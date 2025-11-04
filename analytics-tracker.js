/**
 * Analytics tracking system with persistent storage
 * Tracks unique visitors and sessions accurately using localStorage
 */

(function() {
    'use strict';

    const STORAGE_KEYS = {
        VISITOR_ID: 'visitor_id',
        FIRST_VISIT: 'first_visit',
        LAST_VISIT: 'last_visit',
        VISIT_COUNT: 'visit_count',
        DAILY_VISITS: 'daily_visits',
        MONTHLY_VISITS: 'monthly_visits'
    };

    /**
     * Generate a unique visitor ID
     */
    function generateVisitorId() {
        return 'VIS-' + Date.now() + '-' + Math.random().toString(36).substr(2, 12).toUpperCase();
    }

    /**
     * Get today's date as a string (YYYY-MM-DD)
     */
    function getTodayString() {
        const date = new Date();
        return date.toISOString().split('T')[0];
    }

    /**
     * Get current month string (YYYY-MM)
     */
    function getMonthString() {
        const date = new Date();
        return date.toISOString().substring(0, 7);
    }

    /**
     * Initialize or update visitor tracking
     */
    function trackVisit() {
        const now = new Date();
        const today = getTodayString();
        const currentMonth = getMonthString();

        // Get or create visitor ID
        let visitorId = localStorage.getItem(STORAGE_KEYS.VISITOR_ID);
        if (!visitorId) {
            visitorId = generateVisitorId();
            localStorage.setItem(STORAGE_KEYS.VISITOR_ID, visitorId);
            localStorage.setItem(STORAGE_KEYS.FIRST_VISIT, now.toISOString());
            localStorage.setItem(STORAGE_KEYS.VISIT_COUNT, '1');
        }

        // Update last visit
        const lastVisit = localStorage.getItem(STORAGE_KEYS.LAST_VISIT);
        localStorage.setItem(STORAGE_KEYS.LAST_VISIT, now.toISOString());

        // Update visit count (only if more than 30 minutes since last visit)
        const thirtyMinutes = 30 * 60 * 1000;
        if (lastVisit) {
            const lastVisitTime = new Date(lastVisit);
            const timeDiff = now - lastVisitTime;
            
            if (timeDiff > thirtyMinutes) {
                const visitCount = parseInt(localStorage.getItem(STORAGE_KEYS.VISIT_COUNT) || '0');
                localStorage.setItem(STORAGE_KEYS.VISIT_COUNT, (visitCount + 1).toString());
            }
        }

        // Track daily visits
        let dailyVisits = JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_VISITS) || '{}');
        dailyVisits[today] = (dailyVisits[today] || 0) + 1;
        
        // Keep only last 60 days of daily data
        const daysToKeep = Object.keys(dailyVisits).sort().slice(-60);
        dailyVisits = daysToKeep.reduce((acc, day) => {
            acc[day] = dailyVisits[day];
            return acc;
        }, {});
        localStorage.setItem(STORAGE_KEYS.DAILY_VISITS, JSON.stringify(dailyVisits));

        // Track monthly visits
        let monthlyVisits = JSON.parse(localStorage.getItem(STORAGE_KEYS.MONTHLY_VISITS) || '{}');
        monthlyVisits[currentMonth] = (monthlyVisits[currentMonth] || 0) + 1;
        
        // Keep only last 12 months of monthly data
        const monthsToKeep = Object.keys(monthlyVisits).sort().slice(-12);
        monthlyVisits = monthsToKeep.reduce((acc, month) => {
            acc[month] = monthlyVisits[month];
            return acc;
        }, {});
        localStorage.setItem(STORAGE_KEYS.MONTHLY_VISITS, JSON.stringify(monthlyVisits));

        return {
            visitorId,
            isNewVisitor: !lastVisit || (now - new Date(lastVisit)) > thirtyMinutes,
            visitCount: parseInt(localStorage.getItem(STORAGE_KEYS.VISIT_COUNT) || '1')
        };
    }

    /**
     * Get analytics data for display
     */
    function getAnalyticsData() {
        const today = getTodayString();
        const currentMonth = getMonthString();
        
        // Get yesterday's date
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toISOString().split('T')[0];
        
        // Get last month string
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const lastMonthString = lastMonth.toISOString().substring(0, 7);

        const dailyVisits = JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_VISITS) || '{}');
        const monthlyVisits = JSON.parse(localStorage.getItem(STORAGE_KEYS.MONTHLY_VISITS) || '{}');

        return {
            todayVisitors: dailyVisits[today] || 0,
            yesterdayVisitors: dailyVisits[yesterdayString] || 0,
            monthVisitors: monthlyVisits[currentMonth] || 0,
            lastMonthVisitors: monthlyVisits[lastMonthString] || 0,
            totalVisits: parseInt(localStorage.getItem(STORAGE_KEYS.VISIT_COUNT) || '0'),
            firstVisit: localStorage.getItem(STORAGE_KEYS.FIRST_VISIT),
            lastVisit: localStorage.getItem(STORAGE_KEYS.LAST_VISIT)
        };
    }

    /**
     * Check if visitor is new (based on first visit being today)
     */
    function isNewVisitor() {
        const firstVisit = localStorage.getItem(STORAGE_KEYS.FIRST_VISIT);
        if (!firstVisit) return true;
        
        const firstVisitDate = new Date(firstVisit).toISOString().split('T')[0];
        const today = getTodayString();
        return firstVisitDate === today;
    }

    // Track the visit
    const visitInfo = trackVisit();

    // Export functions to global scope for use in other scripts
    window.AnalyticsTracker = {
        getAnalyticsData,
        isNewVisitor,
        getTodayString,
        getMonthString,
        visitInfo
    };

})();
