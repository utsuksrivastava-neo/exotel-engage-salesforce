import {
  CalendarClock,
  Repeat,
  Calendar,
  Clock,
  Info,
  RefreshCw,
  Database,
} from 'lucide-react';
import Card, { CardHeader } from '../../components/Card';
import type { ScheduleConfig } from '../../types';

interface ScheduleStepProps {
  config: ScheduleConfig;
  onChange: (config: ScheduleConfig) => void;
}

const frequencies = [
  { value: 'daily', label: 'Daily', desc: 'Runs every day at the specified time' },
  { value: 'weekly', label: 'Weekly', desc: 'Runs on selected days of the week' },
  { value: 'monthly', label: 'Monthly', desc: 'Runs on specific dates monthly' },
  { value: 'custom', label: 'Custom', desc: 'Define a custom cron pattern' },
] as const;

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function ScheduleStep({ config, onChange }: ScheduleStepProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Execution Type */}
      <Card>
        <CardHeader
          title="Execution Type"
          subtitle="Choose how this journey should be executed"
          icon={<CalendarClock className="w-4 h-4" />}
        />

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onChange({ ...config, executionType: 'one-time' })}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              config.executionType === 'one-time'
                ? 'border-primary-400 bg-primary-50/50 ring-2 ring-primary-100'
                : 'border-surface-200 hover:border-surface-300'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                config.executionType === 'one-time' ? 'bg-primary-100 text-primary-600' : 'bg-surface-100 text-surface-400'
              }`}>
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-surface-800">One-Time Execution</p>
                <p className="text-[11px] text-surface-400">For CRM batch uploads</p>
              </div>
            </div>
            <p className="text-[11px] text-surface-500 leading-relaxed">
              Define a specific start time. Execution ends upon natural completion of all contacts.
            </p>
          </button>

          <button
            onClick={() => onChange({ ...config, executionType: 'recurring' })}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              config.executionType === 'recurring'
                ? 'border-primary-400 bg-primary-50/50 ring-2 ring-primary-100'
                : 'border-surface-200 hover:border-surface-300'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                config.executionType === 'recurring' ? 'bg-primary-100 text-primary-600' : 'bg-surface-100 text-surface-400'
              }`}>
                <Repeat className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-surface-800">Recurring Execution</p>
                <p className="text-[11px] text-surface-400">For ongoing CRM syncs</p>
              </div>
            </div>
            <p className="text-[11px] text-surface-500 leading-relaxed">
              Configure a cron-like schedule for continuous processing of CRM data.
            </p>
          </button>
        </div>

        <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-[11px] text-amber-700 leading-relaxed">
            <strong>Immediate execution is not allowed.</strong> All executions must be scheduled with a defined start time to ensure system stability and proper load distribution.
          </p>
        </div>
      </Card>

      {/* Schedule Configuration */}
      <Card>
        <CardHeader
          title="Schedule Configuration"
          subtitle="Define when the execution should start"
          icon={<Clock className="w-4 h-4" />}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-surface-500 mb-1.5">Start Date</label>
            <input
              type="date"
              value={config.startDate}
              onChange={(e) => onChange({ ...config, startDate: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-surface-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-surface-500 mb-1.5">Start Time</label>
            <input
              type="time"
              value={config.startTime}
              onChange={(e) => onChange({ ...config, startTime: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-surface-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
            />
          </div>
        </div>

        {config.executionType === 'recurring' && (
          <>
            <div className="mt-5">
              <label className="block text-[11px] font-semibold text-surface-500 mb-2">Frequency</label>
              <div className="grid grid-cols-4 gap-2">
                {frequencies.map((freq) => (
                  <button
                    key={freq.value}
                    onClick={() => onChange({ ...config, frequency: freq.value })}
                    className={`px-3 py-2.5 rounded-lg border text-[12px] font-medium transition-all ${
                      config.frequency === freq.value
                        ? 'border-primary-400 bg-primary-50 text-primary-700'
                        : 'border-surface-200 text-surface-600 hover:border-surface-300'
                    }`}
                  >
                    {freq.label}
                  </button>
                ))}
              </div>
            </div>

            {config.frequency === 'weekly' && (
              <div className="mt-4">
                <label className="block text-[11px] font-semibold text-surface-500 mb-2">Select Days</label>
                <div className="flex gap-2">
                  {weekDays.map((day, i) => (
                    <button
                      key={day}
                      onClick={() => {
                        const days = config.selectedDays || [];
                        const updated = days.includes(i) ? days.filter((d) => d !== i) : [...days, i];
                        onChange({ ...config, selectedDays: updated });
                      }}
                      className={`w-10 h-10 rounded-lg text-[12px] font-semibold transition-all ${
                        config.selectedDays?.includes(i)
                          ? 'bg-primary-600 text-white'
                          : 'bg-surface-100 text-surface-500 hover:bg-surface-200'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {config.frequency === 'custom' && (
              <div className="mt-4">
                <label className="block text-[11px] font-semibold text-surface-500 mb-1.5">Cron Expression</label>
                <input
                  value={config.cronPattern || ''}
                  onChange={(e) => onChange({ ...config, cronPattern: e.target.value })}
                  placeholder="e.g., 0 9 * * 1 (Every Monday at 9 AM)"
                  className="w-full px-3 py-2.5 rounded-lg border border-surface-200 text-[13px] font-mono focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
                />
                <p className="text-[10px] text-surface-400 mt-1">Standard cron syntax: minute hour day-of-month month day-of-week</p>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Data Mode (Recurring only) */}
      {config.executionType === 'recurring' && (
        <Card>
          <CardHeader
            title="Data Processing Mode"
            subtitle="How should CRM data be processed on each run?"
            icon={<Database className="w-4 h-4" />}
          />

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onChange({ ...config, dataMode: 'incremental' })}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                config.dataMode === 'incremental'
                  ? 'border-primary-400 bg-primary-50/50 ring-2 ring-primary-100'
                  : 'border-surface-200 hover:border-surface-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className={`w-4 h-4 ${config.dataMode === 'incremental' ? 'text-primary-600' : 'text-surface-400'}`} />
                <p className="text-[13px] font-semibold text-surface-800">Incremental Mode</p>
              </div>
              <p className="text-[11px] text-surface-500 leading-relaxed">
                Process only <strong>new data</strong> from CRM since last run. Ideal for collections and event-based triggers.
              </p>
              <div className="mt-2 flex items-center gap-1.5">
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-semibold rounded-full">Recommended</span>
                <span className="px-2 py-0.5 bg-surface-100 text-surface-500 text-[10px] font-semibold rounded-full">Low resource</span>
              </div>
            </button>

            <button
              onClick={() => onChange({ ...config, dataMode: 'full-rerun' })}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                config.dataMode === 'full-rerun'
                  ? 'border-primary-400 bg-primary-50/50 ring-2 ring-primary-100'
                  : 'border-surface-200 hover:border-surface-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Database className={`w-4 h-4 ${config.dataMode === 'full-rerun' ? 'text-primary-600' : 'text-surface-400'}`} />
                <p className="text-[13px] font-semibold text-surface-800">Full Re-run Mode</p>
              </div>
              <p className="text-[11px] text-surface-500 leading-relaxed">
                Reprocess the <strong>entire CRM dataset</strong> every run. Ideal for broad marketing campaigns.
              </p>
              <div className="mt-2 flex items-center gap-1.5">
                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-semibold rounded-full">High resource</span>
                <span className="px-2 py-0.5 bg-surface-100 text-surface-500 text-[10px] font-semibold rounded-full">Complete coverage</span>
              </div>
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}
