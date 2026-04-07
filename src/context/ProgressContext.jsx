import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { QUESTIONS } from '../data/questions';
import { todayStr } from '../utils/dateHelpers';

const ProgressContext = createContext();

const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || '/api').replace(/\/$/, '');
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

function extractApiMessage(error, fallbackMessage) {
    return error?.response?.data?.message || error?.message || fallbackMessage;
}

export function ProgressProvider({ children }) {
    const [dsaProg, setDsaProg] = useState({});
    const [coreProg, setCoreProg] = useState({});
    const [dueReviews, setDueReviews] = useState([]);
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMutating, setIsMutating] = useState(false);
    const [error, setError] = useState('');

    async function fetchDsaProgress() {
        const { data } = await api.get('/progress/dsa');
        setDsaProg(data || {});
        return data || {};
    }

    async function fetchCoreProgress() {
        const { data } = await api.get('/progress/core');
        setCoreProg(data || {});
        return data || {};
    }

    async function fetchStats() {
        const { data } = await api.get('/stats');
        setStats(data || null);
        return data || null;
    }

    async function refreshDueReviews(date = todayStr()) {
        const { data } = await api.get('/progress/dsa/reviews/due', { params: { date } });
        setDueReviews(Array.isArray(data?.items) ? data.items : []);
    }

    const refreshProgress = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            await Promise.all([fetchDsaProgress(), fetchCoreProgress(), fetchStats(), refreshDueReviews()]);
        } catch (e) {
            setError(extractApiMessage(e, 'Failed to sync progress from server.'));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshProgress();
    }, [refreshProgress]);

    async function markDone(questionId) {
        setIsMutating(true);
        setError('');
        try {
            const { data } = await api.put(`/progress/dsa/${questionId}/done`);
            setDsaProg((prev) => ({ ...prev, [String(questionId)]: data }));
            await Promise.all([fetchStats(), refreshDueReviews()]);
        } catch (e) {
            setError(extractApiMessage(e, 'Failed to mark question as done.'));
        } finally {
            setIsMutating(false);
        }
    }

    async function markFail(questionId) {
        setIsMutating(true);
        setError('');
        try {
            const { data } = await api.put(`/progress/dsa/${questionId}/fail`);
            setDsaProg((prev) => ({ ...prev, [String(questionId)]: data }));
            await Promise.all([fetchStats(), refreshDueReviews()]);
        } catch (e) {
            setError(extractApiMessage(e, 'Failed to mark question as failed.'));
        } finally {
            setIsMutating(false);
        }
    }

    async function saveNote(questionId, note) {
        setIsMutating(true);
        setError('');
        try {
            const { data } = await api.patch(`/progress/dsa/${questionId}/note`, { note: note.slice(0, 2000) });
            setDsaProg((prev) => ({ ...prev, [String(questionId)]: data }));
            setDueReviews((prev) =>
                prev.map((item) => (String(item.questionId) === String(questionId) ? { ...item, note: data.note } : item))
            );
        } catch (e) {
            setError(extractApiMessage(e, 'Failed to save note.'));
        } finally {
            setIsMutating(false);
        }
    }

    async function markCoreDone(topicId, status) {
        setIsMutating(true);
        setError('');
        try {
            const { data } = await api.put(`/progress/core/${topicId}`, { status });
            setCoreProg((prev) => ({ ...prev, [topicId]: data }));
        } catch (e) {
            setError(extractApiMessage(e, 'Failed to update core topic status.'));
        } finally {
            setIsMutating(false);
        }
    }

    function clearError() {
        setError('');
    }

    const totalQuestions = QUESTIONS.length;
    const fallbackDoneCount = Object.values(dsaProg).filter((p) => p.status === 'done').length;
    const fallbackFailedCount = Object.values(dsaProg).filter((p) => p.status === 'failed').length;
    const fallbackRemainCount = Math.max(0, totalQuestions - fallbackDoneCount - fallbackFailedCount);

    const doneCount = stats?.done ?? fallbackDoneCount;
    const failedCount = stats?.failed ?? fallbackFailedCount;
    const remainCount = stats?.remaining ?? fallbackRemainCount;
    const pct = useMemo(() => Math.round((doneCount / Math.max(totalQuestions, 1)) * 100), [doneCount, totalQuestions]);

    function getStreak() {
        if (typeof stats?.streak === 'number') return stats.streak;

        const dates = Object.values(dsaProg).filter((p) => p.completedAt).map((p) => p.completedAt);
        const unique = [...new Set(dates)].sort().reverse();
        let streak = 0;
        let check = new Date();
        for (const d of unique) {
            const s = check.toISOString().split('T')[0];
            if (d === s) {
                streak++;
                check.setDate(check.getDate() - 1);
            } else {
                break;
            }
        }
        return streak;
    }

    return (
        <ProgressContext.Provider
            value={{
                dsaProg,
                coreProg,
                dueReviews,
                markDone,
                markFail,
                saveNote,
                markCoreDone,
                refreshProgress,
                isLoading,
                isMutating,
                error,
                clearError,
                doneCount,
                failedCount,
                remainCount,
                pct,
                getStreak,
            }}
        >
            {children}
        </ProgressContext.Provider>
    );
}

export const useProgress = () => useContext(ProgressContext);
