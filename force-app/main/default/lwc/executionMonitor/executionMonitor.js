import { LightningElement, track } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import chartJs from '@salesforce/resourceUrl/crmOrchChartJS';
import getExecutionStats from '@salesforce/apex/MonitorController.getExecutionStats';
import getAlerts from '@salesforce/apex/MonitorController.getAlerts';

const MOCK_CONTACTS = [
    { contactId: 'CRM-001', name: 'Rajesh Kumar', phone: '+91 98765 43210',
      states: [
        { state: 'WhatsApp Sent', channel: 'WhatsApp', timestamp: '2026-04-06T09:00:12Z', status: 'sent' },
        { state: 'WhatsApp Delivered', channel: 'WhatsApp', timestamp: '2026-04-06T09:00:15Z', status: 'delivered' },
        { state: 'WhatsApp Read', channel: 'WhatsApp', timestamp: '2026-04-06T09:05:22Z', status: 'read' },
        { state: 'WhatsApp Replied', channel: 'WhatsApp', timestamp: '2026-04-06T09:07:45Z', status: 'replied' }
    ]},
    { contactId: 'CRM-002', name: 'Priya Sharma', phone: '+91 87654 32109',
      states: [
        { state: 'WhatsApp Sent', channel: 'WhatsApp', timestamp: '2026-04-06T09:00:14Z', status: 'sent' },
        { state: 'WhatsApp Delivered', channel: 'WhatsApp', timestamp: '2026-04-06T09:00:18Z', status: 'delivered' },
        { state: 'No Reply', channel: 'WhatsApp', timestamp: '2026-04-06T11:00:18Z', status: 'failed' },
        { state: 'SMS Sent', channel: 'SMS', timestamp: '2026-04-06T11:01:02Z', status: 'sent' },
        { state: 'SMS Delivered', channel: 'SMS', timestamp: '2026-04-06T11:01:08Z', status: 'delivered' }
    ]},
    { contactId: 'CRM-003', name: 'Amit Patel', phone: '+91 76543 21098',
      states: [
        { state: 'WhatsApp Sent', channel: 'WhatsApp', timestamp: '2026-04-06T09:00:16Z', status: 'sent' },
        { state: 'WhatsApp Failed', channel: 'WhatsApp', timestamp: '2026-04-06T09:00:20Z', status: 'failed' },
        { state: 'SMS Sent', channel: 'SMS', timestamp: '2026-04-06T09:01:05Z', status: 'sent' },
        { state: 'SMS Failed', channel: 'SMS', timestamp: '2026-04-06T09:01:10Z', status: 'failed' },
        { state: 'Call Triggered', channel: 'Call', timestamp: '2026-04-06T13:00:00Z', status: 'sent' },
        { state: 'Call Connected', channel: 'Call', timestamp: '2026-04-06T13:00:25Z', status: 'delivered' }
    ]}
];

const STATUS_DOT = { sent: 'dot dot-blue', delivered: 'dot dot-green', read: 'dot dot-violet', replied: 'dot dot-primary', failed: 'dot dot-red', fallback: 'dot dot-amber', pending: 'dot dot-gray' };
const BADGE_MAP = { replied: 'success', delivered: 'info', read: 'info', failed: 'error', sent: 'default', pending: 'default', fallback: 'warning' };

export default class ExecutionMonitor extends LightningElement {
    @track isPaused = false;
    @track searchTerm = '';
    @track expandedContacts = {};
    @track elapsedSeconds = 0;
    @track stats = { totalProcessed: 67240, totalTarget: 108500, successRate: 89.3, failureRate: 10.7, elapsedMinutes: 187,
        channelStats: {
            WhatsApp: { sent: 52400, delivered: 48700, replied: 18600, failed: 3700 },
            SMS: { sent: 12800, delivered: 11900, replied: 4200, failed: 900 },
            Call: { sent: 2040, delivered: 1630, replied: 980, failed: 410 }
        },
        currentTPS: { WhatsApp: 142, SMS: 68, Call: 28 }
    };
    @track alertList = [];

    chartInitialized = false;
    _timer;

    connectedCallback() {
        this._timer = setInterval(() => {
            if (!this.isPaused) this.elapsedSeconds++;
        }, 1000);
        this.loadAlerts();
    }

    disconnectedCallback() {
        if (this._timer) clearInterval(this._timer);
    }

    async loadAlerts() {
        try {
            const data = await getAlerts({ journeyExecId: null });
            this.alertList = data.map(a => ({
                ...a,
                cssClass: 'alert-row alert-' + a.alertType,
                iconName: a.alertType === 'error' ? 'utility:warning' : a.alertType === 'warning' ? 'utility:notification' : 'utility:success',
                iconClass: 'alert-icon-' + a.alertType,
                textClass: 'alert-text-' + a.alertType
            }));
        } catch (e) {
            this.alertList = [
                { alertId: '1', alertType: 'warning', message: 'Call channel approaching capacity (93%)', timeAgo: '2 min ago', cssClass: 'alert-row alert-warning', iconName: 'utility:notification', iconClass: 'alert-icon-warning', textClass: 'alert-text-warning' },
                { alertId: '2', alertType: 'error', message: 'WhatsApp vendor latency spike (avg 450ms)', timeAgo: '8 min ago', cssClass: 'alert-row alert-error', iconName: 'utility:warning', iconClass: 'alert-icon-error', textClass: 'alert-text-error' },
                { alertId: '3', alertType: 'success', message: 'SMS delivery rate recovered to 98.2%', timeAgo: '15 min ago', cssClass: 'alert-row alert-success', iconName: 'utility:success', iconClass: 'alert-icon-success', textClass: 'alert-text-success' }
            ];
        }
    }

    get statusBadgeVariant() { return this.isPaused ? 'warning' : 'success'; }
    get statusLabel() { return this.isPaused ? 'Paused' : 'Running'; }
    get pauseButtonVariant() { return this.isPaused ? 'brand' : 'destructive'; }
    get pauseButtonLabel() { return this.isPaused ? 'Resume Execution' : 'Pause Execution'; }
    get pauseButtonIcon() { return this.isPaused ? 'utility:play' : 'utility:pause'; }
    get elapsedMinutes() { return this.stats.elapsedMinutes; }
    get elapsedFormatted() {
        const total = this.stats.elapsedMinutes * 60 + this.elapsedSeconds;
        const h = Math.floor(total / 3600);
        const m = Math.floor((total % 3600) / 60);
        const s = total % 60;
        return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    }

    get processedFormatted() { return this.fmt(this.stats.totalProcessed); }
    get processedSub() { return `of ${this.fmt(this.stats.totalTarget)}`; }
    get progressPercent() { return Math.round((this.stats.totalProcessed / this.stats.totalTarget) * 100) + '%'; }
    get successRateFormatted() { return this.stats.successRate + '%'; }
    get failureRateFormatted() { return this.stats.failureRate + '%'; }
    get tpsSummary() {
        const t = this.stats.currentTPS;
        return `WA:${t.WhatsApp} SM:${t.SMS} C:${t.Call}`;
    }

    get channelSummaryRows() {
        return Object.entries(this.stats.channelStats).map(([channel, data]) => ({
            channel,
            sentFormatted: this.fmt(data.sent),
            deliveredText: `${data.delivered} del`,
            repliedText: `${data.replied} rep`,
            failedText: `${data.failed} fail`,
            hasReplied: data.replied > 0
        }));
    }

    get alerts() { return this.alertList; }

    get contactRows() {
        const term = this.searchTerm.toLowerCase();
        return MOCK_CONTACTS
            .filter(c => c.name.toLowerCase().includes(term) || c.contactId.toLowerCase().includes(term) || c.phone.includes(term))
            .map(c => {
                const last = c.states[c.states.length - 1];
                const isExpanded = !!this.expandedContacts[c.contactId];
                return {
                    ...c,
                    initials: c.name.split(' ').map(n => n[0]).join(''),
                    isExpanded,
                    chevronIcon: isExpanded ? 'utility:chevrondown' : 'utility:chevronright',
                    lastState: last.state,
                    lastBadgeVariant: BADGE_MAP[last.status] || 'default',
                    stateDots: c.states.map((s, i) => ({ key: `${c.contactId}-${i}`, cssClass: STATUS_DOT[s.status] || 'dot dot-gray' })),
                    states: c.states.map((s, i) => ({
                        ...s,
                        key: `${c.contactId}-s-${i}`,
                        dotClass: 'tl-dot ' + (STATUS_DOT[s.status] || ''),
                        badgeVariant: BADGE_MAP[s.status] || 'default',
                        formattedTime: new Date(s.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                    }))
                };
            });
    }

    togglePause() { this.isPaused = !this.isPaused; }
    handleSearch(e) { this.searchTerm = e.target.value; }
    toggleContact(e) {
        const id = e.currentTarget.dataset.id;
        this.expandedContacts = { ...this.expandedContacts, [id]: !this.expandedContacts[id] };
    }

    renderedCallback() {
        if (this.chartInitialized) return;
        this.chartInitialized = true;
        loadScript(this, chartJs)
            .then(() => { this.initCharts(); })
            .catch(() => {});
    }

    initCharts() {
        if (!window.Chart) return;
        this.initTpsChart();
        this.initPieChart();
    }

    initTpsChart() {
        const canvas = this.refs.tpsChart;
        if (!canvas) return;
        const labels = Array.from({ length: 20 }, (_, i) => `${i + 1}m`);
        const rand = (base, range) => Array.from({ length: 20 }, () => Math.floor(base + Math.random() * range));

        new window.Chart(canvas, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    { label: 'WhatsApp', data: rand(100, 80), borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,.15)', fill: true, tension: 0.3 },
                    { label: 'SMS', data: rand(40, 50), borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,.15)', fill: true, tension: 0.3 },
                    { label: 'Call', data: rand(15, 25), borderColor: '#f97316', backgroundColor: 'rgba(249,115,22,.15)', fill: true, tension: 0.3 }
                ]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { font: { size: 10 } } } }, scales: { y: { beginAtZero: true, ticks: { font: { size: 10 } } }, x: { ticks: { font: { size: 10 } } } } }
        });
    }

    initPieChart() {
        const canvas = this.refs.pieChart;
        if (!canvas) return;
        new window.Chart(canvas, {
            type: 'doughnut',
            data: {
                labels: ['WhatsApp', 'SMS', 'Call'],
                datasets: [{ data: [52400, 12800, 2040], backgroundColor: ['#22c55e', '#8b5cf6', '#f97316'], borderWidth: 0 }]
            },
            options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { display: false } } }
        });
    }

    fmt(n) { return n != null ? Number(n).toLocaleString() : '0'; }
}
