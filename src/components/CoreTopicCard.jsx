import { useProgress } from '../context/ProgressContext';

const subjects = {
    OS: { color: 'bg-violet-500/15 text-violet-200 border border-violet-400/40', icon: 'OS' },
    DBMS: { color: 'bg-fuchsia-500/15 text-fuchsia-200 border border-fuchsia-400/40', icon: 'DB' },
    CN: { color: 'bg-rose-500/15 text-rose-200 border border-rose-400/40', icon: 'CN' },
    OOPs: { color: 'bg-purple-500/15 text-purple-200 border border-purple-400/40', icon: 'OO' },
    SD: { color: 'bg-rose-500/15 text-rose-200 border border-rose-400/40', icon: 'SD' },
};

export default function CoreTopicCard({ topic, showActions = true }) {
    const { coreProg, markCoreDone, isMutating } = useProgress();
    const p = coreProg[topic.id] || {};
    const s = subjects[topic.subject];

    return (
        <div
            className={`rounded-xl border p-3.5 flex items-center gap-3 ${p.status === 'read'
                ? 'border-violet-400/40 bg-violet-500/10'
                : p.status === 'needs-revision'
                    ? 'border-rose-400/40 bg-rose-500/10'
                    : 'border-slate-700 bg-slate-900/60 hover:border-fuchsia-400/40'
                }`}
        >
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${s.color}`}>
                {s.icon} {topic.subject}
            </span>
            <div className="flex-1 text-sm font-medium text-slate-100">{topic.name}</div>
            {showActions && p.status !== 'read' && (
                <div className="flex gap-1">
                    <button
                        onClick={() => markCoreDone(topic.id, 'needs-revision')}
                        disabled={isMutating}
                        className="text-xs px-2 py-1 rounded border border-rose-400/40 text-rose-200 hover:bg-rose-500/20"
                    >
                        revise
                    </button>
                    <button
                        onClick={() => markCoreDone(topic.id, 'read')}
                        disabled={isMutating}
                        className="text-xs px-2 py-1 rounded border border-violet-400/40 text-violet-200 hover:bg-violet-500/20 font-semibold"
                    >
                        done
                    </button>
                </div>
            )}
            {p.status === 'read' && <span className="text-violet-300 text-xs uppercase tracking-wide">Done</span>}
        </div>
    );
}
