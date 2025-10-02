// Intelligence Reports Section Animation & Interaction
    document.addEventListener('DOMContentLoaded', function() {
// Animate elements when they come into view
function animateIntelligence() {
const intelligenceSection = document.querySelector('.intelligence-section');
if (!intelligenceSection) return;

const rect = intelligenceSection.getBoundingClientRect();
const isInViewport = rect.top < window.innerHeight && rect.bottom >= 0;

if (isInViewport) {
    // Activate terminal typing animation if not already activated
    if (!intelligenceSection.classList.contains('animated')) {
        intelligenceSection.classList.add('animated');
        
        // Stagger the appearance of intel cards
        const intelCards = document.querySelectorAll('.intel-card');
        intelCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('appear');
            }, 1000 + (index * 150)); // Start after terminal animation
        });
        
        // Remove scroll listener once animation is triggered
        window.removeEventListener('scroll', animateIntelligence);
    }
}
}

// Add initial scroll listener
window.addEventListener('scroll', animateIntelligence);

// Trigger on page load to check if section is already in view
animateIntelligence();

// Intel Filter Functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const intelCards = document.querySelectorAll('.intel-card');

filterButtons.forEach(button => {
button.addEventListener('click', function() {
    // Update active button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
    
    const filterValue = this.getAttribute('data-filter');
    
    // Filter cards
    intelCards.forEach(card => {
        if (filterValue === 'all') {
            card.style.display = 'flex';
        } else {
            if (card.getAttribute('data-type') === filterValue) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        }
    });
    
    // Add message to JARVIS terminal if it exists
    const jarvisTerminal = document.getElementById('jarvisTerminal');
    if (jarvisTerminal) {
        const newLine = document.createElement('div');
        newLine.className = 'terminal-line';
        newLine.innerHTML = `> <span class="typing">FILTER APPLIED: ${filterValue.toUpperCase()}</span>`;
        jarvisTerminal.appendChild(newLine);
        
        // Auto-scroll terminal to bottom
        jarvisTerminal.scrollTop = jarvisTerminal.scrollHeight;
    }
});
});

// Search Functionality
const searchInput = document.querySelector('.intel-search');
const searchBtn = document.querySelector('.search-btn');

if (searchInput && searchBtn) {
// Search on button click
searchBtn.addEventListener('click', function() {
    performSearch();
});

// Search on Enter key
searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        performSearch();
    }
});

function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        // Reset all cards to visible
        intelCards.forEach(card => {
            card.style.display = 'flex';
        });
        return;
    }
    
    // Reset filter buttons
    filterButtons.forEach(btn => {
        if (btn.getAttribute('data-filter') === 'all') {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Filter cards based on search term
    let matchFound = false;
    
    intelCards.forEach(card => {
        const title = card.querySelector('.intel-title').textContent.toLowerCase();
        const excerpt = card.querySelector('.intel-excerpt').textContent.toLowerCase();
        const tags = Array.from(card.querySelectorAll('.intel-tag')).map(tag => tag.textContent.toLowerCase());
        
        if (title.includes(searchTerm) || excerpt.includes(searchTerm) || tags.some(tag => tag.includes(searchTerm))) {
            card.style.display = 'flex';
            matchFound = true;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Add search result to JARVIS terminal if it exists
    const jarvisTerminal = document.getElementById('jarvisTerminal');
    if (jarvisTerminal) {
        const newLine = document.createElement('div');
        newLine.className = 'terminal-line';
        newLine.innerHTML = `> <span class="typing">SEARCHING: "${searchTerm}"</span>`;
        jarvisTerminal.appendChild(newLine);
        
        const resultLine = document.createElement('div');
        resultLine.className = 'terminal-line response';
        resultLine.textContent = matchFound ? `Results found for "${searchTerm}"` : `No results found for "${searchTerm}"`;
        jarvisTerminal.appendChild(resultLine);
        
        // Auto-scroll terminal to bottom
        jarvisTerminal.scrollTop = jarvisTerminal.scrollHeight;
    }
}
}

// Intel card hover effects
intelCards.forEach(card => {
card.addEventListener('mouseenter', function() {
    // Intensify scan line on hover
    const scanLine = this.querySelector('.scan-line');
    if (scanLine) {
        scanLine.classList.add('intensified');
    }
    
    // Add terminal response to J.A.R.V.I.S. terminal if it exists
    const jarvisTerminal = document.getElementById('jarvisTerminal');
    if (jarvisTerminal) {
        const intelTitle = this.querySelector('.intel-title').textContent;
        const intelID = this.querySelector('.intel-id').textContent;
        
        const newLine = document.createElement('div');
        newLine.className = 'terminal-line';
        newLine.innerHTML = `> <span class="typing">ACCESSING REPORT: ${intelID}</span>`;
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
});

// Database access button effect
const databaseBtn = document.querySelector('.database-btn');
if (databaseBtn) {
databaseBtn.addEventListener('mouseenter', function() {
    // Add terminal response to J.A.R.V.I.S. terminal if it exists
    const jarvisTerminal = document.getElementById('jarvisTerminal');
    if (jarvisTerminal) {
        const newLine = document.createElement('div');
        newLine.className = 'terminal-line';
        newLine.innerHTML = `> <span class="typing">PREPARING DATABASE ACCESS...</span>`;
        jarvisTerminal.appendChild(newLine);
        
        // Auto-scroll terminal to bottom
        jarvisTerminal.scrollTop = jarvisTerminal.scrollHeight;
    }
});
}

// Simulated typing effect for terminal messages
function simulateTyping(element, text, speed = 50) {
let i = 0;
element.textContent = '';

function type() {
    if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
    }
}

type();
}
});