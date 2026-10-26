import { BrainCircuit, Sparkles, FileText, Compass, ArrowUpRight } from 'lucide-react';

const navItems = [
  { label: 'Overview', icon: Compass },
  { label: 'Recent Analyses', icon: FileText },
  { label: 'How It Works', icon: Sparkles }
];

export function Sidebar() {
  return (
    <aside className="flex w-full flex-col justify-between border-b border-slate-800 bg-slate-950/90 p-5 backdrop-blur xl:w-72 xl:border-b-0 xl:border-r">
      <div>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300 ring-1 ring-violet-400/30">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold text-white">Snap2Solve AI</p>
            <p className="text-xs text-slate-400">Visual reasoning</p>
          </div>
        </div>

        <button className="mb-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-violet-400">
          <ArrowUpRight className="h-4 w-4" />
          New Analysis
        </button>

        <nav className="space-y-2">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className="flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-left text-sm text-slate-300 transition hover:border-slate-700 hover:bg-slate-900/80 hover:text-white"
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-8 rounded-xl border border-violet-500/20 bg-violet-500/8 px-3 py-2 text-xs text-violet-200">
        Powered by Gemma 4
      </div>
    </aside>
  );
}
