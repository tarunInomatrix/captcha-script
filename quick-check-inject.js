(function () {
    const currentScript = document.currentScript;
    const apiKey = currentScript.getAttribute('data-api-key');
    const initialEmail = currentScript.getAttribute('data-email'); // Initial value from React
    const loadedActionId = currentScript.getAttribute('data-action-id');
    const loadedEmailElement = currentScript.getAttribute('data-email-element'); // Config ID (might be wrong)
    const loadedWebsiteUrl = currentScript.getAttribute('data-web-url');

    let currentLoadedEmail = null; 

    // --- Iframe Setup ---
    const parentContainerId = 'botbuster-container';
    let container = document.getElementById(parentContainerId);
    if (!container) {
        container = document.createElement('div');
        container.id = parentContainerId;
        document.body.appendChild(container); // Fallback
    }
    container.innerHTML = ''; // Start clean
    const iframe = document.createElement('iframe');
    iframe.id = 'botbuster-iframe';
    iframe.style.cssText = 'width: 100%; height: 700px; border: none; margin-top: 20px;';
    iframe.src = 'about:blank';
    // Note: We don't append to container yet to prevent empty white space on error

    // --- Init Function ---
    async function initSDK(email) {
        // Validation: Must be valid email string
        if (!email || email.length < 5 || !email.includes('@')) return;
        
        // Efficiency: Don't reload if it's the same email
        if (email === currentLoadedEmail) return; 

        console.log(`[Botbuster] Adapting: Detected email change to "${email}"`);

        try {
            const res = await fetch('https://5znp405k6i.execute-api.eu-north-1.amazonaws.com/dev/initSDK', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    apiKey, email, actionId: loadedActionId,
                    emailElement: loadedEmailElement, loadedCaptchaUrl: loadedWebsiteUrl
                })
            });

            // CHECK: If server returns 500 or any non-200 error, abort injection
            if (!res.ok) {
                console.error(`[Botbuster] Server Error: ${res.status}`);
                return;
            }

            const data = await res.json();
            
            if (data.code === "CONFIG_LOADED") {
                const src = `https://dev.botbuster.io/session_id=QC-12345&email=${initialEmail}&website_url=${loadedWebsiteUrl}&skin_type=${data.captcha_uid}&mfa=${hasEmailOption(data?.config?.mfa)}&user_activationstatus=${data?.config?.user_activationstatus}`;
                
                // Only inject/show the iframe if the config loaded successfully
                iframe.src = src;
                if (!document.getElementById('botbuster-iframe')) {
                    container.appendChild(iframe);
                }
                
                currentLoadedEmail = email;
            }
        } catch (e) {
            console.error('[Botbuster] Init Failed:', e);
        }
    }

    // --- MFA function -----
      function hasEmailOption(mfa) {
        if (!Array.isArray(mfa)) return false;

        return mfa.some(obj => {
            if (!obj || typeof obj !== 'object') return false;

            // 1) options as array: ["email", "text"]
            if (Array.isArray(obj.options)) {
                if (obj.options.some(opt => String(opt).toLowerCase() === 'email')) return true;
            }

            // 2) options as single string: "email"
            if (typeof obj.options === 'string' && obj.options.toLowerCase() === 'email') return true;

            // 3) explicit boolean property: email: true
            if (obj.email === true) return true;

            return false;
        });
    }

    // --- ADAPTIVE EVENT LISTENER ---
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
            // Debounce 800ms
            timer = setTimeout(() => {
                initSDK(target.value.trim());
            }, 800);
        }
    };

    document.addEventListener('input', handleInput, true);
    document.addEventListener('change', handleInput, true);

    // Initial Load
    if (initialEmail) {
        initSDK(initialEmail);
    }
})();
