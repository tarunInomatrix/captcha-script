(function () {
  // Avoid injecting twice
  if (document.getElementById("botbuster-captcha")) {
    console.log("🛡️ Botbuster CAPTCHA already injected.");
    return;
  }

  // 1. Create a container for the CAPTCHA
  const captchaContainer = document.createElement("div");
  captchaContainer.id = "botbuster-captcha";
  captchaContainer.style = "margin: 20px 0;";

  // 2. Choose where to inject it — here, before a form’s submit button
  const form = document.querySelector("form");
  const submitBtn = form?.querySelector('input[type="submit"], button[type="submit"]');

  if (form && submitBtn) {
    form.insertBefore(captchaContainer, submitBtn);
  } else {
    // fallback if no form found
    document.body.appendChild(captchaContainer);
  }

  // 3. Inject the Botbuster script
  const botbusterScript = document.createElement("script");
  botbusterScript.src = "https://dev.botbuster.io/api/v1/captcha/script";
  botbusterScript.async = true;
  document.head.appendChild(botbusterScript);

  console.log("✅ Botbuster CAPTCHA injected into #botbuster-captcha");
})();
