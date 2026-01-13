(function () {
    const currentScript = document.currentScript;
    console.log('[Botbuster] Script loaded via CDN/Injection');

    // 1. Read configuration
    const apiKey = currentScript.getAttribute('data-api-key');
    const userEmail = currentScript.getAttribute('data-email');
    const parentContainerId = 'botbuster-container';
    const loadedActionId = currentScript.getAttribute('data-action-id') || null;
    const loadedEmailElement = currentScript.getAttribute('data-email-element') || null;
    const loadedWebsiteUrl = currentScript.getAttribute('data-web-url') || null;

    let activeEmail = userEmail; 

    // 2. Setup Iframe
    const iframe = document.createElement('iframe');
    iframe.id = 'botbuster-iframe';
    iframe.style.width = '100%';
    iframe.style.height = '700px';
    iframe.style.border = '1px solid #ccc';
    iframe.style.borderRadius = '8px';
    iframe.style.marginTop = '20px';

    // Find or create container (React might have rendered it already)
    let container = document.getElementById(parentContainerId);
    if (!container) {
        console.warn(`[Botbuster] Container #${parentContainerId} not found. Creating fallback.`);
        container = document.createElement('div');
        container.id = parentContainerId;
        document.body.appendChild(container); // Append to body if not found
    }
    container.appendChild(iframe);

    // 3. Utilities
    function normalizeToWWW(input) { 
         if (!input) return null;
         // (Your existing normalization logic here if needed, keeping simple pass-through as per snippet)
         return input; 
    }
    
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

    // 4. Init Function
    async function init(emailOverride = null) {
        if (emailOverride !== null) activeEmail = emailOverride;
        const finalEmail = activeEmail;

        if (!finalEmail || finalEmail.length < 6 || !finalEmail.includes('@')) {
             return; // Silent return for invalid email
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
            // Use optional chaining for safety and calculate MFA status before interpolation
            const mfaStatus = hasEmailOption(data?.config?.mfa);
            console.log(mfaStatus, "hasemialoption");
            
            if (data.code === "CONFIG_LOADED") {        
                 // Updated to use data.captcha_uid from the API response
                 iframe.src = `https://dev.botbuster.io/session_id=${data.captcha_uid}&email=${finalEmail}&website_url=${loadedWebsiteUrl}&mfa=${mfaStatus}`;
                console.log(iframe.src, "iFrame Logic");
            }
        } catch (error) {
            console.error('[Botbuster] Init Error:', error);
        }
    }

    // 5. EVENT DELEGATION
    if (loadedEmailElement) {
        let debounceTimer;

        // Helper to check if the event target matches our selector
        const isTarget = (target) => {
            if (!target) return false;
            if (target.id === loadedEmailElement) return true;
            try { 
                if (target.matches(loadedEmailElement)) return true;
            } catch(e) {}
            return false;
        };

        const handleInput = (e) => {
            // 1. Check if the event came from our email input
            if (!isTarget(e.target)) return;

            const val = e.target.value.trim();

            // 2. Clear previous timer (Debounce)
            clearTimeout(debounceTimer);

            // 3. Set new timer
            debounceTimer = setTimeout(() => {
                if (val && val !== activeEmail && val.includes('@') && val.length > 5) {
                    console.log(`[Botbuster] Email change detected (Debounced): ${val}`);
                    init(val);
                }
            }, 800); // 800ms delay
        }

        // Use 'input' event to catch typing. Use 'true' for capture phase.
        document.addEventListener('input', handleInput, true); 
        
        // Also listen for 'change' as a backup
        document.addEventListener('change', handleInput, true);
    }

    // 6. Initial Load
    init();

})();
