import type {
  AudienceSummary,
  JourneyExplosion,
  SystemLoad,
  TimelineEvent,
  CostEstimation,
  Assumption,
  ContactTimeline,
  Journey,
} from '../types';

export const mockAudienceSummary: AudienceSummary = {
  totalRecords: 125000,
  validContacts: 108500,
  invalidContacts: 6500,
  deduplicatedContacts: 7800,
  skippedContacts: 2200,
  channelBreakdown: {
    whatsapp: 86800,
    sms: 65100,
    call: 43400,
    email: 97650,
  },
};

export const mockJourneyExplosion: JourneyExplosion = {
  totalActions: 152000,
  channelActions: {
    whatsapp: 86800,
    sms: 43400,
    call: 21700,
    email: 0,
  },
  fallbackChains: [
    { from: 'whatsapp', to: 'sms', count: 43400 },
    { from: 'sms', to: 'call', count: 21700 },
  ],
};

export const mockSystemLoad: SystemLoad[] = [
  { channel: 'whatsapp', requiredTPS: 145, capacityTPS: 200, status: 'ok' },
  { channel: 'sms', requiredTPS: 72, capacityTPS: 150, status: 'ok' },
  { channel: 'call', requiredTPS: 38, capacityTPS: 30, status: 'overload' },
  { channel: 'email', requiredTPS: 0, capacityTPS: 500, status: 'ok' },
];

export const mockTimeline: TimelineEvent[] = [
  { timeRange: '0-10 min', channel: 'whatsapp', action: 'Initial WhatsApp blast', volume: 86800, isSpike: true },
  { timeRange: '10-30 min', channel: 'whatsapp', action: 'Delivery confirmations', volume: 78120, isSpike: false },
  { timeRange: '30 min - 2 hrs', channel: 'whatsapp', action: 'Reply window', volume: 43400, isSpike: false },
  { timeRange: '+2 hrs', channel: 'sms', action: 'SMS fallback spike', volume: 43400, isSpike: true },
  { timeRange: '+2.5 hrs', channel: 'sms', action: 'SMS delivery', volume: 39060, isSpike: false },
  { timeRange: '+4 hrs', channel: 'call', action: 'Call fallback trigger', volume: 21700, isSpike: true },
  { timeRange: '+4-6 hrs', channel: 'call', action: 'Call execution', volume: 21700, isSpike: false },
  { timeRange: '+6-8 hrs', channel: 'call', action: 'Wrap-up & reporting', volume: 0, isSpike: false },
];

export const mockCostEstimation: CostEstimation[] = [
  { channel: 'whatsapp', unitCost: 0.45, volume: 86800, totalCost: 39060, currency: 'INR' },
  { channel: 'sms', unitCost: 0.12, volume: 43400, totalCost: 5208, currency: 'INR' },
  { channel: 'call', unitCost: 1.20, volume: 21700, totalCost: 26040, currency: 'INR' },
  { channel: 'email', unitCost: 0, volume: 0, totalCost: 0, currency: 'INR' },
];

export const mockAssumptions: Assumption[] = [
  { label: 'WhatsApp Response Rate', lastRunValue: 45, currentValue: 50, unit: '%' },
  { label: 'SMS Delivery Rate', lastRunValue: 92, currentValue: 90, unit: '%' },
  { label: 'Call Answer Rate', lastRunValue: 35, currentValue: 40, unit: '%' },
  { label: 'WhatsApp Drop-off Rate', lastRunValue: 12, currentValue: 10, unit: '%' },
  { label: 'SMS Bounce Rate', lastRunValue: 8, currentValue: 8, unit: '%' },
  { label: 'Call Retry Attempts', lastRunValue: 2, currentValue: 3, unit: 'times' },
];

export const mockContactTimelines: ContactTimeline[] = [
  {
    contactId: 'CRM-001',
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    states: [
      { state: 'WhatsApp Sent', channel: 'whatsapp', timestamp: '2026-04-06T09:00:12Z', status: 'sent' },
      { state: 'WhatsApp Delivered', channel: 'whatsapp', timestamp: '2026-04-06T09:00:15Z', status: 'delivered' },
      { state: 'WhatsApp Read', channel: 'whatsapp', timestamp: '2026-04-06T09:05:22Z', status: 'read' },
      { state: 'WhatsApp Replied', channel: 'whatsapp', timestamp: '2026-04-06T09:07:45Z', status: 'replied' },
    ],
  },
  {
    contactId: 'CRM-002',
    name: 'Priya Sharma',
    phone: '+91 87654 32109',
    states: [
      { state: 'WhatsApp Sent', channel: 'whatsapp', timestamp: '2026-04-06T09:00:14Z', status: 'sent' },
      { state: 'WhatsApp Delivered', channel: 'whatsapp', timestamp: '2026-04-06T09:00:18Z', status: 'delivered' },
      { state: 'No Reply', channel: 'whatsapp', timestamp: '2026-04-06T11:00:18Z', status: 'failed' },
      { state: 'SMS Sent', channel: 'sms', timestamp: '2026-04-06T11:01:02Z', status: 'sent' },
      { state: 'SMS Delivered', channel: 'sms', timestamp: '2026-04-06T11:01:08Z', status: 'delivered' },
    ],
  },
  {
    contactId: 'CRM-003',
    name: 'Amit Patel',
    phone: '+91 76543 21098',
    states: [
      { state: 'WhatsApp Sent', channel: 'whatsapp', timestamp: '2026-04-06T09:00:16Z', status: 'sent' },
      { state: 'WhatsApp Failed', channel: 'whatsapp', timestamp: '2026-04-06T09:00:20Z', status: 'failed' },
      { state: 'SMS Sent', channel: 'sms', timestamp: '2026-04-06T09:01:05Z', status: 'sent' },
      { state: 'SMS Failed', channel: 'sms', timestamp: '2026-04-06T09:01:10Z', status: 'failed' },
      { state: 'Call Triggered', channel: 'call', timestamp: '2026-04-06T13:00:00Z', status: 'sent' },
      { state: 'Call Connected', channel: 'call', timestamp: '2026-04-06T13:00:25Z', status: 'delivered' },
    ],
  },
  {
    contactId: 'CRM-004',
    name: 'Sneha Reddy',
    phone: '+91 65432 10987',
    states: [
      { state: 'WhatsApp Sent', channel: 'whatsapp', timestamp: '2026-04-06T09:00:18Z', status: 'sent' },
      { state: 'WhatsApp Delivered', channel: 'whatsapp', timestamp: '2026-04-06T09:00:22Z', status: 'delivered' },
      { state: 'WhatsApp Read', channel: 'whatsapp', timestamp: '2026-04-06T09:12:30Z', status: 'read' },
    ],
  },
  {
    contactId: 'CRM-005',
    name: 'Vikram Singh',
    phone: '+91 54321 09876',
    states: [
      { state: 'WhatsApp Sent', channel: 'whatsapp', timestamp: '2026-04-06T09:00:20Z', status: 'sent' },
      { state: 'WhatsApp Delivered', channel: 'whatsapp', timestamp: '2026-04-06T09:00:24Z', status: 'delivered' },
      { state: 'No Reply', channel: 'whatsapp', timestamp: '2026-04-06T11:00:24Z', status: 'failed' },
      { state: 'SMS Sent', channel: 'sms', timestamp: '2026-04-06T11:01:10Z', status: 'sent' },
      { state: 'SMS Delivered', channel: 'sms', timestamp: '2026-04-06T11:01:15Z', status: 'delivered' },
      { state: 'SMS Replied', channel: 'sms', timestamp: '2026-04-06T11:15:42Z', status: 'replied' },
    ],
  },
];

export const mockJourney: Journey = {
  id: 'j-001',
  name: 'Q2 Collections Campaign',
  description: 'Automated debt collection journey with multi-channel fallback for overdue accounts',
  nodes: [
    { id: 'n-1', type: 'trigger', label: 'CRM Trigger: Overdue > 30 days', position: { x: 100, y: 200 } },
    { id: 'n-2', type: 'action', label: 'Send WhatsApp Reminder', channel: 'whatsapp', position: { x: 350, y: 200 } },
    { id: 'n-3', type: 'delay', label: 'Wait 2 Hours', position: { x: 600, y: 200 } },
    { id: 'n-4', type: 'condition', label: 'Replied?', position: { x: 850, y: 200 } },
    { id: 'n-5', type: 'action', label: 'Send SMS Fallback', channel: 'sms', position: { x: 1100, y: 320 } },
    { id: 'n-6', type: 'delay', label: 'Wait 2 Hours', position: { x: 1350, y: 320 } },
    { id: 'n-7', type: 'condition', label: 'Responded?', position: { x: 1600, y: 320 } },
    { id: 'n-8', type: 'action', label: 'Trigger Call', channel: 'call', position: { x: 1850, y: 440 } },
    { id: 'n-9', type: 'end', label: 'Journey Complete', position: { x: 1100, y: 80 } },
    { id: 'n-10', type: 'end', label: 'Journey Complete', position: { x: 1850, y: 200 } },
  ],
  edges: [
    { id: 'e-1', source: 'n-1', target: 'n-2' },
    { id: 'e-2', source: 'n-2', target: 'n-3' },
    { id: 'e-3', source: 'n-3', target: 'n-4' },
    { id: 'e-4', source: 'n-4', target: 'n-9', label: 'Yes' },
    { id: 'e-5', source: 'n-4', target: 'n-5', label: 'No' },
    { id: 'e-6', source: 'n-5', target: 'n-6' },
    { id: 'e-7', source: 'n-6', target: 'n-7' },
    { id: 'e-8', source: 'n-7', target: 'n-10', label: 'Yes' },
    { id: 'e-9', source: 'n-7', target: 'n-8', label: 'No' },
  ],
  createdAt: '2026-04-05T14:30:00Z',
  status: 'ready',
};

export const mockExecutionStats = {
  totalProcessed: 67240,
  totalTarget: 108500,
  successRate: 89.3,
  failureRate: 10.7,
  channelStats: {
    whatsapp: { sent: 52400, delivered: 48700, read: 31200, replied: 18600, failed: 3700 },
    sms: { sent: 12800, delivered: 11900, read: 0, replied: 4200, failed: 900 },
    call: { sent: 2040, delivered: 1630, read: 0, replied: 980, failed: 410 },
  },
  currentTPS: { whatsapp: 142, sms: 68, call: 28 },
  startedAt: '2026-04-06T09:00:00Z',
  elapsedMinutes: 187,
};
