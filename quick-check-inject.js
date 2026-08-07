(function () {
    const currentScript = document.currentScript;
    let apiKey = currentScript ? currentScript.getAttribute('data-api-key') : '';
    let initialEmail = currentScript ? currentScript.getAttribute('data-email') : '';
    let loadedActionId = currentScript ? currentScript.getAttribute('data-action-id') : '';
    let loadedEmailElement = currentScript ? currentScript.getAttribute('data-email-element') : '';
    let loadedWebsiteUrl = currentScript ? currentScript.getAttribute('data-web-url') : '';

    let currentLoadedEmail = null;
    let currentQCID = 'QC-12345';
    let currentSessionId = null;

    let removalTimer = null;
    let inactivityTimer = null;
    const INACTIVITY_LIMIT_MS = 10 * 60 * 1000; // 10 minutes

    // --- Container Setup ---
    const parentContainerId = 'botbuster-container';
    let container = document.getElementById(parentContainerId);
    if (!container) {
        container = document.createElement('div');
        container.id = parentContainerId;
        document.body.appendChild(container);
    }

    const getDeviceType = () => {
        const ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "tablet";
        if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return "phone";
        return "desktop";
    };

    const removeIframe = (reason = 'standard') => {
        const iframe = document.getElementById('botbuster-iframe');
        if (iframe) {
            console.log(`[Botbuster] Executing iframe removal. Reason: ${reason}`);
            iframe.remove();
        }
        if (inactivityTimer) {
            clearTimeout(inactivityTimer);
            inactivityTimer = null;
        }
    };

    const triggerSuccessCallback = () => {
        if (typeof window.onBotbusterSuccess === 'function') {
            console.log('[Botbuster] Triggering frontend onBotbusterSuccess callback.');
            window.onBotbusterSuccess();
            // Optional: reset after execution so it doesn't fire twice
            window.onBotbusterSuccess = null;
        } else {
            console.warn('[Botbuster] Captcha completed, but window.onBotbusterSuccess was not defined.');
        }
    };

    const scheduleRemoval = () => {
        if (removalTimer) return;
        console.log('[Botbuster] Submission detected. Removing iframe in 2 seconds...');
        removalTimer = setTimeout(() => {
            removeIframe('success_completion');
            removalTimer = null;
        }, 2000);
    };

    const resetInactivityTimer = () => {
        if (inactivityTimer) clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
            removeIframe('10_minutes_inactivity');
        }, INACTIVITY_LIMIT_MS);
    };

    const injectIframe = (src) => {
        const existingIframe = document.getElementById('botbuster-iframe');
        if (existingIframe && existingIframe.src === src) return;

        container.innerHTML = '';
        const iframe = document.createElement('iframe');
        iframe.id = 'botbuster-iframe';
        iframe.style.cssText = 'width: 100%; height: 700px; border: none; margin-top: 20px;';
        iframe.src = src;

        console.log('[Botbuster] Injecting iframe with URL:', src);

        iframe.addEventListener('load', () => {
            let detectedUrl = null;
            try {
                detectedUrl = iframe.contentWindow.location.href;
            } catch (err) {
                detectedUrl = iframe.src;
            }

            if (detectedUrl && (detectedUrl.includes('/qc-submitted') || detectedUrl.includes('BOTBUSTER_SUCCESS'))) {
                triggerSuccessCallback();
                scheduleRemoval();
            }
        });

        container.appendChild(iframe);
        resetInactivityTimer();
    };

    // --- Init Function Exposed Globally ---
    async function initSDK(email, sessionIdOverride = null, force = false) {
        let sessionChanged = false;

        // Refresh dynamic attributes from script element if modified by React
        const scriptElem = document.getElementById('botbuster-script');
        if (scriptElem) {
            apiKey = scriptElem.getAttribute('data-api-key') || apiKey;
            loadedActionId = scriptElem.getAttribute('data-action-id') || loadedActionId;
            loadedEmailElement = scriptElem.getAttribute('data-email-element') || loadedEmailElement;
            loadedWebsiteUrl = scriptElem.getAttribute('data-web-url') || loadedWebsiteUrl;
        }

        if (sessionIdOverride && sessionIdOverride !== currentSessionId) {
            if (!sessionIdOverride.startsWith('QC-')) {
                currentSessionId = sessionIdOverride;
                sessionChanged = true;
            }
        }

        if (!force && email === currentLoadedEmail && !sessionChanged) return;

        if (!email || email.length < 5 || !email.includes('@')) {
            injectIframe('https://dev.botbuster.io/invalidEmail');
            currentLoadedEmail = email;
            return;
        }

        const deviceType = getDeviceType();
        const session_id = currentSessionId || "";

        const src = `https://dev.botbuster.io/submit?actionId=${encodeURIComponent(loadedActionId || '')}&apiKey=${encodeURIComponent(apiKey || '')}&device_type=${encodeURIComponent(deviceType)}&email=${encodeURIComponent(email)}&emailElement=${encodeURIComponent(loadedEmailElement || '')}&loadedCaptchaUrl=${encodeURIComponent(loadedWebsiteUrl || '')}&session_id=${encodeURIComponent(session_id)}`;

        injectIframe(src);
        currentLoadedEmail = email;
    }

    // Expose initSDK globally so React can re-initialize if script already exists
    window.initBotbusterSDK = initSDK;

    // --- Message Listener for Iframe Updates ---
    window.addEventListener('message', (e) => {
        if (!e.origin.includes('botbuster.io')) return;
        resetInactivityTimer();

        const data = e.data;
        let messageString = '';

        if (typeof data === 'string') {
            messageString = data;
        } else if (data && typeof data === 'object') {
            try {
                messageString = JSON.stringify(data);
            } catch (err) {
                console.error('[Botbuster] Error stringifying message object:', err);
            }
        }

        console.log('[Botbuster] Received postMessage from iframe:', messageString);

        if (messageString.includes('BOTBUSTER_SUCCESS') || messageString.includes('/qc-submitted')) {
            console.log('[Botbuster] Detected SUCCESS state in postMessage.');
            triggerSuccessCallback();
            scheduleRemoval();
            return;
        }

        if (messageString.includes('email=')) {
            try {
                const searchStr = messageString.includes('?') 
                    ? messageString.split('?')[1] 
                    : messageString.replace(/^\//, '');

                const params = new URLSearchParams(searchStr);
                const newEmail = params.get('email');
                const newSessionId = params.get('session_id');

                if (newEmail && (newEmail !== currentLoadedEmail || (newSessionId && newSessionId !== currentSessionId))) {
                    initSDK(newEmail, newSessionId, true);
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
            resetInactivityTimer();
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
