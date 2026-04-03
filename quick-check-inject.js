(function () {
    const currentScript = document.currentScript;
    const apiKey = currentScript.getAttribute('data-api-key');
    const initialEmail = currentScript.getAttribute('data-email');
    const loadedActionId = currentScript.getAttribute('data-action-id');
    const loadedEmailElement = currentScript.getAttribute('data-email-element');
    const loadedWebsiteUrl = currentScript.getAttribute('data-web-url');

    let currentLoadedEmail = null;

    // --- Container Setup (No iframe created here) ---
    const parentContainerId = 'botbuster-container';
    let container = document.getElementById(parentContainerId);
    if (!container) {
        container = document.createElement('div');
        container.id = parentContainerId;
        document.body.appendChild(container);
    }

    const injectIframe = (src) => {
        container.innerHTML = '';
        const iframe = document.createElement('iframe');
        iframe.id = 'botbuster-iframe';
        iframe.style.cssText = 'width: 100%; height: 700px; border: none; margin-top: 20px;';
        iframe.src = src;
        container.appendChild(iframe);
    };

    // --- Init Function ---
    async function initSDK(email) {
        if (email === currentLoadedEmail) return;

        if (!email || email.length < 5 || !email.includes('@')) {
            injectIframe('https://dev.botbuster.io/invalidEmail');
            currentLoadedEmail = email;
            return;
        }

        try {
            const res = await fetch('https://5znp405k6i.execute-api.eu-north-1.amazonaws.com/dev/initSDK', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    apiKey, email, actionId: loadedActionId,
                    emailElement: loadedEmailElement, loadedCaptchaUrl: loadedWebsiteUrl
                })
            });

            // 1. If API fails (500, 404, etc.), clear any old iframe and RETURN
            if (!res.ok) {
                console.error(`[Botbuster] API Error ${res.status}. Aborting injection.`);
                container.innerHTML = '';
                return;
            }

            const data = await res.json();

            // 2. Only if the code is CONFIG_LOADED do we build the iframe
            if (data.code === "CONFIG_LOADED") {
                const src = `https://dev.botbuster.io/session_id=QC-12345&email=${encodeURIComponent(email)}&website_url=${loadedWebsiteUrl}&skin_type=${data.captcha_uid}&mfa=${hasEmailOption(data?.config?.mfa)}&user_activationstatus=${data?.config?.user_activationstatus}`;
                injectIframe(src);
                currentLoadedEmail = email;
            } else {
                // If response code is not successful, remove any existing iframe and return
                container.innerHTML = '';
                return;
            }
        } catch (e) {
            // 3. Handle network/CORS errors: clear and return
            console.error('[Botbuster] Network failure. Aborting injection.', e);
            container.innerHTML = '';
            return;
        }
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
