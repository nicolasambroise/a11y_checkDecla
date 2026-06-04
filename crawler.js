// ---------------------------------------------
//  CRAWLER COMPLET POUR 100 PAGES DECLA
//  Node.js + Puppeteer + p-limit
// ---------------------------------------------

const fs = require('fs');
const pLimit = require('p-limit');
const puppeteer = require('puppeteer');

// ---------------------------------------------
// CONFIG
// ---------------------------------------------
const INPUT_FILE = 'declaData.json';
const OUTPUT_FILE = 'results.json';
const CONCURRENCY = 5; // nombre de pages en parallèle
const TIMEOUT = 60000; // timeout navigation

// ---------------------------------------------
// CHARGEMENT DES DONNÉES
// ---------------------------------------------
const pages = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
const validPages = pages.filter(p => p.status === 200);

console.log(`➡️  ${validPages.length} pages à analyser\n`);

// ---------------------------------------------
// CHARGEMENT DU SCRIPT D'ANALYSE DE DECLA
// ---------------------------------------------
// const declaScript = fs.readFileSync('./decla.js', 'utf8');

// ---------------------------------------------
// EXTRACTEUR DOM (exécuté dans la page)
// ---------------------------------------------
function getExtractor() {
  return () => {
    const result = {
      declarations: {
        info: {
          "url": "",
          "conf" : "",
          "createdDate" : "",
          "renewalDate" : "",
          "referential" : "",
          "auditorName" : "",
          "emailContact" : "",
          "organization" : ""
        },
        nc:[],
        cd:[],
        ex:[],
        feat:[],
        valid: ""
      }
    };

    const urlRoot = document.querySelector(".basic-information.website-name") ? document.querySelector(".basic-information.website-name").textContent : "" ;
    const conf = document.querySelector(".basic-information.conformance-status > b, .basic-information.conformance-status > strong") ? document.querySelector(".basic-information.conformance-status > b, .basic-information.conformance-status > strong").textContent : "";

    const createdDateElem = document.querySelector(".basic-information.statement-created-date")

    result.declarations.info["url"] = urlRoot;
    result.declarations.info["conf"] = conf;

    const createdDate = createdDateElem ? createdDateElem.textContent : "";
    const renewalDate = createdDateElem && document.querySelector(".basic-information.statement-renewal-date") ? document.querySelector(".basic-information.statement-renewal-date").textContent : "";
    const referential = createdDateElem && createdDateElem.parentElement ? createdDateElem.parentElement.getElementsByTagName('A')[0].textContent : "";
    const auditorConst = createdDateElem && createdDateElem.parentElement ? createdDateElem.parentElement.textContent : "";
    let auditorName = "Inconnu"
    if(auditorConst.indexOf("Idéance") > 1 ) auditorName = "Idéance";
    else if(auditorConst.indexOf("Access42") > 1 ) auditorName = "Access42";
    else if(auditorConst.indexOf("auto-évaluation") > 1 ) auditorName = "auto-évaluation";
    else if(auditorConst.indexOf("Service Information et Presse") > 1) auditorName = "Service Information et Presse";

    result.declarations.info["createdDate"] = createdDate;
    result.declarations.info["renewalDate"] = renewalDate;
    result.declarations.info["referential"] = referential;
    result.declarations.info["auditorName"] = auditorName;

    const emailContact = document.querySelector(".basic-information.feedback .email") ? document.querySelector(".basic-information.feedback .email").textContent : "";
    const organization = document.querySelector(".basic-information.organization-name") ? document.querySelector(".basic-information.organization-name").textContent : "";

    result.declarations.info["emailContact"] = emailContact;
    result.declarations.info["organization"] = organization;

    const ncDetails = document.querySelectorAll(".technical-information.accessibility-limitations.non-compliant");
    const cdDetails = document.querySelectorAll(".technical-information.accessibility-limitations.disproportionate-burden");
    const exDetails = document.querySelectorAll(".technical-information.accessibility-limitations.exception") ;
    const accessFeatures = document.querySelectorAll(".technical-information.accessibility-features");

    ncDetails.forEach(item => { result.declarations["nc"].push(item.textContent); });
    cdDetails.forEach(item => { result.declarations["cd"].push(item.textContent); });
    exDetails.forEach(item => { result.declarations["ex"].push(item.textContent); });
    accessFeatures.forEach(item => { result.declarations["feat"].push(item.textContent); });

    let msg ="";
    if(urlRoot == "" ) msg += "<li>Pas d'URL</li>";
    if(conf == "" ) msg += "<li>Pas de conformité indiqué</li>";
    if(createdDate == "" ) msg += "<li>Pas de Date de Décla</li>";
    if(renewalDate != "" && Number(renewalDate.substring(renewalDate.length - 4)) < Number(createdDate.substring(createdDate.length - 4))) msg += "<li>Problème avec la date de révision</li>";
    if(referential == "" ) msg += "<li>Pas de notion du référentiel utilisé</li>";
    if(auditorName == "" ) msg += "<li>Pas d'auditeur indiqué</li>";
    if(emailContact == "" ) msg += "<li>Pas d'email de contact</li>";
    if(organization == "" ) msg += "<li>Pas d'organisation indiqué</li>";
    if(cdDetails.length > 5 ) msg += "<li>Nombre de charges disproportionnées trop important</li>";
    if(exDetails.length > 5 ) msg += "<li>Nombre d'exemptions trop important</li>";


    if(msg != "") {
      result.declarations["valid"]="<ul>" + msg + "</ul>";
    }

    return result;
  };
}

// ---------------------------------------------
// FONCTION D'ANALYSE D'UNE PAGE
// ---------------------------------------------
async function analysePage(browser, pageInfo) {
  const page = await browser.newPage();

  const allowedMsg = ['[FRC Agent] IndexedDB', 'Access to fetch at', 'has been blocked by CORS policy','chat-window-messages'];
  const allowedErr = ['TypeError: Cannot read properties of'];
  const allowedStatus = [200,201,206,301,302,303,304]
  const allowedFailed = ['https://etat.kiss.lu', 'https://eu.frcapi.com/api/v2/captcha']

  page
    .on('console', message => {
      if(!containsExpression(message.text(),allowedMsg)){
        console.log(`- ${message.type().substr(0, 3).toUpperCase()} ${message.text()} (${pageInfo.url})`);
      }
    })
    .on('pageerror', message => {
      if(!containsExpression(message,allowedErr)){
        console.log(`- ERROR ${message} (${pageInfo.url})`);
      }
    })
    .on('response', response => {
      if(!containsExpression(response.status(),allowedStatus)){
        console.log(`- STATUS ${response.status()} ${response.url()}  (${pageInfo.url})`);
      }
    })
    .on('requestfailed', request => {
      if(!containsExpression(request.url(), allowedFailed)){
        console.log(`- FAIL ${request.failure().errorText} ${request.url()}  (${pageInfo.url})`);
      }
    })

  try {
	await page.setViewport({
	  width: 1920,
	  height: 1080
	});  
	  
  await page.goto(pageInfo.url, {
    waitUntil: 'networkidle0',
    timeout: TIMEOUT
  });

	//console.log(`- LOAD ${pageInfo.url}`);
  // await page.evaluate(auditScript);
	//await page.addScriptTag({ content: auditScript });

	//await page.waitForSelector('#checkA11YPanel', { timeout: 20000 }); // 20 secondes

  const result = await page.evaluate(getExtractor());

  console.error(`✅ ${pageInfo.url}`);

    return {
      id: pageInfo.id,
      url: pageInfo.url,
      iso: pageInfo.iso,
      originalTitle: pageInfo.title,
      ...result
    };

  } catch (err) {

    //await page.screenshot({ path: `debug/debug-${pageInfo.id}.png` });
    console.error(`❌ Erreur sur ${pageInfo.url}:`, err.message);

    return {
      id: pageInfo.id,
      url: pageInfo.url,
      iso: pageInfo.iso,
      originalTitle: pageInfo.title,
      error: err.message
    };

  } finally {
    await page.close();
  }
}

function containsExpression(sentence, expressions) {
  return expressions.some(expr => sentence.toString().includes(expr));
}

// ---------------------------------------------
// PIPELINE PRINCIPAL
// ---------------------------------------------
(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--lang=fr'] });
  const limit = pLimit(CONCURRENCY);

  const tasks = validPages.map(pageInfo =>
    limit(() => analysePage(browser, pageInfo))
  );

  const results = await Promise.all(tasks);

  await browser.close();

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));

  console.log(`\n✅ Analyse terminé`);
  console.log(`📁 Résultats enregistrés dans ${OUTPUT_FILE}`);
})();