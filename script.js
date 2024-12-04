let date_decla = "",date_revision = "",referentiel = "", auditeur_const = "",auditeur_name = "";
	
const url_root = document.querySelector(".basic-information.website-name") ? document.querySelector(".basic-information.website-name").textContent : "" ;
const conf = document.querySelector(".basic-information.conformance-status > b, .basic-information.conformance-status > strong") ? document.querySelector(".basic-information.conformance-status > b, .basic-information.conformance-status > strong").textContent : "";
if(document.querySelector(".basic-information.statement-created-date")){
	date_decla = document.querySelector(".basic-information.statement-created-date") ? document.querySelector(".basic-information.statement-created-date").textContent : "";
	date_revision  = document.querySelector(".basic-information.statement-renewal-date") ? document.querySelector(".basic-information.statement-renewal-date").textContent : "";
	referentiel = document.querySelector(".basic-information.statement-created-date").parentElement ? document.querySelector(".basic-information.statement-created-date").parentElement.getElementsByTagName('A')[0].textContent : "";
	auditeur_const = document.querySelector(".basic-information.statement-created-date").parentElement ? document.querySelector(".basic-information.statement-created-date").parentElement.textContent : "";
	if(auditeur_const.indexOf("Idéance") > 1 ) auditeur_name = "Idéance";
	else if(auditeur_const.indexOf("Access42") > 1 ) auditeur_name = "Access42";
	else if(auditeur_const.indexOf("auto-évaluation") > 1 ) auditeur_name = "auto-évaluation";
	else if(auditeur_const.indexOf("Service Information et Presse") > 1) auditeur_name = "Service Information et Presse";
	else auditeur_name = "???";
}

const nb_nc = document.querySelectorAll(".technical-information.accessibility-limitations.non-compliant") ? document.querySelectorAll(".technical-information.accessibility-limitations.non-compliant").length : "";
const nc_details = document.querySelectorAll(".technical-information.accessibility-limitations.non-compliant") && document.querySelectorAll(".technical-information.accessibility-limitations.non-compliant")[0] ? document.querySelectorAll(".technical-information.accessibility-limitations.non-compliant")[0].parentElement.innerHTML : "";
const nb_cd = document.querySelectorAll(".technical-information.accessibility-limitations.disproportionate-burden") ? document.querySelectorAll(".technical-information.accessibility-limitations.disproportionate-burden").length : "";
const cd_details = document.querySelectorAll(".technical-information.accessibility-limitations.disproportionate-burden") && document.querySelectorAll(".technical-information.accessibility-limitations.disproportionate-burden")[0] ? document.querySelectorAll(".technical-information.accessibility-limitations.disproportionate-burden")[0].parentElement.innerHTML : "";
const nb_ex = document.querySelectorAll(".technical-information.accessibility-limitations.exception") ? document.querySelectorAll(".technical-information.accessibility-limitations.exception").length : "";
const ex_details = document.querySelectorAll(".technical-information.accessibility-limitations.exception") && document.querySelectorAll(".technical-information.accessibility-limitations.exception")[0] ? document.querySelectorAll(".technical-information.accessibility-limitations.exception")[0].parentElement.innerHTML : "";
const email_contact = document.querySelector(".email.u-email") ? document.querySelector(".email.u-email").textContent : "";
const organization = document.querySelector(".basic-information.organization-name") ? document.querySelector(".basic-information.organization-name").textContent : "";

const access_features = document.querySelector(".technical-information.accessibility-features") ? document.querySelector(".technical-information.accessibility-features").textContent : "";

/* Check */
let msg = ""
if(url_root == "" ) msg += "<li>Pas d'URL</li>";
if(conf == "" ) msg += "<li>Pas de conformité indiqué</li>";
if(date_decla == "" ) msg += "<li>Pas de Date de Décla</li>";
if(date_revision != "" && date_revision < date_decla) msg += "<li>Problème avec la date de révision</li>";
//if( [max(date_decla, date_review) <= 3 year)  msg += "<li>La date de la décla est trop vieille</li>";
if(referentiel == "" ) msg += "<li>Pas de notion du référentiel utilisé</li>";
//if(referentiel != "RAWeb 1" ) msg += "<li>Le référentiel utilisé n'est pas standart</li>";
if(nb_cd > 5 ) msg += "<li>Nombre de charges disproportionnées trop important</li>";
if(nb_ex > 5 ) msg += "<li>Nombre d'exemptions trop important</li>"; 
if(email_contact == "" ) msg += "<li>Pas d'email de contact</li>";
if(organization == "" ) msg += "<li>Pas d'organisation indiqué</li>";
if(auditeur_name == "" ) msg += "<li>Pas d'auditeur induqué</li>";
if(organization == "" ) msg += "<li>Pas d'organisation indiqué</li>";

if(msg != "") msg = "<ul>"+msg+"</ul>"
else msg = "La décla est valide !";

/* Panel */
let checkA11YPanel = document.createElement('div');
checkA11YPanel.setAttribute("id", "checkA11YPanel");
checkA11YPanel.innerHTML = '<div class="panel-header" style="width: 345px;padding-left: 5px;padding-right: 5px;margin-bottom: 10px;"><h1 style="margin :0 !important; font-size: 2.4rem !important;    line-height: 3.6rem !important;text-align: right !important;    background-color: white !important;   text-transform: capitalize !important;   position: relative !important;   display: block !important;    color: rgb(3, 83, 132) !important;font-weight: bold !important;    font-family: Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif !important;    letter-spacing: 0px !important;box-shadow: none !important;    margin: 0px 1.5rem 0px 0px !important;    padding: 0px !important;">Accessibility check</h1></div><div class="panel-body" style="width: 345px;padding-left: 5px;padding-right: 5px;color: black;    overflow-y: auto !important;height: calc(100% - 2.4rem) !important; background-color: white !important; padding-bottom: 50px !important;">'+msg+'</div>';
checkA11YPanel.setAttribute("style","position: fixed !important;top: 0px !important; height: 100% !important;z-index: 70000 !important;display: block !important;  visibility: visible !important;opacity: 1 !important;direction: ltr !important; background-color: white !important; border-style: none solid none none !important;margin: 0px 0px 0px 0px !important;border-right: 3px solid rgb(3, 83, 132) !important;font-family: Calibri, Candara, Segoe, 'Segoe UI', Optima, Arial, sans-serif;letter-spacing: normal !important;");

document.body.appendChild(checkA11YPanel);
