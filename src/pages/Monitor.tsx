import { useState, useEffect } from 'react';
import {
  Activity,
  Pause,
  Play,
  Users,
  CheckCircle2,
  XCircle,
  Gauge,
  AlertTriangle,
  Bell,
  Search,
  ChevronDown,
  ChevronRight,
  Clock,
  RefreshCw,
  TrendingUp,
  Zap,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Card, { CardHeader } from '../components/Card';
import ChannelIcon, { channelConfig } from '../components/ChannelIcon';
import Badge from '../components/Badge';
import type { ChannelType, ContactState } from '../types';
import { mockExecutionStats, mockContactTimelines } from '../utils/mockData';

const tpsHistory = Array.from({ length: 20 }, (_, i) => ({
  time: `${i + 1}m`,
  whatsapp: Math.floor(100 + Math.random() * 80),
  sms: Math.floor(40 + Math.random() * 50),
  call: Math.floor(15 + Math.random() * 25),
}));

const alerts = [
  { id: 1, type: 'warning' as const, message: 'Call channel approaching capacity limit (93% utilization)', time: '2 min ago' },
  { id: 2, type: 'danger' as const, message: 'WhatsApp vendor latency spike detected (avg 450ms)', time: '8 min ago' },
  { id: 3, type: 'success' as const, message: 'SMS delivery rate recovered to 98.2%', time: '15 min ago' },
];

const statusColors: Record<ContactState, string> = {
  pending: 'bg-surface-400',
  sent: 'bg-blue-500',
  delivered: 'bg-emerald-500',
  read: 'bg-violet-500',
  replied: 'bg-primary-600',
  failed: 'bg-red-500',
  fallback: 'bg-amber-500',
};

export default function Monitor() {
  const [isPaused, setIsPaused] = useState(false);
  const [expandedContact, setExpandedContact] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const stats = mockExecutionStats;
  const progressPercent = Math.round((stats.totalProcessed / stats.totalTarget) * 100);

  const channelPieData = [
    { name: 'WhatsApp', value: stats.channelStats.whatsapp.sent, color: '#22c55e' },
    { name: 'SMS', value: stats.channelStats.sms.sent, color: '#8b5cf6' },
    { name: 'Call', value: stats.channelStats.call.sent, color: '#f97316' },
  ];

  const filteredContacts = mockContactTimelines.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contactId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
  );

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-surface-900">Live Execution Monitor</h2>
            <Badge variant={isPaused ? 'warning' : 'success'} dot>
              {isPaused ? 'Paused' : 'Running'}
            </Badge>
          </div>
          <p className="text-[12px] text-surface-500 mt-0.5">
            Q2 Collections Campaign &middot; Started {stats.elapsedMinutes} min ago &middot; Elapsed: {formatTime(stats.elapsedMinutes * 60 + elapsedSeconds)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-bold transition-all shadow-sm ${
              isPaused
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-amber-500 text-white hover:bg-amber-600'
            }`}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            {isPaused ? 'Resume Execution' : 'Pause Execution'}
          </button>
        </div>
      </div>

      {/* Alerts Banner */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border ${
                alert.type === 'danger'
                  ? 'bg-red-50 border-red-200'
                  : alert.type === 'warning'
                  ? 'bg-amber-50 border-amber-200'
                  : 'bg-emerald-50 border-emerald-200'
              }`}
            >
              {alert.type === 'danger' ? (
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              ) : alert.type === 'warning' ? (
                <Bell className="w-4 h-4 text-amber-600 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
              <span className={`text-[12px] font-medium flex-1 ${
                alert.type === 'danger' ? 'text-red-700' : alert.type === 'warning' ? 'text-amber-700' : 'text-emerald-700'
              }`}>
                {alert.message}
              </span>
              <span className="text-[10px] text-surface-400">{alert.time}</span>
            </div>
          ))}
        </div>
      )}

      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-surface-400 font-medium">Processed</p>
              <p className="text-lg font-bold text-surface-900">{stats.totalProcessed.toLocaleString()}</p>
              <p className="text-[10px] text-surface-400">of {stats.totalTarget.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-surface-400 font-medium">Progress</p>
              <p className="text-lg font-bold text-surface-900">{progressPercent}%</p>
              <div className="w-16 h-1.5 bg-surface-200 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-surface-400 font-medium">Success Rate</p>
              <p className="text-lg font-bold text-emerald-700">{stats.successRate}%</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-surface-400 font-medium">Failure Rate</p>
              <p className="text-lg font-bold text-red-700">{stats.failureRate}%</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-surface-400 font-medium">Current TPS</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] font-bold text-green-600">WA:{stats.currentTPS.whatsapp}</span>
                <span className="text-[11px] font-bold text-violet-600">SMS:{stats.currentTPS.sms}</span>
                <span className="text-[11px] font-bold text-orange-600">Call:{stats.currentTPS.call}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* TPS Chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Real-time TPS / CPS"
              subtitle="Transactions per second across channels"
              icon={<Activity className="w-4 h-4" />}
              action={
                <div className="flex items-center gap-1">
                  <RefreshCw className={`w-3.5 h-3.5 text-surface-400 ${!isPaused ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
                  <span className="text-[10px] text-surface-400">Live</span>
                </div>
              }
            />
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tpsHistory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorWa" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSms" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCall" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                  <Area type="monotone" dataKey="whatsapp" stroke="#22c55e" fill="url(#colorWa)" strokeWidth={2} name="WhatsApp" />
                  <Area type="monotone" dataKey="sms" stroke="#8b5cf6" fill="url(#colorSms)" strokeWidth={2} name="SMS" />
                  <Area type="monotone" dataKey="call" stroke="#f97316" fill="url(#colorCall)" strokeWidth={2} name="Call" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Channel Distribution */}
        <Card>
          <CardHeader
            title="Channel Distribution"
            subtitle="Messages sent per channel"
            icon={<Zap className="w-4 h-4" />}
          />
          <div className="h-40 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channelPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  dataKey="value"
                  paddingAngle={3}
                >
                  {channelPieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {(Object.entries(stats.channelStats) as [ChannelType, typeof stats.channelStats.whatsapp][]).map(
              ([ch, data]) => (
                <div key={ch} className="flex items-center gap-2 p-2 rounded-lg bg-surface-50">
                  <ChannelIcon channel={ch as ChannelType} size="sm" />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-[11px] font-medium text-surface-600 capitalize">{channelConfig[ch as ChannelType].label}</span>
                      <span className="text-[11px] font-bold text-surface-800">{data.sent.toLocaleString()}</span>
                    </div>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="success" className="!text-[9px] !px-1.5 !py-0.5">{data.delivered} del</Badge>
                      {data.replied > 0 && <Badge variant="info" className="!text-[9px] !px-1.5 !py-0.5">{data.replied} rep</Badge>}
                      <Badge variant="danger" className="!text-[9px] !px-1.5 !py-0.5">{data.failed} fail</Badge>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </Card>
      </div>

      {/* Per-Contact Timeline */}
      <Card>
        <CardHeader
          title="Per-Contact Timeline"
          subtitle="Track individual CRM contacts through their journey states"
          icon={<Clock className="w-4 h-4" />}
          action={
            <div className="relative">
              <Search className="w-4 h-4 text-surface-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search contacts..."
                className="pl-9 pr-3 py-2 rounded-lg border border-surface-200 text-[12px] w-56 focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
            </div>
          }
        />

        <div className="space-y-2">
          {filteredContacts.map((contact) => {
            const isExpanded = expandedContact === contact.contactId;
            const lastState = contact.states[contact.states.length - 1];

            return (
              <div key={contact.contactId} className="border border-surface-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedContact(isExpanded ? null : contact.contactId)}
                  className="w-full flex items-center gap-4 px-4 py-3 hover:bg-surface-50 transition-colors text-left"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-surface-400 shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-surface-400 shrink-0" />
                  )}

                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-[11px] font-bold shrink-0">
                    {contact.name.split(' ').map((n) => n[0]).join('')}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-surface-800">{contact.name}</span>
                      <span className="text-[11px] text-surface-400">{contact.contactId}</span>
                    </div>
                    <span className="text-[11px] text-surface-400">{contact.phone}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {contact.states.map((s, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${statusColors[s.status]}`}
                        title={s.state}
                      />
                    ))}
                  </div>

                  <Badge
                    variant={
                      lastState.status === 'replied' ? 'success' :
                      lastState.status === 'delivered' || lastState.status === 'read' ? 'info' :
                      lastState.status === 'failed' ? 'danger' : 'default'
                    }
                  >
                    {lastState.state}
                  </Badge>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="ml-14 pl-4 border-l-2 border-surface-200 space-y-3">
                      {contact.states.map((state, i) => (
                        <div key={i} className="relative flex items-start gap-3">
                          <div className={`absolute -left-[21px] w-3 h-3 rounded-full border-2 border-white ${statusColors[state.status]}`} />
                          <div className="flex-1 ml-1">
                            <div className="flex items-center gap-2">
                              <ChannelIcon channel={state.channel} size="sm" />
                              <span className="text-[12px] font-semibold text-surface-700">{state.state}</span>
                              <Badge
                                variant={
                                  state.status === 'replied' ? 'success' :
                                  state.status === 'delivered' || state.status === 'read' ? 'info' :
                                  state.status === 'failed' ? 'danger' :
                                  state.status === 'sent' ? 'default' : 'warning'
                                }
                                className="!text-[9px]"
                              >
                                {state.status}
                              </Badge>
                            </div>
                            <p className="text-[10px] text-surface-400 mt-0.5">
                              {new Date(state.timestamp).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
