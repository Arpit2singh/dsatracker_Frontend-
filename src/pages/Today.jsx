import { QUESTIONS } from '../data/questions';
import { CORE_TOPICS } from '../data/coreTopics';
import { getPhase, getDayNumber } from '../utils/phaseEngine';
import { useProgress } from '../context/ProgressContext';
import QuestionCard from '../components/QuestionCard';
import CoreTopicCard from '../components/CoreTopicCard';

const PER_DAY = 6;

export default function Today() {
    const { dsaProg, dueReviews } = useProgress();
    const phase = getPhase();
    const dayNum = getDayNumber();

    const newQs =
        phase === 'sprint'
            ? QUESTIONS.slice((dayNum - 1) * PER_DAY, dayNum * PER_DAY).filter((q) => dsaProg[q.id]?.status !== 'done')
            : [];

    const reviewIds = new Set((dueReviews || []).map((item) => Number(item.questionId)));
    const reviews = QUESTIONS.filter((q) => reviewIds.has(q.id));

    const coreToday = phase === 'sprint' ? CORE_TOPICS.find((t) => t.day === dayNum) : null;

    return (
        <div className="space-y-6">
            {phase === 'warmup' && (
                <div className="rounded-xl p-4 text-sm border border-fuchsia-400/40 bg-fuchsia-500/15 text-fuchsia-100">
                    <strong>Warm-up Mode</strong> - May 1 se full sprint shuru hoga. Abhi koi bhi 2-3 questions karo, tracking
                    count nahi hogi. Use the <em>All Questions</em> tab to practice freely.
                </div>
            )}

            {phase === 'polish' && (
                <div className="rounded-xl p-4 text-sm border border-violet-400/40 bg-violet-500/15 text-violet-100">
                    <strong>Polish Mode (June+)</strong> - Sprint complete! Ab weak questions revise karo, mock interviews do,
                    aur company-specific prep karo.
                </div>
            )}

            <section>
                <h2 className="section-title mb-2">
                    Reviews due today
                    <span
                        className={`ml-2 text-[10px] px-2 py-0.5 rounded-full font-semibold border ${reviews.length
                            ? 'bg-rose-500/20 border-rose-400/40 text-rose-200'
                            : 'bg-slate-800 border-slate-700 text-slate-400'
                            }`}
                    >
                        {reviews.length}
                    </span>
                </h2>
                {reviews.length === 0 ? (
                    <p className="text-sm text-slate-400">No reviews pending - great!</p>
                ) : (
                    <div className="space-y-2">
                        {reviews.map((q) => (
                            <QuestionCard key={q.id} q={q} isReview />
                        ))}
                    </div>
                )}
            </section>

            {phase === 'sprint' && (
                <section>
                    <h2 className="section-title mb-2">
                        Day {dayNum} - New questions
                        <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-200 border border-violet-400/40 font-semibold">
                            {PER_DAY}/day
                        </span>
                    </h2>
                    {newQs.length === 0 ? (
                        <p className="text-sm text-violet-200">All new questions done for today!</p>
                    ) : (
                        <div className="space-y-2">
                            {newQs.map((q) => (
                                <QuestionCard key={q.id} q={q} />
                            ))}
                        </div>
                    )}
                </section>
            )}

            {coreToday && (
                <section>
                    <h2 className="section-title mb-2">Core subject - today</h2>
                    <CoreTopicCard topic={coreToday} />
                </section>
            )}
        </div>
    );
}
