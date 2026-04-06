import { MessageCircle, MessageSquare, Phone, Mail } from 'lucide-react';
import type { ChannelType } from '../types';

const channelConfig: Record<ChannelType, { icon: typeof MessageCircle; color: string; bg: string; label: string }> = {
  whatsapp: { icon: MessageCircle, color: 'text-green-600', bg: 'bg-green-50', label: 'WhatsApp' },
  sms: { icon: MessageSquare, color: 'text-violet-600', bg: 'bg-violet-50', label: 'SMS' },
  call: { icon: Phone, color: 'text-orange-600', bg: 'bg-orange-50', label: 'Call' },
  email: { icon: Mail, color: 'text-sky-600', bg: 'bg-sky-50', label: 'Email' },
};

interface ChannelIconProps {
  channel: ChannelType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function ChannelIcon({ channel, size = 'md', showLabel }: ChannelIconProps) {
  const config = channelConfig[channel];
  const Icon = config.icon;
  const sizeMap = { sm: 'w-6 h-6', md: 'w-8 h-8', lg: 'w-10 h-10' };
  const iconSize = { sm: 'w-3 h-3', md: 'w-4 h-4', lg: 'w-5 h-5' };

  return (
    <div className="flex items-center gap-2">
      <div className={`${sizeMap[size]} ${config.bg} ${config.color} rounded-lg flex items-center justify-center`}>
        <Icon className={iconSize[size]} />
      </div>
      {showLabel && <span className="text-[13px] font-medium text-surface-700">{config.label}</span>}
    </div>
  );
}

export { channelConfig };
