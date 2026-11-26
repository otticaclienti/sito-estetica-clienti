const SHEET_ID = 0;
const SITE_URL = 'https://estetica-premium.it/';
const WHATSAPP_URL = 'https://wa.me/393348496487';
const HEADERS = [
  'Data e ora (Roma)', 'Nome', 'Cognome', 'Centro', 'Città', 'Telefono / WhatsApp',
  'Email', 'Trattamento', 'Budget pubblicitario', 'ID candidatura',
];
const TREATMENTS = ['Epilazione laser', 'Viso anti-age', 'Trattamenti corpo', 'Più di uno'];
const BUDGETS = [
  'Sono disponibile a investirlo', 'Vorrei capire quanto serve', 'Non sono disponibile',
];

function doPost(event) {
  const lead = readLead(event);
  if (!lead) {
    return resultPage(
      'Controlla i dati',
      'Torna al modulo e verifica che tutti i campi siano compilati correttamente.',
      false
    );
  }

  try {
    saveLead(lead);
  } catch (error) {
    console.error('Salvataggio della candidatura non riuscito.');
    return resultPage(
      'Candidatura da inviare',
      'Il salvataggio non è stato confermato. Torna al modulo e riprova.',
      false
    );
  }

  return resultPage(
    'Candidatura ricevuta',
    'Abbiamo ricevuto i tuoi dati. Se vuoi, puoi anche scriverci su WhatsApp.',
    true
  );
}

function readLead(event) {
  if (!event || !event.parameter || Number(event.contentLength) > 8192) return null;

  const input = event.parameter;
  const read = (key) => typeof input[key] === 'string' ? input[key].trim() : '';
  const lead = {
    name: read('nome'),
    surname: read('cognome'),
    center: read('centro'),
    city: read('citta'),
    phone: read('tel'),
    email: read('email'),
    treatment: read('servizio'),
    budget: read('budget'),
    id: read('submissionId') || Utilities.getUuid(),
  };

  const textFields = [lead.name, lead.surname, lead.center, lead.city];
  const phoneDigits = lead.phone.replace(/\D/g, '');
  const idPattern = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
  if (read('website') || textFields.some((value) => !value || value.length > 150) ||
      !/^\+?[0-9(). -]+$/.test(lead.phone) || lead.phone.length > 40 ||
      phoneDigits.length < 7 || phoneDigits.length > 15 ||
      lead.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email) ||
      !TREATMENTS.includes(lead.treatment) || !BUDGETS.includes(lead.budget) ||
      !idPattern.test(lead.id)) {
    return null;
  }

  return lead;
}

function saveLead(lead) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const spreadsheetId = PropertiesService.getScriptProperties().getProperty('LEADS_SPREADSHEET_ID');
    if (!spreadsheetId) throw new Error('Missing spreadsheet configuration');
    const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetById(SHEET_ID);
    if (!sheet) throw new Error('Missing lead sheet');

    const headers = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
    if (!HEADERS.every((header, index) => headers[index] === header)) {
      throw new Error('Unexpected lead sheet headers');
    }

    const lastRow = sheet.getLastRow();
    if (lastRow > 1 && sheet.getRange(2, HEADERS.length, lastRow - 1, 1)
      .createTextFinder(lead.id).matchEntireCell(true).findNext()) {
      return;
    }

    const row = [
      Utilities.formatDate(new Date(), 'Europe/Rome', 'dd/MM/yyyy HH:mm:ss'),
      lead.name, lead.surname, lead.center, lead.city, lead.phone, lead.email,
      lead.treatment, lead.budget, lead.id,
    ];
    sheet.appendRow(row.map((value) => "'" + value));
    SpreadsheetApp.flush();
  } finally {
    lock.releaseLock();
  }
}

function resultPage(title, message, saved) {
  const action = saved
    ? '<a class="button" href="' + WHATSAPP_URL + '" target="_blank" rel="noopener">Scrivici su WhatsApp ↗</a>'
    : '<a class="button" href="' + SITE_URL + '#candidatura" target="_top">Torna al modulo</a>';
  const home = saved ? '<a href="' + SITE_URL + '" target="_top">Torna al sito</a>' : '';

  return HtmlService.createHtmlOutput(`<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; }
  body { margin: 0; background: #F1EDE7; color: #261A1E; font: 400 1rem/1.6 system-ui, sans-serif; }
  main { width: min(90%, 34rem); margin: clamp(2rem, 13vh, 8rem) auto; padding: clamp(1.3rem, 6vw, 3rem); border: 1px solid #C9B2B3; border-radius: 1.5rem; background: #FAF7F2; }
  h1 { color: #471926; line-height: 1.1; font-size: clamp(1.8rem, 6vw, 2.8rem); }
  a { color: #471926; font-weight: 650; }
  .button { display: inline-block; padding: .75rem 1.1rem; margin: .6rem 1rem .6rem 0; border-radius: 99px; background: #471926; color: #FAF7F2; text-decoration: none; }
  a:focus-visible { outline: 2px solid #9C7448; outline-offset: 3px; }
</style>
</head>
<body>
<main>
  <p>Estetica Premium</p>
  <h1>${title}</h1>
  <p>${message}</p>
  ${action}${home}
</main>
</body>
</html>`).setTitle(title + ' · Estetica Premium')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}
