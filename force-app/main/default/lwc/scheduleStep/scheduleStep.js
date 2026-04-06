import { LightningElement, api, track } from 'lwc';

const WEEK_LABELS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export default class ScheduleStep extends LightningElement {
    @api executionType = 'Recurring';
    @api startDate = '';
    @api startTime = '09:00';
    @api frequency = 'Daily';
    @api dataMode = 'Incremental';

    @track selectedDays = [];
    @track cronExpression = '';

    get isRecurring() { return this.executionType === 'Recurring'; }
    get isWeekly() { return this.frequency === 'Weekly'; }
    get isCustom() { return this.frequency === 'Custom'; }

    get oneTimeClass() { return 'type-card' + (this.executionType === 'One-Time' ? ' type-card-active' : ''); }
    get recurringClass() { return 'type-card' + (this.executionType === 'Recurring' ? ' type-card-active' : ''); }
    get oneTimeIconClass() { return 'type-icon-box' + (this.executionType === 'One-Time' ? ' type-icon-active' : ''); }
    get recurringIconClass() { return 'type-icon-box' + (this.executionType === 'Recurring' ? ' type-icon-active' : ''); }
    get incrementalClass() { return 'type-card' + (this.dataMode === 'Incremental' ? ' type-card-active' : ''); }
    get fullRerunClass() { return 'type-card' + (this.dataMode === 'Full Re-run' ? ' type-card-active' : ''); }
    get incrementalIconCls() { return this.dataMode === 'Incremental' ? 'icon-active' : 'icon-muted'; }
    get fullRerunIconCls() { return this.dataMode === 'Full Re-run' ? 'icon-active' : 'icon-muted'; }

    get frequencies() {
        return ['Daily','Weekly','Monthly','Custom'].map(f => ({
            value: f, label: f,
            cssClass: 'freq-btn' + (this.frequency === f ? ' freq-btn-active' : '')
        }));
    }

    get weekDays() {
        return WEEK_LABELS.map((label, index) => ({
            label, index,
            cssClass: 'day-btn' + (this.selectedDays.includes(index) ? ' day-btn-active' : '')
        }));
    }

    selectOneTime() { this.fireChange({ executionType: 'One-Time' }); }
    selectRecurring() { this.fireChange({ executionType: 'Recurring' }); }
    selectIncremental() { this.fireChange({ dataMode: 'Incremental' }); }
    selectFullRerun() { this.fireChange({ dataMode: 'Full Re-run' }); }

    handleDateChange(e) { this.fireChange({ startDate: e.target.value }); }
    handleTimeChange(e) { this.fireChange({ startTime: e.target.value }); }
    handleCronChange(e) { this.cronExpression = e.target.value; this.fireChange({ cronExpression: e.target.value }); }

    handleFrequencyClick(e) {
        this.fireChange({ frequency: e.currentTarget.dataset.value });
    }

    handleDayClick(e) {
        const idx = parseInt(e.currentTarget.dataset.index, 10);
        if (this.selectedDays.includes(idx)) {
            this.selectedDays = this.selectedDays.filter(d => d !== idx);
        } else {
            this.selectedDays = [...this.selectedDays, idx];
        }
        this.fireChange({ selectedDays: this.selectedDays.join(',') });
    }

    fireChange(detail) {
        this.dispatchEvent(new CustomEvent('schedulechange', { detail }));
    }
}
