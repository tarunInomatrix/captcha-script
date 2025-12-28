(function () {
    const currentScript = document.currentScript;
    const apiKey = currentScript.getAttribute('data-api-key');
    const initialEmail = currentScript.getAttribute('data-email');
    const loadedActionId = currentScript.getAttribute('data-action-id');
    const loadedEmailElement = currentScript.getAttribute('data-email-element'); 
    const loadedWebsiteUrl = currentScript.getAttribute('data-web-url');

    let currentLoadedEmail = null; 

    console.log(`[Botbuster] Configured to watch Input ID: "${loadedEmailElement}"`);

    // --- Iframe Setup (Same as before) ---
    const parentContainerId = 'botbuster-container';
    let container = document.getElementById(parentContainerId);
    if (!container) {
        container = document.createElement('div');
        container.id = parentContainerId;
        document.body.appendChild(container);
    }
    container.innerHTML = ''; 
    const iframe = document.createElement('iframe');
    iframe.id = 'botbuster-iframe';
    iframe.style.cssText = 'width: 100%; height: 700px; border: none; margin-top: 20px;';
    iframe.src = 'about:blank'; 
    container.appendChild(iframe);

    // --- Init Function ---
    async function initSDK(email) {
        if (!email || email.length < 5 || !email.includes('@')) return;
        if (email === currentLoadedEmail) return; 

        console.log(`[Botbuster] ✅ Loading SDK for: ${email}`);
        
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
                iframe.src = `https://dev.botbuster.io/session_id=QC-12345&email=${email}&website_url=${loadedWebsiteUrl}&skin_type=${data.captcha_uid}`;
                currentLoadedEmail = email;
            }
        } catch (e) {
            console.error('[Botbuster] Init Failed:', e);
        }
    }

    // --- DEBUG Event Listener ---
    let timer;
    document.addEventListener('input', (e) => {
        const target = e.target;
        if (target.tagName !== 'INPUT') return;

        // DEBUG LOGGING
        if (target.type === 'email' || target.name === 'email' || target.id.includes('email')) {
             if (target.id !== loadedEmailElement) {
                 console.warn(`[Botbuster] ⚠️ Saw input in "#${target.id}" but configured to only watch "#${loadedEmailElement}". Please update data-email-element!`);
             }
        }

        if (target.id === loadedEmailElement) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                const val = target.value.trim();
                console.log(`[Botbuster] Detected valid source change: ${val}`);
                initSDK(val);
            }, 800);
        }
    }, true);

    initSDK(initialEmail);

})();
