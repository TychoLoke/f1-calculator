interface GradientMeterProps {
  label: string;
  value: number | null;
  helper?: string;
}

export function GradientMeter({ label, value, helper }: GradientMeterProps) {
  const safeValue = value != null ? Math.min(100, Math.max(0, value)) : null;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-300">
        <span>{label}</span>
        <span>{safeValue != null ? `${safeValue}%` : '—'}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#ff5f6d] via-[#5b8bff] to-[#7c3aed] transition-all"
          style={{ width: `${safeValue ?? 6}%`, opacity: safeValue == null ? 0.3 : 1 }}
        />
      </div>
      {helper && <p className="text-xs text-slate-400">{helper}</p>}
    </div>
  );
}
