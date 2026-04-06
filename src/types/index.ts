export type ExecutionType = 'one-time' | 'recurring';
export type DataMode = 'incremental' | 'full-rerun';
export type IngestionMethod = 'real-time' | 'batch';
export type ChannelType = 'whatsapp' | 'sms' | 'call' | 'email';
export type ExecutionStatus = 'scheduled' | 'running' | 'paused' | 'completed' | 'failed';
export type ContactState = 'pending' | 'sent' | 'delivered' | 'read' | 'replied' | 'failed' | 'fallback';

export interface ScheduleConfig {
  executionType: ExecutionType;
  startTime: string;
  startDate: string;
  cronPattern?: string;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'custom';
  selectedDays?: number[];
  dataMode?: DataMode;
}

export interface SourceConfig {
  source: 'crm';
  ingestionMethod: IngestionMethod;
  autoDedup: boolean;
  skipActiveJourney: boolean;
  queueBuffering: boolean;
}

export interface AudienceSummary {
  totalRecords: number;
  validContacts: number;
  invalidContacts: number;
  deduplicatedContacts: number;
  skippedContacts: number;
  channelBreakdown: Record<ChannelType, number>;
}

export interface JourneyExplosion {
  totalActions: number;
  channelActions: Record<ChannelType, number>;
  fallbackChains: { from: ChannelType; to: ChannelType; count: number }[];
}

export interface SystemLoad {
  channel: ChannelType;
  requiredTPS: number;
  capacityTPS: number;
  status: 'ok' | 'warning' | 'overload';
}

export interface TimelineEvent {
  timeRange: string;
  channel: ChannelType;
  action: string;
  volume: number;
  isSpike: boolean;
}

export interface CostEstimation {
  channel: ChannelType;
  unitCost: number;
  volume: number;
  totalCost: number;
  currency: string;
}

export interface Assumption {
  label: string;
  lastRunValue: number;
  currentValue: number;
  unit: string;
}

export interface ExecutionControls {
  startTime: string;
  throttlePercent: number;
}

export interface ContactTimeline {
  contactId: string;
  name: string;
  phone: string;
  states: { state: string; channel: ChannelType; timestamp: string; status: ContactState }[];
}

export interface JourneyNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'delay' | 'end';
  label: string;
  channel?: ChannelType;
  config?: Record<string, unknown>;
  position: { x: number; y: number };
}

export interface JourneyEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface Journey {
  id: string;
  name: string;
  description: string;
  nodes: JourneyNode[];
  edges: JourneyEdge[];
  createdAt: string;
  status: 'draft' | 'ready' | 'executing' | 'completed';
}
