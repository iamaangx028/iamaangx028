/**
 * LEARNING JOURNEY (app.js)
 * The ordered blog series rendered as a level map.
 *
 * Two layouts, chosen at render time:
 *   - HORIZONTAL curved side-scroller  (Hacker mode on wide screens)
 *       a smooth SVG road runs left->right; nodes sit exactly on the curve;
 *       the filled road shows progress; the strip scrolls sideways.
 *   - VERTICAL list  (Professional mode, or any narrow/mobile screen)
 *       a clean single-column timeline with a left progress spine.
 *
 * Read / saved state persists in localStorage ('cyber_mission_log').
 * Re-renders automatically when the mode toggles or the viewport crosses
 * the layout breakpoint.
 */

const HSPACING = 260;   // px between nodes along the road
const HPADX = 150;      // horizontal padding at each end
const HHEIGHT = 420;    // track height — snug so both card rows are visible at once
const HMIDY = 210;      // road centre line (= HHEIGHT / 2)
const HAMP = 60;        // road wave amplitude
const HBREAKPOINT = 900; // below this width -> vertical layout

class MissionControl {
    constructor() {
        this.data = [];
        this.filteredData = [];
        this.currentCategory = 'ALL';
        this.userProgress = this.loadUserProgress();
        this.elems = this.cacheDOM();
        this._resizeTimer = null;
        this._lastLayout = null;
    }

    cacheDOM() {
        return {
            grid: document.getElementById('missionGrid'),
            filterContainer: document.getElementById('categoryFilters'),
            searchInput: document.getElementById('missionSearch'),
            clearSearch: document.getElementById('clearSearch'),
            noResults: document.getElementById('noResults'),
            modal: document.getElementById('missionModal'),
            modalClose: document.getElementById('modalClose'),
            modalTitle: document.getElementById('modalTitle'),
            modalLevel: document.getElementById('modalLevel'),
            modalCategory: document.getElementById('modalCategory'),
            modalDate: document.getElementById('modalDate'),
            modalTime: document.getElementById('modalTime'),
            modalDesc: document.getElementById('modalDescription'),
            modalTags: document.getElementById('modalTags'),
            modalLink: document.getElementById('modalLink')
        };
    }

    async init() {
        console.log('🛰️ LEARNING JOURNEY INITIALIZING...');
        await this.loadData();
        this.render();
        this.setupEventListeners();
        this.initParallax();
        this.watchLayout();
        console.log('✅ SYSTEM ONLINE');
    }

    /* ===== PERSISTENCE ===== */
    loadUserProgress() {
        const stored = localStorage.getItem('cyber_mission_log');
        return stored ? JSON.parse(stored) : { saved: [], read: [] };
    }
    saveUserProgress() {
        localStorage.setItem('cyber_mission_log', JSON.stringify(this.userProgress));
    }
    toggleStatus(id, type) {
        const list = this.userProgress[type];
        const i = list.indexOf(id);
        if (i === -1) list.push(id); else list.splice(i, 1);
        this.saveUserProgress();
        this.render();
    }

    async loadData() {
        try {
            const res = await fetch('blog-config.json');
            if (!res.ok) throw new Error('DATA LINK SEVERED');
            const json = await res.json();
            this.data = Object.entries(json.posts)
                .map(([key, post]) => ({ weekId: key, ...post }))
                .filter(post => post.status === 'published')
                .sort((a, b) => (parseInt(a.weekId.replace('week', '')) || 0) - (parseInt(b.weekId.replace('week', '')) || 0));
            this.filteredData = [...this.data];
        } catch (err) {
            console.error('CRITICAL FAILURE:', err);
            this.elems.grid.innerHTML = `<div style="color:var(--cyber-danger,#ff0055);text-align:center;padding:40px">SYSTEM ERROR: UNABLE TO LOAD JOURNEY DATA.</div>`;
        }
    }

    // Filter set depends on mode: Pro (tile grid) restores the category
    // filters; Hacker (journey) keeps just the useful views since the worlds
    // already carry the categorisation. Rebuilt only when the set changes.
    ensureFilters() {
        const pro = document.documentElement.dataset.mode === 'pro';
        const want = pro ? 'full' : 'basic';
        if (this._filtersMode === want) return;
        this._filtersMode = want;

        const cats = pro ? [...new Set(this.data.map(d => d.category || 'UNCATEGORIZED'))] : [];
        const filters = ['ALL', 'SAVED', 'COMPLETED', ...cats];
        if (!filters.includes(this.currentCategory)) this.currentCategory = 'ALL';

        this.elems.filterContainer.innerHTML = filters.map(cat =>
            `<button class="filter-btn ${cat === this.currentCategory ? 'active' : ''}" data-cat="${cat}">${cat}</button>`
        ).join('');
    }

    /* ===== HELPERS ===== */
    diffRank(d) {
        if (typeof d === 'number') return Math.min(3, Math.max(1, d));
        const map = { beginner: 1, intermediate: 2, advanced: 3 };
        return map[(d || '').toString().toLowerCase()] || 1;
    }

    worldsFrom(posts) {
        const CHAPTERS = {
            'Network': 'Networking Foundations',
            'Browser': 'The Browser',
            'HTTP': 'Web & Systems',
            'Infrastructure': 'Web & Systems',
            'Web Development': 'Web & Systems',
            'HTTP Security': 'Web & Systems',
            'Front-end & Back-end': 'Front-end & JavaScript',
            'Front-end security': 'Front-end & JavaScript',
            'JS Enumeration': 'Recon & Tooling',
            'Authentication': 'Authentication',
            'Active Directory': 'Active Directory'
        };
        const worlds = [];
        posts.forEach(p => {
            const sector = p.sector || p.category || 'GENERAL';
            const name = CHAPTERS[sector] || sector;
            const last = worlds[worlds.length - 1];
            if (last && last.name === name) last.posts.push(p);
            else worlds.push({ name, posts: [p] });
        });
        return worlds;
    }

    getFiltered() {
        const category = this.currentCategory;
        const query = (this.elems.searchInput.value || '').toLowerCase();
        return this.data.filter(post => {
            if (category === 'SAVED') return this.userProgress.saved.includes(post.weekId);
            if (category === 'COMPLETED') return this.userProgress.read.includes(post.weekId);
            const matchesCategory = category === 'ALL' || (post.category || 'UNCATEGORIZED') === category;
            const matchesSearch = !query ||
                post.title.toLowerCase().includes(query) ||
                post.description.toLowerCase().includes(query) ||
                (post.topics || []).join(' ').toLowerCase().includes(query);
            return matchesCategory && matchesSearch;
        });
    }

    nodeState(post) {
        return {
            isRead: this.userProgress.read.includes(post.weekId),
            isSaved: this.userProgress.saved.includes(post.weekId)
        };
    }

    /* ===== RENDER DISPATCH ===== */
    render() {
        this.ensureFilters();
        const posts = this.getFiltered();
        const grid = this.elems.grid;
        grid.innerHTML = '';

        if (!posts.length) {
            this.elems.noResults.classList.remove('hidden');
            return;
        }
        this.elems.noResults.classList.add('hidden');

        // Professional mode -> the classic tile grid (no journey chrome).
        if (document.documentElement.dataset.mode === 'pro') {
            this._lastLayout = 'tiles';
            this.renderTiles(posts, grid);
            return;
        }

        // Hacker mode -> the journey: curved side-scroller, vertical on narrow.
        grid.appendChild(this.buildReadout());
        const horizontal = window.innerWidth >= HBREAKPOINT;
        this._lastLayout = horizontal ? 'h' : 'v';
        if (horizontal) this.renderHorizontal(posts, grid);
        else this.renderVertical(posts, grid);
    }

    buildReadout() {
        const totalRead = this.data.filter(p => this.userProgress.read.includes(p.weekId)).length;
        const pct = this.data.length ? (totalRead / this.data.length) * 100 : 0;
        const el = document.createElement('div');
        el.className = 'journey-readout';
        el.innerHTML = `
            <span class="journey-readout-label">MISSION PROGRESS</span>
            <span class="journey-readout-count">${totalRead} / ${this.data.length} CLEARED</span>
            <div class="journey-readout-bar"><div class="journey-readout-fill" style="width:${pct}%"></div></div>`;
        return el;
    }

    // first unread across the WHOLE series (so "you are here" is meaningful)
    firstUnreadWeekId() {
        const p = this.data.find(x => !this.userProgress.read.includes(x.weekId));
        return p ? p.weekId : null;
    }

    buildNode(post, i) {
        const { isRead, isSaved } = this.nodeState(post);
        const isHere = post.weekId === this.firstUnreadWeekId();
        const rank = this.diffRank(post.difficulty);
        const weekNum = (post.weekId || '').replace('week', '');

        const node = document.createElement('div');
        node.className = 'lvl';
        node.dataset.diff = rank;
        node.style.setProperty('--i', i);
        if (isRead) node.classList.add('is-read');
        if (isSaved) node.classList.add('is-saved');
        if (isHere) node.classList.add('is-here');

        node.innerHTML = `
            <div class="lvl-badge">
                <span class="lvl-num">${weekNum}</span>
                <span class="lvl-check" aria-hidden="true">✓</span>
            </div>
            <div class="lvl-card">
                <div class="lvl-top">
                    <span class="lvl-diff diff-${rank}">${post.difficulty || 'Beginner'}</span>
                    <div class="lvl-actions">
                        <button class="lvl-act ${isSaved ? 'on' : ''}" data-action="toggle-save" title="Save for later" aria-label="Save for later">${isSaved ? '★' : '☆'}</button>
                        <button class="lvl-act ${isRead ? 'on' : ''}" data-action="toggle-read" title="Mark as read" aria-label="Mark as read">${isRead ? '✅' : '☐'}</button>
                    </div>
                </div>
                <h3 class="lvl-title">${post.title}</h3>
                <div class="lvl-meta">${post.readTime || ''}${post.date ? ' · ' + post.date : ''}</div>
                <div class="lvl-topics">${(post.topics || []).slice(0, 4).map(t => `<span>${t}</span>`).join('')}</div>
            </div>`;

        node.addEventListener('click', (e) => {
            const btn = e.target.closest('.lvl-act');
            if (btn) {
                e.stopPropagation();
                this.toggleStatus(post.weekId, btn.dataset.action === 'toggle-save' ? 'saved' : 'read');
            } else {
                this.openModal(post);
            }
        });
        return node;
    }

    /* ===== HORIZONTAL curved side-scroller ===== */
    renderHorizontal(posts, grid) {
        const n = posts.length;
        const width = HPADX * 2 + Math.max(0, n - 1) * HSPACING;
        const pts = posts.map((_, i) => ({
            x: HPADX + i * HSPACING,
            y: HMIDY + (i % 2 === 0 ? -HAMP : HAMP)
        }));

        const scroll = document.createElement('div');
        scroll.className = 'journey-scroll';

        const track = document.createElement('div');
        track.className = 'journey-track';
        track.style.width = width + 'px';
        track.style.height = HHEIGHT + 'px';

        // Curved road (base + progress fill), nodes as anchor points.
        const d = this.curvePath(pts);
        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('class', 'journey-road');
        svg.setAttribute('width', width);
        svg.setAttribute('height', HHEIGHT);
        svg.setAttribute('viewBox', `0 0 ${width} ${HHEIGHT}`);
        const base = document.createElementNS(svgNS, 'path');
        base.setAttribute('class', 'road-base');
        base.setAttribute('d', d);
        const fill = document.createElementNS(svgNS, 'path');
        fill.setAttribute('class', 'road-fill');
        fill.setAttribute('d', d);
        svg.appendChild(base);
        svg.appendChild(fill);
        track.appendChild(svg);

        // World flags at each world's first node.
        let idx = 0;
        this.worldsFrom(posts).forEach((world, wi) => {
            const flag = document.createElement('div');
            flag.className = 'world-flag';
            flag.style.left = pts[idx].x + 'px';
            flag.innerHTML = `<span class="world-badge">WORLD ${wi + 1}</span><span class="world-name">${world.name}</span>`;
            track.appendChild(flag);
            idx += world.posts.length;
        });

        // Nodes placed exactly on the curve.
        posts.forEach((post, i) => {
            const node = this.buildNode(post, i);
            node.classList.add('lvl--abs');
            node.dataset.card = i % 2 === 0 ? 'below' : 'above'; // cards nest INWARD (upper node -> card below) so both rows fit on screen
            node.style.left = pts[i].x + 'px';
            node.style.top = pts[i].y + 'px';
            track.appendChild(node);
        });

        scroll.appendChild(track);

        grid.appendChild(scroll);

        const hint = document.createElement('div');
        hint.className = 'journey-hint';
        hint.textContent = 'SCROLL / DRAG →';
        grid.appendChild(hint); // pinned to the container, not the scrolled road

        this.enableDragScroll(scroll, hint);

        // Progress: fill the road up to the last completed node.
        requestAnimationFrame(() => {
            let lastRead = -1;
            posts.forEach((p, i) => { if (this.userProgress.read.includes(p.weekId)) lastRead = i; });
            const L = base.getTotalLength();
            const frac = n > 1 ? Math.max(0, lastRead) / (n - 1) : (lastRead >= 0 ? 1 : 0);
            fill.style.strokeDasharray = L;
            fill.style.strokeDashoffset = lastRead < 0 ? L : L * (1 - frac);
            // centre the first unread node in view
            const hereIdx = posts.findIndex(p => p.weekId === this.firstUnreadWeekId());
            if (hereIdx > 1) scroll.scrollLeft = Math.max(0, pts[hereIdx].x - scroll.clientWidth / 2);
        });
    }

    // Smooth cubic path through alternating points (horizontal tangents).
    curvePath(pts) {
        if (!pts.length) return '';
        let d = `M ${pts[0].x} ${pts[0].y}`;
        const dx = HSPACING / 2;
        for (let i = 1; i < pts.length; i++) {
            const a = pts[i - 1], b = pts[i];
            d += ` C ${a.x + dx} ${a.y}, ${b.x - dx} ${b.y}, ${b.x} ${b.y}`;
        }
        return d;
    }

    enableDragScroll(scroll, hint) {
        // Vertical wheel -> horizontal scroll (only while there's room, so the
        // page can still scroll at the ends).
        scroll.addEventListener('wheel', (e) => {
            if (!e.deltaY) return;
            const atStart = scroll.scrollLeft <= 0;
            const atEnd = scroll.scrollLeft + scroll.clientWidth >= scroll.scrollWidth - 1;
            if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;
            e.preventDefault();
            scroll.scrollLeft += e.deltaY;
        }, { passive: false });

        // Click-drag to pan.
        let down = false, startX = 0, startLeft = 0, moved = false;
        scroll.addEventListener('pointerdown', (e) => {
            down = true; moved = false; startX = e.clientX; startLeft = scroll.scrollLeft;
        });
        scroll.addEventListener('pointermove', (e) => {
            if (!down) return;
            const dx = e.clientX - startX;
            if (Math.abs(dx) > 4) { moved = true; scroll.classList.add('dragging'); }
            scroll.scrollLeft = startLeft - dx;
        });
        const end = () => { down = false; scroll.classList.remove('dragging'); };
        scroll.addEventListener('pointerup', end);
        scroll.addEventListener('pointerleave', end);
        // suppress the click that follows a drag (so it doesn't open a modal)
        scroll.addEventListener('click', (e) => { if (moved) { e.stopPropagation(); e.preventDefault(); } }, true);
        scroll.addEventListener('scroll', () => { if (hint) hint.style.opacity = '0'; }, { once: true });
    }

    /* ===== VERTICAL list (pro / mobile) ===== */
    renderVertical(posts, grid) {
        const body = document.createElement('div');
        body.className = 'journey-vertical';

        const line = document.createElement('div');
        line.className = 'journey-line';
        line.innerHTML = '<div class="journey-line-fill"></div>';
        body.appendChild(line);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('reveal'); observer.unobserve(en.target); } });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        let idx = 0;
        this.worldsFrom(posts).forEach((world, wi) => {
            const divider = document.createElement('div');
            divider.className = 'world-divider';
            divider.innerHTML = `<span class="world-badge">WORLD ${wi + 1}</span><span class="world-name">${world.name}</span>`;
            body.appendChild(divider);
            observer.observe(divider);
            world.posts.forEach(post => {
                const node = this.buildNode(post, idx);
                node.classList.add('lvl--row');
                body.appendChild(node);
                observer.observe(node);
                idx++;
            });
        });

        grid.appendChild(body);

        requestAnimationFrame(() => {
            const fill = body.querySelector('.journey-line-fill');
            const readNodes = body.querySelectorAll('.lvl.is-read');
            if (fill && readNodes.length) {
                const last = readNodes[readNodes.length - 1];
                fill.style.height = (last.offsetTop - line.offsetTop + last.offsetHeight) + 'px';
            }
        });
    }

    /* ===== TILE GRID (Professional mode) — the original card layout ===== */
    renderTiles(posts, grid) {
        const wrap = document.createElement('div');
        wrap.className = 'mission-grid';

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('reveal'); observer.unobserve(en.target); } });
        }, { threshold: 0.05, rootMargin: '50px' });

        posts.forEach((post, index) => {
            const { isRead, isSaved } = this.nodeState(post);
            const card = document.createElement('div');
            card.className = 'mission-card';
            if (post.status === 'published') card.classList.add('deployed');
            if (isSaved) card.classList.add('status-saved');
            if (isRead) card.classList.add('status-read');
            card.style.transitionDelay = `${(index % 5) * 50}ms`;

            card.innerHTML = `
                <div class="card-top">
                    <span class="week-badge">${post.weekId.replace('week', 'WK')}</span>
                    <div class="card-actions">
                        <button class="action-btn ${isSaved ? 'saved' : ''}" title="Save for Later" data-action="toggle-save">${isSaved ? '★' : '☆'}</button>
                        <button class="action-btn ${isRead ? 'read' : ''}" title="Mark as Read" data-action="toggle-read">${isRead ? '✅' : '☐'}</button>
                    </div>
                </div>
                <div class="card-main">
                    <h3>${post.title}</h3>
                    <p class="card-desc">${post.description}</p>
                </div>
                <div class="card-footer">
                    <span class="sector-badge">${post.category || 'GEN'}</span>
                    <span class="status-indicator">● ${post.status === 'published' ? 'DEPLOYED' : 'DRAFT'}</span>
                </div>`;

            card.addEventListener('click', (e) => {
                const btn = e.target.closest('.action-btn');
                if (btn) {
                    e.stopPropagation();
                    this.toggleStatus(post.weekId, btn.dataset.action === 'toggle-save' ? 'saved' : 'read');
                } else {
                    this.openModal(post);
                }
            });

            wrap.appendChild(card);
            observer.observe(card);
            if (index < 8) setTimeout(() => card.classList.add('reveal'), 50);
        });

        grid.appendChild(wrap);
    }

    initParallax() {
        let ticking = false;
        document.addEventListener('mousemove', (e) => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const x = (window.innerWidth - e.pageX * 2) / 100;
                    const y = (window.innerHeight - e.pageY * 2) / 100;
                    const bg = document.querySelector('.tactical-grid-overlay');
                    if (bg) bg.style.transform = `translate3d(${x}px, ${y}px, 0)`;
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // Re-render when the mode toggles or the viewport crosses the breakpoint.
    watchLayout() {
        new MutationObserver(() => this.render())
            .observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode'] });
        window.addEventListener('resize', () => {
            clearTimeout(this._resizeTimer);
            this._resizeTimer = setTimeout(() => {
                const pro = document.documentElement.dataset.mode === 'pro';
                const want = pro ? 'tiles' : (window.innerWidth >= HBREAKPOINT ? 'h' : 'v');
                if (want !== this._lastLayout) this.render();
            }, 180);
        });
    }

    /* ===== EVENTS ===== */
    setupEventListeners() {
        this.elems.filterContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentCategory = e.target.dataset.cat;
                this.render();
            }
        });
        this.elems.searchInput.addEventListener('input', () => this.render());
        this.elems.clearSearch.addEventListener('click', () => {
            this.elems.searchInput.value = '';
            this.render();
        });
        this.elems.modalClose.addEventListener('click', () => this.closeModal());
        this.elems.modal.addEventListener('click', (e) => { if (e.target === this.elems.modal) this.closeModal(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.closeModal(); });
    }

    /* ===== MODAL ===== */
    openModal(post) {
        this.elems.modalTitle.innerText = post.title;
        this.elems.modalLevel.innerText = post.difficulty || 1;
        this.elems.modalCategory.innerText = post.sector || post.category || 'GENERAL';
        this.elems.modalDate.innerText = post.date || 'UNK';
        this.elems.modalTime.innerText = post.readTime || 'UNK';
        this.elems.modalDesc.innerText = post.description;
        this.elems.modalLink.href = post.blogUrl;
        this.elems.modalTags.innerHTML = (post.topics || []).map(t => `<span class="tag">${t}</span>`).join('');
        this.elems.modal.classList.add('active');
    }
    closeModal() {
        this.elems.modal.classList.remove('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MissionControl().init();
});
