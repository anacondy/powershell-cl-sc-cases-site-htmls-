/** Hardened analytics page UI glue. */
(function() {
    'use strict';

    function qs(id) { return document.getElementById(id); }
    function setText(id, value) { const el = qs(id); if (el) el.textContent = value; }
    function safeGet(key) { try { return localStorage.getItem(key); } catch (_) { return null; } }
    function safeSet(key, value) { try { localStorage.setItem(key, value); } catch (_) {} }

    function displayDeviceInfo() {
        const deviceInfo = window.DeviceDetector ? window.DeviceDetector.deviceInfo : null;
        setText('device-icon', deviceInfo ? deviceInfo.deviceIcon : '🖥️');
        setText('device-name', deviceInfo ? deviceInfo.deviceName : 'Desktop');
    }

    function loadAnalytics() {
        const analytics = window.AnalyticsTracker ? window.AnalyticsTracker.getAnalyticsData() : null;
        if (!analytics) {
            setText('today-visitors', '1');
            setText('yesterday-visitors', '0');
            setText('month-visitors', '1');
            setText('last-month-visitors', '0');
            setText('new-visitors', '1');
            return;
        }
        setText('today-visitors', String(analytics.todayVisitors));
        setText('yesterday-visitors', String(analytics.yesterdayVisitors));
        setText('month-visitors', String(analytics.monthVisitors));
        setText('last-month-visitors', String(analytics.lastMonthVisitors));
        setText('new-visitors', window.AnalyticsTracker.isNewVisitor() ? '1 (You!)' : '0');

        const lastMonthElement = qs('last-month-visitors');
        const lastMonthCard = lastMonthElement && lastMonthElement.closest('.metric-card');
        if (lastMonthCard && analytics.lastMonthVisitors === 0) {
            lastMonthCard.style.opacity = '0.7';
            const label = lastMonthCard.querySelector('.metric-label');
            if (label) label.textContent = 'Last Month (No data yet)';
        }
    }

    function bindRating() {
        const stars = Array.from(document.querySelectorAll('.star'));
        const container = qs('stars-container');
        const ratingMessage = qs('rating-message');
        if (!stars.length || !container || !ratingMessage) return;
        let currentRating = Number.parseInt(safeGet('user_rating') || '0', 10) || 0;

        function highlightStars(rating) {
            stars.forEach((star, index) => star.classList.toggle('active', index < rating));
        }

        stars.forEach(star => {
            star.addEventListener('mouseenter', function() {
                highlightStars(Number.parseInt(this.dataset.rating || '0', 10) || 0);
            });
            star.addEventListener('click', function() {
                currentRating = Number.parseInt(this.dataset.rating || '0', 10) || 0;
                if (currentRating < 1 || currentRating > 5) return;
                highlightStars(currentRating);
                const messages = [
                    'Thank you for your feedback! 💙',
                    'We appreciate your input! 💙',
                    'Thanks for rating us! 💙',
                    'Your feedback matters! 💙',
                    'Wonderful! Thank you! 💙'
                ];
                ratingMessage.textContent = messages[currentRating - 1];
                safeSet('user_rating', String(currentRating));
                safeSet('rating_date', new Date().toISOString());
            });
        });

        container.addEventListener('mouseleave', () => highlightStars(currentRating));
        if (currentRating) {
            highlightStars(currentRating);
            ratingMessage.textContent = 'Your previous rating';
        }
    }

    displayDeviceInfo();
    loadAnalytics();
    bindRating();
})();
