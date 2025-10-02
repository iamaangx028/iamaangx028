
// Main JavaScript File
document.addEventListener('DOMContentLoaded', function() {
    // Global variables
    const body = document.body;
    
    // Set current year
    function setCurrentYear() {
        const yearElement = document.getElementById('year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }
    
    // Mobile menu handling
    function setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navLinks = document.getElementById('navLinks');
        const navLinkItems = document.querySelectorAll('.nav-link');
        
        if (mobileMenuBtn && navLinks) {
            mobileMenuBtn.addEventListener('click', function() {
                navLinks.classList.toggle('active');
                this.setAttribute('aria-expanded', navLinks.classList.contains('active'));
            });
            
            // Close mobile menu when a link is clicked
            navLinkItems.forEach(link => {
                link.addEventListener('click', function() {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                });
            });
        }
    }
    
    // Smooth scrolling
    function setupSmoothScrolling() {
        const scrollLinks = document.querySelectorAll('a[href^="#"]');
        
        scrollLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update URL without page jump
                    history.pushState(null, null, targetId);
                }
            });
        });
    }
    
    // Contact form handling
    function setupContactForm() {
        const contactForm = document.getElementById('contactForm');
        const formStatus = document.getElementById('formStatus');
        
        if (contactForm && formStatus) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Reset and show sending status
                formStatus.className = 'show';
                formStatus.innerHTML = '<div class="form-sending">Sending message...</div>';
                
                const formData = new FormData(contactForm);
                
                fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        formStatus.innerHTML = '<div class="form-success">Message sent successfully! I\'ll get back to you soon.</div>';
                        contactForm.reset();
                        
                        // Hide success message after 5 seconds
                        setTimeout(() => {
                            formStatus.className = '';
                        }, 5000);
                    } else {
                        response.json().then(data => {
                            formStatus.innerHTML = `<div class="form-error">Oops! There was a problem: ${data.error}</div>`;
                        });
                    }
                })
                .catch(error => {
                    formStatus.innerHTML = '<div class="form-error">Oops! There was a network problem. Please try again.</div>';
                });
            });
        }
    }
    
    // Skills animation
    function setupSkillsAnimation() {
        const skillsSection = document.querySelector('.skills-section');
        const skillProgressBars = document.querySelectorAll('.skill-progress');
        const meterProgressCircles = document.querySelectorAll('.meter-progress');
        
        if (!skillsSection) return;
        
        function animateSkills() {
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
        
        // Check on initial load
        animateSkills();
    }
    
    // Virtual Assistant
    function setupVirtualAssistant() {
        const assistantToggle = document.getElementById('assistantToggle');
        const assistantPanel = document.getElementById('assistantPanel');
        const closeAssistant = document.getElementById('closeAssistant');
        const assistantMessages = document.getElementById('assistantMessages');
        const actionButtons = document.querySelectorAll('.action-btn');
        
        if (!assistantToggle || !assistantPanel) return;
        
        // Toggle assistant panel
        assistantToggle.addEventListener('click', function() {
            assistantPanel.classList.toggle('active');
        });
        
        // Close assistant panel
        if (closeAssistant) {
            closeAssistant.addEventListener('click', function() {
                assistantPanel.classList.remove('active');
            });
        }
        
        // Handle action buttons
        actionButtons.forEach(button => {
            button.addEventListener('click', function() {
                const action = this.getAttribute('data-action');
                
                // Add user message
                addMessage(`I want to ${action === 'hire' ? 'hire you' : action === 'resume' ? 'see your resume' : action === 'projects' ? 'see your projects' : 'contact you'}`, 'user');
                
                // Add assistant response
                setTimeout(() => {
                    switch(action) {
                        case 'projects':
                            addMessage("I'll take you to my projects section right away.", 'assistant');
                            setTimeout(() => {
                                document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
                                assistantPanel.classList.remove('active');
                            }, 1000);
                            break;
                        case 'resume':
                            addMessage("Let me show you my resume.", 'assistant');
                            setTimeout(() => {
                                document.getElementById('resume').scrollIntoView({ behavior: 'smooth' });
                                assistantPanel.classList.remove('active');
                            }, 1000);
                            break;
                        case 'contact':
                            addMessage("I'll direct you to my contact information.", 'assistant');
                            setTimeout(() => {
                                document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
                                assistantPanel.classList.remove('active');
                            }, 1000);
                            break;
                        case 'hire':
                            addMessage("Great! I'll take you to the contact section where you can reach out to discuss working together.", 'assistant');
                            setTimeout(() => {
                                document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
                                assistantPanel.classList.remove('active');
                            }, 1000);
                            break;
                    }
                }, 500);
            });
        });
        
        // Add message to chat
        function addMessage(text, type) {
            if (!assistantMessages) return;
            
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${type}-message`;
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            contentDiv.textContent = text;
            
            messageDiv.appendChild(contentDiv);
            assistantMessages.appendChild(messageDiv);
            
            // Scroll to bottom
            assistantMessages.scrollTop = assistantMessages.scrollHeight;
        }
    }
    
    // Filter functionality for Intelligence section
    function setupIntelligenceFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const intelCards = document.querySelectorAll('.intel-card');
        
        if (filterButtons.length === 0 || intelCards.length === 0) return;
        
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
            });
        });
    }
    
    // Security level indicator 
    function setupSecurityLevelIndicator() {
        const securityIndicator = document.querySelector('.security-indicator');
        
        if (!securityIndicator) return;
        
        function updateSecurityLevel() {
            const scrollPosition = window.scrollY;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercentage = (scrollPosition / documentHeight) * 100;
            
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
        }
        
        window.addEventListener('scroll', updateSecurityLevel);
    }
    
    // Initialize all functionality
    function init() {
        setCurrentYear();
        setupMobileMenu();
        setupSmoothScrolling();
        setupContactForm();
        setupSkillsAnimation();
        setupVirtualAssistant();
        setupIntelligenceFilters();
        setupSecurityLevelIndicator();
    }
    
    // Run initialization
    init();
});

