/**
 * Hardened Performance Optimizer for Ramsey's Legal Archive.
 * Fixes GPU over-promotion, duplicate style injection, selector crashes, and production log noise.
 */
(function() {
    'use strict';

    const DEBUG = (() => {
        try { return localStorage.getItem('debug-performance') === 'true'; }
        catch (_) { return false; }
    })();
    const log = (...args) => { if (DEBUG) console.log(...args); };
    const warn = (...args) => { if (DEBUG) console.warn(...args); };

    function upsertStyle(id, cssText) {
        let style = document.getElementById(id);
        if (!style) {
            style = document.createElement('style');
            style.id = id;
            document.head.appendChild(style);
        }
        style.textContent = cssText;
    }

    function detectAndOptimizeForRefreshRate() {
        let refreshRate = 60;
        let startTime = performance.now();
        let frameCount = 0;
        let done = false;

        function finish(rate) {
            if (done) return;
            done = true;
            applyRefreshRateOptimizations(rate);
        }

        function tick(now) {
            if (done) return;
            frameCount += 1;
            const elapsed = now - startTime;
            if (elapsed >= 1000) finish(Math.max(30, Math.min(240, Math.round(frameCount * 1000 / elapsed))));
            else requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
        setTimeout(() => finish(refreshRate), 1200);
    }

    function applyRefreshRateOptimizations(refreshRate) {
        const root = document.documentElement;
        if (refreshRate >= 144) {
            root.style.setProperty('--transition-speed', '0.08s');
            root.style.setProperty('--animation-timing', 'cubic-bezier(0.4, 0, 0.2, 1)');
        } else if (refreshRate >= 120) {
            root.style.setProperty('--transition-speed', '0.12s');
            root.style.setProperty('--animation-timing', 'cubic-bezier(0.4, 0, 0.2, 1)');
        } else if (refreshRate >= 90) {
            root.style.setProperty('--transition-speed', '0.16s');
            root.style.setProperty('--animation-timing', 'cubic-bezier(0.4, 0, 0.2, 1)');
        } else {
            root.style.setProperty('--transition-speed', '0.25s');
            root.style.setProperty('--animation-timing', 'ease-in-out');
        }

        // Do NOT transform every element. That creates thousands of layers and breaks sticky/fixed behavior.
        upsertStyle('rla-perf-layer-hints', `
            .mock-nav { will-change: background-color; transform: translateZ(0); }
            .content-card { transform: translateZ(0); }
            .nav-icon, .back-link { will-change: transform; }
        `);
        log(`Display refresh rate optimization applied: ${refreshRate}Hz`);
    }

    function optimizeImages() {
        document.querySelectorAll('img').forEach(img => {
            if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
            if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
        });
    }

    function monitorPerformance() {
        if (!DEBUG) return;
        let lastTime = performance.now();
        let frames = 0;
        function measureFPS(now) {
            frames += 1;
            if (now >= lastTime + 1000) {
                const fps = Math.round((frames * 1000) / (now - lastTime));
                frames = 0;
                lastTime = now;
                log(`Current FPS: ${fps}`);
                if (fps < 30) warn('Low FPS detected.');
            }
            requestAnimationFrame(measureFPS);
        }
        requestAnimationFrame(measureFPS);
    }

    function getHashTarget(hash) {
        if (!hash || hash === '#') return null;
        const id = decodeURIComponent(hash.slice(1));
        if (!id) return null;
        return document.getElementById(id);
    }

    function optimizeScrolling() {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => { ticking = false; });
                ticking = true;
            }
        }, { passive: true });

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const target = getHashTarget(this.getAttribute('href'));
                if (!target) return; // Let placeholder links do nothing without throwing.
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }

    function detectDeviceCapabilities() {
        const deviceInfo = {
            isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
            isLowEnd: false,
            deviceMemory: navigator.deviceMemory || null,
            hardwareConcurrency: navigator.hardwareConcurrency || null,
            connectionType: 'unknown'
        };

        if ('connection' in navigator && navigator.connection) {
            deviceInfo.connectionType = navigator.connection.effectiveType || 'unknown';
            deviceInfo.saveData = !!navigator.connection.saveData;
        }

        const hasLowMemory = navigator.deviceMemory && navigator.deviceMemory <= 2;
        const hasLowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
        if (hasLowMemory || hasLowCPU || deviceInfo.saveData) {
            deviceInfo.isLowEnd = true;
            document.body.classList.add('low-end-device');
            upsertStyle('rla-low-end-style', `
                .low-end-device .content-card,
                .low-end-device .mock-nav {
                    backdrop-filter: blur(3px) !important;
                    -webkit-backdrop-filter: blur(3px) !important;
                }
            `);
        }
        log('Device capabilities:', deviceInfo);
        return deviceInfo;
    }

    function optimizeForAspectRatio() {
        const aspectRatio = window.innerWidth / Math.max(window.innerHeight, 1);
        document.body.classList.remove('aspect-20-9', 'aspect-16-9', 'aspect-18-9');
        if (aspectRatio >= 0.44 && aspectRatio <= 0.46) document.body.classList.add('aspect-20-9');
        else if (aspectRatio >= 0.55 && aspectRatio <= 0.58) document.body.classList.add('aspect-16-9');
        else if (aspectRatio >= 0.49 && aspectRatio <= 0.51) document.body.classList.add('aspect-18-9');
    }

    function optimizeForTouch() {
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            document.body.classList.add('touch-device');
            upsertStyle('rla-touch-style', `
                .touch-device .nav-icon,
                .touch-device a {
                    min-height: 44px;
                    min-width: 44px;
                }
            `);
        }
    }

    function initialize() {
        detectAndOptimizeForRefreshRate();
        detectDeviceCapabilities();
        optimizeForAspectRatio();
        optimizeForTouch();

        const onReady = () => {
            optimizeImages();
            optimizeScrolling();
            monitorPerformance();
        };
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onReady, { once: true });
        else onReady();

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(optimizeForAspectRatio, 250);
        }, { passive: true });
    }

    window.PerformanceOptimizer = {
        initialize,
        detectDeviceCapabilities,
        optimizeForAspectRatio,
        detectAndOptimizeForRefreshRate,
        applyRefreshRateOptimizations
    };

    initialize();
})();
