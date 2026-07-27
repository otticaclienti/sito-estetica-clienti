# Estetica Clienti — sito

Landing page one-page per **Estetica Clienti**, il network di centri specializzati in estetica avanzata
(epilazione laser, rimodellamento corpo, anti-age viso). Struttura e funnel ispirati al modello Ottica Clienti,
con brand identity (crema / nero / rosa cipria / oro) presa dal profilo Instagram `@estetica.clienti`.

## File

- `index.html` — sito completo, **statico e self-contained** (nessuna dipendenza esterna: niente CDN, niente font remoti).

## Come vederlo in locale

Basta aprire `index.html` in un browser. In alternativa, con un server locale:

```bash
python3 -m http.server 8000
# poi apri http://localhost:8000
```

## Struttura della pagina

1. **Hero** — «Vuoi diventare il centro di riferimento della tua zona per…?» + 3 stat (3–8 clienti/sett., garanzia scritta, candidatura gratuita)
2. **Come funziona** — metodo in 3 step (01/02/03)
3. **Testimonianze** — segnaposto per i video-racconto dei centri clienti
4. **Garanzia** — promessa + estratto contratto (Art. Garanzia)
5. **Servizi** — «Cos'è Estetica Clienti» (4 card)
6. **Infrastruttura** — la squadra «in una sola chat»
7. **Team** — segnaposto foto/nomi/ruoli
8. **FAQ**
9. **Candidatura** — form di qualificazione + WhatsApp
10. **Footer** — contatti e social

## Da personalizzare (cerca questi segnaposto)

| Cosa | Dove | Nota |
|------|------|------|
| Numero WhatsApp | `wa.me/39XXXXXXXXXX` (compare 4 volte) | Sostituisci con il numero reale in formato internazionale senza `+` |
| Email / telefono footer | sezione `<footer>` | `info@esteticaclienti.it`, `+39 XXX XXX XXXX` |
| Video testimonianze | sezione `#testimonianze` | Sostituisci i placeholder con `<iframe>` YouTube reali |
| Foto/nomi team | sezione `#team` | Inserisci foto reali (sostituendo il cerchio con le iniziali) |
| Foto trattamenti | sezione `#verticali`/servizi | Sostituisci i gradienti `.fig-a/.fig-b/.fig-c` con immagini reali |
| Numeri risultati | (rimossi in questa versione, riattivabili) | — |
| Testo garanzia | sezione `#garanzia` | Da validare con un consulente legale |
| P.IVA, Privacy, Cookie | footer | Link e dati legali reali |
| Google Form | CTA «Candidati» | Se vuoi replicare Ottica Clienti, puoi puntare a un Google Form invece del form interno |

## Note tecniche

- **Tema chiaro/scuro** automatico (rispetta il sistema) + toggle manuale in alto a destra.
- **Responsive** mobile-first.
- **Accessibilità**: focus visibili, `aria-label`, `prefers-reduced-motion` rispettato.
- **Font**: stack di sistema serif/sans (nessun webfont da caricare). Per usare i font esatti del brand
  (es. un serif tipo *Cormorant/Didot* + *Montserrat*), vanno self-hostati e aggiunti via `@font-face`.
- Il form, senza backend, precompila un messaggio WhatsApp. Per raccogliere i lead in un CRM/email
  va collegato un endpoint (es. Formspree, Make/n8n, o il Google Form del network).
