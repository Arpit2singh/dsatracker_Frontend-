import { getPhaseLabel } from '../utils/phaseEngine';

const colors = {
    blue: 'bg-violet-500/15 text-violet-200 border-violet-400/40',
    green: 'bg-rose-500/15 text-rose-200 border-rose-400/40',
    purple: 'bg-fuchsia-500/15 text-fuchsia-200 border-fuchsia-400/40',
};

export default function PhaseBar() {
    const { label, color, desc } = getPhaseLabel();
    return (
        <div className={`glass-panel border rounded-xl px-4 py-3 text-sm flex items-start sm:items-center gap-2 sm:gap-3 flex-col sm:flex-row ${colors[color]}`}>
            <span className="font-semibold tracking-wide">{label}</span>
            <span className="opacity-80 text-xs sm:text-sm">{desc}</span>
        </div>
    );
}
