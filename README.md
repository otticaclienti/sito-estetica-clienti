# Estetica Premium — sito

Landing page corporate ad alta conversione per **Estetica Premium**, specializzata in marketing e acquisizione clienti per centri di estetica avanzata.

Dominio ufficiale: **https://estetica-premium.it/**

## Struttura

Il sito è statico e composto da un solo `index.html`, senza framework o dipendenze esterne. Font, logo e immagini social sono ospitati localmente in `assets/`.

La pagina segue questo percorso:

1. Offerta iniziale: primo mese di gestione gratuito
2. Problema del modello “lead e poi arrangiati”
3. Sistema completo Estetica Premium
4. Processo dalla pubblicità all'appuntamento
5. Beauty Consultant
6. Focus su laser, viso anti-age e corpo
7. Produzione contenuti semplificata
8. Differenziali Estetica Premium
9. Caso studio Giada
10. Prova di 30 giorni
11. Criteri di accesso
12. FAQ
13. Form di candidatura con invio WhatsApp

## Configurazione commerciale

All'inizio dello script in `index.html` è presente `SITE_CONFIG`:

- `selectedCenters`: numero di centri ammessi alla prova. Lasciare `null` per mostrare soltanto “centri selezionati”.
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
- Privacy e Cookie nel footer richiedono ancora URL legali definitivi.
