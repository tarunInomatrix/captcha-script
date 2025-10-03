(function () {
  const currentScript = document.currentScript;
  
  // Read the data attributes from the script tag.
  const apiKey = currentScript.getAttribute('data-api-key');
  const userEmail = currentScript.getAttribute('data-email');
  const parentContainerId = 'botbuster-container'; 
  const loadedActionId = currentScript.getAttribute('data-action-id') || null;
  const loadedEmailElement = currentScript.getAttribute('data-email-element') || null;
  const loadedWebsiteUrl = currentScript.getAttribute('data-web-url') || null;

  console.log('loadedWebsiteUrl', loadedWebsiteUrl);
  
  // --- INJECT IFRAME BEFORE API CALL (Step 1) ---
  const iframe = document.createElement('iframe');
  iframe.id = 'botbuster-iframe';
  iframe.src = 'about:blank'; // Placeholder URL
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
  
  // --- Start the API call after the temporary iframe is in place ---
  async function init() {
    try {
      const response = await fetch('https://5znp405k6i.execute-api.eu-north-1.amazonaws.com/dev/initSDK', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: apiKey,
          loadedCaptchaUrl: loadedWebsiteUrl,
          email: userEmail,
          actionId: loadedActionId,
          emailElement: loadedEmailElement,
        }),
      });

      const data = await response.json();

      if (data.code === "CONFIG_LOADED") {
        console.log('✅ Botbuster SDK initialized successfully.');
        
        // --- INJECT IFRAME AFTER API CALL (Step 2) ---
        // Update the src of the existing iframe with the real URL
        iframe.src = `https://dev.botbuster.io/${data.captcha_uid}`;
        
        // Post-message logic
        iframe.addEventListener("load", () => {
          iframe.contentWindow.postMessage(
            { type: "BOTBUSTER_INIT", url: loadedWebsiteUrl },
            "https://dev.botbuster.io"
          );
        });
        console.log('Iframe src updated to the real CAPTCHA URL.');
      } else {
        const errorMessage = data.message || 'Unknown error during initialization.';
        console.warn(`⚠️ Botbuster SDK initialization failed: ${errorMessage}`);
        console.log(data,"API response", "Status :", data.statusCode);
      }
    } catch (error) {
      console.error('❌ An error occurred during Botbuster SDK initialization:', error);
    }
  }

  init();
})();
