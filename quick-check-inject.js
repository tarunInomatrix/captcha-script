(function () {
    const currentScript = document.currentScript;
    const apiKey = currentScript.getAttribute('data-api-key');
    const initialEmail = currentScript.getAttribute('data-email');
    const loadedActionId = currentScript.getAttribute('data-action-id');
    const loadedEmailElement = currentScript.getAttribute('data-email-element');
    const loadedWebsiteUrl = currentScript.getAttribute('data-web-url');

    let currentLoadedEmail = null;
    let currentQCID = 'QC-12345';
    let currentSessionId = null;

    // --- Container Setup (No iframe created here) ---
    const parentContainerId = 'botbuster-container';
    let container = document.getElementById(parentContainerId);
    if (!container) {
        container = document.createElement('div');
        container.id = parentContainerId;
        document.body.appendChild(container);
    }

    const getDeviceType = () => {
        const ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return "tablet";
        }
        if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
            return "phone";
        }
        return "desktop";
    };

    const injectIframe = (src) => {
        const existingIframe = document.getElementById('botbuster-iframe');
        if (existingIframe && existingIframe.src === src) return;

        container.innerHTML = '';
        const iframe = document.createElement('iframe');
        iframe.id = 'botbuster-iframe';
        iframe.style.cssText = 'width: 100%; height: 700px; border: none; margin-top: 20px;';
        iframe.src = src;
        container.appendChild(iframe);
    };

    // --- Init Function ---
    async function initSDK(email, sessionIdOverride = null, force = false) {
        let sessionChanged = false;
        if (sessionIdOverride && sessionIdOverride !== currentSessionId) {
            // Prevent overriding a valid session_id with a QCID placeholder like QC-12345
            if (!sessionIdOverride.startsWith('QC-')) {
                currentSessionId = sessionIdOverride;
                sessionChanged = true;
            } else {
                console.warn('[Botbuster] Ignoring erroneous session_id override from iframe:', sessionIdOverride);
            }
        }
        if (!force && email === currentLoadedEmail && !sessionChanged) return;

        if (!email || email.length < 5 || !email.includes('@')) {
            injectIframe('https://dev.botbuster.io/invalidEmail');
            currentLoadedEmail = email;
            return;
        }

        const deviceType = getDeviceType();
        console.log("deviceType", deviceType);
        const session_id = currentSessionId || "";

        const src = `https://dev.botbuster.io/submit?actionId=${encodeURIComponent(loadedActionId || '')}&apiKey=${encodeURIComponent(apiKey || '')}&device_type=${encodeURIComponent(deviceType)}&email=${encodeURIComponent(email)}&emailElement=${encodeURIComponent(loadedEmailElement || '')}&loadedCaptchaUrl=${encodeURIComponent(loadedWebsiteUrl || '')}&session_id=${encodeURIComponent(session_id)}`;

        injectIframe(src);
        currentLoadedEmail = email;
    }

    // --- MFA function -----
    function hasEmailOption(mfa) {
        if (!Array.isArray(mfa)) return false;
        return mfa.some(obj => {
            if (!obj || typeof obj !== 'object') return false;
            if (Array.isArray(obj.options)) {
                if (obj.options.some(opt => String(opt).toLowerCase() === 'email')) return true;
            }
            if (typeof obj.options === 'string' && obj.options.toLowerCase() === 'email') return true;
            if (obj.email === true) return true;
            return false;
        });
    }

    // --- Message Listener for Iframe Updates ---
    window.addEventListener('message', (e) => {
        // Only accept messages from botbuster.io
        if (!e.origin.includes('botbuster.io')) return;

        const data = e.data;
        if (typeof data === 'string' && data.includes('email=')) {
            try {
                // Parse email from the message (which could be a URL or fragment)
                const params = new URLSearchParams(data.includes('?') ? data.split('?')[1] : data.replace(/^\//, ''));
                const newEmail = params.get('email');
                const newSessionId = params.get('session_id');

                if (newEmail && (newEmail !== currentLoadedEmail || (newSessionId && newSessionId !== currentSessionId))) {
                    console.log('[Botbuster] Received updated email/session_id from iframe:', { newEmail, newSessionId });
                    initSDK(newEmail, newSessionId, true); // Force update when triggered by message
                }
            } catch (err) {
                console.error('[Botbuster] Error parsing message data:', err);
            }
        }
    });

    // --- Event Listeners ---
    let timer;
    const handleInput = (e) => {
        const target = e.target;
        if (!target) return;

        const isEmailField = (loadedEmailElement && target.id === loadedEmailElement) ||
            (target.id === 'email') ||
            (target.type === 'email') ||
            (target.name === 'email');

        if (isEmailField) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                initSDK(target.value.trim());
            }, 800);
        }
    };

    document.addEventListener('input', handleInput, true);
    document.addEventListener('change', handleInput, true);

    // Initial check
    if (initialEmail) {
        initSDK(initialEmail);
    }
})();
