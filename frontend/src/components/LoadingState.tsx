export function LoadingState() {
  return (
    <div className="flex min-h-[220px] items-center justify-center rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500/40 border-t-violet-400" />
        <div>
          <p className="text-base font-medium text-white">Understanding your screenshot</p>
          <p className="text-sm text-slate-400">Reading the image and generating an explanation…</p>
        </div>
      </div>
    </div>
  );
}
