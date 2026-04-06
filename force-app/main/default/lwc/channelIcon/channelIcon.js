import { LightningElement, api } from 'lwc';

const CONFIG = {
    WhatsApp: { icon: 'utility:chat', color: 'icon-green', bg: 'iconbox-green', label: 'WhatsApp' },
    SMS: { icon: 'utility:sms', color: 'icon-violet', bg: 'iconbox-violet', label: 'SMS' },
    Call: { icon: 'utility:call', color: 'icon-orange', bg: 'iconbox-orange', label: 'Call' },
    Email: { icon: 'utility:email', color: 'icon-blue', bg: 'iconbox-blue', label: 'Email' }
};

export default class ChannelIcon extends LightningElement {
    @api channel = 'WhatsApp';
    @api size = 'medium';
    @api showLabel = false;

    get cfg() {
        return CONFIG[this.channel] || CONFIG.WhatsApp;
    }
    get wrapperClass() {
        return 'channel-icon-wrapper';
    }
    get iconBoxClass() {
        return 'iconbox iconbox-' + this.size + ' ' + this.cfg.bg;
    }
    get iconName() {
        return this.cfg.icon;
    }
    get iconColorClass() {
        return this.cfg.color;
    }
    get channelLabel() {
        return this.cfg.label;
    }
}
