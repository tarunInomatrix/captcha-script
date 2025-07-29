(function () {
    // Wait for the DOM to load
    document.addEventListener("DOMContentLoaded", function () {
      const form = document.querySelector("form"); // Modify if needed
      if (!form) return console.warn("No form found");
  
      // Create CAPTCHA container
      const captchaContainer = document.createElement("div");
      captchaContainer.id = "custom-captcha";
      captchaContainer.style = "margin: 10px 0;";
  
      // Generate question
      const a = Math.floor(Math.random() * 10);
      const b = Math.floor(Math.random() * 10);
      const answer = a + b;
  
      captchaContainer.innerHTML = `
        <label>What is ${a} + ${b}? (CAPTCHA)</label><br>
        <input type="text" id="captcha-answer" required />
        <input type="hidden" id="captcha-correct-answer" value="${answer}" />
      `;
  
      // Insert before submit button
      const submit = form.querySelector("input[type='submit'], button[type='submit']");
      if (submit) {
        form.insertBefore(captchaContainer, submit);
      } else {
        form.appendChild(captchaContainer);
      }
  
      // Add form submission check
      form.addEventListener("submit", function (e) {
        const userAnswer = document.getElementById("captcha-answer").value;
        const correctAnswer = document.getElementById("captcha-correct-answer").value;
        if (userAnswer !== correctAnswer) {
          e.preventDefault();
          alert("CAPTCHA failed. Please try again.");
        }
      });
  
      console.log("Custom CAPTCHA injected");
    });
  })();
  