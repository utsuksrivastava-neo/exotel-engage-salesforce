import { useNavigate } from 'react-router-dom';
import {
  Rocket,
  Activity,
  Users,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  GitBranch,
  ExternalLink,
} from 'lucide-react';
import Card, { CardHeader } from '../components/Card';
import Badge from '../components/Badge';

const stats = [
  { label: 'Active Journeys', value: '12', change: '+3 this week', icon: GitBranch, color: 'bg-primary-50 text-primary-600' },
  { label: 'Total Contacts Reached', value: '1.2M', change: '+18% vs last month', icon: Users, color: 'bg-emerald-50 text-emerald-600' },
  { label: 'Executions Today', value: '8', change: '3 running, 5 completed', icon: Rocket, color: 'bg-violet-50 text-violet-600' },
  { label: 'Avg. Response Rate', value: '47.3%', change: '+2.1% improvement', icon: TrendingUp, color: 'bg-amber-50 text-amber-600' },
];

const recentExecutions = [
  { name: 'Q2 Collections Campaign', journeyId: 'BJ-2026-04-0847', status: 'running', contacts: '108.5K', started: '2 hrs ago', progress: 62 },
  { name: 'Payment Reminder Flow', journeyId: 'BJ-2026-03-0612', status: 'completed', contacts: '45.2K', started: '6 hrs ago', progress: 100 },
  { name: 'Welcome Series - New Users', journeyId: 'BJ-2026-04-0901', status: 'scheduled', contacts: '23.8K', started: 'In 1 hour', progress: 0 },
  { name: 'Win-back Campaign', journeyId: 'BJ-2026-03-0455', status: 'completed', contacts: '67.1K', started: 'Yesterday', progress: 100 },
];

const availableJourneys = [
  { id: 'BJ-2026-04-0847', name: 'Q2 Collections Campaign', channels: ['whatsapp', 'sms', 'call'], status: 'ready' },
  { id: 'BJ-2026-04-0901', name: 'Welcome Series - New Users', channels: ['whatsapp', 'email'], status: 'ready' },
  { id: 'BJ-2026-04-0923', name: 'Upsell Premium Plan', channels: ['whatsapp', 'sms'], status: 'ready' },
];

const statusConfig: Record<string, { icon: typeof PlayCircle; color: string; bg: string }> = {
  running: { icon: PlayCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  completed: { icon: CheckCircle2, color: 'text-primary-600', bg: 'bg-primary-50' },
  scheduled: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  failed: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
};

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-surface-900">Dashboard</h2>
          <p className="text-[13px] text-surface-500 mt-0.5">Overview of your CRM journey orchestration</p>
        </div>
        <button
          onClick={() => navigate('/execute')}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg text-[13px] font-semibold hover:bg-primary-700 transition-colors shadow-sm"
        >
          <Rocket className="w-4 h-4" />
          Execute Journey
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-medium text-surface-500">{stat.label}</p>
                <p className="text-2xl font-bold text-surface-900 mt-1">{stat.value}</p>
                <p className="text-[11px] text-surface-400 mt-1">{stat.change}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Recent Executions"
              subtitle="Track ongoing and past journey executions"
              icon={<Activity className="w-4 h-4" />}
              action={
                <button
                  onClick={() => navigate('/monitor')}
                  className="text-[12px] text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1"
                >
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </button>
              }
            />
            <div className="space-y-3">
              {recentExecutions.map((exec) => {
                const config = statusConfig[exec.status];
                return (
                  <div
                    key={exec.name}
                    className="flex items-center gap-4 p-3 rounded-lg bg-surface-50 hover:bg-surface-100 transition-colors cursor-pointer"
                    onClick={() => exec.status === 'running' && navigate('/monitor')}
                  >
                    <div className={`w-8 h-8 rounded-lg ${config.bg} ${config.color} flex items-center justify-center`}>
                      <config.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-surface-800 truncate">{exec.name}</p>
                      <p className="text-[11px] text-surface-400">
                        <span className="font-mono text-surface-500">{exec.journeyId}</span>
                        <span className="mx-1">&middot;</span>
                        {exec.contacts} contacts &middot; {exec.started}
                      </p>
                    </div>
                    <div className="w-32">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[11px] font-semibold capitalize ${config.color}`}>{exec.status}</span>
                        <span className="text-[11px] text-surface-400">{exec.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-surface-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${exec.status === 'running' ? 'bg-emerald-500' : exec.status === 'completed' ? 'bg-primary-500' : 'bg-surface-300'}`}
                          style={{ width: `${exec.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Available Journeys"
              subtitle="Ready to execute from Journey Builder"
              icon={<GitBranch className="w-4 h-4" />}
              action={
                <span className="flex items-center gap-1 text-[11px] text-surface-400">
                  <ExternalLink className="w-3 h-3" /> External app
                </span>
              }
            />
            <div className="space-y-2">
              {availableJourneys.map((journey) => (
                <button
                  key={journey.id}
                  onClick={() => navigate('/execute')}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-surface-200 hover:border-primary-200 hover:bg-primary-50/50 transition-all text-left group"
                >
                  <div className="w-8 h-8 rounded-lg bg-surface-50 group-hover:bg-primary-100 text-surface-400 group-hover:text-primary-600 flex items-center justify-center transition-all">
                    <GitBranch className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-surface-800 truncate">{journey.name}</p>
                    <p className="text-[11px] text-surface-400 font-mono">{journey.id}</p>
                  </div>
                  <Badge variant="success">Ready</Badge>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Quick Actions"
              subtitle="Common tasks"
              icon={<Rocket className="w-4 h-4" />}
            />
            <div className="space-y-2">
              {[
                { label: 'Execute Journey', desc: 'Schedule & run a journey', to: '/execute', icon: Rocket },
                { label: 'View Monitor', desc: 'Check live executions', to: '/monitor', icon: Activity },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.to)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-surface-200 hover:border-primary-200 hover:bg-primary-50/50 transition-all text-left group"
                >
                  <div className="w-8 h-8 rounded-lg bg-surface-50 group-hover:bg-primary-100 text-surface-400 group-hover:text-primary-600 flex items-center justify-center transition-all">
                    <action.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-surface-800">{action.label}</p>
                    <p className="text-[11px] text-surface-400">{action.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-surface-300 ml-auto group-hover:text-primary-500 transition-colors" />
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
