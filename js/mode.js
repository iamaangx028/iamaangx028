/**
 * MODE SYSTEM — Professional (default) <-> Hacker
 *
 * One shared content source; the mode only changes *presentation*:
 *   - CSS: `[data-mode="pro"]` rules in css/mode-pro.css hide theatrics/chrome.
 *   - Labels: any element with data-label-pro swaps text between its two labels.
 *
 * State lives in localStorage ('portfolio_mode') and on <html data-mode>, so it
 * persists across the portfolio and the Blog page. An inline <head> script sets
 * the attribute before first paint (no flash); this file wires the toggle.
 */
(function () {
    const KEY = 'portfolio_mode';
    const PRO = 'pro';
    const HACKER = 'hacker';
    // Professional mode + the corner toggle are temporarily DISABLED.
    // To bring them back: set TOGGLE_ENABLED = true and DEFAULT = PRO, and
    // restore the storage-reading no-flash <script> in index.html / Blog/index.html.
    const TOGGLE_ENABLED = false;
    const DEFAULT = HACKER;
    const root = document.documentElement;

    function getMode() {
        if (!TOGGLE_ENABLED) return DEFAULT;      // locked to default while disabled
        const m = localStorage.getItem(KEY);
        return m === HACKER || m === PRO ? m : DEFAULT;
    }

    // Swap every [data-label-pro] element between its pro label and its original.
    function applyLabels(mode) {
        document.querySelectorAll('[data-label-pro]').forEach(el => {
            if (!el.dataset.labelHacker) el.dataset.labelHacker = el.textContent.trim();
            el.textContent = mode === PRO ? el.dataset.labelPro : el.dataset.labelHacker;
        });
    }

    let toggleBtn;
    function updateToggle(mode) {
        if (!toggleBtn) return;
        const target = mode === PRO ? 'Hacker' : 'Professional';
        const icon = mode === PRO ? '🕶️' : '📄';
        toggleBtn.innerHTML =
            `<span class="mode-toggle-icon" aria-hidden="true">${icon}</span>` +
            `<span class="mode-toggle-text">${target} Mode</span>`;
        toggleBtn.setAttribute('aria-label', `Switch to ${target} mode`);
        toggleBtn.setAttribute('aria-pressed', mode === HACKER ? 'true' : 'false');
        toggleBtn.title =
            `Currently in ${mode === PRO ? 'Professional' : 'Hacker'} mode — click for ${target} mode`;
    }

    function apply(mode) {
        root.dataset.mode = mode;
        applyLabels(mode);
        updateToggle(mode);
    }

    function setMode(mode) {
        try { localStorage.setItem(KEY, mode); } catch (e) { /* private mode: session only */ }
        apply(mode);
    }

    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
        .mode-toggle {
            position: fixed; bottom: 20px; right: 20px; z-index: 9000;
            display: inline-flex; align-items: center; gap: 8px; padding: 10px 16px;
            font-family: var(--font-tech, sans-serif); font-size: 13px; letter-spacing: 1px;
            text-transform: uppercase; color: var(--cyber-primary, #00f5ff);
            background: rgba(0, 8, 20, 0.85); border: 1px solid var(--cyber-primary, #00f5ff);
            border-radius: var(--radius-pill, 999px); cursor: pointer; -webkit-backdrop-filter: blur(8px);
            backdrop-filter: blur(8px); box-shadow: 0 0 12px rgba(0, 245, 255, 0.25);
            transition: background .25s ease, box-shadow .25s ease, transform .25s ease;
        }
        .mode-toggle:hover {
            background: rgba(0, 245, 255, 0.12);
            box-shadow: 0 0 20px rgba(0, 245, 255, 0.5); transform: translateY(-2px);
        }
        .mode-toggle:focus-visible { outline: 2px solid var(--cyber-accent, #64ffda); outline-offset: 2px; }
        .mode-toggle-icon { font-size: 15px; line-height: 1; }
        @media (max-width: 600px) {
            .mode-toggle { bottom: 12px; right: 12px; padding: 9px 11px; }
            .mode-toggle-text { display: none; }
        }`;
        document.head.appendChild(style);
    }

    function buildToggle() {
        injectStyles();
        toggleBtn = document.createElement('button');
        toggleBtn.className = 'mode-toggle';
        toggleBtn.type = 'button';
        toggleBtn.addEventListener('click', () => {
            setMode(root.dataset.mode === PRO ? HACKER : PRO);
        });
        document.body.appendChild(toggleBtn);
    }

    document.addEventListener('DOMContentLoaded', () => {
        if (TOGGLE_ENABLED) buildToggle();
        apply(getMode());
    });
})();
