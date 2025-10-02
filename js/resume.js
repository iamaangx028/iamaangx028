    // Resume section interactivity
document.addEventListener('DOMContentLoaded', function() {
    // Resume image zoom functionality
    const resumeImage = document.querySelector('.resume-image');
    const zoomInBtn = document.querySelector('.zoom-in');
    const zoomOutBtn = document.querySelector('.zoom-out');
    const zoomResetBtn = document.querySelector('.zoom-reset');
    
    let zoomLevel = 1;
    
    if (resumeImage && zoomInBtn && zoomOutBtn && zoomResetBtn) {
        // Zoom in
        zoomInBtn.addEventListener('click', function() {
            if (zoomLevel < 2.5) { // Maximum zoom
                zoomLevel += 0.25;
                updateZoom();
            }
        });
        
        // Zoom out
        zoomOutBtn.addEventListener('click', function() {
            if (zoomLevel > 0.5) { // Minimum zoom
                zoomLevel -= 0.25;
                updateZoom();
            }
        });
        
        // Reset zoom
        zoomResetBtn.addEventListener('click', function() {
            zoomLevel = 1;
            updateZoom();
        });
        
        // Update zoom level
        function updateZoom() {
            resumeImage.style.transform = `scale(${zoomLevel})`;
        }
    }
    
    // Terminal animation for resume section
    const resumeTerminalLines = document.querySelectorAll('.resume-section .terminal-line');
    
    // Restart animation when section comes into view
    function animateTerminalWhenVisible() {
        const resumeSection = document.querySelector('.resume-section');
        if (!resumeSection) return;
        
        const rect = resumeSection.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom >= 0;
        
        if (isInViewport && !resumeSection.classList.contains('animated')) {
            resumeSection.classList.add('animated');
            
            resumeTerminalLines.forEach((line, index) => {
                line.style.width = '0';
                
                setTimeout(() => {
                    line.style.width = '100%';
                }, index * 800);
            });
        }
    }
    
    // Check on scroll
    window.addEventListener('scroll', animateTerminalWhenVisible);
    
    // Check on initial load
    animateTerminalWhenVisible();
});