(function () {
    const currentScript = document.currentScript;
    const apiKey = currentScript.getAttribute('data-api-key');
    const initialEmail = currentScript.getAttribute('data-email');
    const loadedActionId = currentScript.getAttribute('data-action-id');
    const loadedEmailElement = currentScript.getAttribute('data-email-element'); 
    const loadedWebsiteUrl = currentScript.getAttribute('data-web-url');

    let currentLoadedEmail = null; // Tracks what is currently inside the iframe

    console.log('[Botbuster] Script started. Initial email:', initialEmail);

    // --- Iframe Setup ---
    const parentContainerId = 'botbuster-container';
    let container = document.getElementById(parentContainerId);
    if (!container) {
        container = document.createElement('div');
        container.id = parentContainerId;
        document.body.appendChild(container);
    }
    
    // Clear container to prevent duplicates if react re-runs script
    container.innerHTML = ''; 

    const iframe = document.createElement('iframe');
    iframe.id = 'botbuster-iframe';
    iframe.style.cssText = 'width: 100%; height: 700px; border: none; margin-top: 20px;';
    iframe.src = 'about:blank'; // Default
    container.appendChild(iframe);

    // --- Init Function ---
    async function initSDK(email) {
        // 1. Validation
        if (!email || email.length < 5 || !email.includes('@')) {
            console.log('[Botbuster] Email invalid/empty. Skipping.');
            return;
        }

        // 2. Prevent Duplicate Loads
        if (email === currentLoadedEmail) {
            console.log('[Botbuster] Email matches current iframe. Skipping reload.');
            return; 
        }

        console.log(`[Botbuster] Loading SDK for: ${email}`);

        try {
            const res = await fetch('https://5znp405k6i.execute-api.eu-north-1.amazonaws.com/dev/initSDK', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    apiKey, 
                    email, 
                    actionId: loadedActionId,
                    emailElement: loadedEmailElement, 
                    loadedCaptchaUrl: loadedWebsiteUrl
                })
            });
            const data = await res.json();
            
            if (data.code === "CONFIG_LOADED") {
                // 3. Update Iframe & State
                const src = `https://dev.botbuster.io/session_id=QC-12345&email=${email}&website_url=${loadedWebsiteUrl}&skin_type=${data.captcha_uid}`;
                iframe.src = src;
                currentLoadedEmail = email; // Mark as loaded
                console.log('[Botbuster] Iframe updated.');
            } else {
                console.warn('[Botbuster] Config load failed:', data);
            }
        } catch (e) {
            console.error('[Botbuster] Network/Init Error:', e);
        }
    }

    // --- Event Delegation (React Support) ---
    if (loadedEmailElement) {
        let timer;
        const handleInput = (e) => {
            const target = e.target;
            // Check ID
            if (target && target.id === loadedEmailElement) {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    initSDK(target.value.trim());
                }, 800);
            }
        };

        // Capture phase to catch events early
        document.addEventListener('input', handleInput, true);
        document.addEventListener('change', handleInput, true); 
    }

    // --- Trigger First Load ---
    initSDK(initialEmail); // This will now work!

})();
