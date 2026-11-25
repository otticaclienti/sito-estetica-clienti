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
  const fallback = document.getElementById('whatsappFallback');
  const phone = document.getElementById('tel');

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
    fallback.hidden = true;
    status.textContent = '';
    showStep(currentStep - 1);
  });

  form.addEventListener('focusin', () => track('form_open'), { once: true });
  form.addEventListener('input', (event) => {
    event.target.setCustomValidity('');
    fallback.hidden = true;
    status.textContent = '';
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

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

    const data = new FormData(form);
    const value = (name) => data.get(name).trim();
    const message = [
      'Nuova candidatura Estetica Premium',
      `Nome: ${value('nome')} ${value('cognome')}`,
      `Centro: ${value('centro')}`,
      `Città: ${value('citta')}`,
      `Cellulare: ${value('tel')}`,
      `Email: ${value('email')}`,
      `Trattamento: ${value('servizio')}`,
      `Budget pubblicitario: ${value('budget')}`,
    ].join('\n');
    const whatsappUrl = `https://wa.me/393348496487?text=${encodeURIComponent(message)}`;

    track('form_completed', { service: data.get('servizio') });
    status.textContent = 'Apriamo WhatsApp. Controlla il messaggio e premi Invia.';
    fallback.href = whatsappUrl;
    fallback.hidden = false;
    window.location.assign(whatsappUrl);
  });
})();
