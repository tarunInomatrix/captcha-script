(function () {
  // Find the current script tag
  const currentScript = document.currentScript;

  // Read the data attributes
  const clientSecret = currentScript.getAttribute('data-client-secret');
  const apiSecret = currentScript.getAttribute('data-api-secret');
  const userEmail = currentScript.getAttribute('data-user-email');

  // New init function to fetch configuration
  async function init() {
    try {
      const response = await fetch('https://5znp405k6i.execute-api.eu-north-1.amazonaws.com/dev/initSDK', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: apiSecret, 
          loadedCaptchaUrl: window.location.href,
          email: userEmail,
        }),
      });

      const data = await response.json();

      // Check for a successful response (statusCode 200)
      if (data.statusCode === 200) {
        console.log('✅ Botbuster SDK initialized successfully.');

        // Proceed to inject CAPTCHA only if the status is 200
        injectCaptcha('loginForm', 'loginSubmitBtn', 'botbuster-captcha-login');
        injectCaptcha('signupForm', 'signupSubmitBtn', 'botbuster-captcha-signup');
      } else {
        // Use the provided message, or a default message if it's missing
        const errorMessage = data.message || 'Unknown error during initialization.';
        console.warn(`⚠️ Botbuster SDK initialization failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error('❌ An error occurred during Botbuster SDK initialization:', error);
    }
  }

  // The rest of your CAPTCHA injection logic remains the same
  function injectCaptcha(formId, submitBtnId, captchaId) {
    const targetForm = document.getElementById(formId);
    const targetSubmitBtn = document.getElementById(submitBtnId);

    if (!targetForm || !targetSubmitBtn) {
      console.warn(`⚠️ Could not find form '${formId}' or submit button '${submitBtnId}'. CAPTCHA not injected for this form.`);
      return;
    }

    const captchaContainer = document.createElement('div');
    captchaContainer.id = captchaId;
    captchaContainer.style.cssText = 'width:320px; height:700px; margin:20px auto;';

    const iframe = document.createElement('iframe');
    iframe.src = `https://dev.botbuster.io/?client_secret=${clientSecret}&api_secret=${apiSecret}&email=${userEmail}`;
    iframe.style.cssText = 'width:100%; height:100%; border:none; display:block;';

    captchaContainer.appendChild(iframe);
    targetForm.insertBefore(captchaContainer, targetSubmitBtn);

    console.log(`✅ Botbuster CAPTCHA iframe injected into '${formId}'.`);
  }

  // Call the new init function to start the process
  init();
})();
