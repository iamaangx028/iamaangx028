/**
 * CYBER BLOG INTEGRATION
 * Bridges the main portfolio with the interactive cyber blog
 * Handles navigation, state management, and cross-communication
 */

class CyberBlogIntegration {
    constructor() {
        this.isMainPortfolio = !window.location.pathname.includes('cyber-blog.html');
        this.blogUrl = this.isMainPortfolio ? 'Blog/cyber-blog.html' : '../index.html';
        this.init();
    }

    init() {
        console.log('🔗 Cyber Blog Integration initialized');
        
        if (this.isMainPortfolio) {
            this.setupMainPortfolioIntegration();
        } else {
            this.setupBlogIntegration();
        }
        
        this.setupCrossWindowCommunication();
    }

    setupMainPortfolioIntegration() {
        // Add blog navigation enhancements
        this.enhanceBlogLinks();
        
        // Add keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Monitor blog interactions
        this.trackBlogEngagement();
    }

    setupBlogIntegration() {
        // Add back-to-portfolio functionality
        this.enhanceBackNavigation();
        
        // Sync with main portfolio theme
        this.syncPortfolioTheme();
    }

    enhanceBlogLinks() {
        const blogLinks = document.querySelectorAll('a[href*="cyber-blog.html"]');
        
        blogLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.launchCyberBlog();
            });
        });
    }

    launchCyberBlog() {
        // Show smooth transition animation
        this.showSmoothTransition();

        // Navigate to blog after transition starts
        setTimeout(() => {
            window.location.href = 'Blog/cyber-blog.html';
        }, 800);
    }

    showSmoothTransition() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(0, 8, 20, 0.95), rgba(0, 20, 40, 0.98));
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            opacity: 0;
            transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(10px);
        `;

        overlay.innerHTML = `
            <div style="text-align: center; position: relative;">
                <div style="position: relative;">
                    <div style="font-size: 4rem; animation: cyberPulse 1.5s ease-in-out infinite; filter: drop-shadow(0 0 30px #00f5ff);">⚡</div>
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80px; height: 80px; border: 2px solid #00f5ff; border-radius: 50%; animation: cyberRotate 2s linear infinite; opacity: 0.6;"></div>
                </div>
            </div>
        `;

        // Add cyberpunk animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes cyberPulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.1); opacity: 0.8; }
            }
            @keyframes cyberRotate {
                0% { transform: translate(-50%, -50%) rotate(0deg); }
                100% { transform: translate(-50%, -50%) rotate(360deg); }
            }
            @keyframes cyberLoading {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
            @keyframes cyberBlink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0.3; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(overlay);

        // Fade in with smooth transition
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
        });

        // Also fade out the main content
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '0.3';
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + B = Open Cyber Blog
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault();
                this.launchCyberBlog();
            }
        });
    }

    enhanceBackNavigation() {
        const backButtons = document.querySelectorAll('a[href*="../index.html"], a[href*="index.html"]');
        
        backButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.returnToPortfolio();
            });
        });
    }

    returnToPortfolio() {
        window.location.href = '../index.html#blog';
    }

    syncPortfolioTheme() {
        // Ensure blog uses same theme variables as main portfolio
        const themeSync = document.createElement('style');
        themeSync.textContent = `
            :root {
                --portfolio-primary: #00f5ff;
                --portfolio-secondary: #0080ff;
                --portfolio-accent: #64ffda;
                --portfolio-bg: #0A192F;
            }
        `;
        document.head.appendChild(themeSync);
    }

    setupCrossWindowCommunication() {
        // Listen for messages from blog/portfolio
        window.addEventListener('message', (event) => {
            if (event.data.type === 'CYBER_BLOG_ACTION') {
                this.handleCrossWindowAction(event.data);
            }
        });
    }

    handleCrossWindowAction(data) {
        switch (data.action) {
            case 'BLOG_LAUNCHED':
                console.log('🚀 Cyber blog launched successfully');
                break;
                
            case 'BLOG_POST_VIEWED':
                console.log('📖 Blog post viewed:', data.postId);
                break;
        }
    }

    trackBlogLaunch(blogWindow) {
        if (blogWindow) {
            console.log('🚀 Cyber blog launched in new window');
        }
    }

    trackBlogEngagement() {
        // Monitor clicks on blog-related elements
        document.addEventListener('click', (e) => {
            if (e.target.closest('.intel-database-access') || 
                e.target.closest('.database-btn') ||
                e.target.closest('[data-action="cyber-blog"]')) {
                console.log('📊 Blog interaction tracked');
            }
        });
    }

    // Integration with J.A.R.V.I.S.
    integrateWithJarvis() {
        if (window.jarvis) {
            console.log('🤖 Integrating with J.A.R.V.I.S. system');
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.cyberBlogIntegration = new CyberBlogIntegration();

    // Integrate with J.A.R.V.I.S. when available
    setTimeout(() => {
        window.cyberBlogIntegration.integrateWithJarvis();
    }, 1000);

    console.log('🔗 Cyber Blog Integration loaded and ready');
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CyberBlogIntegration;
}