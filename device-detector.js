/**
 * Enhanced device detection utility
 * Provides accurate device and browser information
 */

(function() {
    'use strict';

    /**
     * Detect device type and details
     */
    function detectDevice() {
        const ua = navigator.userAgent.toLowerCase();
        const platform = navigator.platform.toLowerCase();
        
        let deviceType = 'Desktop';
        let deviceIcon = '🖥️';
        let deviceName = 'Desktop';
        let os = 'Unknown OS';
        
        // Mobile Detection
        const isMobile = /mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua);
        const isTablet = /ipad|tablet|kindle/i.test(ua) || (ua.includes('android') && !ua.includes('mobile'));
        
        // OS Detection
        if (/android/i.test(ua)) {
            os = 'Android';
            deviceIcon = '📱';
            deviceName = isTablet ? 'Android Tablet' : 'Android Phone';
            deviceType = isTablet ? 'Tablet' : 'Mobile';
        } else if (/iphone/i.test(ua)) {
            os = 'iOS';
            deviceIcon = '📱';
            deviceName = 'iPhone';
            deviceType = 'Mobile';
        } else if (/ipad/i.test(ua) || (ua.includes('macintosh') && 'ontouchend' in document)) {
            os = 'iPadOS';
            deviceIcon = '📱';
            deviceName = 'iPad';
            deviceType = 'Tablet';
        } else if (/mac os x/i.test(ua) || platform.includes('mac')) {
            os = 'macOS';
            deviceIcon = '🍎';
            deviceName = 'Mac';
            deviceType = 'Desktop';
        } else if (/windows/i.test(ua) || platform.includes('win')) {
            os = 'Windows';
            deviceIcon = '💻';
            deviceName = 'Windows PC';
            deviceType = 'Desktop';
        } else if (/linux/i.test(ua) || platform.includes('linux')) {
            os = 'Linux';
            deviceIcon = '🐧';
            deviceName = 'Linux PC';
            deviceType = 'Desktop';
        } else if (/cros/i.test(ua)) {
            os = 'Chrome OS';
            deviceIcon = '💻';
            deviceName = 'Chromebook';
            deviceType = 'Desktop';
        }
        
        // Browser Detection
        let browser = 'Unknown Browser';
        if (/edg\//i.test(ua)) {
            browser = 'Microsoft Edge';
        } else if (/chrome/i.test(ua) && !/edg/i.test(ua)) {
            browser = 'Chrome';
        } else if (/firefox/i.test(ua)) {
            browser = 'Firefox';
        } else if (/safari/i.test(ua) && !/chrome/i.test(ua)) {
            browser = 'Safari';
        } else if (/opera|opr\//i.test(ua)) {
            browser = 'Opera';
        } else if (/msie|trident/i.test(ua)) {
            browser = 'Internet Explorer';
        }
        
        // Screen information
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        return {
            deviceType,
            deviceIcon,
            deviceName,
            os,
            browser,
            isMobile,
            isTablet,
            isDesktop: !isMobile && !isTablet,
            screen: {
                width: screenWidth,
                height: screenHeight,
                resolution: `${screenWidth}x${screenHeight}`
            },
            viewport: {
                width: viewportWidth,
                height: viewportHeight,
                resolution: `${viewportWidth}x${viewportHeight}`
            },
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            cookieEnabled: navigator.cookieEnabled,
            onlineStatus: navigator.onLine
        };
    }

    /**
     * Get a human-readable device summary
     */
    function getDeviceSummary() {
        const device = detectDevice();
        return `${device.deviceName} (${device.os}) - ${device.browser}`;
    }

    /**
     * Check if device has touch capability
     */
    function isTouchDevice() {
        return ('ontouchstart' in window) || 
               (navigator.maxTouchPoints > 0) || 
               (navigator.msMaxTouchPoints > 0);
    }

    /**
     * Get connection information (if available)
     */
    function getConnectionInfo() {
        if ('connection' in navigator) {
            const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            if (conn) {
                return {
                    effectiveType: conn.effectiveType || 'unknown',
                    downlink: conn.downlink || 0,
                    rtt: conn.rtt || 0,
                    saveData: conn.saveData || false
                };
            }
        }
        return null;
    }

    // Detect device on load
    const deviceInfo = detectDevice();
    
    // Export to global scope
    window.DeviceDetector = {
        detectDevice,
        getDeviceSummary,
        isTouchDevice,
        getConnectionInfo,
        deviceInfo
    };

    // Log device info for debugging
    console.log('Device Info:', deviceInfo);
    
})();
