/**
 * Theme Management
 * Always applies dark theme
 */

(function() {
    'use strict';

    // Always apply dark theme
    function applyDarkTheme() {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Initialize theme on page load
    function initTheme() {
        applyDarkTheme();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
})();

