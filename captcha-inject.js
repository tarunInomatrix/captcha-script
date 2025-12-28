(function () {
    const currentScript = document.currentScript;

    // 1. Read configuration
    const apiKey = currentScript.getAttribute('data-api-key');
    const userEmail = currentScript.getAttribute('data-email');
    const parentContainerId = 'botbuster-container';
    const loadedActionId = currentScript.getAttribute('data-action-id') || null;
    const loadedEmailElement = currentScript.getAttribute('data-email-element') || null;
    const loadedWebsiteUrl = currentScript.getAttribute('data-web-url') || null;
    
    // activeEmail stores the email that the SDK was last initialized with
    let activeEmail = userEmail; 

    console.log('[Botbuster Debug] Script started.', { apiKey, loadedEmailElement });

    // 2. Setup Iframe
    const iframe = document.createElement('iframe');
    iframe.id = 'botbuster-iframe';
    // ... styling same as before ...
    iframe.src = 'https://dev.botbuster.io/test'; 
    iframe.style.width = '100%';
    iframe.style.height = '700px';
    iframe.style.border = '1px solid #ccc';
    iframe.style.borderRadius = '8px';
    iframe.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    iframe.style.marginTop = '20px';

    let container = document.getElementById(parentContainerId);
    if (!container) {
        container = document.createElement('div');
        container.id = parentContainerId;
        document.body.appendChild(container); // Fallback if React container missing
    }
    container.appendChild(iframe);

    // 3. Utility Functions
    function hasEmailOption(mfa) {
        if (!Array.isArray(mfa)) return false;
        return mfa.some(obj => {
            if (!obj || typeof obj !== 'object') return false;
            // Handle both structure types if necessary
            if (obj.email === true) return true; 
            if (typeof obj.options === 'string' && obj.options.toLowerCase() === 'email') return true;
             if (Array.isArray(obj.options) && obj.options.some(opt => String(opt).toLowerCase() === 'email')) return true;
            return false;
        });
    }

    function normalizeToWWW(input) {
        if (!input || typeof input !== 'string') return null;
        let working = input.trim();
        if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(working)) {
            working = 'https://' + working;
        }
        try {
            const url = new URL(working);
            let host = url.hostname;
            if (!host.startsWith('www.')) host = 'www.' + host;
            return host + '/';
        } catch (e) {
            return input; // Fallback
        }
    }

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    // Helper to check if a target matches our ID or Selector
    function isTargetEmailInput(target) {
        if (!target || target.tagName !== 'INPUT') return false;
        if (loadedEmailElement) {
            // Check By ID
            if (target.id === loadedEmailElement) return true;
            // Check By Selector (catch errors if selector is invalid)
            try { if (target.matches(loadedEmailElement)) return true; } catch(e) {}
        }
        return false;
    }

    // 4. Main Init Function
    async function init(emailOverride = null) {
        if (emailOverride !== null) activeEmail = emailOverride;
        const finalEmail = activeEmail;
        
        if (!finalEmail || finalEmail.length < 6 || !finalEmail.includes('@')) {
             console.log('[Botbuster] Skipping init: Email invalid/short.');
             return;
        }

        console.log('[Botbuster] Initializing SDK for:', finalEmail);

        try {
            const response = await fetch('https://5znp405k6i.execute-api.eu-north-1.amazonaws.com/dev/initSDK', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    apiKey: apiKey,
                    loadedCaptchaUrl: loadedWebsiteUrl,
                    email: finalEmail,
                    actionId: loadedActionId,
                    emailElement: loadedEmailElement,
                }),
            });

            const data = await response.json();

            if (data.code === "CONFIG_LOADED") {
                console.log('✅ SDK Config Loaded.');
                iframe.src = `https://dev.botbuster.io/session_id=QC-12345&skin_type=${data.captcha_uid}&email=${finalEmail}&mfa=${hasEmailOption(data?.config?.mfa)}&website_url=${normalizeToWWW(loadedWebsiteUrl)}&new_user=${data?.config?.user_activationstatus}`;
                
                iframe.onload = () => {
                     iframe.contentWindow.postMessage(
                        { type: "BOTBUSTER_INIT", url: loadedWebsiteUrl },
                        "https://dev.botbuster.io"
                    );
                };
            }
        } catch (error) {
            console.error('❌ SDK Init Failed:', error);
        }
    }

    // 5. Robust Event Handling (Delegation)
    if (loadedEmailElement) {
        console.log(`[Botbuster] Listening for updates on: ${loadedEmailElement}`);

        const checkAndInit = (emailVal) => {
            const newEmail = emailVal ? emailVal.trim() : '';
            if (newEmail && newEmail.includes('@') && newEmail !== activeEmail && newEmail.length > 5) {
                console.log(`[Botbuster] Email changed to ${newEmail}. Reloading...`);
                init(newEmail);
            }
        };

        const debouncedHandler = debounce((e) => checkAndInit(e.target.value), 800);

        // USE DOCUMENT LISTENER (Bubbling)
        // This works even if React deletes the old input and adds a new one.
        document.addEventListener('input', (e) => {
            if (isTargetEmailInput(e.target)) {
                debouncedHandler(e);
            }
        });

        // USE FOCUSOUT instead of BLUR (Blur doesn't bubble, Focusout does)
        document.addEventListener('focusout', (e) => {
            if (isTargetEmailInput(e.target)) {
                checkAndInit(e.target.value);
            }
        });
    }

    // 6. Initial Load
    init();

})();
