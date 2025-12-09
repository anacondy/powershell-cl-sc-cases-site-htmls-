/**
 * Performance Optimizer for Ramsey's Legal Archive
 * Ensures smooth scrolling and 60+ FPS performance
 * Optimized for mobile devices and high refresh rate displays
 */

(function() {
    'use strict';

    /**
     * Detect refresh rate and apply optimizations
     */
    function detectAndOptimizeForRefreshRate() {
        // Try to detect display refresh rate using requestAnimationFrame
        let refreshRate = 60; // Default to 60Hz
        let lastTime = performance.now();
        let frameCount = 0;
        let detectionComplete = false;
        
        function detectRefreshRate(currentTime) {
            if (detectionComplete) return;
            
            frameCount++;
            const elapsed = currentTime - lastTime;
            
            // After 1 second, calculate refresh rate
            if (elapsed >= 1000) {
                refreshRate = Math.round(frameCount);
                detectionComplete = true;
                
                console.log(`Display refresh rate: ${refreshRate}Hz`);
                applyRefreshRateOptimizations(refreshRate);
            } else {
                requestAnimationFrame(detectRefreshRate);
            }
        }
        
        // Start detection
        requestAnimationFrame(detectRefreshRate);
        
        // Fallback: Apply default optimizations after 100ms if detection is slow
        setTimeout(() => {
            if (!detectionComplete) {
                console.log('Display refresh rate: 60Hz (fallback)');
                applyRefreshRateOptimizations(60);
            }
        }, 100);
    }
    
    /**
     * Apply optimizations based on detected refresh rate
     */
    function applyRefreshRateOptimizations(refreshRate) {
        const root = document.documentElement;
        
        // Set CSS variables for smooth animations matching refresh rate
        if (refreshRate >= 144) {
            root.style.setProperty('--transition-speed', '0.08s');
            root.style.setProperty('--animation-timing', 'cubic-bezier(0.4, 0, 0.2, 1)');
            console.log('Applied 144Hz+ optimizations for ultra-smooth experience');
        } else if (refreshRate >= 120) {
            root.style.setProperty('--transition-speed', '0.12s');
            root.style.setProperty('--animation-timing', 'cubic-bezier(0.4, 0, 0.2, 1)');
            console.log('Applied 120Hz optimizations for high refresh rate');
        } else if (refreshRate >= 90) {
            root.style.setProperty('--transition-speed', '0.16s');
            root.style.setProperty('--animation-timing', 'cubic-bezier(0.4, 0, 0.2, 1)');
            console.log('Applied 90Hz optimizations');
        } else {
            root.style.setProperty('--transition-speed', '0.25s');
            root.style.setProperty('--animation-timing', 'ease-in-out');
            console.log('Applied 60Hz optimizations');
        }
        
        // Enable hardware acceleration for better frame rates
        const style = document.createElement('style');
        style.textContent = `
            * {
                -webkit-transform: translateZ(0);
                -moz-transform: translateZ(0);
                -ms-transform: translateZ(0);
                -o-transform: translateZ(0);
                transform: translateZ(0);
            }
            
            .content-card,
            .mock-nav,
            .article-entry {
                will-change: transform;
                transform: translate3d(0, 0, 0);
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Optimize images for lazy loading and performance
     */
    function optimizeImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Add loading="lazy" if not already present
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Add decoding="async" for better performance
            if (!img.hasAttribute('decoding')) {
                img.setAttribute('decoding', 'async');
            }
        });
    }

    /**
     * Monitor frame rate and performance
     */
    function monitorPerformance() {
        let lastTime = performance.now();
        let frames = 0;
        let fps = 60;
        
        function measureFPS() {
            const currentTime = performance.now();
            frames++;
            
            if (currentTime >= lastTime + 1000) {
                fps = Math.round((frames * 1000) / (currentTime - lastTime));
                frames = 0;
                lastTime = currentTime;
                
                // Log FPS occasionally (every 5 seconds)
                if (Math.random() < 0.2) {
                    console.log(`Current FPS: ${fps}`);
                    
                    // Warn if FPS is consistently low
                    if (fps < 30) {
                        console.warn('Low FPS detected. Consider enabling performance mode.');
                    }
                }
            }
            
            requestAnimationFrame(measureFPS);
        }
        
        // Only monitor in development/debug mode
        if (localStorage.getItem('debug-performance') === 'true') {
            requestAnimationFrame(measureFPS);
        }
    }

    /**
     * Optimize scrolling performance
     */
    function optimizeScrolling() {
        let ticking = false;
        
        function handleScroll() {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    // Scroll handling code here (if needed)
                    ticking = false;
                });
                ticking = true;
            }
        }
        
        // Use passive event listener for better scroll performance
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Add smooth scroll behavior with requestAnimationFrame
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /**
     * Detect device capabilities and apply optimizations
     */
    function detectDeviceCapabilities() {
        const deviceInfo = {
            isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
            isLowEnd: false,
            deviceMemory: navigator.deviceMemory || 4, // GB, fallback to 4GB
            hardwareConcurrency: navigator.hardwareConcurrency || 4,
            connectionType: 'unknown'
        };
        
        // Check network information (standard API only, limited browser support)
        if ('connection' in navigator && navigator.connection) {
            const conn = navigator.connection;
            if (conn) {
                deviceInfo.connectionType = conn.effectiveType || 'unknown';
                deviceInfo.saveData = conn.saveData || false;
            }
        }
        
        // Detect low-end devices - only if deviceMemory API is supported
        const hasLowMemory = navigator.deviceMemory && navigator.deviceMemory <= 2;
        const hasLowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
        
        if (hasLowMemory || hasLowCPU) {
            deviceInfo.isLowEnd = true;
            console.log('Low-end device detected');
            
            // Apply low-end optimizations
            document.body.classList.add('low-end-device');
            
            // Reduce backdrop blur on low-end devices
            const style = document.createElement('style');
            style.textContent = `
                .low-end-device .content-card,
                .low-end-device .mock-nav {
                    backdrop-filter: blur(3px) !important;
                    -webkit-backdrop-filter: blur(3px) !important;
                }
            `;
            document.head.appendChild(style);
        }
        
        console.log('Device capabilities:', deviceInfo);
        return deviceInfo;
    }

    /**
     * Apply aspect ratio specific optimizations
     */
    function optimizeForAspectRatio() {
        const aspectRatio = window.innerWidth / window.innerHeight;
        
        console.log(`Screen aspect ratio: ${aspectRatio.toFixed(2)} (${window.innerWidth}x${window.innerHeight})`);
        
        // Detect common aspect ratios
        if (aspectRatio >= 0.44 && aspectRatio <= 0.46) {
            console.log('Detected 20:9 aspect ratio device');
            document.body.classList.add('aspect-20-9');
        } else if (aspectRatio >= 0.55 && aspectRatio <= 0.58) {
            console.log('Detected 16:9 aspect ratio device');
            document.body.classList.add('aspect-16-9');
        } else if (aspectRatio >= 0.49 && aspectRatio <= 0.51) {
            console.log('Detected 18:9 aspect ratio device');
            document.body.classList.add('aspect-18-9');
        }
    }

    /**
     * Optimize for touch devices
     */
    function optimizeForTouch() {
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            document.body.classList.add('touch-device');
            console.log('Touch device detected - optimizations applied');
            
            // Add touch-specific optimizations
            const style = document.createElement('style');
            style.textContent = `
                .touch-device * {
                    -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
                    -webkit-touch-callout: none;
                }
                
                .touch-device .nav-icon,
                .touch-device a {
                    min-height: 44px;
                    min-width: 44px;
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Initialize all optimizations
     */
    function initialize() {
        console.log('Initializing performance optimizations...');
        
        // Run optimizations
        detectAndOptimizeForRefreshRate();
        detectDeviceCapabilities();
        optimizeForAspectRatio();
        optimizeForTouch();
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                optimizeImages();
                optimizeScrolling();
                monitorPerformance();
            });
        } else {
            optimizeImages();
            optimizeScrolling();
            monitorPerformance();
        }
        
        // Re-optimize on window resize (debounced)
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                optimizeForAspectRatio();
            }, 250);
        }, { passive: true });
        
        console.log('Performance optimizations initialized successfully');
    }

    // Export to global scope
    window.PerformanceOptimizer = {
        initialize,
        detectDeviceCapabilities,
        optimizeForAspectRatio,
        detectAndOptimizeForRefreshRate,
        applyRefreshRateOptimizations
    };

    // Auto-initialize
    initialize();

})();
