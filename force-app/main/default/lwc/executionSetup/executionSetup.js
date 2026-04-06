import { LightningElement, track } from 'lwc';

export default class ExecutionSetup extends LightningElement {
    @track currentStep = 0;

    steps = [
        { label: 'Schedule', description: 'Execution timing' },
        { label: 'Source', description: 'CRM configuration' },
        { label: 'Intelligence', description: 'Pre-execution review' }
    ];

    @track scheduleConfig = {
        executionType: 'Recurring',
        startDate: '',
        startTime: '09:00',
        frequency: 'Daily',
        dataMode: 'Incremental',
        selectedDays: '',
        cronExpression: ''
    };

    @track sourceConfig = {
        source: 'crm',
        ingestionMethod: 'Batch',
        autoDedup: true,
        skipActiveJourney: true,
        queueBuffering: true
    };

    get isScheduleStep() { return this.currentStep === 0; }
    get isSourceStep() { return this.currentStep === 1; }
    get isSummaryStep() { return this.currentStep === 2; }
    get showNextButton() { return this.currentStep < 2; }
    get backLabel() { return this.currentStep === 0 ? 'Back to Dashboard' : 'Previous'; }
    get scheduleConfigJson() { return JSON.stringify(this.scheduleConfig); }
    get sourceConfigJson() { return JSON.stringify(this.sourceConfig); }

    handleScheduleChange(event) {
        this.scheduleConfig = { ...this.scheduleConfig, ...event.detail };
    }

    handleSourceChange(event) {
        this.sourceConfig = { ...this.sourceConfig, ...event.detail };
    }

    handleNext() {
        if (this.currentStep < 2) {
            this.currentStep++;
        }
    }

    handleBack() {
        if (this.currentStep === 0) {
            this.dispatchEvent(new CustomEvent('navigate', { detail: { screen: 'dashboard' } }));
        } else {
            this.currentStep--;
        }
    }

    handleExecute() {
        this.dispatchEvent(new CustomEvent('navigate', { detail: { screen: 'monitor' } }));
    }

    handleDryRun() {
        // Handled by intelligenceSummary internally
    }

    handleCancel() {
        this.dispatchEvent(new CustomEvent('navigate', { detail: { screen: 'dashboard' } }));
    }
}
