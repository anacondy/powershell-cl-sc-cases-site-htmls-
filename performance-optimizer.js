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
        // Try to detect display refresh rate
        let refreshRate = 60; // Default to 60Hz
        
        // Modern browsers support this API
        if ('getDisplayMedia' in navigator.mediaDevices || screen.frameRate) {
            refreshRate = screen.frameRate || 60;
        }
        
        // Log detected refresh rate
        console.log(`Display refresh rate: ${refreshRate}Hz`);
        
        // Apply optimizations based on refresh rate
        const root = document.documentElement;
        
        if (refreshRate >= 144) {
            root.style.setProperty('--transition-speed', '0.1s');
            console.log('Applied 144Hz+ optimizations');
        } else if (refreshRate >= 120) {
            root.style.setProperty('--transition-speed', '0.15s');
            console.log('Applied 120Hz optimizations');
        } else if (refreshRate >= 90) {
            root.style.setProperty('--transition-speed', '0.2s');
            console.log('Applied 90Hz optimizations');
        } else {
            root.style.setProperty('--transition-speed', '0.3s');
            console.log('Applied 60Hz optimizations');
        }
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
            deviceMemory: navigator.deviceMemory || 4, // GB
            hardwareConcurrency: navigator.hardwareConcurrency || 4,
            connectionType: 'unknown'
        };
        
        // Check network information
        if ('connection' in navigator) {
            const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            if (conn) {
                deviceInfo.connectionType = conn.effectiveType || 'unknown';
                deviceInfo.saveData = conn.saveData || false;
            }
        }
        
        // Detect low-end devices
        if (deviceInfo.deviceMemory <= 2 || deviceInfo.hardwareConcurrency <= 2) {
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
        detectAndOptimizeForRefreshRate
    };

    // Auto-initialize
    initialize();

})();
