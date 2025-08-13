(function () {
  const currentScript = document.currentScript;
  
  // Read the data attributes from the script tag.
  const apiKey = currentScript.getAttribute('data-api-key');
  const loadedCaptchaUrl = currentScript.getAttribute('data-loaded-captcha-url');
  const userEmail = currentScript.getAttribute('data-email');
  const parentContainerId = 'botbuster-container'; // ID of a container element for the iframe.

  async function init() {
    try {
      const response = await fetch('https://5znp405k6i.execute-api.eu-north-1.amazonaws.com/dev/initSDK', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: apiKey,
          loadedCaptchaUrl: loadedCaptchaUrl,
          email: userEmail,
        }),
      });

      const data = await response.json();

      if (data.statusCode === 200) {
        console.log('✅ Botbuster SDK initialized successfully.');
        
        // Logic to inject the iframe after successful initialization.
        const iframe = document.createElement('iframe');
        iframe.id = 'botbuster-iframe'; // Unique ID for the iframe.
        iframe.src = "https://dev.botbuster.io/"; // Use the URL from the data attribute.
        iframe.style.width = '100%';
        iframe.style.height = '400px';
        iframe.style.border = '1px solid #ccc';
        iframe.style.borderRadius = '8px';
        iframe.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        iframe.style.marginTop = '20px';
        
        // Find the container to inject the iframe into.
        let container = document.getElementById(parentContainerId);
        if (!container) {
            // Create the container if it doesn't exist.
            container = document.createElement('div');
            container.id = parentContainerId;
            document.body.appendChild(container);
            console.log(`Created container #${parentContainerId} for the iframe.`);
        }

        container.appendChild(iframe);
        console.log('Iframe injected successfully.');

      } else {
        const errorMessage = data.message || 'Unknown error during initialization.';
        console.warn(`⚠️ Botbuster SDK initialization failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error('❌ An error occurred during Botbuster SDK initialization:', error);
    }
  }

  // Call the init function to start the process.
  init();
})();
