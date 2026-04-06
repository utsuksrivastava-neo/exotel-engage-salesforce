import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Zap,
  Gauge,
  Clock,
  DollarSign,
  SlidersHorizontal,
  Play,
  X,
  FlaskConical,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ArrowRightLeft,
  Timer,
  IndianRupee,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import Card, { CardHeader } from '../../components/Card';
import ChannelIcon, { channelConfig } from '../../components/ChannelIcon';
import Badge from '../../components/Badge';
import DryRunModal from './DryRunModal';
import type { ScheduleConfig, SourceConfig, ChannelType } from '../../types';
import {
  mockAudienceSummary,
  mockJourneyExplosion,
  mockSystemLoad,
  mockTimeline,
  mockCostEstimation,
  mockAssumptions,
} from '../../utils/mockData';

interface SummaryStepProps {
  schedule: ScheduleConfig;
  source: SourceConfig;
}

const channelColors: Record<ChannelType, string> = {
  whatsapp: '#22c55e',
  sms: '#8b5cf6',
  call: '#f97316',
  email: '#0ea5e9',
};

export default function SummaryStep({ schedule }: SummaryStepProps) {
  const navigate = useNavigate();
  const [throttle, setThrottle] = useState(75);
  const [showDryRun, setShowDryRun] = useState(false);
  const [assumptions, setAssumptions] = useState(mockAssumptions);
  const [executionTime, setExecutionTime] = useState(schedule.startTime);
  const [executionDate, setExecutionDate] = useState(schedule.startDate);

  const totalCost = mockCostEstimation.reduce((sum, c) => sum + c.totalCost, 0);

  const timelineChartData = mockTimeline.map((t) => ({
    name: t.timeRange,
    volume: t.volume,
    color: channelColors[t.channel],
    channel: t.channel,
    isSpike: t.isSpike,
  }));

  return (
    <>
      <div className="max-w-5xl mx-auto space-y-5">
        <div className="p-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold">Pre-Execution Intelligence Summary</h3>
              <p className="text-[12px] text-primary-100">
                Review projections for safety, scale, and cost before executing. This is a mandatory gate.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Panel A: Audience Summary */}
          <Card>
            <CardHeader
              title="Panel A: Audience Summary"
              subtitle="CRM data breakdown"
              icon={<Users className="w-4 h-4" />}
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-surface-50">
                <p className="text-[11px] text-surface-500 font-medium">Total Records</p>
                <p className="text-xl font-bold text-surface-900">{mockAudienceSummary.totalRecords.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50">
                <p className="text-[11px] text-emerald-600 font-medium">Valid Contacts</p>
                <p className="text-xl font-bold text-emerald-700">{mockAudienceSummary.validContacts.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-lg bg-red-50">
                <p className="text-[11px] text-red-600 font-medium">Invalid Contacts</p>
                <p className="text-xl font-bold text-red-700">{mockAudienceSummary.invalidContacts.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-50">
                <p className="text-[11px] text-amber-600 font-medium">Deduplicated</p>
                <p className="text-xl font-bold text-amber-700">{mockAudienceSummary.deduplicatedContacts.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-3 p-3 rounded-lg bg-violet-50 border border-violet-100">
              <p className="text-[11px] text-violet-600 font-medium mb-1">Skipped (Already in active journey)</p>
              <p className="text-lg font-bold text-violet-700">{mockAudienceSummary.skippedContacts.toLocaleString()}</p>
            </div>
            <div className="mt-3">
              <p className="text-[11px] font-semibold text-surface-500 mb-2">Channel-wise Availability</p>
              <div className="space-y-2">
                {(Object.entries(mockAudienceSummary.channelBreakdown) as [ChannelType, number][]).map(([ch, count]) => (
                  <div key={ch} className="flex items-center gap-3">
                    <ChannelIcon channel={ch} size="sm" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[12px] font-medium text-surface-700 capitalize">{channelConfig[ch].label}</span>
                        <span className="text-[12px] font-semibold text-surface-800">{count.toLocaleString()}</span>
                      </div>
                      <div className="h-1.5 bg-surface-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(count / mockAudienceSummary.totalRecords) * 100}%`,
                            backgroundColor: channelColors[ch],
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Panel B: Journey Explosion */}
          <Card>
            <CardHeader
              title="Panel B: Journey Explosion"
              subtitle="Computed total actions across all channels"
              icon={<Zap className="w-4 h-4" />}
            />

            <div className="p-4 rounded-xl bg-gradient-to-br from-surface-800 to-surface-900 text-white mb-4">
              <p className="text-[11px] text-surface-300 font-medium">Grand Total Actions</p>
              <p className="text-3xl font-bold mt-1">{mockJourneyExplosion.totalActions.toLocaleString()}</p>
              <p className="text-[11px] text-surface-400 mt-1">
                From {mockAudienceSummary.validContacts.toLocaleString()} CRM contacts entering journey
              </p>
            </div>

            <div className="space-y-3">
              {(Object.entries(mockJourneyExplosion.channelActions) as [ChannelType, number][])
                .filter(([, count]) => count > 0)
                .map(([ch, count]) => (
                  <div key={ch} className="flex items-center gap-3 p-3 rounded-lg bg-surface-50">
                    <ChannelIcon channel={ch} size="md" />
                    <div className="flex-1">
                      <p className="text-[12px] font-medium text-surface-600 capitalize">{channelConfig[ch].label} Messages</p>
                      <p className="text-lg font-bold text-surface-900">{count.toLocaleString()}</p>
                    </div>
                    <span className="text-[12px] font-semibold text-surface-400">
                      {((count / mockJourneyExplosion.totalActions) * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
            </div>

            <div className="mt-4">
              <p className="text-[11px] font-semibold text-surface-500 mb-2 flex items-center gap-1.5">
                <ArrowRightLeft className="w-3.5 h-3.5" />
                Fallback Chains
              </p>
              {mockJourneyExplosion.fallbackChains.map((chain, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 border border-amber-100 mb-2">
                  <Badge variant={chain.from}>{channelConfig[chain.from].label}</Badge>
                  <span className="text-[11px] text-amber-600">→</span>
                  <Badge variant={chain.to}>{channelConfig[chain.to].label}</Badge>
                  <span className="text-[11px] font-semibold text-amber-700 ml-auto">{chain.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Panel C: System Load Estimation */}
          <Card>
            <CardHeader
              title="Panel C: System Load Estimation"
              subtitle="Required vs. available capacity"
              icon={<Gauge className="w-4 h-4" />}
            />

            <div className="overflow-hidden rounded-lg border border-surface-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-50">
                    <th className="text-left text-[11px] font-semibold text-surface-500 px-3 py-2.5">Channel</th>
                    <th className="text-right text-[11px] font-semibold text-surface-500 px-3 py-2.5">Required TPS</th>
                    <th className="text-right text-[11px] font-semibold text-surface-500 px-3 py-2.5">Capacity TPS</th>
                    <th className="text-center text-[11px] font-semibold text-surface-500 px-3 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockSystemLoad.map((load) => (
                    <tr key={load.channel} className="border-t border-surface-100">
                      <td className="px-3 py-3">
                        <ChannelIcon channel={load.channel} size="sm" showLabel />
                      </td>
                      <td className="text-right px-3 py-3 text-[13px] font-semibold text-surface-800">
                        {load.requiredTPS}
                      </td>
                      <td className="text-right px-3 py-3 text-[13px] font-semibold text-surface-800">
                        {load.capacityTPS}
                      </td>
                      <td className="text-center px-3 py-3">
                        {load.status === 'ok' ? (
                          <Badge variant="success" dot>OK</Badge>
                        ) : load.status === 'warning' ? (
                          <Badge variant="warning" dot>Warning</Badge>
                        ) : (
                          <Badge variant="danger" dot>Overload</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {mockSystemLoad.some((l) => l.status === 'overload') && (
              <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] font-semibold text-red-700">Capacity Overload Detected</p>
                  <p className="text-[11px] text-red-600 mt-0.5">
                    Call channel exceeds capacity. Consider reducing throttle or increasing call infrastructure.
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Panel D: Timeline Simulation */}
          <Card>
            <CardHeader
              title="Panel D: Timeline Simulation"
              subtitle="Time-based distribution & predicted load spikes"
              icon={<Clock className="w-4 h-4" />}
            />

            <div className="h-48 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timelineChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <Tooltip
                    contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
                    {timelineChartData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} opacity={entry.isSpike ? 1 : 0.6} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 space-y-1.5">
              {mockTimeline
                .filter((t) => t.isSpike)
                .map((t, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 border border-amber-100">
                    <Timer className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-[11px] font-semibold text-amber-700">{t.timeRange}</span>
                    <span className="text-[11px] text-amber-600">→ {t.action}</span>
                    <span className="text-[11px] font-bold text-amber-800 ml-auto">{t.volume.toLocaleString()}</span>
                  </div>
                ))}
            </div>
          </Card>

          {/* Panel E: Cost Estimation */}
          <Card>
            <CardHeader
              title="Panel E: Cost Estimation"
              subtitle="Pure pass-through pricing (no markup)"
              icon={<IndianRupee className="w-4 h-4" />}
            />

            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-white mb-4">
              <p className="text-[11px] text-emerald-100 font-medium">Total Estimated Cost</p>
              <p className="text-3xl font-bold mt-1">
                <span className="text-lg">&#8377;</span>{totalCost.toLocaleString()}
              </p>
              <p className="text-[11px] text-emerald-200 mt-1">Based on current assumptions and channel volumes</p>
            </div>

            <div className="overflow-hidden rounded-lg border border-surface-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-50">
                    <th className="text-left text-[11px] font-semibold text-surface-500 px-3 py-2.5">Channel</th>
                    <th className="text-right text-[11px] font-semibold text-surface-500 px-3 py-2.5">Unit Cost</th>
                    <th className="text-right text-[11px] font-semibold text-surface-500 px-3 py-2.5">Volume</th>
                    <th className="text-right text-[11px] font-semibold text-surface-500 px-3 py-2.5">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {mockCostEstimation.filter((c) => c.volume > 0).map((cost) => (
                    <tr key={cost.channel} className="border-t border-surface-100">
                      <td className="px-3 py-3">
                        <ChannelIcon channel={cost.channel} size="sm" showLabel />
                      </td>
                      <td className="text-right px-3 py-3 text-[12px] text-surface-600">&#8377;{cost.unitCost.toFixed(2)}</td>
                      <td className="text-right px-3 py-3 text-[12px] text-surface-600">{cost.volume.toLocaleString()}</td>
                      <td className="text-right px-3 py-3 text-[13px] font-bold text-surface-800">&#8377;{cost.totalCost.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Panel F: Assumption Engine */}
          <Card>
            <CardHeader
              title="Panel F: Assumption Engine"
              subtitle="View and edit estimation assumptions"
              icon={<SlidersHorizontal className="w-4 h-4" />}
            />

            <div className="space-y-3">
              {assumptions.map((assumption, i) => (
                <div key={assumption.label} className="p-3 rounded-lg bg-surface-50 border border-surface-100">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[12px] font-semibold text-surface-700">{assumption.label}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-surface-400">Last Run:</span>
                      <Badge variant="default">{assumption.lastRunValue}{assumption.unit}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={assumption.currentValue}
                      onChange={(e) => {
                        const updated = [...assumptions];
                        updated[i] = { ...updated[i], currentValue: Number(e.target.value) };
                        setAssumptions(updated);
                      }}
                      className="flex-1 h-1.5 accent-primary-600"
                    />
                    <span className="text-[13px] font-bold text-primary-700 w-12 text-right">
                      {assumption.currentValue}{assumption.unit}
                    </span>
                  </div>
                  {assumption.currentValue !== assumption.lastRunValue && (
                    <div className="mt-1.5 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-primary-500" />
                      <span className="text-[10px] text-primary-600 font-medium">
                        Changed from {assumption.lastRunValue}{assumption.unit}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Panel G: Execution Controls */}
        <Card>
          <CardHeader
            title="Panel G: Execution Controls"
            subtitle="Fine-tune execution timing and speed"
            icon={<SlidersHorizontal className="w-4 h-4" />}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <p className="text-[11px] font-semibold text-surface-500 mb-3">Scheduled Start Time</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-surface-400 mb-1">Date</label>
                  <input
                    type="date"
                    value={executionDate}
                    onChange={(e) => setExecutionDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-surface-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-surface-400 mb-1">Time</label>
                  <input
                    type="time"
                    value={executionTime}
                    onChange={(e) => setExecutionTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-surface-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                  />
                </div>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-surface-500 mb-3">Throttling Control</p>
              <div className="p-4 rounded-lg bg-surface-50 border border-surface-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] text-surface-600">Execution Speed</span>
                  <span className="text-[14px] font-bold text-primary-700">{throttle}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={5}
                  value={throttle}
                  onChange={(e) => setThrottle(Number(e.target.value))}
                  className="w-full h-2 accent-primary-600"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-surface-400">10% (Slow)</span>
                  <span className="text-[10px] text-surface-400">100% (Max)</span>
                </div>
                {throttle < 100 && (
                  <p className="text-[10px] text-primary-600 mt-2 font-medium">
                    Execution will be spread over {Math.round(24 / (throttle / 100))} hours to prevent instant blasts
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Panel H: Action Footer */}
        <div className="p-5 bg-white rounded-xl border border-surface-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-semibold text-surface-700">Ready to execute?</p>
              <p className="text-[11px] text-surface-400 mt-0.5">
                {mockAudienceSummary.validContacts.toLocaleString()} contacts &middot;{' '}
                {mockJourneyExplosion.totalActions.toLocaleString()} total actions &middot;{' '}
                &#8377;{totalCost.toLocaleString()} estimated cost
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2.5 border border-surface-200 rounded-lg text-[13px] font-medium text-surface-600 hover:bg-surface-50 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={() => setShowDryRun(true)}
                className="flex items-center gap-2 px-4 py-2.5 border-2 border-violet-200 bg-violet-50 rounded-lg text-[13px] font-semibold text-violet-700 hover:bg-violet-100 transition-colors"
              >
                <FlaskConical className="w-4 h-4" />
                Dry Run
              </button>
              <button
                onClick={() => navigate('/monitor')}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-[13px] font-bold hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <Play className="w-4 h-4" />
                Execute
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDryRun && <DryRunModal onClose={() => setShowDryRun(false)} />}
    </>
  );
}
