import { useState } from 'react';
import { QUESTIONS } from '../data/questions';
import { useProgress } from '../context/ProgressContext';
import QuestionCard from '../components/QuestionCard';

const TOPICS = ['All', ...new Set(QUESTIONS.map((q) => q.topic))];
const STATUSES = ['All', 'done', 'failed', 'pending'];

export default function AllQuestions() {
    const { dsaProg } = useProgress();
    const [topic, setTopic] = useState('All');
    const [status, setStatus] = useState('All');
    const [search, setSearch] = useState('');

    const filtered = QUESTIONS.filter((q) => {
        const p = dsaProg[q.id];
        const st = p?.status || 'pending';
        const topicOk = topic === 'All' || q.topic === topic;
        const statusOk = status === 'All' || st === status;
        const searchOk = q.name.toLowerCase().includes(search.toLowerCase());
        return topicOk && statusOk && searchOk;
    });

    const done = QUESTIONS.filter((q) => dsaProg[q.id]?.status === 'done').length;
    const failed = QUESTIONS.filter((q) => dsaProg[q.id]?.status === 'failed').length;

    return (
        <div className="space-y-4">
            <input
                className="input-dark"
                placeholder="Search questions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="flex gap-2 flex-wrap">
                {TOPICS.map((t) => (
                    <button
                        key={t}
                        onClick={() => setTopic(t)}
                        className={`pill-btn ${topic === t
                            ? 'pill-btn-active'
                            : ''
                            }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            <div className="flex gap-2 flex-wrap">
                {STATUSES.map((s) => (
                    <button
                        key={s}
                        onClick={() => setStatus(s)}
                        className={`pill-btn ${status === s
                            ? 'pill-btn-active'
                            : ''
                            }`}
                    >
                        {s === 'All' ? 'All' : s}
                    </button>
                ))}
            </div>

            <p className="text-xs text-slate-400">
                {filtered.length} questions - {done} done - {failed} failed
            </p>

            <div className="space-y-2">
                {filtered.map((q) => (
                    <QuestionCard key={q.id} q={q} />
                ))}
            </div>
        </div>
    );
}
