import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import StepIndicator from '../components/StepIndicator';
import ScheduleStep from './execution/ScheduleStep';
import SourceStep from './execution/SourceStep';
import SummaryStep from './execution/SummaryStep';
import type { ScheduleConfig, SourceConfig } from '../types';

const steps = [
  { label: 'Schedule', description: 'Execution timing' },
  { label: 'Source', description: 'CRM configuration' },
  { label: 'Intelligence', description: 'Pre-execution review' },
];

export default function ExecutionSetup() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const [schedule, setSchedule] = useState<ScheduleConfig>({
    executionType: 'recurring',
    startTime: '09:00',
    startDate: '2026-04-07',
    frequency: 'daily',
    dataMode: 'incremental',
  });

  const [source, setSource] = useState<SourceConfig>({
    source: 'crm',
    ingestionMethod: 'batch',
    autoDedup: true,
    skipActiveJourney: true,
    queueBuffering: true,
  });

  const canProceed = () => {
    if (currentStep === 0) return schedule.startTime && schedule.startDate;
    if (currentStep === 1) return source.source === 'crm';
    return true;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-5 bg-white border-b border-surface-200 shrink-0">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-surface-900">Execute: Q2 Collections Campaign</h2>
            <p className="text-[12px] text-surface-500 mt-0.5">
              Journey ID: <span className="font-mono text-primary-600 font-semibold">BJ-2026-04-0847</span>
              <span className="mx-1.5 text-surface-300">|</span>
              Configure scheduling, source, and review intelligence before execution
            </p>
          </div>
        </div>
        <StepIndicator steps={steps} currentStep={currentStep} />
      </div>

      <div className="flex-1 overflow-auto p-6">
        {currentStep === 0 && <ScheduleStep config={schedule} onChange={setSchedule} />}
        {currentStep === 1 && <SourceStep config={source} onChange={setSource} />}
        {currentStep === 2 && <SummaryStep schedule={schedule} source={source} />}
      </div>

      <div className="px-6 py-4 bg-white border-t border-surface-200 flex items-center justify-between shrink-0">
        <button
          onClick={() => (currentStep === 0 ? navigate('/') : setCurrentStep((s) => s - 1))}
          className="flex items-center gap-2 px-4 py-2.5 border border-surface-200 rounded-lg text-[13px] font-medium text-surface-600 hover:bg-surface-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {currentStep === 0 ? 'Back to Dashboard' : 'Previous'}
        </button>

        {currentStep < 2 ? (
          <button
            onClick={() => setCurrentStep((s) => s + 1)}
            disabled={!canProceed()}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg text-[13px] font-semibold hover:bg-primary-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next Step
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
