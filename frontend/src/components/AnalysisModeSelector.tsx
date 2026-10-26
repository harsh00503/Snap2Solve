import { AlertTriangle, FileSearch, Wand2 } from 'lucide-react';
import type { AnalysisMode } from '../types/analysis';
import { modeMeta } from '../services/api';

interface Props {
  mode: AnalysisMode;
  onChange: (mode: AnalysisMode) => void;
}

const icons: Record<AnalysisMode, typeof AlertTriangle> = {
  DEBUG: AlertTriangle,
  UNDERSTAND: FileSearch,
  ACT: Wand2
};

export function AnalysisModeSelector({ mode, onChange }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-200">Analysis mode</h3>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {(Object.keys(modeMeta) as AnalysisMode[]).map((key) => {
          const Icon = icons[key];
          const active = mode === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={[
                'rounded-2xl border p-4 text-left transition',
                active
                  ? 'border-violet-500/50 bg-violet-500/10 shadow-[0_0_0_1px_rgba(168,85,247,0.25)]'
                  : 'border-slate-700 bg-slate-900/50 hover:border-slate-600 hover:bg-slate-900'
              ].join(' ')}
            >
              <div className="mb-3 flex items-center gap-3">
                <span className={[
                  'flex h-9 w-9 items-center justify-center rounded-xl',
                  active ? 'bg-violet-500/20 text-violet-200' : 'bg-slate-800 text-slate-300'
                ].join(' ')}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold text-white">{modeMeta[key].label}</span>
              </div>
              <p className="text-xs text-slate-400">{modeMeta[key].description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
