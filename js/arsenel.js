
// Set current year in footer
document.addEventListener('DOMContentLoaded', function() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});

// Mobile menu toggle with proper close functionality
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
const navLinkItems = document.querySelectorAll('.nav-link');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when a link is clicked
navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Animate skill progress bars when scrolled into view
function animateSkills() {
    const skillsSection = document.querySelector('.skills-section');
    const skillProgressBars = document.querySelectorAll('.skill-progress');
    const meterProgressCircles = document.querySelectorAll('.meter-progress');
    
    // Check if skills section is in viewport
    const rect = skillsSection.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom >= 0;
    
    if (isInViewport) {
        // Animate skill bars
        skillProgressBars.forEach(progressBar => {
            const level = progressBar.getAttribute('data-level');
            progressBar.style.width = `${level}%`;
        });
        
        // Animate circular meters
        meterProgressCircles.forEach(meter => {
            const level = meter.getAttribute('data-level');
            const dashoffset = 283 - (283 * level / 100);
            meter.style.strokeDashoffset = dashoffset;
        });
        
        // Remove scroll listener once animation is triggered
        window.removeEventListener('scroll', animateSkills);
    }
}

// Add scroll listener
window.addEventListener('scroll', animateSkills);

// Contact form validation
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Update status dots
    const dots = document.querySelectorAll('.status-dot');
    
    // Simulate form submission process
    dots[0].classList.add('active'); // Already active
    
    // Simulate encryption
    setTimeout(() => {
        dots[1].classList.add('active');
        
        // Simulate transmission
        setTimeout(() => {
            dots[2].classList.add('active');
            
            // Simulate confirmation
            setTimeout(() => {
                dots[3].classList.add('active');
                
                // Show success message in JARVIS terminal
                const jarvisTerminal = document.getElementById('jarvisTerminal');
                const newLine = document.createElement('div');
                newLine.className = 'terminal-line response';
                newLine.textContent = 'Message sent successfully. Expect response within 24 hours.';
                jarvisTerminal.appendChild(newLine);
                
                // Optionally, open JARVIS to show the message
                const assistantPanel = document.getElementById('assistantPanel');
                if (assistantPanel) assistantPanel.classList.add('active');
                
                // Reset form after 2 seconds
                setTimeout(() => {
                    contactForm.reset();
                    dots.forEach((dot, index) => {
                        if (index > 0) dot.classList.remove('active');
                    });
                }, 2000);
            }, 800);
        }, 800);
    }, 800);
});

// Download CV functionality
document.getElementById('downloadCV').addEventListener('click', function() {
    const jarvisTerminal = document.getElementById('jarvisTerminal');
    const newLine = document.createElement('div');
    newLine.className = 'terminal-line response';
    newLine.textContent = 'CV download initiated. Please check your downloads folder.';
    jarvisTerminal.appendChild(newLine);
    
    // In a real implementation, this would trigger the CV download
    // window.location.href = 'path/to/your/cv.pdf';
});

// Hire Me functionality
document.getElementById('hireMe').addEventListener('click', function() {
    const jarvisTerminal = document.getElementById('jarvisTerminal');
    const newLine = document.createElement('div');
    newLine.className = 'terminal-line response';
    newLine.textContent = 'Redirecting to contact form for engagement discussion...';
    jarvisTerminal.appendChild(newLine);
    
    // Scroll to contact section
    setTimeout(() => {
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        const assistantPanel = document.getElementById('assistantPanel');
        if (assistantPanel) assistantPanel.classList.remove('active');
    }, 1500);
});

// Easter egg - "stark" keyword detection
let keySequence = [];
document.addEventListener('keydown', (e) => {
    keySequence.push(e.key.toLowerCase());
    keySequence = keySequence.slice(-5); // Keep only last 5 keys
    
    if (keySequence.join('') === 'stark') {
        const assistantPanel = document.getElementById('assistantPanel');
        if (assistantPanel) assistantPanel.classList.add('active');
        
        const assistantMessages = document.getElementById('assistantMessages');
        if (assistantMessages) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message assistant-message';
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            contentDiv.textContent = 'Hello, Mr. Stark. How can I assist you today?';
            messageDiv.appendChild(contentDiv);
            assistantMessages.appendChild(messageDiv);
            assistantMessages.scrollTop = assistantMessages.scrollHeight;
        }
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Security level indicator animation
const updateSecurityLevel = () => {
    const scrollPosition = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = (scrollPosition / documentHeight) * 100;
    
    const securityIndicator = document.querySelector('.security-indicator');
    
    if (scrollPercentage > 80) {
        securityIndicator.style.boxShadow = '0 0 10px #4AF626, 0 0 20px #4AF626';
        securityIndicator.style.backgroundColor = '#4AF626';
    } else if (scrollPercentage > 50) {
        securityIndicator.style.boxShadow = '0 0 10px #FFD700, 0 0 20px #FFD700';
        securityIndicator.style.backgroundColor = '#FFD700';
    } else if (scrollPercentage > 20) {
        securityIndicator.style.boxShadow = '0 0 10px #64f9ff, 0 0 20px #64f9ff';
        securityIndicator.style.backgroundColor = '#64f9ff';
    } else {
        securityIndicator.style.boxShadow = '0 0 5px #4AF626';
        securityIndicator.style.backgroundColor = '#4AF626';
    }
};

window.addEventListener('scroll', updateSecurityLevel);

// Initialize animations on load
window.addEventListener('load', () => {
    // Trigger initial animations
    setTimeout(animateSkills, 2000);
    
    // Make HUD corners appear
    const hudCorners = document.querySelectorAll('.hud-corner');
    hudCorners.forEach((corner, index) => {
        setTimeout(() => {
            corner.style.strokeDashoffset = 0;
        }, 5000 + (index * 300));
    });
});

