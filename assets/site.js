(() => {
  'use strict';

  const SITE_CONFIG = { selectedCenters: null, vimeoId: '' };

  function track(event, data = {}) {
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event, ...data });
    }
  }

  if (Number.isInteger(SITE_CONFIG.selectedCenters) && SITE_CONFIG.selectedCenters > 0) {
    document.querySelector('[data-offer-note]').textContent =
      `Stiamo selezionando ${SITE_CONFIG.selectedCenters} centri.`;
  }

  if (SITE_CONFIG.vimeoId) {
    const vsl = document.getElementById('vsl');
    vsl.querySelector('[data-vsl-frame]').src =
      `https://player.vimeo.com/video/${encodeURIComponent(SITE_CONFIG.vimeoId)}?dnt=1&title=0&byline=0&portrait=0`;
    vsl.hidden = false;

    const cta = document.getElementById('heroSecondary');
    cta.href = '#vsl';
    cta.textContent = 'Guarda la presentazione ↓';
    cta.dataset.track = 'vsl_click';
  }

  document.querySelectorAll('[data-track]').forEach((link) => {
    link.addEventListener('click', () => {
      track(link.dataset.track, { label: link.textContent.trim() });
    });
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  const casePlay = document.getElementById('casePlay');
  const caseVideo = document.getElementById('caseVideo');

  casePlay.addEventListener('click', () => {
    caseVideo.src = caseVideo.dataset.src;
    caseVideo.hidden = false;
    casePlay.hidden = true;
    caseVideo.focus();
  }, { once: true });

  const form = document.getElementById('leadForm');
  const status = document.getElementById('formStatus');
  const phone = document.getElementById('tel');
  const submissionId = form.elements.namedItem('submissionId');

  const steps = Array.from(form.querySelectorAll('.form-step'));
  const progress = form.querySelector('.form-progress');
  const progressText = document.getElementById('formProgress');
  const bars = progress.querySelectorAll('.progress-bars i');
  const back = form.querySelector('.form-back');
  const next = form.querySelector('.form-next');
  const submit = form.querySelector('.form-submit');
  const lastStep = steps.length - 1;
  let currentStep = 0;

  function showStep(index, moveFocus = true) {
    currentStep = index;
    steps.forEach((step, position) => {
      step.hidden = position !== index;
      bars[position].classList.toggle('is-filled', position <= index);
    });
    progressText.textContent = `Passo ${index + 1} di ${steps.length}`;
    back.hidden = index === 0;
    next.hidden = index === lastStep;
    submit.hidden = index !== lastStep;

    if (moveFocus) steps[index].querySelector('legend').focus();
  }

  form.noValidate = true;
  progress.hidden = false;
  showStep(0, false);

  back.addEventListener('click', () => {
    status.textContent = '';
    showStep(currentStep - 1);
  });

  form.addEventListener('focusin', () => track('form_open'), { once: true });
  form.addEventListener('input', (event) => {
    event.target.setCustomValidity('');
    submissionId.value = '';
    status.textContent = '';
  });

  window.addEventListener('pageshow', () => {
    submit.disabled = false;
    status.textContent = '';
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (submit.disabled) return;

    const phoneValue = phone.value.trim();
    const phoneDigits = phoneValue.replace(/\D/g, '');
    const validPhone = /^\+?[0-9(). -]+$/.test(phoneValue) &&
      phoneDigits.length >= 7 && phoneDigits.length <= 15;
    phone.setCustomValidity(phoneValue && !validPhone ? 'Inserisci un numero di telefono valido.' : '');

    for (const field of form.querySelectorAll('input[type="text"]')) {
      const onlyWhitespace = field.value !== '' && field.value.trim() === '';
      field.setCustomValidity(onlyWhitespace ? 'Compila questo campo.' : '');
    }

    const invalidStep = steps.slice(0, currentStep + 1)
      .findIndex((step) => step.querySelector('input:invalid'));
    if (invalidStep !== -1) {
      if (invalidStep !== currentStep) showStep(invalidStep, false);
      steps[invalidStep].querySelector('input:invalid').reportValidity();
      return;
    }

    if (currentStep < lastStep) {
      showStep(currentStep + 1);
      return;
    }

    if (!form.hasAttribute('action')) {
      status.textContent = 'Il modulo non è ancora disponibile. Riprova più tardi.';
      return;
    }

    if (!submissionId.value && window.crypto.randomUUID) {
      submissionId.value = window.crypto.randomUUID();
    }
    track('form_submitted', { service: form.elements.namedItem('servizio').value });
    status.textContent = 'Invio della candidatura…';
    submit.disabled = true;
    HTMLFormElement.prototype.submit.call(form);
  });
})();
