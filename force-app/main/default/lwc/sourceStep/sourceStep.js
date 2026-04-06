import { LightningElement, api } from 'lwc';

export default class SourceStep extends LightningElement {
    @api ingestionMethod = 'Batch';

    get realtimeClass() { return 'type-card' + (this.ingestionMethod === 'Real-time' ? ' type-card-active' : ''); }
    get batchClass() { return 'type-card' + (this.ingestionMethod === 'Batch' ? ' type-card-active' : ''); }
    get realtimeIconCls() { return this.ingestionMethod === 'Real-time' ? 'icon-active' : 'icon-muted'; }
    get batchIconCls() { return this.ingestionMethod === 'Batch' ? 'icon-active' : 'icon-muted'; }

    selectRealtime() { this.fireChange({ ingestionMethod: 'Real-time' }); }
    selectBatch() { this.fireChange({ ingestionMethod: 'Batch' }); }

    fireChange(detail) {
        this.dispatchEvent(new CustomEvent('sourcechange', { detail }));
    }
}
