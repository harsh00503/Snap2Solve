import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  serviceStatus: 'checking' | 'ready' | 'needs-key' | 'offline';
}

const statusCopy = {
  checking: { label: 'Checking AI service', className: 'border-slate-600 bg-slate-800/60 text-slate-300' },
  ready: { label: 'AI service ready', className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' },
  'needs-key': { label: 'API key required', className: 'border-amber-500/30 bg-amber-500/10 text-amber-300' },
  offline: { label: 'AI service offline', className: 'border-rose-500/30 bg-rose-500/10 text-rose-300' }
} as const;

export function Header({ serviceStatus }: Props) {
  const status = statusCopy[serviceStatus];

  return (
    <header className="flex flex-col gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white md:text-4xl">
          Understand anything on your screen.
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300 md:text-base">
          Upload a screenshot, ask a question, and get a clear explanation or step-by-step fix powered by multimodal AI.
        </p>
      </div>

      <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${status.className}`}>
        {serviceStatus === 'ready' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
        {status.label}
      </div>
    </header>
  );
}
