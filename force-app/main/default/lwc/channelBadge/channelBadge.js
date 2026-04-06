import { LightningElement, api } from 'lwc';

const CHANNEL_CONFIG = {
    WhatsApp: { bgClass: 'badge badge-whatsapp', dotClass: 'dot dot-green', label: 'WhatsApp' },
    SMS: { bgClass: 'badge badge-sms', dotClass: 'dot dot-violet', label: 'SMS' },
    Call: { bgClass: 'badge badge-call', dotClass: 'dot dot-orange', label: 'Call' },
    Email: { bgClass: 'badge badge-email', dotClass: 'dot dot-blue', label: 'Email' },
    success: { bgClass: 'badge badge-success', dotClass: 'dot dot-green', label: '' },
    warning: { bgClass: 'badge badge-warning', dotClass: 'dot dot-orange', label: '' },
    error: { bgClass: 'badge badge-error', dotClass: 'dot dot-red', label: '' },
    info: { bgClass: 'badge badge-info', dotClass: 'dot dot-blue', label: '' },
    default: { bgClass: 'badge badge-default', dotClass: 'dot dot-gray', label: '' }
};

export default class ChannelBadge extends LightningElement {
    @api variant = 'default';
    @api text = '';
    @api showDot = false;

    get config() {
        return CHANNEL_CONFIG[this.variant] || CHANNEL_CONFIG.default;
    }
    get badgeClass() {
        return this.config.bgClass;
    }
    get dotClass() {
        return this.config.dotClass;
    }
    get label() {
        return this.text || this.config.label;
    }
}
