const INTERVALS = [3, 7, 14];

export function getNextReviewDate(failCount) {
    const days = INTERVALS[Math.min(failCount - 1, INTERVALS.length - 1)];
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
}

export function isDueToday(nextReview) {
    if (!nextReview) return false;
    const today = new Date().toISOString().split('T')[0];
    return nextReview <= today;
}
