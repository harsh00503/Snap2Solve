import { CheckCircle2, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import type { AnalysisMode } from '../types/analysis';
import { modeMeta } from '../services/api';

interface Props {
  answer: string;
  summary: string;
  mode: AnalysisMode;
}

function renderInlineMarkdown(text: string): ReactNode[] {
  const tokens = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  const parts = text.split(tokens);

  return parts.filter(Boolean).map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={index} className="rounded bg-slate-950 px-1.5 py-0.5 font-mono text-[0.9em] text-violet-200">
          {part.slice(1, -1)}
        </code>
      );
    }

    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-semibold text-slate-100">{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }

    return <span key={index}>{part}</span>;
  });
}

function MarkdownContent({ content }: { content: string }) {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const blocks: ReactNode[] = [];
  let codeLines: string[] = [];
  let inCodeBlock = false;

  const flushCodeBlock = () => {
    if (codeLines.length === 0) return;
    blocks.push(
      <pre key={`code-${blocks.length}`} className="overflow-x-auto rounded-2xl border border-slate-700 bg-slate-950 p-4 text-xs leading-6 text-slate-200">
        <code>{codeLines.join('\n')}</code>
      </pre>
    );
    codeLines = [];
  };

  lines.forEach((line, index) => {
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) flushCodeBlock();
      inCodeBlock = !inCodeBlock;
      return;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      return;
    }

    const trimmed = line.trim();
    if (!trimmed) return;

    if (/^---+$/.test(trimmed)) {
      blocks.push(<hr key={`rule-${index}`} className="border-slate-700" />);
      return;
    }

    const heading = trimmed.match(/^#{1,4}\s+(.+)$/);
    if (heading) {
      blocks.push(
        <h4 key={`heading-${index}`} className="pt-2 text-base font-semibold text-white">
          {renderInlineMarkdown(heading[1].replace(/\*\*/g, ''))}
        </h4>
      );
      return;
    }

    const bullet = trimmed.match(/^(?:[-*])\s+(.+)$/);
    if (bullet) {
      blocks.push(
        <li key={`bullet-${index}`} className="ml-5 list-disc pl-1">
          {renderInlineMarkdown(bullet[1])}
        </li>
      );
      return;
    }

    const numbered = trimmed.match(/^\d+[.)]\s+(.+)$/);
    if (numbered) {
      blocks.push(
        <li key={`number-${index}`} className="ml-5 list-decimal pl-1">
          {renderInlineMarkdown(numbered[1])}
        </li>
      );
      return;
    }

    blocks.push(
      <p key={`paragraph-${index}`} className="text-sm leading-7 text-slate-300">
        {renderInlineMarkdown(trimmed)}
      </p>
    );
  });

  if (inCodeBlock) flushCodeBlock();

  return <div className="space-y-3">{blocks}</div>;
}

export function AnalysisResults({ answer, summary, mode }: Props) {
  return (
    <div className="space-y-5 rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-violet-300">{modeMeta[mode].label} analysis</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Response</h3>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Ready
        </div>
      </div>

      <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4">
        <div className="mb-2 flex items-center gap-2 text-violet-200">
          <Sparkles className="h-4 w-4" />
          <span className="text-xs font-medium uppercase tracking-[0.12em]">Summary</span>
        </div>
        <p className="text-sm text-slate-200">{renderInlineMarkdown(summary)}</p>
      </div>

      <MarkdownContent content={answer} />
    </div>
  );
}
