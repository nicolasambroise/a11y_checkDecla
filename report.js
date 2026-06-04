// ------------------------------------------------------
//  REPORT.JS — VERSION COMPLÈTE AVEC TENDANCES PAR PAGE
//  ET PAR PROBLÈME + NETTOYAGE + FUSION + INDEX.JSON
// ------------------------------------------------------

const fs = require('fs');
const path = require('path');

// ------------------------------------------------------
// CONFIG
// ------------------------------------------------------
const INPUT_FILE = 'results.json';
const REPORTS_DIR = './reports';

// ------------------------------------------------------
// CRÉATION DU DOSSIER DES RAPPORTS
// ------------------------------------------------------
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR);
}

// ------------------------------------------------------
// GÉNÉRATION DU NOM DE FICHIER DATÉ
// ------------------------------------------------------
const now = new Date();
const date = now.toISOString().split('T')[0];
const time = now.toTimeString().split(' ')[0].replace(/:/g, '-');

const OUTPUT_FILE = path.join(REPORTS_DIR, `report-${date}-${time}.json`);

// ------------------------------------------------------
// CHARGEMENT DES DONNÉES
// ------------------------------------------------------
const results = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));

console.log(`➡️ Analyse de ${results.length} pages`);


// ------------------------------------------------------
// STRUCTURE DU RAPPORT FINAL
// ------------------------------------------------------
const report = {
  generatedAt: `${date} ${time}`,
  totalPages: results.length,
  results
};

// SAUVEGARDE DU RAPPORT
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2));
console.log(`✅ Rapport généré : ${OUTPUT_FILE}`);

// ------------------------------------------------------
// 5. GÉNÉRATION DE index.json POUR LE DASHBOARD
// ------------------------------------------------------
const reportFiles = fs.readdirSync(REPORTS_DIR)
  .filter(f => f.startsWith('report-') && f.endsWith('.json'))
  .sort();

fs.writeFileSync(
  path.join(REPORTS_DIR, 'index.json'),
  JSON.stringify(reportFiles, null, 2)
);

console.log(`📁 index.json mis à jour`);
