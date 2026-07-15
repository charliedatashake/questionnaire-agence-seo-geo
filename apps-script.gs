/**
 * Backend du formulaire "Fiche de différenciation par agence" In Extenso.
 *
 * A coller dans un projet Apps Script LIE au Google Sheet
 * "In Extenso - Fiche de différenciation par agence (SEO-GEO)"
 * (Extensions > Apps Script depuis le Sheet).
 *
 * Deux points d'entrée :
 * - doGet  ?action=list  : renvoie la liste des agences (onglet "Informations agences")
 * - doPost {action:"submit", ...} : enregistre une réponse dans l'onglet "Réponses"
 *   et passe le Statut de l'agence à "Rempli" dans "Informations agences".
 */

var SHEET_AGENCES = "Informations agences";
var SHEET_REPONSES = "Réponses";

// Ordre des colonnes de l'onglet "Réponses" (doit matcher les en-têtes)
var COLS = [
  "ts", "ville", "url", "slug",
  "rempli_par.nom", "rempli_par.email",
  "annee",
  "effectif.collaborateurs", "effectif.diplomes",
  "contact.telephone", "contact.horaires",
  "acces", "zone",
  "secteurs", "clients_services", "differenciation", "engagement", "digital",
  "rdv", "equipe", "photos", "langues",
  "faq", "gbp", "reussites", "partenaires", "vie_locale", "labels"
];

function doGet(e) {
  var action = e && e.parameter ? e.parameter.action : "";
  if (action === "list") {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(SHEET_AGENCES);
    var last = sh.getLastRow();
    var rows = sh.getRange(5, 1, last - 4, 3).getValues(); // A5:C = Priorité / Ville / URL
    var agences = rows
      .filter(function (r) { return r[1] && r[2]; })
      .map(function (r) { return { p: String(r[0]), v: String(r[1]), u: String(r[2]) }; });
    return json({ agences: agences });
  }
  return json({ ok: true, service: "fiche-agence-inextenso" });
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    if (data.action !== "submit") return json({ ok: false, error: "unknown action" });

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(SHEET_REPONSES);

    var flat = {
      "ts": new Date(),
      "ville": data.ville || "",
      "url": data.url || "",
      "slug": data.slug || ""
    };
    var a = data.answers || {};
    COLS.slice(4).forEach(function (key) {
      var parts = key.split(".");
      var v = a[parts[0]];
      if (parts.length === 2) v = v ? v[parts[1]] : "";
      flat[key] = (v == null) ? "" : String(v);
    });

    var row = COLS.map(function (k) { return flat[k]; });
    sh.appendRow(row);

    // Pilotage : passer le Statut a "Rempli" dans "Informations agences" (match par URL)
    if (data.url) {
      var ag = ss.getSheetByName(SHEET_AGENCES);
      var lastRow = ag.getLastRow();
      var urls = ag.getRange(5, 3, lastRow - 4, 1).getValues(); // col C
      for (var i = 0; i < urls.length; i++) {
        if (String(urls[i][0]).replace(/\/+$/, "") === String(data.url).replace(/\/+$/, "")) {
          ag.getRange(5 + i, 6).setValue("Rempli"); // col F = Statut
          break;
        }
      }
    }

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
