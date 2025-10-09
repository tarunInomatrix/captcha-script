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

  // Avoid duplicate iframe
  const existingIframe = document.getElementById('botbuster-iframe');
  if (existingIframe) {
    container.replaceChild(iframe, existingIframe);
  } else {
    container.appendChild(iframe);
  }
  console.log('Temporary iframe injected successfully.');

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

  function normalizeToWWW(input) {
    if (!input || typeof input !== 'string') return null;

    // Ensure URL() can parse it — if there is no scheme, prepend a temporary one
    let working = input.trim();
    if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(working)) {
      working = 'https://' + working;
    }

    try {
      const url = new URL(working);
      let host = url.hostname; // no port, no path
      if (!host.startsWith('www.')) {
        host = 'www.' + host;
      }
      return host + '/';
    } catch (e) {
      // Fallback simple parse
      working = working.replace(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//, '');
      const host = working.split(/[\/?#]/, 1)[0].split(':', 1)[0];
      return (host.startsWith('www.') ? host : 'www.' + host) + '/';
    }
  }
  
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

      if (!response.ok) {
        const text = await response.text().catch(() => null);
        console.warn('Init API returned non-OK status', response.status, text);
        return;
      }

      const data = await response.json();

      if (data.code === "CONFIG_LOADED") {
        console.log('✅ Botbuster SDK initialized successfully.');

        // --- SAFELY BUILD THE IFRAME URL (fixed) ---
        const base = 'https://dev.botbuster.io/';
        const params = {
          session_id: data.session_id || 'QC-12345',
          skin_type: data.captcha_uid || '',
          email: userEmail || '',
          mfa: hasEmailOption(data?.config?.mfa) ? 'true' : 'false',
          website_url: normalizeToWWW(loadedWebsiteUrl) || ''
        };

        // Use URL + URLSearchParams to ensure correct encoding and avoid template literal bugs
        const url = new URL(base);
        url.search = new URLSearchParams(params).toString();

        console.log('Setting iframe src to:', url.toString());
        iframe.src = url.toString();

        // Post-message logic
        iframe.addEventListener("load", () => {
          try {
            iframe.contentWindow.postMessage(
              { type: "BOTBUSTER_INIT", url: loadedWebsiteUrl },
              "https://dev.botbuster.io"
            );
          } catch (e) {
            console.warn('postMessage failed', e);
          }
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
