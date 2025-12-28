(function () {
    const currentScript = document.currentScript;
    const apiKey = currentScript.getAttribute('data-api-key');
    let activeEmail = currentScript.getAttribute('data-email');
    const loadedActionId = currentScript.getAttribute('data-action-id');
    // Ensure this matches your React Input ID!
    const loadedEmailElement = currentScript.getAttribute('data-email-element'); 
    const loadedWebsiteUrl = currentScript.getAttribute('data-web-url');

    console.log('[Botbuster] Started. Watching ID:', loadedEmailElement);

    // --- Iframe Setup ---
    const parentContainerId = 'botbuster-container';
    let container = document.getElementById(parentContainerId);
    if (!container) {
        container = document.createElement('div');
        container.id = parentContainerId;
        document.body.appendChild(container);
    }
    const iframe = document.createElement('iframe');
    iframe.id = 'botbuster-iframe';
    iframe.style.cssText = 'width: 100%; height: 700px; border: none; margin-top: 20px;';
    container.appendChild(iframe);

    // --- Init Function ---
    async function initSDK(email) {
        if (!email || email === activeEmail || email.length < 5 || !email.includes('@')) return;
        
        console.log(`[Botbuster] Reloading for: ${email}`);
        activeEmail = email; // Update active state

        // Fetch Config
        try {
            const res = await fetch('https://5znp405k6i.execute-api.eu-north-1.amazonaws.com/dev/initSDK', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    apiKey, email, actionId: loadedActionId,
                    emailElement: loadedEmailElement, loadedCaptchaUrl: loadedWebsiteUrl
                })
            });
            const data = await res.json();
            if (data.code === "CONFIG_LOADED") {
                // Update Iframe Source
                iframe.src = `https://dev.botbuster.io/session_id=QC-12345&email=${email}&website_url=${loadedWebsiteUrl}&skin_type=${data.captcha_uid}`;
            }
        } catch (e) {
            console.error('[Botbuster] Init Failed:', e);
        }
    }

    // --- ROBUST EVENT LISTENER (The Fix) ---
    if (loadedEmailElement) {
        let timer;
        
        // Listen to 'input' on document (captures typing immediately)
        document.addEventListener('input', (e) => {
            const target = e.target;
            
            // Check if the event came from our target ID
            if (target && target.id === loadedEmailElement) {
                const val = target.value.trim();
                
                // Debounce: Wait 800ms after last keystroke
                clearTimeout(timer);
                timer = setTimeout(() => {
                    initSDK(val);
                }, 800);
            }
        }, true); // 'true' uses capture phase for better React compatibility
    }

    // Initial Load
    initSDK(activeEmail);
})();
