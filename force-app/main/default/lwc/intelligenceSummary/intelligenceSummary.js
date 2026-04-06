import { LightningElement, api, track } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import chartJs from '@salesforce/resourceUrl/crmOrchChartJS';

const CHANNEL_COLORS = { WhatsApp: '#22c55e', SMS: '#8b5cf6', Call: '#f97316', Email: '#0ea5e9' };

const DEFAULT_AUDIENCE = { total: 125000, valid: 108500, invalid: 6500, dedup: 7800, skipped: 2200,
    channels: { WhatsApp: 86800, SMS: 65100, Call: 43400, Email: 97650 } };

const DEFAULT_ACTIONS = { total: 152000,
    channels: { WhatsApp: 86800, SMS: 43400, Call: 21700 } };

const DEFAULT_LOAD = [
    { channel: 'WhatsApp', required: 145, capacity: 200, status: 'ok' },
    { channel: 'SMS', required: 72, capacity: 150, status: 'ok' },
    { channel: 'Call', required: 38, capacity: 30, status: 'overload' },
    { channel: 'Email', required: 0, capacity: 500, status: 'ok' }
];

const DEFAULT_COSTS = [
    { channel: 'WhatsApp', unitCost: '0.45', volume: 86800, total: 39060 },
    { channel: 'SMS', unitCost: '0.12', volume: 43400, total: 5208 },
    { channel: 'Call', unitCost: '1.20', volume: 21700, total: 26040 }
];

const DEFAULT_SPIKES = [
    { time: '0-10 min', action: 'WhatsApp spike', volume: '86,800' },
    { time: '+2 hrs', action: 'SMS fallback spike', volume: '43,400' },
    { time: '+4 hrs', action: 'Call fallback trigger', volume: '21,700' }
];

const DEFAULT_ASSUMPTIONS = [
    { label: 'WhatsApp Response Rate', lastRun: 45, current: 50, unit: '%' },
    { label: 'SMS Delivery Rate', lastRun: 92, current: 90, unit: '%' },
    { label: 'Call Answer Rate', lastRun: 35, current: 40, unit: '%' },
    { label: 'WhatsApp Drop-off Rate', lastRun: 12, current: 10, unit: '%' },
    { label: 'SMS Bounce Rate', lastRun: 8, current: 8, unit: '%' },
    { label: 'Call Retry Attempts', lastRun: 2, current: 3, unit: 'times' }
];

export default class IntelligenceSummary extends LightningElement {
    @api scheduleConfig;
    @api sourceConfig;

    @track throttle = 75;
    @track execDate = '';
    @track execTime = '09:00';
    @track showDryRunModal = false;
    @track assumptionValues = DEFAULT_ASSUMPTIONS.map(a => a.current);

    chartInitialized = false;

    get audienceTotalFormatted() { return this.fmt(DEFAULT_AUDIENCE.total); }
    get audienceValidFormatted() { return this.fmt(DEFAULT_AUDIENCE.valid); }
    get audienceInvalidFormatted() { return this.fmt(DEFAULT_AUDIENCE.invalid); }
    get audienceDedupFormatted() { return this.fmt(DEFAULT_AUDIENCE.dedup); }
    get audienceSkippedFormatted() { return this.fmt(DEFAULT_AUDIENCE.skipped); }
    get totalActionsFormatted() { return this.fmt(DEFAULT_ACTIONS.total); }

    get channelBars() {
        const ch = DEFAULT_AUDIENCE.channels;
        const total = DEFAULT_AUDIENCE.total;
        return Object.entries(ch).map(([channel, count]) => ({
            channel,
            formatted: this.fmt(count),
            style: `width:${Math.round((count / total) * 100)}%;background:${CHANNEL_COLORS[channel]}`
        }));
    }

    get channelActions() {
        const ch = DEFAULT_ACTIONS.channels;
        const total = DEFAULT_ACTIONS.total;
        return Object.entries(ch).map(([channel, count]) => ({
            channel,
            formatted: this.fmt(count),
            percent: ((count / total) * 100).toFixed(1)
        }));
    }

    get systemLoad() {
        return DEFAULT_LOAD.map(l => ({
            ...l,
            badgeVariant: l.status === 'ok' ? 'success' : l.status === 'overload' ? 'error' : 'warning',
            statusLabel: l.status === 'ok' ? 'OK' : l.status === 'overload' ? 'Overload' : 'Warning'
        }));
    }

    get hasOverload() { return DEFAULT_LOAD.some(l => l.status === 'overload'); }
    get spikes() { return DEFAULT_SPIKES; }

    get costLines() {
        return DEFAULT_COSTS.map(c => ({
            channel: c.channel,
            unitCost: c.unitCost,
            volumeFormatted: this.fmt(c.volume),
            totalFormatted: this.fmt(c.total)
        }));
    }

    get grandTotalFormatted() {
        return this.fmt(DEFAULT_COSTS.reduce((s, c) => s + c.total, 0));
    }

    get assumptions() {
        return DEFAULT_ASSUMPTIONS.map((a, i) => ({
            ...a,
            index: i,
            currentValue: this.assumptionValues[i],
            lastRunText: `Last Run: ${a.lastRun}${a.unit}`
        }));
    }

    get showSpreadMessage() { return this.throttle < 100; }
    get spreadHours() { return Math.round(24 / (this.throttle / 100)); }

    handleThrottleChange(e) { this.throttle = parseInt(e.target.value, 10); }
    handleExecDateChange(e) { this.execDate = e.target.value; }
    handleExecTimeChange(e) { this.execTime = e.target.value; }

    handleAssumptionChange(e) {
        const idx = parseInt(e.target.dataset.index, 10);
        const vals = [...this.assumptionValues];
        vals[idx] = parseInt(e.target.value, 10);
        this.assumptionValues = vals;
    }

    handleExecute() { this.dispatchEvent(new CustomEvent('execute')); }
    handleCancel() { this.dispatchEvent(new CustomEvent('cancel')); }
    handleDryRun() { this.showDryRunModal = true; }
    closeDryRun() { this.showDryRunModal = false; }

    renderedCallback() {
        if (this.chartInitialized) return;
        this.chartInitialized = true;
        loadScript(this, chartJs)
            .then(() => { this.initChart(); })
            .catch(() => { /* Chart.js not available */ });
    }

    initChart() {
        const canvas = this.refs.timelineChart;
        if (!canvas || !window.Chart) return;

        const data = [
            { label: '0-10m', value: 86800, color: CHANNEL_COLORS.WhatsApp },
            { label: '10-30m', value: 78120, color: CHANNEL_COLORS.WhatsApp },
            { label: '30m-2h', value: 43400, color: CHANNEL_COLORS.WhatsApp },
            { label: '+2h', value: 43400, color: CHANNEL_COLORS.SMS },
            { label: '+2.5h', value: 39060, color: CHANNEL_COLORS.SMS },
            { label: '+4h', value: 21700, color: CHANNEL_COLORS.Call },
            { label: '+4-6h', value: 21700, color: CHANNEL_COLORS.Call },
            { label: '+6-8h', value: 0, color: CHANNEL_COLORS.Call }
        ];

        new window.Chart(canvas, {
            type: 'bar',
            data: {
                labels: data.map(d => d.label),
                datasets: [{
                    data: data.map(d => d.value),
                    backgroundColor: data.map(d => d.color),
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, ticks: { font: { size: 10 } } },
                    x: { ticks: { font: { size: 10 } } }
                }
            }
        });
    }

    fmt(n) {
        if (n == null) return '0';
        return Number(n).toLocaleString();
    }
}
