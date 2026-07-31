// ================= PAGE NAVIGATION =================
// Navigation Helper Function
function goTo(page) {
    window.location.href = page;
}

// Function to apply theme to document
function applyTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
    }
    
    // Update button icon if button exists on this page
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.textContent = (theme === 'light') ? '☀️' : '🌙';
    }
}

// 1. Run immediately on script execution to apply saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
applyTheme(savedTheme);

// 2. Bind event listeners when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Re-apply theme in case body wasn't ready when script executed
    applyTheme(localStorage.getItem('theme') || 'dark');

    const themeToggleBtn = document.getElementById('theme-toggle');
    
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
            const newTheme = (currentTheme === 'dark') ? 'light' : 'dark';
            
            // Save & apply globally
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
    }
});

