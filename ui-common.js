/**
 * Common navigation binder. Replaces inline onclick handlers so CSP can block inline scripts.
 */
(function() {
    'use strict';

    function navigateTo(path) {
        if (!/^[A-Za-z0-9._/-]+\.html$/.test(path)) return;
        window.location.assign(path);
    }

    function handleAction(element) {
        const action = element.getAttribute('data-nav-action');
        const href = element.getAttribute('data-nav-href');
        if (action === 'back') history.back();
        else if (action === 'forward') history.forward();
        else if (href) navigateTo(href);
    }

    document.addEventListener('click', event => {
        const target = event.target.closest('[data-nav-action], [data-nav-href]');
        if (!target) return;
        event.preventDefault();
        handleAction(target);
    });

    document.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        const target = event.target.closest('[data-nav-action], [data-nav-href]');
        if (!target) return;
        event.preventDefault();
        handleAction(target);
    });
})();
