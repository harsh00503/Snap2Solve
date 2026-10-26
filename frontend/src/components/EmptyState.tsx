import { Sparkles } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex min-h-[250px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-slate-900/60 p-8 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300 ring-1 ring-violet-500/20">
        <Sparkles className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-semibold text-white">Your screenshot. Your question. A clear solution.</h3>
      <p className="mt-2 max-w-md text-sm text-slate-400">
        Upload a screenshot to inspect errors, explain content, or turn visual details into a practical action plan.
      </p>
    </div>
  );
}
