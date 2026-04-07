import { useState } from 'react';
import { ProgressProvider, useProgress } from './context/ProgressContext';
import PhaseBar from './components/PhaseBar';
import StatsCards from './components/StatsCards';
import Today from './pages/Today';
import AllQuestions from './pages/AllQuestions';
import CoreSubjects from './pages/CoreSubjects';
import Analytics from './pages/Analytics';

const TABS = [
    { id: 'today', label: "Today's Plan" },
    { id: 'all', label: 'All 180' },
    { id: 'core', label: 'Core Subjects' },
    { id: 'stats', label: 'Analytics' },
];

export default function App() {
    return (
        <ProgressProvider>
            <Dashboard />
        </ProgressProvider>
    );
}

function Dashboard() {
    const [tab, setTab] = useState('today');
    const { isLoading, isMutating, error, clearError } = useProgress();

    const pages = {
        today: <Today />,
        all: <AllQuestions />,
        core: <CoreSubjects />,
        stats: <Analytics />,
    };

    return (
        <div className="min-h-screen text-slate-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
                <div className="glass-panel p-6 sm:p-7 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-35 pointer-events-none bg-[radial-gradient(circle_at_top_right,_rgba(244,63,94,0.38),_transparent_45%)]" />
                    <div className="relative">
                        <span className="inline-flex items-center rounded-full border border-fuchsia-400/45 bg-fuchsia-500/15 text-fuchsia-200 text-[10px] uppercase tracking-[0.18em] px-3 py-1 font-semibold">
                            Interview Sprint Dashboard
                        </span>
                        <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-slate-100">DSA + Core Tracker</h1>
                        <p className="text-sm sm:text-base text-slate-300 mt-1.5">
                            Striver 180 plus core CS revision with spaced repetition and phase-based daily planning.
                        </p>
                        {(isLoading || isMutating) && (
                            <p className="mt-3 text-xs text-fuchsia-200">Syncing with backend...</p>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="glass-panel p-3 border border-rose-400/40 bg-rose-500/10 flex items-center justify-between gap-3">
                        <p className="text-sm text-rose-200">{error}</p>
                        <button
                            onClick={clearError}
                            className="text-xs px-2 py-1 rounded border border-rose-300/40 text-rose-200 hover:bg-rose-500/20"
                        >
                            dismiss
                        </button>
                    </div>
                )}

                <PhaseBar />
                <StatsCards />

                <div className="glass-panel p-2 flex gap-2 flex-wrap">
                    {TABS.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`pill-btn text-sm px-4 ${tab === t.id
                                ? 'pill-btn-active font-semibold'
                                : ''
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                <div className="glass-panel p-4 sm:p-6">{pages[tab]}</div>
            </div>
        </div>
    );
}
