📘 README.md
markdown
# Decla Monitoring A11Y – Crawler + Dashboard

Ce projet permet suivre automatiquement l'état de plusieurs centaines de déclaration d'accessibilité en :

1. parcourant chaque URL via Puppeteer  
2. extrayant les informations d’accessibilité  
3. générant un rapport daté  
4. affichant un dashboard interactif avec graphiques

---

## 🚀 Fonctionnalités

- Analyse automatique de centaine de pages
- Extraction des informations d’accessibilité  
- Génération d’un fichier `results.json`
- Génération d’un rapport daté dans `reports/`
- Dashboard HTML interactif (Chart.js)
- Visualisation :
  - Etat de la conformité
  - Referentiel
  - Expiration des déclarations
  - Nombre de point de non-conformité


---

## 📁 Structure du projet

```bash
project/
│
├── crawler.js
├── report.js
├── declaData.json
│
├── results.json
├── reports/
│     └── report-YYYY-MM-DD-HH-MM-SS.json
│
└── dashboard/
	  └── index.html
```


---

## 📦 Installation

```bash
npm install
npm install puppeteer p-limit
```

S'il y a des problèmes pour installer puppeteer, vous pouvez installer chrome headless manuellement :
```bash
set PUPPETEER_SKIP_DOWNLOAD=true
set NODE_TLS_REJECT_UNAUTHORIZED=0
npx puppeteer browser install chrome
```

🔍 Lancer le crawler
```bash
node crawler.js
```
Ce script :
- lit pages.json
- ouvre chaque page
- extrait les informations
- génère results.json

📊 Générer un rapport daté
```bash
node report.js
```

Le rapport est enregistré dans :
```Code
/reports/report-YYYY-MM-DD-HH-MM-SS.json
```
📈 Afficher le dashboard
Le dashboard se trouve dans :

```Code
dashboard/index.html
```

---

📜 Licence
Projet interne – usage réservé.