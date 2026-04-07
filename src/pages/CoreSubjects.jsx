import { CORE_TOPICS } from '../data/coreTopics';
import { useProgress } from '../context/ProgressContext';
import CoreTopicCard from '../components/CoreTopicCard';

const SUBJECTS = ['OS', 'DBMS', 'CN', 'OOPs', 'SD'];

export default function CoreSubjects() {
    const { coreProg } = useProgress();

    return (
        <div className="space-y-6">
            {SUBJECTS.map((sub) => {
                const topics = CORE_TOPICS.filter((t) => t.subject === sub);
                const done = topics.filter((t) => coreProg[t.id]?.status === 'read').length;
                return (
                    <section key={sub}>
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="section-title !text-slate-300">{sub}</h2>
                            <span className="text-xs text-slate-400">
                                {done}/{topics.length}
                            </span>
                        </div>
                        <div className="space-y-2">
                            {topics.map((t) => (
                                <CoreTopicCard key={t.id} topic={t} />
                            ))}
                        </div>
                    </section>
                );
            })}
        </div>
    );
}
