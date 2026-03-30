(function () {
    const currentScript = document.currentScript;
    const apiKey = currentScript.getAttribute('data-api-key');
    const initialEmail = currentScript.getAttribute('data-email'); 
    const loadedActionId = currentScript.getAttribute('data-action-id');
    const loadedEmailElement = currentScript.getAttribute('data-email-element'); 
    const loadedWebsiteUrl = currentScript.getAttribute('data-web-url');

    let currentLoadedEmail = null; 

    // Ensure container exists
    const parentContainerId = 'botbuster-container';
    let container = document.getElementById(parentContainerId);
    if (!container) {
        container = document.createElement('div');
        container.id = parentContainerId;
        document.body.appendChild(container); 
    }

    async function initSDK(email) {
        if (!email || email.length < 5 || !email.includes('@')) return;
        
        // Prevent unnecessary API calls if email hasn't actually changed
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

            if (!res.ok) {
                container.innerHTML = ''; 
                return; 
            }

            const data = await res.json();

            if (data.code === "CONFIG_LOADED") {
                const existingIframe = document.getElementById('botbuster-iframe');
                const newSrc = `https://dev.botbuster.io/session_id=QC-12345&email=${encodeURIComponent(email)}&website_url=${loadedWebsiteUrl}&skin_type=${data.captcha_uid}&mfa=${hasEmailOption(data?.config?.mfa)}&user_activationstatus=${data?.config?.user_activationstatus}`;

                if (existingIframe) {
                    // Update existing iframe SRC if it differs
                    if (existingIframe.src !== newSrc) {
                        existingIframe.src = newSrc;
                    }
                } else {
                    // Fresh injection
                    container.innerHTML = ''; 
                    const iframe = document.createElement('iframe');
                    iframe.id = 'botbuster-iframe';
                    iframe.style.cssText = 'width: 100%; height: 700px; border: none; margin-top: 20px;';
                    iframe.src = newSrc;
                    container.appendChild(iframe);
                }
                
                currentLoadedEmail = email;
            } else {
                container.innerHTML = '';
            }
        } catch (e) {
            container.innerHTML = ''; 
        }
    }

    function hasEmailOption(mfa) {
        if (!Array.isArray(mfa)) return false;
        return mfa.some(obj => {
            if (!obj || typeof obj !== 'object') return false;
            const options = Array.isArray(obj.options) ? obj.options : [obj.options];
            return options.some(opt => String(opt).toLowerCase() === 'email') || obj.email === true;
        });
    }

    // Listener for real-time sync
    let timer;
    const handleInput = (e) => {
        const target = e.target;
        const isEmailField = (loadedEmailElement && target.id === loadedEmailElement) || 
                             (target.id === 'email') || (target.type === 'email');

        if (isEmailField) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                initSDK(target.value.trim());
            }, 800); // Wait for user to pause typing
        }
    };

    document.addEventListener('input', handleInput, true);

    if (initialEmail) initSDK(initialEmail);
})(); 
