/**
 * Hardened device detection utility.
 * No production console logging, no unnecessary persistent storage.
 */
(function() {
    'use strict';

    function detectDevice() {
        const ua = navigator.userAgent.toLowerCase();
        const platform = (navigator.platform || '').toLowerCase();
        let deviceType = 'Desktop';
        let deviceIcon = '🖥️';
        let deviceName = 'Desktop';
        let os = 'Unknown OS';

        const isMobile = /mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua);
        const isTablet = /ipad|tablet|kindle/i.test(ua) || (ua.includes('android') && !ua.includes('mobile'));

        if (/android/i.test(ua)) {
            os = 'Android'; deviceIcon = '📱'; deviceName = isTablet ? 'Android Tablet' : 'Android Phone'; deviceType = isTablet ? 'Tablet' : 'Mobile';
        } else if (/iphone/i.test(ua)) {
            os = 'iOS'; deviceIcon = '📱'; deviceName = 'iPhone'; deviceType = 'Mobile';
        } else if (/ipad/i.test(ua) || (ua.includes('macintosh') && 'ontouchend' in document)) {
            os = 'iPadOS'; deviceIcon = '📱'; deviceName = 'iPad'; deviceType = 'Tablet';
        } else if (/mac os x/i.test(ua) || platform.includes('mac')) {
            os = 'macOS'; deviceIcon = '🍎'; deviceName = 'Mac';
        } else if (/windows/i.test(ua) || platform.includes('win')) {
            os = 'Windows'; deviceIcon = '💻'; deviceName = 'Windows PC';
        } else if (/cros/i.test(ua)) {
            os = 'Chrome OS'; deviceIcon = '💻'; deviceName = 'Chromebook';
        } else if (/linux/i.test(ua) || platform.includes('linux')) {
            os = 'Linux'; deviceIcon = '🐧'; deviceName = 'Linux PC';
        }

        let browser = 'Unknown Browser';
        if (/edg\//i.test(ua)) browser = 'Microsoft Edge';
        else if (/opr\//i.test(ua) || /opera/i.test(ua)) browser = 'Opera';
        else if (/chrome|crios/i.test(ua) && !/edg/i.test(ua)) browser = 'Chrome';
        else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
        else if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) browser = 'Safari';
        else if (/msie|trident/i.test(ua)) browser = 'Internet Explorer';

        return {
            deviceType,
            deviceIcon,
            deviceName,
            os,
            browser,
            isMobile,
            isTablet,
            isDesktop: !isMobile && !isTablet,
            screen: { width: window.screen.width, height: window.screen.height, resolution: `${window.screen.width}x${window.screen.height}` },
            viewport: { width: window.innerWidth, height: window.innerHeight, resolution: `${window.innerWidth}x${window.innerHeight}` },
            language: navigator.language,
            cookieEnabled: navigator.cookieEnabled,
            onlineStatus: navigator.onLine
        };
    }

    function getDeviceSummary() {
        const device = detectDevice();
        return `${device.deviceName} (${device.os}) - ${device.browser}`;
    }

    function isTouchDevice() {
        return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
    }

    function getConnectionInfo() {
        const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (!conn) return null;
        return {
            effectiveType: conn.effectiveType || 'unknown',
            downlink: conn.downlink || 0,
            rtt: conn.rtt || 0,
            saveData: !!conn.saveData
        };
    }

    window.DeviceDetector = {
        detectDevice,
        getDeviceSummary,
        isTouchDevice,
        getConnectionInfo,
        deviceInfo: detectDevice()
    };
})();
