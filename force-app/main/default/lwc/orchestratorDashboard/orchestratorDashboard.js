import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getRecentExecutions from '@salesforce/apex/ExecutionController.getRecentExecutions';
import getAvailableJourneys from '@salesforce/apex/ExecutionController.getAvailableJourneys';

const STATUS_CONFIG = {
    Running:   { icon: 'utility:play',    iconClass: 'status-icon status-icon-green',  textClass: 'status-text status-text-green',  barClass: 'progress-bar bar-green',  iconVariant: '' },
    Completed: { icon: 'utility:check',   iconClass: 'status-icon status-icon-blue',   textClass: 'status-text status-text-blue',   barClass: 'progress-bar bar-blue',   iconVariant: '' },
    Scheduled: { icon: 'utility:clock',   iconClass: 'status-icon status-icon-amber',  textClass: 'status-text status-text-amber',  barClass: 'progress-bar bar-gray',   iconVariant: '' },
    Paused:    { icon: 'utility:pause',   iconClass: 'status-icon status-icon-amber',  textClass: 'status-text status-text-amber',  barClass: 'progress-bar bar-amber',  iconVariant: '' },
    Failed:    { icon: 'utility:warning', iconClass: 'status-icon status-icon-red',    textClass: 'status-text status-text-red',    barClass: 'progress-bar bar-red',    iconVariant: '' }
};

export default class OrchestratorDashboard extends NavigationMixin(LightningElement) {
    executions = [];
    journeys = [];

    @wire(getRecentExecutions)
    wiredExecutions({ data, error }) {
        if (data) {
            this.executions = data.map(e => {
                const total = e.Total_Contacts__c || 1;
                const processed = e.Processed_Contacts__c || 0;
                const progress = Math.round((processed / total) * 100);
                const cfg = STATUS_CONFIG[e.Status__c] || STATUS_CONFIG.Scheduled;
                return {
                    id: e.Id,
                    name: e.Journey_Name__c,
                    journeyId: e.Business_Journey_ID__c,
                    status: e.Status__c,
                    contacts: this.formatNumber(total),
                    started: this.timeAgo(e.Started_At__c || e.CreatedDate),
                    progress,
                    statusIcon: cfg.icon,
                    statusIconClass: cfg.iconClass,
                    statusTextClass: cfg.textClass,
                    progressBarClass: cfg.barClass,
                    progressStyle: `width:${progress}%`,
                    iconVariant: cfg.iconVariant
                };
            });
        }
        if (error) {
            this.executions = [];
        }
    }

    @wire(getAvailableJourneys)
    wiredJourneys({ data, error }) {
        if (data) {
            this.journeys = data.map(j => ({ id: j.id, name: j.name, channels: j.channels, status: j.status }));
        }
        if (error) {
            this.journeys = [];
        }
    }

    navigateToExecute() {
        this.dispatchEvent(new CustomEvent('navigate', { detail: { screen: 'execute' } }));
    }

    navigateToMonitor() {
        this.dispatchEvent(new CustomEvent('navigate', { detail: { screen: 'monitor' } }));
    }

    handleExecClick(event) {
        const jid = event.currentTarget.dataset.id;
        this.dispatchEvent(new CustomEvent('navigate', { detail: { screen: 'monitor', journeyId: jid } }));
    }

    formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return String(num);
    }

    timeAgo(dateStr) {
        if (!dateStr) return '';
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return mins + ' min ago';
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return hrs + ' hrs ago';
        return Math.floor(hrs / 24) + ' days ago';
    }
}
