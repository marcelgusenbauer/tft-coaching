# Anleitung: Website selbst ändern (für Daniel / zBerth)

Du kannst Preise, Texte und Testimonials der Website **ohne Programmierkenntnisse** ändern.
Alles Wichtige steht in **einer Datei**: `config.js`. Jede gespeicherte Änderung ist nach
**ca. 1 Minute automatisch live** auf https://tft-coaching.pages.dev — du musst nichts
hochladen oder deployen.

## So änderst du etwas (Schritt für Schritt)

1. Öffne https://github.com/marcelgusenbauer/tft-coaching (eingeloggt mit deinem GitHub-Account).
2. Klicke in der Dateiliste auf **`config.js`**.
3. Klicke rechts oben auf das **Stift-Symbol ✏️** („Edit this file").
4. Ändere **nur den Text zwischen den Anführungszeichen** — Beispiele:
   - Preis ändern: `session1h: "€20",` → `session1h: "€25",`
   - Rang aktualisieren: `peakRank: "Challenger 1,000+ LP · #34 EUW",` → neuen Wert eintragen
5. Klicke rechts oben auf den grünen Button **„Commit changes…"** → im Fenster nochmal
   **„Commit changes"**. Fertig!
6. Warte ~1 Minute, dann lade die Website neu (Strg+F5). Deine Änderung ist live.

## ⚠️ Die drei goldenen Regeln

1. **Niemals Anführungszeichen `"` oder Kommas `,` löschen** — nur den Text dazwischen ändern.
2. Zeilen, die mit `//` beginnen, sind nur Erklärungen — sie ändern nichts an der Website.
3. Wenn etwas schiefgeht: **kein Drama.** Die Website geht nicht kaputt, sie zeigt schlimmstenfalls
   Platzhalter an. Schreib Marcel — er kann jede Änderung mit einem Klick rückgängig machen.

## Testimonials eintragen (Schüler-Bewertungen)

In `config.js` findest du den Block `testimonials: [ ... ]`. Trage pro Bewertung eine Zeile
nach diesem Muster ein (Komma am Ende nicht vergessen, wenn mehrere untereinander stehen):

```
testimonials: [
  { name: "MaxTFT", rank: "Emerald II → Diamond IV", quote: "Nach 3 Sessions endlich raus aus Emerald — die VOD-Reviews haben meine größten Fehler sofort sichtbar gemacht." },
  { name: "Lea", rank: "Platinum I → Emerald III", quote: "Endlich verstehe ich Econ-Management. Jede Session war das Geld wert." },
],
```

Wichtig: Frag deine Schüler vorher, ob du sie zitieren darfst. Solange die Liste leer ist,
zeigt die Website automatisch Beispielkarten (klar als „Example" markiert).

## Video einbinden

In `config.js` gibt es den Abschnitt `VIDEO`. Füge bei `videoUrl` einfach einen
YouTube-Link ein — egal welches Format:

```
videoUrl: "https://youtu.be/DEIN_VIDEO",
```

Sobald ein Link drinsteht, erscheint automatisch eine Video-Sektion auf der Seite
(Überschrift änderbar über `videoTitle`). Link wieder löschen (`videoUrl: "",`) =
Sektion verschwindet.

## Eigene Texte

Im Abschnitt `TEXTE` kannst du den Satz unter der großen Überschrift (`heroSubline`)
und den Einleitungstext über dem Kontaktformular (`contactIntro`) durch eigene Sätze
ersetzen. Feld leer lassen = der eingebaute Text bleibt.

## Was du NICHT anfassen solltest

Die anderen Dateien (`index.html`, `styles.css`, `main.js`, …) steuern Design und Technik —
Änderungen dort bitte über Marcel laufen lassen.
