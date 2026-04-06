import { useState, useEffect } from 'react';
import {
  FlaskConical,
  X,
  CheckCircle2,
  Loader2,
  Users,
  Zap,
  Gauge,
  Clock,
  IndianRupee,
  AlertTriangle,
} from 'lucide-react';
import ChannelIcon, { channelConfig } from '../../components/ChannelIcon';
import Badge from '../../components/Badge';
import type { ChannelType } from '../../types';
import {
  mockAudienceSummary,
  mockJourneyExplosion,
  mockSystemLoad,
  mockCostEstimation,
} from '../../utils/mockData';

interface DryRunModalProps {
  onClose: () => void;
}

type SimPhase = 'simulating' | 'complete';

export default function DryRunModal({ onClose }: DryRunModalProps) {
  const [phase, setPhase] = useState<SimPhase>('simulating');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setPhase('complete');
          return 100;
        }
        return p + 4;
      });
    }, 120);
    return () => clearInterval(interval);
  }, []);

  const totalCost = mockCostEstimation.reduce((sum, c) => sum + c.totalCost, 0);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl">
        <div className="px-6 py-4 bg-violet-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold">Dry Run Simulation</h3>
              <p className="text-[11px] text-violet-200">No actual messages will be sent</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(85vh-130px)]">
          {phase === 'simulating' && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-violet-600 animate-spin mb-4" />
              <p className="text-[15px] font-semibold text-surface-800">Simulating Journey Execution...</p>
              <p className="text-[12px] text-surface-400 mt-1">Processing {mockAudienceSummary.validContacts.toLocaleString()} contacts</p>
              <div className="w-64 mt-6">
                <div className="flex justify-between mb-1.5">
                  <span className="text-[11px] text-surface-400">Progress</span>
                  <span className="text-[11px] font-semibold text-violet-600">{Math.min(progress, 100)}%</span>
                </div>
                <div className="h-2 bg-surface-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-600 rounded-full transition-all duration-100"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {phase === 'complete' && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <div>
                  <p className="text-[14px] font-semibold text-emerald-800">Dry Run Complete</p>
                  <p className="text-[12px] text-emerald-600">
                    Simulation finished successfully. No messages were sent.
                  </p>
                </div>
              </div>

              {/* Simulated Actions */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-surface-400" />
                  <h4 className="text-[13px] font-semibold text-surface-700">Simulated Action Counts</h4>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {(Object.entries(mockJourneyExplosion.channelActions) as [ChannelType, number][])
                    .filter(([, count]) => count > 0)
                    .map(([ch, count]) => (
                      <div key={ch} className="p-3 rounded-lg bg-surface-50 border border-surface-100 text-center">
                        <ChannelIcon channel={ch} size="sm" />
                        <p className="text-lg font-bold text-surface-900 mt-2">{count.toLocaleString()}</p>
                        <p className="text-[10px] text-surface-400 capitalize">{channelConfig[ch].label}</p>
                      </div>
                    ))}
                </div>
                <div className="mt-2 p-3 rounded-lg bg-primary-50 border border-primary-100 text-center">
                  <p className="text-[11px] text-primary-600 font-medium">Total Simulated Actions</p>
                  <p className="text-2xl font-bold text-primary-700">{mockJourneyExplosion.totalActions.toLocaleString()}</p>
                </div>
              </div>

              {/* System Load */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Gauge className="w-4 h-4 text-surface-400" />
                  <h4 className="text-[13px] font-semibold text-surface-700">Expected System Load</h4>
                </div>
                <div className="space-y-2">
                  {mockSystemLoad.map((load) => (
                    <div key={load.channel} className="flex items-center gap-3 p-2 rounded-lg bg-surface-50">
                      <ChannelIcon channel={load.channel} size="sm" showLabel />
                      <div className="flex-1 flex items-center gap-3">
                        <div className="flex-1">
                          <div className="h-1.5 bg-surface-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                load.status === 'ok' ? 'bg-emerald-500' : load.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min((load.requiredTPS / load.capacityTPS) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-[11px] font-semibold text-surface-600 w-20 text-right">
                          {load.requiredTPS}/{load.capacityTPS} TPS
                        </span>
                        {load.status === 'overload' ? (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline Summary */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-surface-400" />
                  <h4 className="text-[13px] font-semibold text-surface-700">Estimated Timeline</h4>
                </div>
                <div className="p-3 rounded-lg bg-surface-50 border border-surface-100">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-[10px] text-surface-400">WhatsApp Phase</p>
                      <p className="text-[14px] font-bold text-surface-800">0-30 min</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-surface-400">SMS Fallback</p>
                      <p className="text-[14px] font-bold text-surface-800">+2 hrs</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-surface-400">Call Trigger</p>
                      <p className="text-[14px] font-bold text-surface-800">+4 hrs</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cost */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <IndianRupee className="w-4 h-4 text-surface-400" />
                  <h4 className="text-[13px] font-semibold text-surface-700">Estimated Cost</h4>
                </div>
                <div className="p-4 rounded-lg bg-surface-50 border border-surface-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {mockCostEstimation.filter((c) => c.volume > 0).map((c) => (
                      <div key={c.channel} className="flex items-center gap-2">
                        <Badge variant={c.channel}>{channelConfig[c.channel].label}: &#8377;{c.totalCost.toLocaleString()}</Badge>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-[10px] text-surface-400 text-right">Total</p>
                    <p className="text-xl font-bold text-surface-900">&#8377;{totalCost.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-surface-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-surface-200 rounded-lg text-[13px] font-medium text-surface-600 hover:bg-surface-50 transition-colors"
          >
            Close
          </button>
          {phase === 'complete' && (
            <button className="px-5 py-2.5 bg-primary-600 text-white rounded-lg text-[13px] font-semibold hover:bg-primary-700 transition-colors shadow-sm">
              Proceed to Execute
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
