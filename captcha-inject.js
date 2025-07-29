(function () {
  // Check if the page already has the Botbuster CAPTCHA
  if (document.querySelector('script[src*="botbuster.io"]')) {
    console.log("🛡️ Botbuster CAPTCHA already loaded.");
    return;
  }

  // Inject Botbuster CAPTCHA script
  const botbuster = document.createElement("script");
  botbuster.src = "https://dev.botbuster.io/api/v1/captcha/script";
  botbuster.async = true;
  document.head.appendChild(botbuster);

  console.log("✅ Botbuster CAPTCHA injected.");
})();
