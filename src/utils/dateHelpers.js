export function todayStr() {
    return new Date().toISOString().split('T')[0];
}

export function formatDate(str) {
    if (!str) return '-';
    return new Date(str).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
    });
}
