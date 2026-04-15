function initContactForm() {
  const form = document.querySelector('#contactForm');
  const statusElement = document.querySelector('#contactFormStatus');
  const submitButton = form?.querySelector('button[type="submit"]');
  const nextUrlField = document.querySelector('#contactNextUrl');

  if (!form || !statusElement || !submitButton) {
    return;
  }

  if (nextUrlField) {
    nextUrlField.value = window.location.href;
  }

  function sanitizeText(value) {
    return String(value || '').trim().replace(/[<>]/g, '');
  }

  function displayContactStatus(message, type) {
    statusElement.textContent = message;
    statusElement.classList.remove('error', 'success');
    if (type) {
      statusElement.classList.add(type);
    }
  }

  function validateContactForm() {
    const values = {
      vorname: sanitizeText(form.vorname.value),
      name: sanitizeText(form.name.value),
      email: sanitizeText(form.email.value),
      telefon: sanitizeText(form.telefon.value),
      nachricht: sanitizeText(form.nachricht.value)
    };

    const errors = [];
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9+()\-\s\.]{0,30}$/;

    if (!values.vorname) {
      errors.push('Bitte gib deinen Vornamen ein.');
    }

    if (!values.name) {
      errors.push('Bitte gib deinen Namen ein.');
    }

    if (!values.email || !emailPattern.test(values.email)) {
      errors.push('Bitte gib eine gültige E-Mail-Adresse ein.');
    }

    if (values.telefon && !phonePattern.test(values.telefon)) {
      errors.push('Bitte gib eine gültige Telefonnummer ein.');
    }

    if (!values.nachricht || values.nachricht.length < 10) {
      errors.push('Bitte gib eine Nachricht mit mindestens 10 Zeichen ein.');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const honeypot = form.querySelector('[name="website"]');
    if (honeypot && honeypot.value.trim() !== '') {
      displayContactStatus('Bot-Filter aktiviert. Formular wurde nicht gesendet.', 'error');
      return;
    }

    const { valid, errors } = validateContactForm();
    if (!valid) {
      displayContactStatus(errors.join(' '), 'error');
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Sende...';
    displayContactStatus('Nachricht wird gesendet…');

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        },
        credentials: 'omit'
      });

      if (!response.ok) {
        throw new Error('Netzwerkfehler');
      }

      const result = await response.json();
      if (result.success || response.status === 200) {
        form.reset();
        if (nextUrlField) {
          nextUrlField.value = window.location.href;
        }
        displayContactStatus('Deine Nachricht wurde erfolgreich übermittelt. Wir melden uns zeitnah.', 'success');
      } else {
        throw new Error(result.message || 'Senden fehlgeschlagen');
      }
    } catch (error) {
      console.error('Kontaktformular-Fehler:', error);
      displayContactStatus('Beim Senden ist ein Fehler aufgetreten. Bitte versuche es später erneut.', 'error');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Nachricht senden';
    }
  });
}
