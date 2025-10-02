   // Set up companies marquee
document.addEventListener('DOMContentLoaded', function() {
    // Duplicate marquee content for seamless infinite scroll
    const marqueeContent = document.querySelector('.marquee-content');
    if (marqueeContent) {
        // Clone the content to create the illusion of infinite scrolling
        const contentClone = marqueeContent.cloneNode(true);
        marqueeContent.appendChild(contentClone.childNodes[0]);
        
        // Clone all company items to ensure the marquee is long enough
        const companyItems = marqueeContent.querySelectorAll('.company-item');
        companyItems.forEach(item => {
            const clone = item.cloneNode(true);
            marqueeContent.appendChild(clone);
        });
    }
    
    // Add subtle glow effect to companies on random intervals
    const companyItems = document.querySelectorAll('.company-item');
    if (companyItems.length > 0) {
        setInterval(() => {
            // Select random company to highlight
            const randomIndex = Math.floor(Math.random() * companyItems.length);
            const randomCompany = companyItems[randomIndex];
            
            // Add highlight class
            randomCompany.classList.add('highlight');
            
            // Remove highlight after animation
            setTimeout(() => {
                randomCompany.classList.remove('highlight');
            }, 2000);
        }, 3000);
    }
});