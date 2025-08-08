(function () {
  // Find the current script tag
  const currentScript = document.currentScript;

  // Read the data attributes
  const clientSecret = currentScript.getAttribute('data-client-secret');
  const apiSecret = currentScript.getAttribute('data-api-secret');
  const userEmail = currentScript.getAttribute('data-user-email');
  
  // Use these values to make your API calls
  console.log('Client Secret:', clientSecret);
  console.log('API Secret:', apiSecret);
  console.log('User Email:', userEmail);

  // ... rest of your CAPTCHA injection logic

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
    // You can also pass these secrets as iframe parameters
    iframe.src = `https://dev.botbuster.io/?client_secret=${clientSecret}&api_secret=${apiSecret}&email=${userEmail}`;
    iframe.style.cssText = 'width:100%; height:100%; border:none; display:block;';

    captchaContainer.appendChild(iframe);
    targetForm.insertBefore(captchaContainer, targetSubmitBtn);

    console.log(`✅ Botbuster CAPTCHA iframe injected into '${formId}'.`);
  }

  injectCaptcha('loginForm', 'loginSubmitBtn', 'botbuster-captcha-login');
  injectCaptcha('signupForm', 'signupSubmitBtn', 'botbuster-captcha-signup');
})();
