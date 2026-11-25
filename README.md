# Estetica Premium — sito

Landing page corporate ad alta conversione per **Estetica Premium**, specializzata in marketing e acquisizione clienti per centri di estetica avanzata.

Dominio ufficiale: **https://estetica-premium.it/**

## Struttura

Il sito è statico e non richiede framework o dipendenze esterne. La home è in `index.html`, con gli stili in `assets/site.css` e il comportamento del modulo in `assets/site.js`. Font, logo e fotografia editoriale sono ospitati localmente.

La pagina presenta il servizio, la Beauty Consultant, il metodo di acquisizione, il caso studio di Giada, i trattamenti supportati e le FAQ. Il pulsante nella prima schermata porta al form di candidatura con invio tramite WhatsApp.

## Configurazione commerciale

All'inizio di `assets/site.js` è presente `SITE_CONFIG`:

- `selectedCenters`: numero di centri selezionati per il servizio. Lasciare `null` per mostrare soltanto “centri selezionati”.
- `vimeoId`: ID della VSL Vimeo. La sezione e il player restano nascosti finché non viene inserito un ID reale.

## Anteprima locale

```bash
python3 -m http.server 8000
```

Poi aprire `http://localhost:8000`.

## Note

- Palette: avorio, bordeaux, cipria e dettagli bronzo.
- Font self-hosted: Bodoni Moda e Manrope.
- Il form precompila una candidatura su WhatsApp.
- Gli eventi vengono inviati a `dataLayer` solo se un sistema di tracking lo ha già inizializzato.
- `privacy/index.html`: informativa recruiting, pubblicata all’indirizzo `https://estetica-premium.it/privacy/` e collegata nel footer come “Privacy recruiting”. `privacy-recruiting.html` conserva lo stesso testo per compatibilità con il precedente indirizzo; aggiornare entrambi i file quando cambia il contenuto.
- Conservazione recruiting approvata: fino alla conclusione della selezione, massimo 12 mesi dalla candidatura. La cancellazione dal Google Sheet e dalle altre copie va gestita operativamente dal titolare; il sito non esegue cancellazioni automatiche.
- La privacy relativa alle richieste commerciali del sito e l’informativa Cookie richiedono ancora una gestione separata: la pagina recruiting non le sostituisce.
