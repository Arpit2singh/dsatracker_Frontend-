import { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { formatDate } from '../utils/dateHelpers';

const diffStyle = {
    Easy: 'text-violet-200 bg-violet-500/20 border border-violet-400/40',
    Medium: 'text-fuchsia-200 bg-fuchsia-500/20 border border-fuchsia-400/40',
    Hard: 'text-rose-200 bg-rose-500/20 border border-rose-400/40',
};

export default function QuestionCard({ q, isReview = false }) {
    const { dsaProg, markDone, markFail, saveNote, isMutating } = useProgress();
    const p = dsaProg[q.id] || {};
    const done = p.status === 'done';
    const [showNote, setShowNote] = useState(false);
    const [note, setNote] = useState(p.note || '');

    function handleNote() {
        saveNote(q.id, note);
        setShowNote(false);
    }

    const lcUrl = q.lc !== '0' ? `https://leetcode.com/problems/${q.lc}` : null;

    return (
        <div
            className={`rounded-xl border p-3.5 transition-all ${done
                ? 'border-violet-400/45 bg-violet-500/15'
                : isReview
                    ? 'border-rose-400/45 bg-rose-500/10'
                    : 'border-slate-700 bg-slate-900/60 hover:border-fuchsia-400/45'
                }`}
        >
            <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-slate-100">
                            {q.id}. {q.name}
                        </span>
                        {isReview && (
                            <span className="text-xs bg-rose-500/20 text-rose-200 px-2 py-0.5 rounded-full border border-rose-400/40">review #{p.failCount}</span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 mt-1.5 text-xs text-slate-400 flex-wrap">
                        <span>{q.topic}</span>
                        <span className={`px-2 py-0.5 rounded-full font-medium ${diffStyle[q.diff]}`}>{q.diff}</span>
                        {lcUrl && (
                            <a href={lcUrl} target="_blank" rel="noreferrer" className="text-fuchsia-300 hover:text-fuchsia-200 hover:underline">
                                LC #{q.lc}
                            </a>
                        )}
                        {p.nextReview && p.status === 'failed' && !isReview && <span>next: {formatDate(p.nextReview)}</span>}
                    </div>
                    {p.note && !showNote && <p className="text-xs text-slate-400 mt-1.5 italic truncate">{p.note}</p>}
                    {showNote && (
                        <div className="mt-2 flex gap-2">
                            <input
                                className="flex-1 text-xs border border-slate-600 bg-slate-900/90 text-slate-100 rounded px-2 py-1 outline-none focus:border-fuchsia-400"
                                placeholder="Write your approach..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleNote()}
                            />
                            <button onClick={handleNote} className="text-xs bg-fuchsia-500/80 text-slate-950 px-2 py-1 rounded hover:bg-fuchsia-400 font-semibold">
                                save
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                    {!done && (
                        <>
                            <button
                                onClick={() => setShowNote((s) => !s)}
                                disabled={isMutating}
                                className="text-xs px-2 py-1 rounded border border-slate-600 text-slate-300 hover:bg-slate-800"
                                title="Add note"
                            >
                                Note
                            </button>
                            <button
                                onClick={() => markFail(q.id)}
                                disabled={isMutating}
                                className="text-xs px-3 py-1 rounded border border-rose-400/40 text-rose-200 hover:bg-rose-500/20"
                            >
                                fail
                            </button>
                            <button
                                onClick={() => markDone(q.id)}
                                disabled={isMutating}
                                className="text-xs px-3 py-1 rounded border border-violet-400/40 text-violet-200 hover:bg-violet-500/20 font-semibold"
                            >
                                done
                            </button>
                        </>
                    )}
                    {done && <span className="text-violet-300 text-sm uppercase tracking-wide">Done</span>}
                </div>
            </div>
        </div>
    );
}
