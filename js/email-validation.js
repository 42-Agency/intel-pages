// Email validation using mails.so API
(function() {
  let validateTimeout = null;
  let lastValidatedEmail = '';
  let isEmailValid = false;

  function initEmailValidation() {
    const form = document.getElementById('downloadForm') || document.getElementById('subscribeForm');
    if (!form) return;

    const emailInput = form.querySelector('input[type="email"]');
    const submitBtn = form.querySelector('button[type="submit"]');

    // Save and remove the original onsubmit handler
    const originalHandler = form.onsubmit;
    form.onsubmit = null;
    form.removeAttribute('onsubmit');

    // Create wrapper for input to allow feedback below it without breaking flex
    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'email-input-wrapper';
    emailInput.parentNode.insertBefore(inputWrapper, emailInput);
    inputWrapper.appendChild(emailInput);

    // Create feedback element inside wrapper (below input)
    const feedback = document.createElement('div');
    feedback.className = 'email-feedback';
    inputWrapper.appendChild(feedback);

    // Style additions - keep flex layout intact
    const style = document.createElement('style');
    style.textContent = `
      .email-input-wrapper {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      .email-input-wrapper input[type="email"] {
        width: 100%;
      }
      .email-feedback {
        font-size: 0.8rem;
        min-height: 1.4rem;
        margin-top: 0.35rem;
        text-align: left;
      }
      .email-feedback:empty { min-height: 0; margin-top: 0; }
      .email-feedback.error { color: #c62828; font-weight: 500; }
      .email-feedback.success { color: #2e7d32; }
      .email-feedback.checking { color: #666; font-style: italic; }
      .email-input-error { border-color: #c62828 !important; box-shadow: 0 0 0 1px #c62828 !important; }
      .email-input-success { border-color: #2e7d32 !important; }
    `;
    document.head.appendChild(style);

    // Validate on input with debounce
    emailInput.addEventListener('input', function() {
      const email = this.value.trim();

      // Clear previous timeout
      if (validateTimeout) clearTimeout(validateTimeout);

      // Reset state
      isEmailValid = false;
      emailInput.classList.remove('email-input-error', 'email-input-success');

      // Basic format check first
      if (!email || !email.includes('@') || !email.includes('.')) {
        feedback.textContent = '';
        feedback.className = 'email-feedback';
        return;
      }

      // Skip if already validated this email
      if (email === lastValidatedEmail) return;

      feedback.textContent = 'Checking...';
      feedback.className = 'email-feedback checking';

      // Debounce API call
      validateTimeout = setTimeout(() => validateEmail(email, emailInput, feedback), 600);
    });

    // Function to proceed with original form submission
    function proceedWithSubmit(e) {
      if (originalHandler) {
        originalHandler.call(form, e);
      } else if (typeof handleSubmit === 'function') {
        handleSubmit(e);
      }
    }

    // Intercept form submission - validate first, then call original handler
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      e.stopPropagation();

      const email = emailInput.value.trim();

      // Allow if we validated this email and it's valid
      if (email === lastValidatedEmail && isEmailValid) {
        proceedWithSubmit(e);
        return;
      }

      // If not validated yet, validate first
      if (email !== lastValidatedEmail) {
        feedback.textContent = 'Validating email...';
        feedback.className = 'email-feedback checking';
        submitBtn.disabled = true;

        validateEmail(email, emailInput, feedback, function(valid) {
          submitBtn.disabled = false;
          if (valid) {
            proceedWithSubmit(e);
          }
        });
        return;
      }

      // If validated but invalid, block
      if (!isEmailValid) {
        feedback.textContent = 'Please enter a valid email address';
        feedback.className = 'email-feedback error';
        emailInput.classList.add('email-input-error');
        emailInput.focus();
        return;
      }
    });
  }

  async function validateEmail(email, input, feedback, callback) {
    try {
      const response = await fetch(`/api/validate-email?email=${encodeURIComponent(email)}`);
      const data = await response.json();

      lastValidatedEmail = email;
      isEmailValid = data.valid;

      if (data.valid) {
        feedback.textContent = data.risky ? '' : '';
        feedback.className = 'email-feedback success';
        input.classList.remove('email-input-error');
        input.classList.add('email-input-success');
      } else {
        const message = data.reason === 'disposable'
          ? 'Please use a non-disposable email'
          : 'This email appears to be invalid';
        feedback.textContent = message;
        feedback.className = 'email-feedback error';
        input.classList.remove('email-input-success');
        input.classList.add('email-input-error');
      }

      if (callback) callback(data.valid);
    } catch (error) {
      // Fail open on error
      lastValidatedEmail = email;
      isEmailValid = true;
      feedback.textContent = '';
      feedback.className = 'email-feedback';
      if (callback) callback(true);
    }
  }

  // Init when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEmailValidation);
  } else {
    initEmailValidation();
  }
})();
