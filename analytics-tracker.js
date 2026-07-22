/**
 * Hardened client-side analytics.
 * Reality check: this is per-browser local telemetry, not server-side unique visitors.
 */
(function() {
    'use strict';

    const STORAGE_KEYS = {
        VISITOR_ID: 'rla_visitor_id',
        FIRST_VISIT: 'rla_first_visit',
        LAST_VISIT: 'rla_last_visit',
        VISIT_COUNT: 'rla_visit_count',
        DAILY_VISITS: 'rla_daily_visits',
        MONTHLY_VISITS: 'rla_monthly_visits'
    };

    const LEGACY_KEYS = {
        VISITOR_ID: 'visitor_id',
        FIRST_VISIT: 'first_visit',
        LAST_VISIT: 'last_visit',
        VISIT_COUNT: 'visit_count',
        DAILY_VISITS: 'daily_visits',
        MONTHLY_VISITS: 'monthly_visits'
    };

    const memoryStore = new Map();

    function storageAvailable() {
        try {
            const testKey = '__rla_storage_test__';
            localStorage.setItem(testKey, '1');
            localStorage.removeItem(testKey);
            return true;
        } catch (_) {
            return false;
        }
    }

    const hasStorage = storageAvailable();

    function getItem(key) {
        try { return hasStorage ? localStorage.getItem(key) : (memoryStore.get(key) || null); }
        catch (_) { return null; }
    }

    function setItem(key, value) {
        try {
            if (hasStorage) localStorage.setItem(key, value);
            else memoryStore.set(key, value);
        } catch (_) { /* ignore quota/private-mode failures */ }
    }

    function migrateLegacyKeys() {
        Object.keys(STORAGE_KEYS).forEach(name => {
            if (!getItem(STORAGE_KEYS[name])) {
                const legacyValue = getItem(LEGACY_KEYS[name]);
                if (legacyValue !== null) setItem(STORAGE_KEYS[name], legacyValue);
            }
        });
    }

    function parseStoredObject(key) {
        const raw = getItem(key);
        if (!raw) return {};
        try {
            const parsed = JSON.parse(raw);
            return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
        } catch (_) {
            setItem(key, '{}'); // repair poisoned/corrupt localStorage
            return {};
        }
    }

    function toInteger(value, fallback = 0) {
        const parsed = Number.parseInt(value, 10);
        return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : fallback;
    }

    function generateVisitorId() {
        if (crypto && typeof crypto.randomUUID === 'function') {
            return `VIS-${crypto.randomUUID().toUpperCase()}`;
        }
        const bytes = new Uint8Array(16);
        if (crypto && typeof crypto.getRandomValues === 'function') {
            crypto.getRandomValues(bytes);
            return 'VIS-' + Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
        }
        return 'VIS-' + Date.now() + '-' + Math.random().toString(36).slice(2, 14).toUpperCase();
    }

    function localDateString(date = new Date()) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    function localMonthString(date = new Date()) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        return `${y}-${m}`;
    }

    function keepLastKeys(object, count) {
        return Object.keys(object).sort().slice(-count).reduce((acc, key) => {
            const value = toInteger(object[key], 0);
            if (value > 0) acc[key] = value;
            return acc;
        }, {});
    }

    function trackVisit() {
        migrateLegacyKeys();
        const now = new Date();
        const today = localDateString(now);
        const currentMonth = localMonthString(now);
        const thirtyMinutes = 30 * 60 * 1000;

        let visitorId = getItem(STORAGE_KEYS.VISITOR_ID);
        if (!visitorId || !/^VIS-[A-Z0-9-]{8,80}$/.test(visitorId)) {
            visitorId = generateVisitorId();
            setItem(STORAGE_KEYS.VISITOR_ID, visitorId);
            setItem(STORAGE_KEYS.FIRST_VISIT, now.toISOString());
            setItem(STORAGE_KEYS.VISIT_COUNT, '0');
        }

        const lastVisitRaw = getItem(STORAGE_KEYS.LAST_VISIT);
        const lastVisit = lastVisitRaw ? new Date(lastVisitRaw) : null;
        const isNewSession = !lastVisit || Number.isNaN(lastVisit.getTime()) || (now - lastVisit) > thirtyMinutes;

        if (isNewSession) {
            const visitCount = toInteger(getItem(STORAGE_KEYS.VISIT_COUNT), 0) + 1;
            setItem(STORAGE_KEYS.VISIT_COUNT, String(visitCount));
        }
        setItem(STORAGE_KEYS.LAST_VISIT, now.toISOString());

        let dailyVisits = parseStoredObject(STORAGE_KEYS.DAILY_VISITS);
        dailyVisits[today] = toInteger(dailyVisits[today], 0) + 1;
        dailyVisits = keepLastKeys(dailyVisits, 60);
        setItem(STORAGE_KEYS.DAILY_VISITS, JSON.stringify(dailyVisits));

        let monthlyVisits = parseStoredObject(STORAGE_KEYS.MONTHLY_VISITS);
        monthlyVisits[currentMonth] = toInteger(monthlyVisits[currentMonth], 0) + 1;
        monthlyVisits = keepLastKeys(monthlyVisits, 12);
        setItem(STORAGE_KEYS.MONTHLY_VISITS, JSON.stringify(monthlyVisits));

        return {
            visitorId,
            isNewVisitor: isNewSession,
            visitCount: toInteger(getItem(STORAGE_KEYS.VISIT_COUNT), 0)
        };
    }

    function getAnalyticsData() {
        const today = localDateString();
        const currentMonth = localMonthString();
        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const yesterday = localDateString(yesterdayDate);
        const lastMonthDate = new Date();
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
        const lastMonth = localMonthString(lastMonthDate);
        const dailyVisits = parseStoredObject(STORAGE_KEYS.DAILY_VISITS);
        const monthlyVisits = parseStoredObject(STORAGE_KEYS.MONTHLY_VISITS);

        return {
            todayVisitors: toInteger(dailyVisits[today], 0),
            yesterdayVisitors: toInteger(dailyVisits[yesterday], 0),
            monthVisitors: toInteger(monthlyVisits[currentMonth], 0),
            lastMonthVisitors: toInteger(monthlyVisits[lastMonth], 0),
            totalVisits: toInteger(getItem(STORAGE_KEYS.VISIT_COUNT), 0),
            firstVisit: getItem(STORAGE_KEYS.FIRST_VISIT),
            lastVisit: getItem(STORAGE_KEYS.LAST_VISIT)
        };
    }

    function isNewVisitor() {
        const firstVisit = getItem(STORAGE_KEYS.FIRST_VISIT);
        if (!firstVisit) return true;
        const parsed = new Date(firstVisit);
        if (Number.isNaN(parsed.getTime())) return true;
        return localDateString(parsed) === localDateString();
    }

    const visitInfo = trackVisit();
    window.AnalyticsTracker = {
        getAnalyticsData,
        isNewVisitor,
        getTodayString: localDateString,
        getMonthString: localMonthString,
        visitInfo
    };
})();
