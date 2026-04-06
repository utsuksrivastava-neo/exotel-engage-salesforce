import { LightningElement, api } from 'lwc';

export default class StatCard extends LightningElement {
    @api label = '';
    @api value = '';
    @api subtitle = '';
    @api iconName = 'utility:chart';
    @api variant = 'default';

    get iconBoxClass() {
        const variants = {
            default: 'stat-icon stat-icon-blue',
            success: 'stat-icon stat-icon-green',
            warning: 'stat-icon stat-icon-amber',
            error: 'stat-icon stat-icon-red',
            purple: 'stat-icon stat-icon-purple'
        };
        return variants[this.variant] || variants.default;
    }
}
