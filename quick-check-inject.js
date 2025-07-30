(function () {
  if (document.getElementById('botbuster-captcha')) {
    console.log('🛡️ Botbuster CAPTCHA already injected.');
    return;
  }

  const captchaContainer = document.createElement('div');
  captchaContainer.id = 'botbuster-captcha';
  captchaContainer.style.cssText = 'width:320px; height:400px; margin:20px 0; border:1px solid #ccc;';

  const iframe = document.createElement('iframe');
  iframe.src = 'https://dev.botbuster.io/'; // Change this if Botbuster provides a specific iframe URL
  iframe.style.cssText = 'width:100%; height:100%; border:none; display:block;';

  captchaContainer.appendChild(iframe);

  // Append the container before the first form’s submit button, if any, else at body end
  const form = document.querySelector('form');
  const submitBtn = form?.querySelector('input[type="submit"], button[type="submit"]');

  if (form && submitBtn) {
    form.insertBefore(captchaContainer, submitBtn);
  } else {
    document.body.appendChild(captchaContainer);
  }

  console.log('✅ Botbuster CAPTCHA iframe injected.');
})();
