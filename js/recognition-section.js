        // JavaScript for Recognition Section Functionality
        document.addEventListener('DOMContentLoaded', function() {
        // Display tab switching
        const displayTabs = document.querySelectorAll('.display-tab');
        const displaySections = document.querySelectorAll('.display-section');
        
        displayTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const displayTarget = this.getAttribute('data-display');
                
                // Update active tab
                displayTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Show corresponding section
                displaySections.forEach(section => {
                    section.classList.remove('active');
                    
                    if (section.id === `${displayTarget}-display`) {
                        section.classList.add('active');
                    }
                });
                
                // Terminal effect when switching tabs
                const terminalLines = document.querySelectorAll('.terminal-line');
                terminalLines.forEach((line, index) => {
                    setTimeout(() => {
                        line.style.width = '0';
                        setTimeout(() => {
                            if (index === 0) {
                                line.textContent = '$ ACCESSING DATABASE...';
                            } else if (index === 1) {
                                line.textContent = `$ LOADING ${displayTarget.toUpperCase()} DATA...`;
                            } else if (index === 2) {
                                line.textContent = `$ DISPLAYING ${displayTarget.toUpperCase()} RECORDS...`;
                            }
                            
                            line.style.width = '100%';
                        }, 300);
                    }, index * 200);
                });
            });
        });
        
        // LOA Navigation
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const navDots = document.querySelectorAll('.nav-dot');
        const letterDisplays = document.querySelectorAll('.letter-display');
        const thumbnails = document.querySelectorAll('.thumbnail');
        
        let currentLetter = 1;
        const totalLetters = letterDisplays.length;
        
        // Update display based on current letter
        function updateLetterDisplay() {
            // Hide all letters
            letterDisplays.forEach(display => {
                display.classList.remove('active');
            });
            
            // Show current letter
            document.getElementById(`letter-${currentLetter}`).classList.add('active');
            
            // Update navigation dots
            navDots.forEach(dot => {
                dot.classList.remove('active');
                
                if (parseInt(dot.getAttribute('data-letter')) === currentLetter) {
                    dot.classList.add('active');
                }
            });
            
            // Update thumbnails
            thumbnails.forEach(thumb => {
                thumb.classList.remove('active');
                
                if (parseInt(thumb.getAttribute('data-letter')) === currentLetter) {
                    thumb.classList.add('active');
                }
            });
        }
        
        // Previous button click
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                currentLetter--;
                
                if (currentLetter < 1) {
                    currentLetter = totalLetters;
                }
                
                updateLetterDisplay();
            });
        }
        
        // Next button click
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                currentLetter++;
                
                if (currentLetter > totalLetters) {
                    currentLetter = 1;
                }
                
                updateLetterDisplay();
            });
        }
        
        // Nav dot click
        navDots.forEach(dot => {
            dot.addEventListener('click', function() {
                currentLetter = parseInt(this.getAttribute('data-letter'));
                updateLetterDisplay();
            });
        });
        
        // Thumbnail click
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                currentLetter = parseInt(this.getAttribute('data-letter'));
                updateLetterDisplay();
            });
        });
        
        // Image zoom functionality
        const letterImages = document.querySelectorAll('.letter-image');
        const zoomInBtns = document.querySelectorAll('.zoom-in-btn');
        const zoomOutBtns = document.querySelectorAll('.zoom-out-btn');
        const resetZoomBtns = document.querySelectorAll('.reset-zoom-btn');
        
        // Track zoom level for each image
        let zoomLevels = {};
        
        letterImages.forEach((img, index) => {
            zoomLevels[index] = 1; // Initial zoom level
        });
        
        // Zoom in button click
        zoomInBtns.forEach((btn, index) => {
            btn.addEventListener('click', function() {
                if (zoomLevels[index] < 2.5) { // Max zoom
                    zoomLevels[index] += 0.25;
                    letterImages[index].style.transform = `scale(${zoomLevels[index]})`;
                }
            });
        });
        
        // Zoom out button click
        zoomOutBtns.forEach((btn, index) => {
            btn.addEventListener('click', function() {
                if (zoomLevels[index] > 0.5) { // Min zoom
                    zoomLevels[index] -= 0.25;
                    letterImages[index].style.transform = `scale(${zoomLevels[index]})`;
                }
            });
        });
        
        // Reset zoom button click
        resetZoomBtns.forEach((btn, index) => {
            btn.addEventListener('click', function() {
                zoomLevels[index] = 1;
                letterImages[index].style.transform = 'scale(1)';
            });
        });
        
        // Initialize with first display tab active
        if (displayTabs.length > 0) {
            displayTabs[0].classList.add('active');
        }
        
        if (displaySections.length > 0) {
            displaySections[0].classList.add('active');
        }
    });