export const SPRINT_START = new Date('2026-05-01T00:00:00');
export const SPRINT_END = new Date('2026-05-30T23:59:59');
export const POLISH_START = new Date('2026-06-01T00:00:00');

export function getPhase() {
    const now = new Date();
    if (now < SPRINT_START) return 'warmup';
    if (now <= SPRINT_END) return 'sprint';
    return 'polish';
}

export function getDayNumber() {
    const now = new Date();
    if (now < SPRINT_START) return 0;
    const diff = Math.floor((now - SPRINT_START) / 86400000);
    return Math.max(1, Math.min(30, diff + 1));
}

export function getPhaseLabel() {
    const p = getPhase();
    if (p === 'warmup') {
        return { label: 'Warm-up Mode', color: 'blue', desc: 'Practice freely - no streak tracking till May 1' };
    }
    if (p === 'sprint') {
        return { label: 'Sprint Mode', color: 'green', desc: `Day ${getDayNumber()} of 30 - full tracking on` };
    }
    return { label: 'Polish Mode', color: 'purple', desc: 'Revision + weak questions + mock prep' };
}
