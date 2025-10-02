// Updated function that will work with existing HTML elements
function setupVirtualAssistant() {
    // Get element references that match the HTML
    const assistantToggle = document.getElementById('assistantToggle');
    const assistantPanel = document.getElementById('assistantPanel');
    const closeAssistant = document.getElementById('closeAssistant');
    const assistantMessages = document.getElementById('assistantMessages');
    const actionButtons = document.querySelectorAll('.action-btn');
    
    // Exit if elements aren't found
    if (!assistantToggle || !assistantPanel) {
        console.warn('Assistant elements not found in the DOM');
        return;
    }
    
    // Enhanced toggle with sound feedback and animations
    assistantToggle.addEventListener('click', function() {
        const wasActive = assistantPanel.classList.contains('active');
        assistantPanel.classList.toggle('active');
        
        // Update ARIA attributes for accessibility
        const isExpanded = assistantPanel.classList.contains('active');
        this.setAttribute('aria-expanded', isExpanded);
        
        // Add user interaction message
        if (isExpanded && window.addJarvisMessage) {
            setTimeout(() => {
                window.addJarvisMessage('How can I assist you today? Use the quick actions below or ask me anything!', 'assistant');
            }, 300);
        }
    });
    
    // Close assistant panel with the X button
    if (closeAssistant) {
        closeAssistant.addEventListener('click', function() {
            assistantPanel.classList.remove('active');
            assistantToggle.setAttribute('aria-expanded', 'false');
        });
    }
    
    // Action buttons are now handled by the enhanced integration script
    // This prevents duplicate event listeners and conflicts
    console.log('J.A.R.V.I.S. initialized - Action buttons managed by integration script');
    
    // Utility function to add messages to the chat
    function addMessage(text, type) {
        if (!assistantMessages) return;
        
        // Create message container
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        // Create message content
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = text;
        
        // Assemble and append to chat
        messageDiv.appendChild(contentDiv);
        assistantMessages.appendChild(messageDiv);
        
        // Scroll chat to bottom to show new message
        assistantMessages.scrollTop = assistantMessages.scrollHeight;
    }
    
    // Close assistant when clicking outside
    document.addEventListener('click', function(event) {
        // Check if assistant is open and click is outside
        if (assistantPanel.classList.contains('active') && 
            !assistantPanel.contains(event.target) && 
            event.target !== assistantToggle) {
            
            assistantPanel.classList.remove('active');
            assistantToggle.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Add keyboard shortcut (Alt+A) to toggle assistant
    document.addEventListener('keydown', function(event) {
        if (event.altKey && event.key === 'a') {
            assistantPanel.classList.toggle('active');
            assistantToggle.setAttribute('aria-expanded', 
                assistantPanel.classList.contains('active'));
            
            // Prevent default browser action
            event.preventDefault();
        }
    });
}

// Make sure to call this function when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupVirtualAssistant();
});