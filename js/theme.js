/**
 * Theme Toggle Functionality
 * Handles switching between light and dark themes
 */

(function() {
    'use strict';

    // Theme state management
    const THEME_KEY = 'comicverse-theme';
    const LIGHT_THEME = 'light';
    const DARK_THEME = 'dark';

    // Get theme from localStorage or default to light
    function getStoredTheme() {
        return localStorage.getItem(THEME_KEY) || LIGHT_THEME;
    }

    // Save theme to localStorage
    function saveTheme(theme) {
        localStorage.setItem(THEME_KEY, theme);
    }

    // Apply theme to document
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        saveTheme(theme);
        
        // Update checkbox state
        const checkbox = document.getElementById('theme-checkbox');
        if (checkbox) {
            checkbox.checked = theme === DARK_THEME;
        }
    }

    // Toggle between themes
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || getStoredTheme();
        const newTheme = currentTheme === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;
        applyTheme(newTheme);
    }

    // Initialize theme on page load
    function initTheme() {
        const savedTheme = getStoredTheme();
        applyTheme(savedTheme);
    }

    // Set up event listeners
    function setupThemeToggle() {
        const checkbox = document.getElementById('theme-checkbox');
        if (checkbox) {
            checkbox.addEventListener('change', toggleTheme);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initTheme();
            setupThemeToggle();
        });
    } else {
        initTheme();
        setupThemeToggle();
    }
})();

