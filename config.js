// ============================================================================
// WEBSITE-EINSTELLUNGEN — hier stehen alle änderbaren Inhalte der Seite.
//
//   * Nur den Text ZWISCHEN den Anführungszeichen ändern, nie " oder , löschen!
//   * Zeilen mit // sind nur Erklärungen und ändern nichts an der Website.
//   * Änderungen sind ~1 Minute nach dem Speichern (Commit) automatisch live.
//   * Ausführliche Hilfe: siehe ANLEITUNG.md
// ============================================================================
const SITE_CONFIG = {

  // --- DEINE DATEN ----------------------------------------------------------
  coachName: "zBerth",                        // Dein Anzeigename (Header, Hero, Footer)
  riotId: "zBerth#EUW",                       // Deine Riot-ID (steht neben dem Rang-Beweis)
  region: "EUW",                              // Deine Ladder-Region
  peakRank: "Challenger 1,000+ LP · #34 EUW", // Dein Peak-Rang (Hero-Badge + Statistik-Karte)
  seasonsPlayed: "4",                         // Wie viele Sets/Seasons du gespielt hast
  profileUrl: "https://www.metatft.com/player/euw/zBerth-EUW", // Ziel des "Verify my rank"-Links

  // --- KONTAKT ---------------------------------------------------------------
  discordHandle: "kruzlinger",                // Dein Discord-Name (wird im Footer angezeigt)
  discordInviteUrl: "https://discord.com/users/282600381564059648", // Ziel des "Reach me on Discord"-Buttons
  contactEmail: "danielmemic1@gmail.com",     // E-Mail für die "e-mail me your offer"-Links
  web3formsAccessKey: "2b3105bc-2078-4c52-a019-b4b1d00b2317", // Technik des Kontaktformulars — NICHT ändern!

  // --- VIDEO (optional) -------------------------------------------------------
  // Füge hier einen YouTube-Link ein (egal ob "https://youtu.be/...", ein normaler
  // "watch?v="-Link oder nur die Video-ID) — dann erscheint automatisch eine
  // Video-Sektion auf der Seite. Feld leer lassen = keine Video-Sektion.
  videoUrl: "",
  videoTitle: "See the coaching in action",   // Überschrift über dem Video

  // --- PREISE ------------------------------------------------------------------
  // Einfach den Betrag ändern (z.B. "€20" zu "€25") — die Seite und die
  // Google-Daten aktualisieren sich automatisch. Ein leeres Feld ("") zeigt
  // stattdessen "Price on request".
  pricing: {
    session1h: "€20",   // 1-Hour Session
    session2h: "€35",   // 2-Hour Deep Dive
    plan4h: "€70",      // Starter Plan — 4 Sessions
    plan8h: "€135",     // Climb Plan — 8 Sessions
    plan12h: "€190"     // Pro Plan — 12 Sessions
  },

  // --- TEXTE (optional) --------------------------------------------------------
  // Leer lassen = der eingebaute englische Text bleibt. Eigenen Text eintragen,
  // um ihn zu ersetzen.
  texts: {
    heroSubline: "",    // Der Satz unter der großen Überschrift ganz oben
    contactIntro: ""    // Der Einleitungssatz über dem Kontaktformular
  },

  // --- TESTIMONIALS (Schüler-Bewertungen) ---------------------------------------
  // Pro Bewertung eine Zeile nach diesem Muster (Komma am Zeilenende!):
  //   { name: "MaxTFT", rank: "Emerald II → Diamond IV", quote: "Kurzes Zitat des Schülers." },
  // Solange die Liste leer ist, zeigt die Seite klar markierte Beispielkarten.
  // Bitte nur mit Einverständnis der Schüler eintragen.
  testimonials: [
  ]
};
