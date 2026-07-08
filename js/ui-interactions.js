// Credentials and Appreciation Sections Animation & Interaction
document.addEventListener('DOMContentLoaded', function() {
// Animate elements when they come into view
function animateElements() {
// Credentials Section Animation
const credentialsSection = document.querySelector('.credentials-section');
if (credentialsSection) {
    const rect = credentialsSection.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom >= 0;
    
    if (isInViewport) {
        // Activate terminal typing animation if not already activated
        if (!credentialsSection.classList.contains('animated')) {
            credentialsSection.classList.add('animated');
            
            // Stagger the appearance of certification cards
            const certCards = credentialsSection.querySelectorAll('.cert-card');
            certCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('appear');
                }, 3500 + (index * 300)); // Start after terminal animation
            });
        }
    }
}

// Appreciation Section Animation
const appreciationSection = document.querySelector('.appreciation-section');
if (appreciationSection) {
    const rect = appreciationSection.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom >= 0;
    
    if (isInViewport) {
        // Activate terminal typing animation if not already activated
        if (!appreciationSection.classList.contains('animated')) {
            appreciationSection.classList.add('animated');
            
            // Stagger the appearance of recognition cards
            const recognitionCards = appreciationSection.querySelectorAll('.recognition-card');
            recognitionCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('appear');
                }, 3500 + (index * 300)); // Start after terminal animation
            });
        }
    }
}
}

// Add initial scroll listener
window.addEventListener('scroll', animateElements);

// Trigger on page load to check if sections are already in view
animateElements();

// Certificate cards hover effects
const certCards = document.querySelectorAll('.cert-card');
certCards.forEach(card => {
card.addEventListener('mouseenter', function() {
    // Intensify scan line on hover
    const scanLine = this.querySelector('.scan-line');
    if (scanLine) {
        scanLine.classList.add('intensified');
    }
    
    // Add terminal response to J.A.R.V.I.S. terminal if it exists
    const jarvisTerminal = document.getElementById('jarvisTerminal');
    if (jarvisTerminal) {
        const certName = this.querySelector('.cert-name').textContent;
        const newLine = document.createElement('div');
        newLine.className = 'terminal-line';
        newLine.innerHTML = `> <span class="typing">ACCESSING CREDENTIAL: ${certName}</span>`;
        jarvisTerminal.appendChild(newLine);
        
        // Auto-scroll terminal to bottom
        jarvisTerminal.scrollTop = jarvisTerminal.scrollHeight;
    }
});

card.addEventListener('mouseleave', function() {
    // Restore scan line on mouse leave
    const scanLine = this.querySelector('.scan-line');
    if (scanLine) {
        scanLine.classList.remove('intensified');
    }
});

// Certificate details button click
const detailsBtn = card.querySelector('.cert-details-btn');
if (detailsBtn) {
    detailsBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get certificate details
        const certName = card.querySelector('.cert-name').textContent;
        const certID = card.querySelector('.verify-id').textContent;
        
        // Display verification in JARVIS assistant if it exists
        const assistantPanel = document.getElementById('assistantPanel');
        const assistantMessages = document.getElementById('assistantMessages');
        if (assistantPanel && assistantMessages) {
            // Make JARVIS visible if not already
            assistantPanel.classList.add('active');
            
            // Add credential verification message
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message assistant-message';
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            contentDiv.innerHTML = `
                <strong>Certificate Verification:</strong><br>
                📋 ${certName}<br>
                🆔 ${certID}<br>
                ✅ STATUS: AUTHENTICATED & VERIFIED
            `;
            messageDiv.appendChild(contentDiv);
            assistantMessages.appendChild(messageDiv);
            
            // Auto-scroll messages to bottom
            assistantMessages.scrollTop = assistantMessages.scrollHeight;
        }
    });
}
});

// Recognition card hover effects
const recognitionCards = document.querySelectorAll('.recognition-card');
recognitionCards.forEach(card => {
card.addEventListener('mouseenter', function() {
    // Add terminal response to J.A.R.V.I.S. terminal if it exists
    const jarvisTerminal = document.getElementById('jarvisTerminal');
    if (jarvisTerminal) {
        const companyName = this.querySelector('.company-name').textContent;
        const newLine = document.createElement('div');
        newLine.className = 'terminal-line';
        newLine.innerHTML = `> <span class="typing">ACCESSING ACKNOWLEDGEMENT: ${companyName}</span>`;
        jarvisTerminal.appendChild(newLine);
        
        // Auto-scroll terminal to bottom
        jarvisTerminal.scrollTop = jarvisTerminal.scrollHeight;
    }
});
});

// View more letters button interaction
const viewMoreBtn = document.querySelector('.view-more-btn');
if (viewMoreBtn) {
viewMoreBtn.addEventListener('click', function() {
    // Simulate loading more records
    this.innerHTML = '<span>ACCESSING RECORDS...</span> <span class="btn-icon">↻</span>';
    this.classList.add('loading');
    
    // Animate progress bar
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = '100%';
        progressBar.style.transition = 'width 2s ease-in-out';
    }
    
    // Reset after simulated loading
    setTimeout(() => {
        this.innerHTML = '<span>ACCESS ADDITIONAL RECORDS</span> <span class="btn-icon">→</span>';
        this.classList.remove('loading');
        
        // Reset progress bar with no transition
        if (progressBar) {
            progressBar.style.transition = 'none';
            progressBar.style.width = '16%';
            
            // Force reflow
            void progressBar.offsetWidth;
            
            // Restore transition
            progressBar.style.transition = 'width 2s ease-in-out';
        }
        
        // Add message to JARVIS terminal if it exists
        const jarvisTerminal = document.getElementById('jarvisTerminal');
        if (jarvisTerminal) {
            const newLine = document.createElement('div');
            newLine.className = 'terminal-line response';
            newLine.textContent = 'Additional security clearance required to access more records.';
            jarvisTerminal.appendChild(newLine);
            
            // Auto-scroll terminal to bottom
            jarvisTerminal.scrollTop = jarvisTerminal.scrollHeight;
        }
    }, 2500);
});
}
});
