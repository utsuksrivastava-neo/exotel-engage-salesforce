import { LightningElement, track } from 'lwc';

export default class DryRunModal extends LightningElement {
    @track phase = 'simulating';
    @track progress = 0;
    _interval;

    connectedCallback() {
        this._interval = setInterval(() => {
            if (this.progress >= 100) {
                clearInterval(this._interval);
                this.phase = 'complete';
                return;
            }
            this.progress += 4;
        }, 120);
    }

    disconnectedCallback() {
        if (this._interval) clearInterval(this._interval);
    }

    get isSimulating() { return this.phase === 'simulating'; }
    get isComplete() { return this.phase === 'complete'; }
    get progressStyle() { return `width:${Math.min(this.progress, 100)}%`; }

    handleClose() {
        this.dispatchEvent(new CustomEvent('close'));
    }

    handleProceed() {
        this.dispatchEvent(new CustomEvent('close'));
        this.dispatchEvent(new CustomEvent('execute'));
    }

    handleBackdropClick() {
        this.handleClose();
    }

    stopPropagation(event) {
        event.stopPropagation();
    }
}
