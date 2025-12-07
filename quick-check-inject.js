(function () {
    const currentScript = document.currentScript;

    // 1. Read configuration from script tag attributes
    const apiKey = currentScript.getAttribute('data-api-key');
    const userEmail = currentScript.getAttribute('data-email');
    const parentContainerId = 'botbuster-container';
    const loadedActionId = currentScript.getAttribute('data-action-id') || null;
    const loadedEmailElement = currentScript.getAttribute('data-email-element') || null;
    const loadedWebsiteUrl = currentScript.getAttribute('data-web-url') || null;
    // activeEmail stores the email that the SDK was last successfully initialized with
    let activeEmail = userEmail; 

    console.log('[Botbuster Debug] Script started.');
    console.log('[Botbuster Debug] Configuration:', {
        apiKey,
        userEmail,
        loadedActionId,
        loadedEmailElement,
        loadedWebsiteUrl
    });

    // 2. Setup Iframe (Temporary Injection)
    const iframe = document.createElement('iframe');
    iframe.id = 'botbuster-iframe';
    iframe.src = 'https://dev.botbuster.io/test'; // Placeholder URL
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
        document.body.appendChild(container);
        console.log(`Created container #${parentContainerId} for the iframe.`);
    }
    container.appendChild(iframe);
    console.log('Temporary iframe injected successfully.');

    // 3. Utility Functions
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
            working = working.replace(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//, '');
            const host = working.split(/[\/?#]/, 1)[0].split(':', 1)[0];
            return (host.startsWith('www.') ? host : 'www.' + host) + '/';
        }
    }

    // Debounce Utility: Ensures func is only called once after a pause of 'wait' ms.
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    // Finds the target element, waiting for it if necessary (useful for async React/framework rendering)
    function waitForElement(selectorOrId) {
        return new Promise((resolve) => {
            const el = document.getElementById(selectorOrId) || document.querySelector(selectorOrId);
            if (el) return resolve(el);
            console.log(`[Botbuster Debug] Email element '${selectorOrId}' not found yet. Starting MutationObserver...`);
            const observer = new MutationObserver((mutations, obs) => {
                const el = document.getElementById(selectorOrId) || document.querySelector(selectorOrId);
                if (el) {
                    console.log(`[Botbuster Debug] Element '${selectorOrId}' found via MutationObserver.`);
                    obs.disconnect();
                    resolve(el);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    // 4. Main Init Function (Handles API Call and Iframe Source Update)
    async function init(emailOverride = null) {
        // Update the active email state for subsequent comparisons
        if (emailOverride !== null) { // Check for explicit override
            activeEmail = emailOverride;
        }
        const finalEmail = activeEmail;
        
        // Skip initialization if the email is empty or invalid
        if (!finalEmail || finalEmail.length < 6 || !finalEmail.includes('@')) {
             console.log('Skipping init: Email is empty, invalid, or too short.');
             return;
        }

        console.log('Initializing Botbuster SDK with email:', finalEmail);

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
                console.log('✅ Botbuster SDK initialized successfully.');
                
                // Construct the final iframe URL with configuration data
                iframe.src = `https://dev.botbuster.io/session_id=QC-12345&skin_type=${data.captcha_uid}&email=${finalEmail}&mfa=${hasEmailOption(data?.config?.mfa)}&website_url=${normalizeToWWW(loadedWebsiteUrl)}`;
                
                // Post message after the iframe loads
                iframe.onload = () => {
                     iframe.contentWindow.postMessage(
                        { type: "BOTBUSTER_INIT", url: loadedWebsiteUrl },
                        "https://dev.botbuster.io"
                    );
                };
            } else {
                console.warn(`⚠️ Botbuster SDK initialization failed: ${data.message}`);
            }
        } catch (error) {
            console.error('❌ An error occurred during Botbuster SDK initialization:', error);
        }
    }

    // 5. Bind Listeners and Start
    if (loadedEmailElement) {
        waitForElement(loadedEmailElement).then((emailInput) => {
            
            // CRITICAL: Ensure we are only binding to an <input type="email">
            if (emailInput.tagName !== 'INPUT' || emailInput.type !== 'email') {
                console.warn(`[Botbuster Debug] Element '${loadedEmailElement}' found but is not an INPUT with type="email". Skipping dynamic binding.`);
                return; 
            }
            
            console.log(`✅ Found email input element: ${loadedEmailElement} with type="email". Binding events.`);
            
            // --- Synchronization Check ---
            // If the live DOM value is different from the initial value (from data-email), 
            // re-initialize the SDK immediately with the current DOM value.
            const initialEmail = emailInput.value.trim();
            if (initialEmail && initialEmail !== activeEmail) {
                 console.log(`[Botbuster Debug] DOM email value (${initialEmail}) differs from initial attribute (${activeEmail}). Re-initializing SDK.`);
                 init(initialEmail); 
            }
            // If they are the same, the initial unconditional init() call was sufficient.


            const checkAndInit = (emailVal) => {
                const newEmail = emailVal ? emailVal.trim() : '';
                
                // The core condition for re-initialization:
                // 1. Is it a valid-looking email (has @ and is long enough)?
                // 2. Is it DIFFERENT from the last email we successfully initialized with (activeEmail)?
                if (newEmail && newEmail.includes('@') && newEmail !== activeEmail && newEmail.length > 5) {
                    console.log(`[Botbuster Debug] Email updated from ${activeEmail} to ${newEmail}. Triggering initSDK.`);
                    init(newEmail);
                } else {
                     console.log(`[Botbuster Debug] Change ignored. New email is ${newEmail.length > 0 ? 'valid but unchanged' : 'empty/invalid'} or shorter than 6 characters.`);
                }
            };

            // 1. Debounced Handler: Calls checkAndInit 800ms after the user stops typing
            const debouncedHandler = debounce((e) => {
                checkAndInit(e.target.value);
            }, 800); 

            // 2. Blur Handler: Calls checkAndInit immediately when focus leaves the input
            const blurHandler = (e) => {
                checkAndInit(e.target.value);
            };

            // Attach listeners
            emailInput.addEventListener('input', debouncedHandler);
            emailInput.addEventListener('blur', blurHandler);
        });
    }

    // 6. Initial SDK Load Trigger (Unconditional)
    // Always run this first for fastest loading, especially if loadedEmailElement is not provided 
    // or if the element is slow to load. The synchronization check above handles correction later.
    init();

})();
