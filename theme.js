/**
 * Shared theme management and common functionality
 * This file handles theme switching and system preference detection
 */

(function() {
    'use strict';
    
    // Theme toggle functionality
    const themeSwitch = document.getElementById('theme-switch');
    const body = document.body;

    /**
     * Set theme and update UI
     * @param {boolean} isLight - True for light mode, false for dark mode
     */
    function setTheme(isLight) {
        if (isLight) {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
        } else {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
        }
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    }

    /**
     * Initialize theme based on saved preference or system preference
     */
    function initializeTheme() {
        // Remove any default class first to let JS determine theme
        body.classList.remove('light-mode', 'dark-mode');
        
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme) {
            // User has a saved preference
            const isLight = (savedTheme === 'light');
            themeSwitch.checked = isLight;
            setTheme(isLight);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // System prefers dark mode
            themeSwitch.checked = false;
            setTheme(false);
        } else {
            // Default to light mode
            themeSwitch.checked = true;
            setTheme(true);
        }
    }

    // Initialize theme immediately
    initializeTheme();

    // Listen for toggle changes
    themeSwitch.addEventListener('change', () => {
        setTheme(themeSwitch.checked);
    });

    // Listen for system theme changes (only if no saved preference)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        if (!localStorage.getItem('theme')) {
            themeSwitch.checked = !event.matches;
            setTheme(!event.matches);
        }
    });

    // Simple fade-in animation on load
    document.addEventListener('DOMContentLoaded', () => {
        document.body.classList.add('loaded');
    });
})();
