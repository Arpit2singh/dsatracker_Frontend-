import { QUESTIONS } from '../data/questions';
import { useProgress } from '../context/ProgressContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Analytics() {
    const { dsaProg } = useProgress();

    const topics = [...new Set(QUESTIONS.map((q) => q.topic))];
    const data = topics.map((t) => {
        const qs = QUESTIONS.filter((q) => q.topic === t);
        const done = qs.filter((q) => dsaProg[q.id]?.status === 'done').length;
        const fail = qs.filter((q) => dsaProg[q.id]?.status === 'failed').length;
        return { topic: t.replace('Advanced ', ''), done, fail, total: qs.length };
    });

    const failed = QUESTIONS.filter((q) => dsaProg[q.id]?.status === 'failed');

    return (
        <div className="space-y-6">
            <section>
                <h2 className="section-title mb-3">Progress by topic</h2>
                <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={data} layout="vertical" margin={{ left: 60, right: 20 }}>
                        <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                        <YAxis type="category" dataKey="topic" tick={{ fontSize: 11, fill: '#cbd5e1' }} width={80} />
                        <Tooltip />
                        <Bar dataKey="done" fill="#c084fc" radius={[0, 4, 4, 0]} name="Done" />
                        <Bar dataKey="fail" fill="#fb7185" radius={[0, 4, 4, 0]} name="Failed" />
                    </BarChart>
                </ResponsiveContainer>
            </section>

            <section>
                <h2 className="section-title mb-3">Weak questions ({failed.length})</h2>
                {failed.length === 0 ? (
                    <p className="text-sm text-slate-400">No failed questions yet.</p>
                ) : (
                    <div className="space-y-2">
                        {failed.map((q) => {
                            const p = dsaProg[q.id];
                            return (
                                <div
                                    key={q.id}
                                    className="flex items-center justify-between text-sm border border-slate-700 rounded-xl px-3 py-2.5 bg-slate-900/60"
                                >
                                    <span className="text-slate-100">
                                        {q.id}. {q.name}
                                    </span>
                                    <div className="flex gap-2 text-xs text-slate-400">
                                        <span className="text-rose-300">fail x{p.failCount}</span>
                                        <span>next: {p.nextReview || '-'}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}
