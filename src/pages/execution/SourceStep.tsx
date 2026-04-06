import {
  Database,
  Zap,
  Layers,
  Shield,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  Lock,
} from 'lucide-react';
import Card, { CardHeader } from '../../components/Card';
import type { SourceConfig } from '../../types';

interface SourceStepProps {
  config: SourceConfig;
  onChange: (config: SourceConfig) => void;
}

export default function SourceStep({ config, onChange }: SourceStepProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Source Selection */}
      <Card>
        <CardHeader
          title="Input Source"
          subtitle="Select the data source for this execution"
          icon={<Database className="w-4 h-4" />}
        />

        <div className="grid grid-cols-2 gap-3">
          <button
            className="p-4 rounded-xl border-2 border-primary-400 bg-primary-50/50 ring-2 ring-primary-100 text-left"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-surface-800">CRM (Salesforce)</p>
                <p className="text-[11px] text-primary-600 font-medium">Selected</p>
              </div>
            </div>
            <p className="text-[11px] text-surface-500 leading-relaxed">
              Pull audience data directly from your connected Salesforce CRM instance.
            </p>
          </button>

          <button
            disabled
            className="p-4 rounded-xl border-2 border-surface-200 text-left opacity-50 cursor-not-allowed relative"
          >
            <div className="absolute top-3 right-3">
              <Lock className="w-4 h-4 text-surface-300" />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-surface-100 text-surface-400 flex items-center justify-center">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-surface-500">Excel Upload</p>
                <p className="text-[11px] text-surface-400">Unavailable</p>
              </div>
            </div>
            <p className="text-[11px] text-surface-400 leading-relaxed">
              Cannot combine with CRM source in the same execution.
            </p>
          </button>
        </div>

        <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-200 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
          <p className="text-[11px] text-blue-700 leading-relaxed">
            <strong>Single source constraint:</strong> Only one input source is allowed per execution. CRM and Excel uploads cannot be combined in the same run.
          </p>
        </div>
      </Card>

      {/* Ingestion Method */}
      <Card>
        <CardHeader
          title="Ingestion Configuration"
          subtitle="Choose how CRM data is pulled"
          icon={<Layers className="w-4 h-4" />}
        />

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onChange({ ...config, ingestionMethod: 'real-time' })}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              config.ingestionMethod === 'real-time'
                ? 'border-primary-400 bg-primary-50/50 ring-2 ring-primary-100'
                : 'border-surface-200 hover:border-surface-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap className={`w-4 h-4 ${config.ingestionMethod === 'real-time' ? 'text-primary-600' : 'text-surface-400'}`} />
              <p className="text-[13px] font-semibold text-surface-800">Real-time Trigger</p>
            </div>
            <p className="text-[11px] text-surface-500 leading-relaxed">
              Event-based triggers pulling individual updates as they occur in the CRM.
            </p>
            <div className="mt-2">
              <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-semibold rounded-full">Event-driven</span>
            </div>
          </button>

          <button
            onClick={() => onChange({ ...config, ingestionMethod: 'batch' })}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              config.ingestionMethod === 'batch'
                ? 'border-primary-400 bg-primary-50/50 ring-2 ring-primary-100'
                : 'border-surface-200 hover:border-surface-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Layers className={`w-4 h-4 ${config.ingestionMethod === 'batch' ? 'text-primary-600' : 'text-surface-400'}`} />
              <p className="text-[13px] font-semibold text-surface-800">Batch Ingestion</p>
            </div>
            <p className="text-[11px] text-surface-500 leading-relaxed">
              Bulk data transfers from CRM at scheduled intervals for high-volume processing.
            </p>
            <div className="mt-2">
              <span className="px-2 py-0.5 bg-violet-50 text-violet-700 text-[10px] font-semibold rounded-full">High throughput</span>
            </div>
          </button>
        </div>
      </Card>

      {/* Data Safeguards */}
      <Card>
        <CardHeader
          title="Data Safeguards"
          subtitle="Automatic protections applied to this execution"
          icon={<Shield className="w-4 h-4" />}
        />

        <div className="space-y-3">
          {[
            {
              icon: ShieldCheck,
              label: 'Queue Buffering',
              desc: 'Automatic buffer to handle sudden CRM data spikes and protect system stability',
              enabled: config.queueBuffering,
              mandatory: true,
            },
            {
              icon: CheckCircle2,
              label: 'Auto-Deduplication',
              desc: 'Automatically removes duplicate contacts from the CRM data feed',
              enabled: config.autoDedup,
              mandatory: true,
            },
            {
              icon: Shield,
              label: 'Skip Active Journey Contacts',
              desc: 'Contacts already in an active journey are automatically excluded',
              enabled: config.skipActiveJourney,
              mandatory: true,
            },
          ].map((guard) => (
            <div key={guard.label} className="flex items-start gap-3 p-3 rounded-lg bg-surface-50 border border-surface-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <guard.icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-semibold text-surface-800">{guard.label}</p>
                  {guard.mandatory && (
                    <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold rounded uppercase">Mandatory</span>
                  )}
                </div>
                <p className="text-[11px] text-surface-500 mt-0.5">{guard.desc}</p>
              </div>
              <div className="w-10 h-5 bg-emerald-500 rounded-full relative shrink-0 mt-1">
                <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
