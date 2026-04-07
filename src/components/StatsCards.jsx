import { useProgress } from '../context/ProgressContext';

export default function StatsCards() {
    const { doneCount, failedCount, remainCount, pct, getStreak } = useProgress();
    const streak = getStreak();

    const stats = [
        { label: 'Done', value: doneCount, color: 'text-fuchsia-200', tone: 'from-fuchsia-500/20' },
        { label: 'Failed', value: failedCount, color: 'text-rose-300', tone: 'from-rose-500/20' },
        { label: 'Remaining', value: remainCount, color: 'text-slate-200', tone: 'from-slate-500/20' },
        { label: 'Streak', value: `${streak}d`, color: 'text-violet-200', tone: 'from-violet-500/20' },
    ];

    return (
        <div className="glass-panel p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {stats.map((s) => (
                    <div key={s.label} className={`rounded-xl p-3 text-center border border-slate-700/80 bg-gradient-to-b ${s.tone} to-slate-900/50`}>
                        <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                        <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400 mt-1">{s.label}</div>
                    </div>
                ))}
            </div>
            <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                    <span>Overall progress</span>
                    <span>
                        {doneCount} / 180 ({pct}%)
                    </span>
                </div>
                <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                    <div
                        className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
