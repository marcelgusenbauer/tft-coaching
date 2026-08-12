# Anleitung: Website selbst bearbeiten (für Daniel / zBerth)

Du kannst **alle Inhalte** der Website selbst ändern — Texte, Preise, Angebote,
Bewertungen, Video — ohne Programmierkenntnisse. Dafür gibt es ein Bearbeitungs-Panel
mit normalen Eingabefeldern.

## So geht's

1. Öffne **https://tft-coaching.pages.dev/admin**
2. Klicke auf **„Sign in with GitHub"** und melde dich mit deinem GitHub-Konto an.
   (Beim allerersten Mal fragt GitHub einmal um Erlaubnis — auf *Authorize* klicken.)
3. Klicke links auf **Website → Alle Inhalte der Website**.
4. Die Inhalte sind in nummerierte Bereiche gegliedert, in derselben Reihenfolge wie
   auf der Website:

   | Bereich | Was du dort änderst |
   |---|---|
   | 1 · Deine Daten | Name, Riot-ID, Rang, Region, Seasons, Profil-Link |
   | 2 · Kontakt | E-Mail, Discord, Formular-Schlüssel |
   | 3 · Startbereich | Große Überschrift, Text, Buttons, Stichpunkte |
   | 4 · Nachweis-Bereich | Überschriften und Kachel-Beschriftungen |
   | 5 · Angebote & Preise | Alle Sessions und Pläne — inkl. Preise |
   | 6 · Was du lernst | Die vier Themen-Karten |
   | 7 + 8 · Bewertungen | Überschriften und die Schüler-Bewertungen |
   | 9 · Video | YouTube-Link (optional) |
   | 10 · So läuft es ab | Die drei Schritte |
   | 11 · Kontaktformular | Alle Beschriftungen und die Danke-Nachricht |
   | 12 · Google & Link-Vorschau | Seitentitel und Beschreibung für Google |

5. Ändere, was du willst, und klicke oben rechts auf **Save**.
6. Nach ca. **1 Minute** ist die Änderung live. Website neu laden (Strg+F5).

## Typische Aufgaben

**Preis ändern:** Bereich 5 → passendes Angebot aufklappen → Feld *Preis* → z. B. `€25`.
Der Preis erscheint automatisch auch im Auswahlfeld des Kontaktformulars und bei Google.

**Bewertung hinzufügen:** Bereich 8 → **Add Bewertung** → Name, Rang-Entwicklung
(z. B. `Emerald II → Diamond IV`) und Zitat eintragen. Sobald die erste echte Bewertung
drin ist, verschwinden die Beispielkarten automatisch. Bitte nur mit Einverständnis
der Schüler.

**Angebot hinzufügen oder löschen:** Bereich 5 → **Add Einzelstunde** bzw.
**Add Trainingsplan** — oder das Papierkorb-Symbol zum Löschen. Reihenfolge lässt sich
per Ziehen ändern.

**Video einbinden:** Bereich 9 → YouTube-Link einfügen (jedes Format funktioniert).
Sofort erscheint eine Video-Sektion. Feld wieder leeren = Sektion verschwindet.

## Was passiert, wenn etwas schiefgeht?

**Nichts Schlimmes.** Wenn eine Eingabe die Website beschädigen würde, bricht der
automatische Veröffentlichungsvorgang ab und die **bisherige Website bleibt unverändert
online**. Außerdem wird jede Änderung gespeichert und kann von Marcel mit einem Klick
rückgängig gemacht werden.

Zwei Felder solltest du in Ruhe lassen, außer du weißt genau was du tust:
- **Web3Forms-Schlüssel** (Bereich 2) — steuert das Kontaktformular
- **Seitentitel/-beschreibung** (Bereich 12) — beeinflusst Google

## Wichtig für die Sicherheit

Aktiviere in deinem GitHub-Konto die **Zwei-Faktor-Anmeldung**:
GitHub → *Settings* → *Password and authentication* → *Two-factor authentication*.
Dein GitHub-Zugang ist der Schlüssel zur Website.

## Notfall-Weg (falls das Panel mal nicht lädt)

Du kannst die Inhalte auch direkt bearbeiten:
https://github.com/marcelgusenbauer/tft-coaching → Datei `config.json` → Stift-Symbol ✏️
→ Text zwischen den Anführungszeichen ändern → **Commit changes**. Dabei niemals
Anführungszeichen `"`, Kommas `,` oder Klammern löschen.
