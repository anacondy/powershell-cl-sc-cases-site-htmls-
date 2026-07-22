/**
 * Hardened shared theme management.
 * - Survives blocked localStorage / older Safari matchMedia.
 * - Never leaves the page invisible if initialization fails.
 */
(function() {
    'use strict';

    const body = document.body;
    const themeSwitch = document.getElementById('theme-switch');

    function safeGet(key) {
        try { return window.localStorage ? localStorage.getItem(key) : null; }
        catch (_) { return null; }
    }

    function safeSet(key, value) {
        try { if (window.localStorage) localStorage.setItem(key, value); }
        catch (_) { /* Storage can be disabled. Theme still works for this load. */ }
    }

    function setTheme(isLight, persist = true) {
        body.classList.toggle('light-mode', isLight);
        body.classList.toggle('dark-mode', !isLight);
        if (themeSwitch) themeSwitch.checked = isLight;
        if (persist) safeSet('theme', isLight ? 'light' : 'dark');
    }

    function systemPrefersDark() {
        return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }

    function initializeTheme() {
        body.classList.remove('light-mode', 'dark-mode');
        const savedTheme = safeGet('theme');
        if (savedTheme === 'light' || savedTheme === 'dark') {
            setTheme(savedTheme === 'light', false);
            return;
        }
        setTheme(!systemPrefersDark(), false);
    }

    function bindSystemPreferenceListener() {
        if (!window.matchMedia) return;
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = event => {
            if (!safeGet('theme')) setTheme(!event.matches, false);
        };
        if (typeof media.addEventListener === 'function') {
            media.addEventListener('change', handler);
        } else if (typeof media.addListener === 'function') {
            media.addListener(handler); // Safari < 14
        }
    }

    function markLoaded() {
        body.classList.add('loaded');
    }

    try {
        initializeTheme();
        if (themeSwitch) {
            themeSwitch.addEventListener('change', () => setTheme(themeSwitch.checked, true));
        }
        bindSystemPreferenceListener();
    } catch (error) {
        // Fail open: visible, readable light-mode page instead of a blank screen.
        body.classList.add('light-mode');
        // Deliberately no production console spam.
    } finally {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', markLoaded, { once: true });
        } else {
            markLoaded();
        }
    }
})();
