(function () {
    const currentScript = document.currentScript;
    const apiKey = currentScript.getAttribute('data-api-key');
    const initialEmail = currentScript.getAttribute('data-email');
    const loadedActionId = currentScript.getAttribute('data-action-id');
    const loadedEmailElement = currentScript.getAttribute('data-email-element');
    const loadedWebsiteUrl = currentScript.getAttribute('data-web-url');

    let currentLoadedEmail = null; 

    // --- Container Setup ---
    const parentContainerId = 'botbuster-container';
    let container = document.getElementById(parentContainerId);
    if (!container) {
        container = document.createElement('div');
        container.id = parentContainerId;
        document.body.appendChild(container); 
    }

    // --- Init Function ---
    async function initSDK(email) {
        if (!email || email.length < 5 || !email.includes('@')) return;
        if (email === currentLoadedEmail) return; 

        try {
            const res = await fetch('https://5znp405k6i.execute-api.eu-north-1.amazonaws.com/dev/initSDK', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    apiKey, email, actionId: loadedActionId,
                    emailElement: loadedEmailElement, loadedCaptchaUrl: loadedWebsiteUrl
                })
            });

            // If 500 or any non-OK response, clear the iframe and exit
            if (!res.ok) {
                console.error(`[Botbuster] Error ${res.status}: Removing iframe.`);
                container.innerHTML = ''; 
                currentLoadedEmail = null; // Reset so it can try again if user fixes input
                return;
            }

            const data = await res.json();

            if (data.code === "CONFIG_LOADED") {
                container.innerHTML = ''; // Clear previous state

                const iframe = document.createElement('iframe');
                iframe.id = 'botbuster-iframe';
                iframe.style.cssText = 'width: 100%; height: 700px; border: none; margin-top: 20px;';
                
                const src = `https://dev.botbuster.io/session_id=QC-12345&email=${encodeURIComponent(email)}&website_url=${loadedWebsiteUrl}&skin_type=${data.captcha_uid}&mfa=${hasEmailOption(data?.config?.mfa)}&user_activationstatus=${data?.config?.user_activationstatus}`;
                
                iframe.src = src;
                container.appendChild(iframe);
                
                currentLoadedEmail = email;
            } else {
                // If code is not CONFIG_LOADED, treat as error/inactive
                container.innerHTML = '';
            }
        } catch (e) {
            console.error('[Botbuster] Network error: Removing iframe.', e);
            container.innerHTML = ''; // Remove iframe on network failure
            currentLoadedEmail = null;
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

    if (initialEmail) {
        initSDK(initialEmail);
    }
})();
