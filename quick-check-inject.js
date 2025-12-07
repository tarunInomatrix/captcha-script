// --- Bind to Email Input if provided ---
    function waitForElement(selectorOrId) {
        return new Promise((resolve) => {
            const el = document.getElementById(selectorOrId) || document.querySelector(selectorOrId);
            if (el) return resolve(el);

            const observer = new MutationObserver((mutations, obs) => {
                const el = document.getElementById(selectorOrId) || document.querySelector(selectorOrId);
                if (el) {
                    obs.disconnect();
                    resolve(el);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    // Debounce Utility: Prevents API spam while typing
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    if (loadedEmailElement) {
        waitForElement(loadedEmailElement).then((emailInput) => {
            console.log(`✅ Found email input element: ${loadedEmailElement}`);

            const checkAndInit = (emailVal) => {
                // Remove whitespace
                const newEmail = emailVal ? emailVal.trim() : '';
                
                console.log(`[Botbuster Debug] Checking email: '${newEmail}'. Active: '${activeEmail}'`);

                // Validate: Must have @, must be different from current, must be reasonably long
                if (newEmail && newEmail.includes('@') && newEmail !== activeEmail && newEmail.length > 5) {
                    console.log(`[Botbuster Debug] Valid email change detected. Reloading SDK...`);
                    init(newEmail);
                }
            };

            // 1. Debounced Input Handler (for typing)
            // Waits 800ms after the last keystroke before checking
            const debouncedHandler = debounce((e) => {
                checkAndInit(e.target.value);
            }, 800);

            // 2. Immediate Blur Handler (for clicking away/tabbing)
            const blurHandler = (e) => {
                checkAndInit(e.target.value);
            };

            // Bind events
            emailInput.addEventListener('input', debouncedHandler);
            emailInput.addEventListener('blur', blurHandler);
            
            // Optional: Listen for autofill specifically (animationstart is a common hack for Chrome autofill detection)
             emailInput.addEventListener('animationstart', (e) => {
                if (e.animationName === "onAutoFillStart") {
                     checkAndInit(emailInput.value);
                }
            });
        });
    }
