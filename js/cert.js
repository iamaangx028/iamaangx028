// Modified animation for faster certification cards appearance
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
                
                // Stagger the appearance of certification cards with REDUCED DELAY
                const certCards = credentialsSection.querySelectorAll('.cert-card');
                certCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('appear');
                    }, 500 + (index * 100)); // Much faster appearance (was 3500 + index * 300)
                });
            }
        }
    }
    
    // Rest of your animation code for other sections...
}

// Add initial scroll listener
window.addEventListener('scroll', animateElements);

// Trigger on page load to check if sections are already in view
animateElements();