(function () {
  const currentScript = document.currentScript;

  // Read the new data attributes
  const apiKey = currentScript.getAttribute('data-api-key');
  const loadedCaptchaUrl = currentScript.getAttribute('data-loaded-captcha-url');
  const userEmail = currentScript.getAttribute('data-email');
  
  // The rest of your code...
  async function init() {
    try {
      const response = await fetch('https://5znp405k6i.execute-api.eu-north-1.amazonaws.com/dev/initSDK', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Use the new variables here
          apiKey: apiKey,
          loadedCaptchaUrl: loadedCaptchaUrl, 
          email: userEmail,
        }),
      });

      const data = await response.json();

      if (data.statusCode === 200) {
        console.log('✅ Botbuster SDK initialized successfully.');

        // ... (rest of the logic)
      } else {
        const errorMessage = data.message || 'Unknown error during initialization.';
        console.warn(`⚠️ Botbuster SDK initialization failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error('❌ An error occurred during Botbuster SDK initialization:', error);
    }
  }

  // Call the new init function to start the process
  init();
})();
