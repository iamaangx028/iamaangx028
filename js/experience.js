/**
 * Auto-updating experience durations.
 *
 * Any element with a `data-start="YYYY-MM"` attribute has its text set to a
 * human-readable tenure ("1 yr 9 mos") measured from that date to `data-end`
 * ("YYYY-MM") — or to the current month if no end is given (ongoing role).
 *
 * This keeps tenure current on its own: an ongoing role's duration grows each
 * month with zero manual edits. The HTML keeps a sensible static fallback in
 * case JS is disabled.
 */
(function () {
    function parseYM(str) {
        const [y, m] = String(str).split('-').map(Number);
        return { y, m: m || 1 };
    }

    function format(months) {
        if (months < 1) months = 1; // a brand-new role still reads as "1 mo"
        const y = Math.floor(months / 12);
        const m = months % 12;
        const parts = [];
        if (y) parts.push(`${y} yr${y > 1 ? 's' : ''}`);
        if (m) parts.push(`${m} mo${m > 1 ? 's' : ''}`);
        return parts.join(' ') || '0 mos';
    }

    function run() {
        const now = new Date();
        const nowYM = { y: now.getFullYear(), m: now.getMonth() + 1 };

        document.querySelectorAll('[data-start]').forEach(el => {
            const start = parseYM(el.getAttribute('data-start'));
            const endAttr = el.getAttribute('data-end');
            const end = endAttr ? parseYM(endAttr) : nowYM;
            const months = (end.y - start.y) * 12 + (end.m - start.m);
            el.textContent = format(months);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
    } else {
        run();
    }
})();
