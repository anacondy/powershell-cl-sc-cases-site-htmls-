/**
 * Hardened About page feedback/session helper.
 */
(function() {
    'use strict';

    const MAX_FEEDBACK_CHARS = 2000;
    const SUPPORT_EMAIL = 'anujmeena2025@gmail.com';

    function qs(id) { return document.getElementById(id); }

    function generateTraceId() {
        if (crypto && typeof crypto.randomUUID === 'function') return `TRC-${crypto.randomUUID().toUpperCase()}`;
        const bytes = new Uint8Array(12);
        if (crypto && typeof crypto.getRandomValues === 'function') {
            crypto.getRandomValues(bytes);
            return 'TRC-' + Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
        }
        return 'TRC-' + Date.now() + '-' + Math.random().toString(36).slice(2, 11).toUpperCase();
    }

    function setResult(message, isError) {
        const result = qs('feedback-result');
        if (!result) return;
        result.textContent = message;
        result.style.display = 'block';
        result.style.backgroundColor = isError ? '#ffebee' : '#e8f5e9';
        result.style.color = isError ? '#c62828' : '#2e7d32';
    }

    function formatDuration(start, end) {
        const durationSec = Math.max(0, Math.floor((end - start) / 1000));
        const hours = Math.floor(durationSec / 3600);
        const minutes = Math.floor((durationSec % 3600) / 60);
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
        if (minutes > 0) return `${minutes} min${minutes > 1 ? 's' : ''}`;
        return `${durationSec} sec`;
    }

    const sessionData = {
        traceId: generateTraceId(),
        loginTime: new Date(),
        device: window.DeviceDetector ? window.DeviceDetector.getDeviceSummary() : 'Unknown Device'
    };

    const traceEl = qs('trace-id');
    if (traceEl) traceEl.textContent = sessionData.traceId;

    const copyBtn = qs('copy-trace-id');
    const copyMessage = qs('copy-message');
    if (copyBtn && copyMessage) {
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(sessionData.traceId);
                copyBtn.textContent = '✓';
                copyMessage.textContent = 'Copied to clipboard!';
                copyMessage.style.display = 'block';
                setTimeout(() => {
                    copyBtn.textContent = '📋';
                    copyMessage.style.display = 'none';
                }, 2000);
            } catch (_) {
                copyMessage.textContent = 'Failed to copy. Please copy manually.';
                copyMessage.style.display = 'block';
            }
        });
    }

    const submitBtn = qs('submit-feedback-btn');
    const feedbackText = qs('feedback-text');
    if (submitBtn && feedbackText) {
        submitBtn.addEventListener('click', () => {
            const feedback = feedbackText.value.trim();
            if (!feedback) {
                setResult('Please enter your feedback before submitting.', true);
                return;
            }
            if (feedback.length > MAX_FEEDBACK_CHARS) {
                setResult(`Feedback is too long. Limit: ${MAX_FEEDBACK_CHARS} characters.`, true);
                return;
            }

            const currentTime = new Date();
            const sessionDetails = [
                `Trace ID - ${sessionData.traceId}`,
                'Session -',
                `LOGIN - ${sessionData.loginTime.toISOString()}`,
                `LOGOUT - ${currentTime.toISOString()}`,
                `Duration - ${formatDuration(sessionData.loginTime, currentTime)}`,
                `Device - ${sessionData.device}`,
                '',
                'Feedback:',
                feedback
            ].join('\n');

            const params = new URLSearchParams({
                subject: `Feedback from ${sessionData.traceId}`,
                body: sessionDetails
            });
            window.location.href = `mailto:${SUPPORT_EMAIL}?${params.toString()}`;
            setResult(`Opening your email client. Your trace ID: ${sessionData.traceId}. Please save this ID for reference.`, false);
            feedbackText.value = '';
        });
    }
})();
