(function () {
  // Check if CAPTCHA is already injected to prevent duplicates
  if (document.getElementById('botbuster-captcha-login') || document.getElementById('botbuster-captcha-signup')) {
    console.log('🛡️ Botbuster CAPTCHA already injected.');
    return;
  }

  // Function to create and inject a CAPTCHA for a given form and submit button
  function injectCaptcha(formId, submitBtnId, captchaId) {
    const targetForm = document.getElementById(formId);
    const targetSubmitBtn = document.getElementById(submitBtnId);

    if (!targetForm || !targetSubmitBtn) {
      console.warn(`⚠️ Could not find form '${formId}' or submit button '${submitBtnId}'. CAPTCHA not injected for this form.`);
      return;
    }

    const captchaContainer = document.createElement('div');
    captchaContainer.id = captchaId;
    captchaContainer.style.cssText = 'width:320px; height:700px; margin:20px auto;'; // 'auto' for horizontal centering

    const iframe = document.createElement('iframe');
    iframe.src = 'https://dev.botbuster.io/'; // Botbuster iframe URL
    iframe.style.cssText = 'width:100%; height:100%; border:none; display:block;';

    captchaContainer.appendChild(iframe);

    // Insert the CAPTCHA container before the submit button in the specific form
    targetForm.insertBefore(captchaContainer, targetSubmitBtn);

    console.log(`✅ Botbuster CAPTCHA iframe injected into '${formId}'.`);
  }

  // Inject CAPTCHA into the Login Form
  injectCaptcha('loginForm', 'loginSubmitBtn', 'botbuster-captcha-login');

  // Inject CAPTCHA into the Signup Form
  injectCaptcha('signupForm', 'signupSubmitBtn', 'botbuster-captcha-signup');

})();
