class BlogGraphEngine {
    constructor() {
        // Dynamic state management
        this.state = {
            currentNodeIndex: 0,
            totalNodes: 0,
            visitedNodes: new Set(),
            isLoading: true,
            isModalOpen: false,
            analystMode: 'INITIALIZING',
            isDragging: false,
            draggedNode: null,
            mouseOffset: { x: 0, y: 0 },
            searchQuery: '',
            searchActive: false,
            matchingNodes: []
        };

        // Dynamic configuration (no hardcoded values)
        this.config = {
            nodeSize: 120,
            nodeSpacing: { x: 250, y: 200 },
            containerPadding: 50,
            pathCurve: 0.3,
            edgeWidth: 3,
            activeEdgeWidth: 5,
            soundEnabled: true
        };

        // Dynamic data structures
        this.nodes = [];
        this.edges = [];
        this.blogPosts = [];
        this.blogConfig = null;
        this.elements = {};
    }

    /**
     * Simplified 5-step initialization
     */
    async init() {
        try {
            console.log('🚀 Starting graph initialization...');
            
            // Step 1: Setup DOM
            this.updateLoadingMessage('Caching DOM elements...', 'CONNECTING');
            this.cacheElements();
            
            // Step 2: Load data
            this.updateLoadingMessage('Loading blog configuration...', 'DOWNLOADING');
            await this.loadBlogData();
            
            // Step 3: Generate graph
            this.updateLoadingMessage('Generating graph layout...', 'PROCESSING');
            this.generateGraph();
            
            // Step 4: Render everything
            this.updateLoadingMessage('Rendering interface...', 'RENDERING');
            this.renderInterface();
            
            // Step 5: Finalize
            this.updateLoadingMessage('System online!', 'OPERATIONAL');
            this.finalizeSystem();
            
            console.log('🎮 Graph Navigation System Online!');
            
        } catch (error) {
            console.error('❌ Initialization failed:', error);
            this.showError(`Initialization failed: ${error.message}`);
        }
    }

    /**
     * Update loading screen with dynamic messages
     */
    updateLoadingMessage(message, mode) {
        const loadingMessage = document.getElementById('loadingMessage');
        
        if (loadingMessage) loadingMessage.textContent = message;
        
        this.state.analystMode = mode;
    }

    /**
     * Cache DOM elements efficiently
     */
    cacheElements() {
        const selectors = {
            loadingScreen: '#loadingScreen',
            loadingProgress: '#loadingProgress',
            graphContainer: '#graphContainer',
            edgesSVG: '#edgesSVG',
            postModal: '#postModal',
            modalTitle: '#modalTitle',
            modalBody: '#modalBody',
            modalClose: '#modalClose',
            searchInput: '#blogSearchInput',
            searchClearBtn: '#searchClearBtn',
            searchResultsCount: '#searchResultsCount'
        };

        this.elements = {};
        let found = 0;
        
        for (const [key, selector] of Object.entries(selectors)) {
            this.elements[key] = document.querySelector(selector);
            if (this.elements[key]) found++;
        }
        
        console.log(`📦 Cached ${found}/${Object.keys(selectors).length} DOM elements`);
    }

    /**
     * Load blog data dynamically with automatic ID assignment
     */
    async loadBlogData() {
        try {
            const response = await fetch('./blog-config.json');
            this.blogConfig = await response.json();
            
            console.log(`📄 Config loaded - Version: ${this.blogConfig.settings?.version || 'Unknown'}`);
            
            // Process posts dynamically with enhanced sorting
            const posts = this.blogConfig.posts || {};
            const sortMethod = this.blogConfig.settings?.autoSort || 'by-date-desc';
            
            let sortedEntries = Object.entries(posts)
                .filter(([key, post]) => post && post.status === 'published');
            
            // Apply sorting based on configuration
            switch(sortMethod) {
                case 'by-date-asc':
                    sortedEntries.sort((a, b) => new Date(a[1].date) - new Date(b[1].date));
                    break;
                case 'by-difficulty':
                    sortedEntries.sort((a, b) => (b[1].difficulty || 1) - (a[1].difficulty || 1));
                    break;
                case 'by-week':
                    // Sort by week number (week1, week2, week3, etc.)
                    sortedEntries.sort((a, b) => {
                        const weekA = parseInt(a[0].replace('week', '')) || 0;
                        const weekB = parseInt(b[0].replace('week', '')) || 0;
                        return weekA - weekB;
                    });
                    break;
                default: // 'by-date-desc'
                    sortedEntries.sort((a, b) => new Date(b[1].date) - new Date(a[1].date));
            }
            
            // Assign sequential IDs automatically
            this.blogPosts = sortedEntries.map(([key, post], index) => ({
                id: index + 1,
                weekId: key,
                title: post.title || 'Untitled Post',
                description: post.description || 'No description available',
                category: post.category || 'general',
                difficulty: post.difficulty || 1,
                readTime: post.readTime || '5 min read',
                topics: post.topics || [],
                blogUrl: post.blogUrl || '#',
                date: post.date || new Date().toISOString().split('T')[0],
                sector: post.sector || 'general'
            }));
            
            this.state.totalNodes = this.blogPosts.length;
            console.log(`📊 Loaded ${this.state.totalNodes} blog posts`);
            
        } catch (error) {
            console.warn('⚠️ Using fallback data:', error);
            this.createFallbackData();
        }
    }

    /**
     * Create fallback data if config fails
     */
    createFallbackData() {
        this.blogPosts = [
            {
                id: 1,
                title: "XSS Exploitation Techniques",
                description: "Advanced cross-site scripting methods and prevention strategies",
                category: "web-security",
                difficulty: 3,
                readTime: "8 min read",
                topics: ["XSS", "Web Security", "OWASP"],
                blogUrl: "https://medium.com/@rokkamvamshi18/exploiting-django-debug-mode",
                date: "2024-09-15"
            },
            {
                id: 2,
                title: "WiFi Penetration Testing",
                description: "Comprehensive wireless security assessment techniques",
                category: "network-security",
                difficulty: 3,
                readTime: "10 min read",
                topics: ["WiFi", "Network Security", "Pentesting"],
                blogUrl: "https://rokkamvamshi18.medium.com/wifi-pentesting",
                date: "2024-09-10"
            },
            {
                id: 3,
                title: "Container Security Analysis",
                description: "Docker and Kubernetes security best practices",
                category: "infrastructure-security",
                difficulty: 4,
                readTime: "15 min read",
                topics: ["Container Security", "Docker", "Kubernetes"],
                blogUrl: "https://rokkamvamshi18.medium.com/container-security",
                date: "2024-09-05"
            }
        ];
        
        this.state.totalNodes = this.blogPosts.length;
        console.log(`📊 Using ${this.state.totalNodes} fallback posts`);
    }

    /**
     * Helper methods for post management
     */
    getPostById(id) {
        return this.blogPosts.find(post => post.id === id);
    }

    getPostByWeekId(weekId) {
        return this.blogPosts.find(post => post.weekId === weekId);
    }

    getPostIndex(identifier) {
        // Support both ID and weekId lookups
        if (typeof identifier === 'number') {
            return this.blogPosts.findIndex(post => post.id === identifier);
        }
        return this.blogPosts.findIndex(post => post.weekId === identifier);
    }



    /**
     * Generate graph layout dynamically
     */
    generateGraph() {
        const nodeCount = this.blogPosts.length;
        console.log(`📊 Generating layout for ${nodeCount} nodes`);
        
        // Dynamic layout selection based on node count
        if (nodeCount <= 3) {
            this.generateLinearLayout();
        } else {
            // Use square grid layout for all other cases
            this.generateSquareLayout();
        }
        
        this.generateEdgeConnections();
        console.log(`🔗 Generated ${this.edges.length} edge connections`);
    }

    /**
     * Linear layout for small node counts
     */
    generateLinearLayout() {
        const container = this.elements.graphContainer;
        const containerWidth = container ? container.offsetWidth : 800;
        const spacing = Math.min(containerWidth / (this.blogPosts.length + 1), this.config.nodeSpacing.x);
        
        this.nodes = this.blogPosts.map((post, index) => ({
            id: post.id,
            post: post,
            position: {
                x: spacing * (index + 1),
                y: 300
            },
            active: index === 0,
            visited: false
        }));
    }

    /**
     * Grid layout for medium node counts
     */
    generateGridLayout() {
        const cols = Math.ceil(Math.sqrt(this.blogPosts.length));
        const rows = Math.ceil(this.blogPosts.length / cols);
        
        this.nodes = this.blogPosts.map((post, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            
            return {
                id: post.id,
                post: post,
                position: {
                    x: this.config.containerPadding + col * this.config.nodeSpacing.x,
                    y: this.config.containerPadding + row * this.config.nodeSpacing.y
                },
                active: index === 0,
                visited: false
            };
        });
    }

    /**
     * Square grid layout for 4+ posts
     * Creates perfect squares: 3x3, 4x4, 5x5, etc. based on post count
     * Responsive design adapts to screen size
     */
    generateSquareLayout() {
        const container = this.elements.graphContainer;
        const containerWidth = container ? container.offsetWidth : 1200;
        const containerHeight = container ? container.offsetHeight : 600;
        const screenWidth = window.innerWidth;

        // Responsive margins and spacing based on screen size
        let marginX, marginY, minColSpacing, maxColSpacing, minRowSpacing, maxRowSpacing;

        if (screenWidth <= 360) {
            // Small mobile phones
            marginX = 30;
            marginY = 15;
            minColSpacing = 80;
            maxColSpacing = 120;
            minRowSpacing = 70;
            maxRowSpacing = 100;
        } else if (screenWidth <= 480) {
            // Mobile phones
            marginX = 25;
            marginY = 20;
            minColSpacing = 100;
            maxColSpacing = 140;
            minRowSpacing = 85;
            maxRowSpacing = 120;
        } else if (screenWidth <= 640) {
            // Small tablets
            marginX = 30;
            marginY = 25;
            minColSpacing = 120;
            maxColSpacing = 160;
            minRowSpacing = 100;
            maxRowSpacing = 140;
        } else if (screenWidth <= 768) {
            // Tablets
            marginX = 20;
            marginY = 30;
            minColSpacing = 130;
            maxColSpacing = 180;
            minRowSpacing = 110;
            maxRowSpacing = 150;
        } else if (screenWidth <= 1024) {
            // Small laptops
            marginX = 25;
            marginY = 35;
            minColSpacing = 140;
            maxColSpacing = 190;
            minRowSpacing = 120;
            maxRowSpacing = 160;
        } else if (screenWidth <= 1200) {
            // Large tablets/small laptops
            marginX = 30;
            marginY = 40;
            minColSpacing = 150;
            maxColSpacing = 200;
            minRowSpacing = 130;
            maxRowSpacing = 170;
        } else {
            // Desktop and larger
            marginX = 40;
            marginY = 60;
            minColSpacing = 160;
            maxColSpacing = 220;
            minRowSpacing = 140;
            maxRowSpacing = 180;
        }

        // Calculate the smallest square that can fit all posts
        // For example: 10 posts -> 4x4 (16 slots), 17 posts -> 5x5 (25 slots)
        const squareSize = Math.ceil(Math.sqrt(this.blogPosts.length));
        const cols = squareSize;
        const rows = Math.ceil(this.blogPosts.length / cols); // Use actual rows needed

        // Calculate spacing to fit within container with proper margins
        const availableWidth = containerWidth - (marginX * 2);
        const availableHeight = containerHeight - (marginY * 2);

        let colSpacing = Math.max(minColSpacing, Math.min(availableWidth / cols, maxColSpacing));
        let rowSpacing = Math.max(minRowSpacing, Math.min(availableHeight / rows, maxRowSpacing));

        // If grid is too tall, reduce row spacing to ensure visibility
        const estimatedTotalHeight = (rows - 1) * rowSpacing;
        if (estimatedTotalHeight > availableHeight * 1.2) { // Allow some overflow for scrolling
            const maxAllowedHeight = availableHeight * 1.2;
            rowSpacing = Math.max(minRowSpacing * 0.8, maxAllowedHeight / (rows - 1));
        }

        // Center the entire grid, but ensure top row is always visible
        const totalGridWidth = (cols - 1) * colSpacing;
        const totalGridHeight = (rows - 1) * rowSpacing;
        const startX = marginX + Math.max(0, (availableWidth - totalGridWidth) / 2);
        const startY = marginY + Math.max(0, (availableHeight - totalGridHeight) / 2);

        // Additional check: ensure first row is always visible
        // Account for node size (120px default) to keep top nodes in view
        const nodeSize = this.config.nodeSize || 120;
        const minTopMargin = Math.max(marginY, nodeSize / 2); // At least half the node should be visible

        // If grid is much taller than container, prioritize showing top rows
        let actualStartY;
        if (totalGridHeight > availableHeight) {
            // Grid is taller than container, ensure top is visible for scrolling
            actualStartY = Math.max(minTopMargin, marginY);
        } else {
            // Grid fits, use centering
            actualStartY = Math.max(minTopMargin, startY);
        }

        console.log(`📐 Layout: ${cols}x${rows} grid, container: ${containerWidth}x${containerHeight}, grid: ${totalGridWidth}x${totalGridHeight}, startY: ${actualStartY}`);

        this.nodes = this.blogPosts.map((post, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);

            return {
                id: post.id,
                post: post,
                position: {
                    x: startX + col * colSpacing,
                    y: actualStartY + row * rowSpacing
                },
                active: index === 0,
                visited: false
            };
        });
    }

    /**
     * Generate edge connections between nodes
     * Creates logical flow connections for different layouts
     */
    generateEdgeConnections() {
        this.edges = [];
        const nodeCount = this.nodes.length;

        if (nodeCount <= 3) {
            // Linear: simple sequential connections
            for (let i = 0; i < nodeCount - 1; i++) {
                this.edges.push({
                    id: i,
                    from: this.nodes[i],
                    to: this.nodes[i + 1],
                    active: false
                });
            }
        } else {
            // Square/Grid: connect in proper grid reading order
            const cols = Math.ceil(Math.sqrt(this.blogPosts.length));
            const rows = Math.ceil(this.blogPosts.length / cols);

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const currentIndex = row * cols + col;

                    // Don't create edges for empty positions
                    if (currentIndex >= nodeCount) break;

                    // Connect to the right neighbor (if exists)
                    if (col < cols - 1) {
                        const rightIndex = currentIndex + 1;
                        if (rightIndex < nodeCount) {
                            this.edges.push({
                                id: this.edges.length,
                                from: this.nodes[currentIndex],
                                to: this.nodes[rightIndex],
                                active: false
                            });
                        }
                    }

                    // Connect to the bottom neighbor (if exists)
                    if (row < rows - 1) {
                        const bottomIndex = currentIndex + cols;
                        if (bottomIndex < nodeCount) {
                            this.edges.push({
                                id: this.edges.length,
                                from: this.nodes[currentIndex],
                                to: this.nodes[bottomIndex],
                                active: false
                            });
                        }
                    }
                }
            }
        }
    }

    /**
     * Render the complete interface
     */
    renderInterface() {
        this.renderGraph();
        this.setupControls();
    }

    /**
     * Render the graph (nodes and edges)
     */
    renderGraph() {
        const container = this.elements.graphContainer;
        const svg = this.elements.edgesSVG;
        
        if (!container || !svg) {
            console.error('❌ Graph container or SVG not found');
            return;
        }

        // Clear existing content
        container.querySelectorAll('.cyber-node').forEach(node => node.remove());
        svg.innerHTML = '';

        // Set SVG size
        const containerRect = container.getBoundingClientRect();
        svg.setAttribute('width', containerRect.width);
        svg.setAttribute('height', containerRect.height);

        // Render edges
        this.edges.forEach(edge => {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const pathData = this.createSVGPath(edge);
            
            path.setAttribute('d', pathData);
            path.setAttribute('class', 'cyber-edge');
            path.setAttribute('data-edge-id', edge.id);
            
            svg.appendChild(path);
        });

        // Render nodes
        this.nodes.forEach((node, index) => {
            const nodeElement = this.createNodeElement(node, index);
            container.appendChild(nodeElement);
        });
    }

    /**
     * Create SVG path for edges
     */
    createSVGPath(edge) {
        const start = edge.from.position;
        const end = edge.to.position;
        
        // Simple curved path
        const midX = (start.x + end.x) / 2;
        const midY = Math.min(start.y, end.y) - 50;
        
        return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
    }

    /**
     * Create individual node element
     */
    createNodeElement(node, index) {
        const nodeEl = document.createElement('div');
        nodeEl.className = `cyber-node ${index === 0 ? 'active' : ''}`;
        nodeEl.setAttribute('data-node-id', node.id);
        nodeEl.setAttribute('data-node-index', index);
        
        nodeEl.style.cssText = `
            position: absolute;
            left: ${node.position.x - this.config.nodeSize/2}px;
            top: ${node.position.y - this.config.nodeSize/2}px;
            width: ${this.config.nodeSize}px;
            height: ${this.config.nodeSize}px;
            background: linear-gradient(135deg, #001122, #003366);
            border: 2px solid #00f5ff;
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #00f5ff;
            font-family: 'Quantico', monospace;
            font-size: 11px;
            text-align: center;
            cursor: grab;
            box-shadow: 0 0 15px rgba(0, 245, 255, 0.3);
            transition: all 0.3s ease;
            z-index: 10;
            padding: 8px;
            user-select: none;
        `;
        
        nodeEl.innerHTML = `
            <div class="node-title" style="font-weight: bold; margin-bottom: 4px; line-height: 1.2; pointer-events: none;">
                ${node.post.title}
            </div>
            <div class="node-category" style="font-size: 9px; opacity: 0.8; pointer-events: none;">
                ${node.post.category.toUpperCase()}
            </div>
            <div class="node-difficulty" style="font-size: 8px; margin-top: 2px; pointer-events: none;">
                ${'⭐'.repeat(node.post.difficulty)}
            </div>
        `;
        
        // Add drag and click handlers
        this.addNodeInteractions(nodeEl, node, index);
        
        return nodeEl;
    }

    /**
     * Add drag and click interactions to nodes
     */
    addNodeInteractions(nodeEl, node, index) {
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;
        let clickTime;
        
        // Mouse down - start potential drag
        nodeEl.addEventListener('mousedown', (e) => {
            clickTime = Date.now();
            isDragging = false;
            startX = e.clientX;
            startY = e.clientY;
            initialLeft = parseInt(nodeEl.style.left);
            initialTop = parseInt(nodeEl.style.top);
            
            nodeEl.style.cursor = 'grabbing';
            nodeEl.style.zIndex = '1000';
            e.preventDefault();
        });
        
        // Mouse move - drag if conditions met (attached to nodeEl instead of document)
        nodeEl.addEventListener('mousemove', (e) => {
            if (clickTime && (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5)) {
                isDragging = true;
                this.state.isDragging = true;
                
                const newLeft = initialLeft + (e.clientX - startX);
                const newTop = initialTop + (e.clientY - startY);
                
                nodeEl.style.left = newLeft + 'px';
                nodeEl.style.top = newTop + 'px';
                nodeEl.style.transition = 'none';
                
                // Update node position in data
                node.position.x = newLeft + this.config.nodeSize/2;
                node.position.y = newTop + this.config.nodeSize/2;
                
                // Update edges
                this.updateEdges();
            }
        });
        
        // Mouse up - end drag or handle click (attached to nodeEl instead of document)
        nodeEl.addEventListener('mouseup', (e) => {
            if (clickTime) {
                const timeDiff = Date.now() - clickTime;
                console.log('🖱️ Mouse up detected:', {
                    isDragging,
                    timeDiff,
                    nodeIndex: index,
                    nodeTitle: node.post.title
                });
                
                if (!isDragging && timeDiff < 300) {
                    // This was a click, not a drag
                    console.log('👆 Click detected, opening modal for node:', index);
                    this.showNodeMetadata(node, index);
                }
                
                // Reset drag state
                isDragging = false;
                this.state.isDragging = false;
                clickTime = null;
                
                nodeEl.style.cursor = 'grab';
                nodeEl.style.zIndex = '10';
                nodeEl.style.transition = 'all 0.3s ease';
            }
        });
        
        // Prevent default drag behavior
        nodeEl.addEventListener('dragstart', (e) => {
            e.preventDefault();
        });
        
        // Hover effects
        nodeEl.addEventListener('mouseenter', () => {
            if (!this.state.isDragging) {
                nodeEl.style.transform = 'scale(1.1)';
                nodeEl.style.boxShadow = '0 0 25px rgba(0, 245, 255, 0.6)';
            }
        });
        
        nodeEl.addEventListener('mouseleave', () => {
            if (!this.state.isDragging) {
                nodeEl.style.transform = 'scale(1)';
                nodeEl.style.boxShadow = '0 0 15px rgba(0, 245, 255, 0.3)';
            }
        });
    }

    /**
     * Update edge paths when nodes are moved
     */
    updateEdges() {
        const svg = this.elements.edgesSVG;
        if (!svg) return;
        
        this.edges.forEach(edge => {
            const pathElement = svg.querySelector(`[data-edge-id="${edge.id}"]`);
            if (pathElement) {
                const pathData = this.createSVGPath(edge);
                pathElement.setAttribute('d', pathData);
            }
        });
    }

    /**
     * Show node metadata in modal
     */
    showNodeMetadata(node, index) {
        console.log('🎯 showNodeMetadata called for node:', index, node.post.title);
        
        // Show metadata modal
        const modal = this.elements.postModal;
        const modalTitle = this.elements.modalTitle;
        const modalBody = this.elements.modalBody;
        
        console.log('📋 Modal elements found:', {
            modal: !!modal,
            modalTitle: !!modalTitle,
            modalBody: !!modalBody
        });
        
        if (modal && modalTitle && modalBody) {
            modalTitle.textContent = node.post.title;
            
            modalBody.innerHTML = `
                <div class="post-metadata-container">
                    <!-- Intelligence Brief Header -->
                    <div class="intel-header">
                        <div class="intel-badge">
                            <span class="intel-icon">🛰️</span>
                            ABOUT THE BLOG
                        </div>
                        <div class="security-clearance">
                            <span class="clearance-level">${node.post.difficulty}</span>
                        </div>
                    </div>

                    <!-- Mission Parameters Grid -->
                    <div class="mission-params-grid">
                        <div class="param-card">
                            <div class="param-icon">📅</div>
                            <div class="param-content">
                                <div class="param-label">PUBLISHED DATE</div>
                                <div class="param-value">${new Date(node.post.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}</div>
                            </div>
                        </div>

                        <div class="param-card">
                            <div class="param-icon">🏷️</div>
                            <div class="param-content">
                                <div class="param-label">CLASSIFICATION</div>
                                <div class="param-value">${node.post.category.replace('-', ' ').toUpperCase()}</div>
                            </div>
                        </div>

                        <div class="param-card">
                            <div class="param-icon">⭐</div>
                            <div class="param-content">
                                <div class="param-label">DIFFICULTY LEVEL</div>
                                <div class="param-value">
                                    <span class="threat-stars">${'★'.repeat(node.post.difficulty)}${'☆'.repeat(5-node.post.difficulty)}</span>
                                    <span class="threat-rating">${node.post.difficulty}</span>
                                </div>
                            </div>
                        </div>

                        <div class="param-card">
                            <div class="param-icon">⏱️</div>
                            <div class="param-content">
                                <div class="param-label">READ TIME</div>
                                <div class="param-value">${node.post.readTime}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Intelligence Summary -->
                    <div class="intel-summary">
                        <div class="summary-header">
                            <span class="summary-icon">📋</span>
                            <span class="summary-title">DESCRIPTION</span>
                        </div>
                        <div class="summary-content">
                            ${node.post.description}
                        </div>
                    </div>

                    <!-- Target Systems -->
                    <div class="target-systems">
                        <div class="systems-header">
                            <span class="systems-icon">🎯</span>
                            <span class="systems-title">TOPICS COVERED</span>
                        </div>
                        <div class="systems-tags">
                            ${node.post.topics.map(topic =>
                                `<span class="system-tag">${topic.toUpperCase()}</span>`
                            ).join('')}
                        </div>
                    </div>

                    <!-- Action Protocols -->
                    <div class="action-protocols">
                        <button class="protocol-btn primary-protocol" onclick="window.open('${node.post.blogUrl}', '_blank')">
                            <span class="protocol-icon">🚀</span>
                            <span class="protocol-text">TAKE ME TO BLOG</span>
                        </button>

                        <button class="protocol-btn secondary-protocol" onclick="navigator.clipboard.writeText('${node.post.blogUrl}').then(() => this.showNotification('Mission coordinates copied to clipboard!'))">
                            <span class="protocol-icon">📡</span>
                            <span class="protocol-text">COPY LINK</span>
                        </button>
                    </div>
                </div>
            `;
            
            modal.style.display = 'flex';
            modal.classList.add('show');
            this.state.isModalOpen = true;
            console.log('✅ Modal opened successfully');
        } else {
            console.error('❌ Modal elements not found:', {
                modal: modal,
                modalTitle: modalTitle,
                modalBody: modalBody
            });
        }
    }



    /**
     * Setup controls
     */
    setupControls() {
        console.log('🎮 Setting up controls...');

        // Modal close button
        if (this.elements.modalClose) {
            console.log('✅ Found modal close button, attaching click listener');
            this.elements.modalClose.onclick = () => {
                console.log('🖱️ Modal close button clicked');
                this.closeModal();
            };
        } else {
            console.error('❌ Modal close button not found!');
        }

        // Info button
        const infoBtn = document.getElementById('navInfoBtn');
        if (infoBtn) {
            console.log('✅ Found info button, attaching click listener');
            infoBtn.onclick = () => {
                console.log('🖱️ Info button clicked');
                this.showInfoModal();
            };
        } else {
            console.error('❌ Info button not found!');
        }

        // Info modal close button
        const infoModalClose = document.getElementById('infoModalClose');
        if (infoModalClose) {
            infoModalClose.onclick = () => {
                this.closeInfoModal();
            };
        }

        // Click outside modal to close
        if (this.elements.postModal) {
            console.log('✅ Found modal, attaching outside click listener');
            this.elements.postModal.addEventListener('click', (e) => {
                if (e.target === this.elements.postModal || e.target.classList.contains('modal-background')) {
                    console.log('🖱️ Clicked outside modal');
                    this.closeModal();
                }
            });
        } else {
            console.error('❌ Modal not found!');
        }

        // Info modal outside click
        const infoModal = document.getElementById('infoModal');
        if (infoModal) {
            infoModal.addEventListener('click', (e) => {
                if (e.target === infoModal || e.target.classList.contains('modal-background')) {
                    this.closeInfoModal();
                }
            });
        }

        // Setup search functionality
        this.setupSearchBar();

        // Keyboard controls for modal and search
        console.log('⌨️ Setting up keyboard controls');
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                console.log('⌨️ Escape key pressed');
                this.closeModal();
                this.closeInfoModal();
                // Clear search on Escape
                if (this.state.searchActive) {
                    this.clearSearch();
                }
            }
        });

        // Responsive layout adjustments on window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            // Debounce resize events to avoid excessive recalculations
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (this.blogPosts && this.blogPosts.length > 0) {
                    console.log('🔄 Window resized, recalculating layout...');
                    this.generateGraph();
                    this.renderGraph();
                }
            }, 250); // 250ms debounce
        });

        console.log('🎮 Controls setup complete');
    }

    /**
     * Setup search bar functionality
     */
    setupSearchBar() {
        if (!this.elements.searchInput) {
            console.warn('⚠️ Search input not found');
            return;
        }

        console.log('🔍 Setting up search bar...');

        // Real-time search on input
        this.elements.searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            this.handleSearch(query);
        });

        // Clear button
        if (this.elements.searchClearBtn) {
            this.elements.searchClearBtn.addEventListener('click', () => {
                this.clearSearch();
            });
        }

        // Focus styling
        this.elements.searchInput.addEventListener('focus', () => {
            this.elements.searchInput.parentElement.classList.add('focused');
        });

        this.elements.searchInput.addEventListener('blur', () => {
            this.elements.searchInput.parentElement.classList.remove('focused');
        });

        console.log('✅ Search bar setup complete');
    }

    /**
     * Handle search query
     */
    handleSearch(query) {
        this.state.searchQuery = query.toLowerCase();
        
        if (!query) {
            this.clearSearch();
            return;
        }

        console.log(`🔍 Searching for: "${query}"`);
        this.state.searchActive = true;

        // Show clear button
        if (this.elements.searchClearBtn) {
            this.elements.searchClearBtn.classList.add('visible');
        }

        // Find matching nodes
        this.state.matchingNodes = this.nodes.filter(node => {
            const post = node.post;
            
            // Search in title
            if (post.title.toLowerCase().includes(this.state.searchQuery)) {
                return true;
            }
            
            // Search in description
            if (post.description && post.description.toLowerCase().includes(this.state.searchQuery)) {
                return true;
            }
            
            // Search in category
            if (post.category && post.category.toLowerCase().includes(this.state.searchQuery)) {
                return true;
            }
            
            // Search in topics array
            if (post.topics && Array.isArray(post.topics)) {
                return post.topics.some(topic => 
                    topic.toLowerCase().includes(this.state.searchQuery)
                );
            }
            
            return false;
        });

        console.log(`✅ Found ${this.state.matchingNodes.length} matching nodes`);

        // Update UI
        this.applySearchFilter();
        this.updateSearchResultsCount();

        // Show notification if no results
        if (this.state.matchingNodes.length === 0) {
            this.showNotification(`No results found for "${query}"`);
        }
    }

    /**
     * Apply search filter to nodes
     */
    applySearchFilter() {
        const container = this.elements.graphContainer;
        if (!container) return;

        const allNodeElements = container.querySelectorAll('.cyber-node');
        
        allNodeElements.forEach(nodeEl => {
            const nodeId = parseInt(nodeEl.getAttribute('data-node-id'));
            const isMatch = this.state.matchingNodes.some(n => n.id === nodeId);
            
            if (isMatch) {
                // Add heartbeat animation to matching nodes
                nodeEl.classList.add('search-match');
                nodeEl.classList.remove('search-dimmed');
            } else {
                // Dim non-matching nodes
                nodeEl.classList.add('search-dimmed');
                nodeEl.classList.remove('search-match');
            }
        });
    }

    /**
     * Update search results count display
     */
    updateSearchResultsCount() {
        if (!this.elements.searchResultsCount) return;

        const count = this.state.matchingNodes.length;
        const total = this.nodes.length;

        if (this.state.searchActive && count > 0) {
            this.elements.searchResultsCount.textContent = `${count}/${total}`;
            this.elements.searchResultsCount.classList.add('visible');
        } else {
            this.elements.searchResultsCount.classList.remove('visible');
        }
    }

    /**
     * Clear search and reset view
     */
    clearSearch() {
        console.log('🧹 Clearing search...');
        
        this.state.searchQuery = '';
        this.state.searchActive = false;
        this.state.matchingNodes = [];

        // Clear input
        if (this.elements.searchInput) {
            this.elements.searchInput.value = '';
        }

        // Hide clear button
        if (this.elements.searchClearBtn) {
            this.elements.searchClearBtn.classList.remove('visible');
        }

        // Hide results count
        if (this.elements.searchResultsCount) {
            this.elements.searchResultsCount.classList.remove('visible');
        }

        // Reset all nodes
        const container = this.elements.graphContainer;
        if (container) {
            const allNodeElements = container.querySelectorAll('.cyber-node');
            allNodeElements.forEach(nodeEl => {
                nodeEl.classList.remove('search-match', 'search-dimmed');
            });
        }

        console.log('✅ Search cleared');
    }

    /**
     * Update progress display dynamically
     */




    /**
     * Update intelligence statistics display
     */
    updateIntelligenceStats() {
        const totalPostsEl = document.getElementById('totalPosts');
        const totalTopicsEl = document.getElementById('totalTopics');
        const lastUpdatedEl = document.getElementById('lastUpdated');
        
        if (totalPostsEl) {
            totalPostsEl.textContent = this.blogPosts.length;
        }
        
        if (totalTopicsEl) {
            // Count unique topics/categories
            const topics = new Set();
            this.blogPosts.forEach(post => {
                if (post.category) topics.add(post.category);
                if (post.topics) {
                    post.topics.forEach(topic => topics.add(topic));
                }
            });
            totalTopicsEl.textContent = topics.size;
        }
        
        if (lastUpdatedEl) {
            // Find the most recent post date
            if (this.blogPosts.length > 0) {
                const dates = this.blogPosts
                    .map(post => new Date(post.date))
                    .filter(date => !isNaN(date.getTime()))
                    .sort((a, b) => b - a);
                
                if (dates.length > 0) {
                    const latestDate = dates[0];
                    lastUpdatedEl.textContent = latestDate.getFullYear();
                }
            }
        }
        
        console.log('📊 Intelligence stats updated:', {
            posts: this.blogPosts.length,
            topics: totalTopicsEl ? totalTopicsEl.textContent : 'N/A',
            latest: lastUpdatedEl ? lastUpdatedEl.textContent : 'N/A'
        });
    }

    /**
     * Finalize system startup
     */
    finalizeSystem() {
        // Hide loading screen
        setTimeout(() => {
            if (this.elements.loadingScreen) {
                this.elements.loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    this.elements.loadingScreen.style.display = 'none';
                }, 500);
            }
            
            // Update intelligence stats
            this.updateIntelligenceStats();
            
            // Show intro animation
            this.startIntroAnimation();
        }, 1000);
    }

    /**
     * Simple intro animation
     */
    startIntroAnimation() {
        this.nodes.forEach((node, index) => {
            const nodeEl = document.querySelector(`[data-node-id="${node.id}"]`);
            if (nodeEl) {
                nodeEl.style.opacity = '0';
                nodeEl.style.transform = 'scale(0.5)';
                
                setTimeout(() => {
                    nodeEl.style.transition = 'all 0.5s ease';
                    nodeEl.style.opacity = '1';
                    nodeEl.style.transform = 'scale(1)';
                }, index * 200);
            }
        });
    }

    /**
     * Close modal
     */
    closeModal() {
        if (this.elements.postModal) {
            this.elements.postModal.classList.remove('show');
            setTimeout(() => {
                this.elements.postModal.style.display = 'none';
            }, 300); // Match the transition duration
            this.state.isModalOpen = false;
        }
    }

    /**
     * Show info modal
     */
    showInfoModal() {
        const infoModal = document.getElementById('infoModal');
        if (infoModal) {
            infoModal.style.display = 'flex';
            infoModal.classList.add('show');
            
            // Update stats in info modal
            this.updateInfoModalStats();
            
            console.log('✅ Info modal opened');
        } else {
            console.error('❌ Info modal not found');
        }
    }

    /**
     * Close info modal
     */
    closeInfoModal() {
        const infoModal = document.getElementById('infoModal');
        if (infoModal) {
            infoModal.classList.remove('show');
            setTimeout(() => {
                infoModal.style.display = 'none';
            }, 300); // Match the transition duration
            console.log('✅ Info modal closed');
        }
    }

    /**
     * Update info modal statistics
     */
    updateInfoModalStats() {
        const infoTotalPostsEl = document.getElementById('infoTotalPosts');
        const infoTotalTopicsEl = document.getElementById('infoTotalTopics');
        const infoLastUpdatedEl = document.getElementById('infoLastUpdated');
        
        if (infoTotalPostsEl) {
            infoTotalPostsEl.textContent = this.blogPosts.length;
        }
        
        if (infoTotalTopicsEl) {
            // Count unique topics/categories
            const topics = new Set();
            this.blogPosts.forEach(post => {
                if (post.category) topics.add(post.category);
                if (post.topics) {
                    post.topics.forEach(topic => topics.add(topic));
                }
            });
            infoTotalTopicsEl.textContent = topics.size;
        }
        
        if (infoLastUpdatedEl) {
            // Find the most recent post date
            if (this.blogPosts.length > 0) {
                const dates = this.blogPosts
                    .map(post => new Date(post.date))
                    .filter(date => !isNaN(date.getTime()))
                    .sort((a, b) => b - a);
                
                if (dates.length > 0) {
                    const latestDate = dates[0];
                    infoLastUpdatedEl.textContent = latestDate.getFullYear();
                }
            }
        }
        
        console.log('📊 Info modal stats updated');
    }

    /**
     * Show error message
     */
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #001122, #002244);
                border: 2px solid #ff6b6b;
                border-radius: 8px;
                padding: 2rem;
                max-width: 500px;
                text-align: center;
                color: #e0e0e0;
                font-family: 'Quantico', monospace;
                z-index: 10000;
                box-shadow: 0 0 30px rgba(255, 107, 107, 0.3);
            ">
                <div style="color: #ff6b6b; font-size: 1.5rem; margin-bottom: 1rem;">⚠️ SYSTEM ERROR</div>
                <div style="margin-bottom: 2rem;">${message}</div>
                <button onclick="location.reload()" style="
                    background: linear-gradient(45deg, #00f5ff, #0080ff);
                    border: none;
                    padding: 0.8rem 1.5rem;
                    border-radius: 4px;
                    color: #001122;
                    font-weight: bold;
                    cursor: pointer;
                    margin-right: 1rem;
                ">🔄 RETRY</button>
                <button onclick="window.location.href='../index.html'" style="
                    background: linear-gradient(45deg, #666, #888);
                    border: none;
                    padding: 0.8rem 1.5rem;
                    border-radius: 4px;
                    color: white;
                    font-weight: bold;
                    cursor: pointer;
                ">🏠 RETURN TO HQ</button>
            </div>
        `;
        document.body.appendChild(errorDiv);
    }

    /**
     * Show notification message
     */
    showNotification(message) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create new notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        // Auto-remove after animation
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3300);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM loaded - Starting simplified graph system...');
    
    setTimeout(async () => {
        try {
            window.cyberBlog = new BlogGraphEngine();
            await window.cyberBlog.init();
            console.log('🎮 Simplified graph system online!');
        } catch (error) {
            console.error('❌ Failed to start graph system:', error);
        }
    }, 200);
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlogGraphEngine;
}