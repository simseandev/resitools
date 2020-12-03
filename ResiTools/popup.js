//=============================================================================================
//====================================== Startup ==============================================
//=============================================================================================

//show only remindMeDiv, hide others.
//TODO: Later to be dynamic via settings

let remindMeDiv = document.getElementById("remindMeDiv");
if (remindMeDiv) { remindMeDiv.style.display = "block"; }

let templatesDiv = document.getElementById("templatesDiv");
if (templatesDiv) { templatesDiv.style.display = "none"; }

let calculatorsDiv = document.getElementById("calculatorsDiv");
if (calculatorsDiv) { calculatorsDiv.style.display = "none"; }

let settingsDiv = document.getElementById("settingsDiv");
if (settingsDiv) { settingsDiv.style.display = "none"; }

let aboutDiv = document.getElementById("aboutDiv");
if (aboutDiv) { aboutDiv.style.display = "none"; }

//TODO: load any settings bound to account if there are any

//=============================================================================================
//==================================== Tab Control ============================================
//=============================================================================================

//if button is clicked, execute clickTab() function and switch to tab

let remindMeBtn = document.getElementById("remindMeBtn");
if (remindMeBtn) { remindMeBtn.addEventListener("click", function () {clickTab("remindMeDiv")}); }

let templatesBtn = document.getElementById("templatesBtn");
if (templatesBtn) { templatesBtn.addEventListener("click", function () {clickTab("templatesDiv")}); }

let emailBtn = document.getElementById("emailsBtn");
if (emailBtn) { emailBtn.addEventListener("click", function () {clickTab("emailsDiv")}); }

let calculatorsBtn = document.getElementById("calculatorsBtn");
if (calculatorsBtn) { calculatorsBtn.addEventListener("click", function () {clickTab("calculatorsDiv")}); }

let settingsBtn = document.getElementById("settingsBtn");
if (settingsBtn) { settingsBtn.addEventListener("click", function () {clickTab("settingsDiv")}); }

let aboutBtn = document.getElementById("aboutBtn");
if (aboutBtn) { aboutBtn.addEventListener("click", function () {clickTab("aboutDiv")}); }

function clickTab(elementId) {

    //hide all tabs and show elementId tab

    document.getElementById("remindMeDiv").style.display = "none";
    document.getElementById("templatesDiv").style.display = "none";
    document.getElementById("calculatorsDiv").style.display = "none";
    document.getElementById("settingsDiv").style.display = "none";
    document.getElementById("aboutDiv").style.display = "none";

    document.getElementById(elementId).style.display = "block";

}

//=============================================================================================
//======================================= Utils ===============================================
//=============================================================================================

function setStorage(keyValues) {
    chrome.storage.sync.set(keyValues, function () {
        console.log("Storage has successfully been set.");
    });
}

function isStringNumber(value) { //string value eg "8.42"
    return parseFloat(value.match(/^-?\d*(\.\d+)?$/))>0;
}

function copyText(elementId) { //copy elements value to clipboard
    var text = document.getElementById(elementId).value;
    navigator.clipboard.writeText(text).then(function () {
        console.log("Copying to clipboard was successful!");
    }, function (err) {
        console.error("Could not copy text: ", err);
    });
}

function copyTemplateText(description) {
    navigator.clipboard.writeText(description).then(function () {
        console.log("Copying to clipboard was successful!");
    }, function (err) {
        console.error("Could not copy text: ", err);
    });
}

function setStorage(keyValues) {
    chrome.storage.sync.set(keyValues, function () {
        console.log("Storage has successfully been set.");
    });
}

function wait(time) { //MUST BE ASYNC FUNCTION TO CALL THIS
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

function checkSpecialChar(title) {

    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (format.test(title)) {
        return true;
    } else {
        return false;
    }

}

//=============================================================================================
//===================================== Templates =============================================
//=============================================================================================

let addTemplateBtn = document.getElementById("addTemplateBtn");
if (addTemplateBtn) { addTemplateBtn.addEventListener("click", function () {addTemplate()}); }

function addTemplate() {

    let templateName = document.getElementById("templateName").value;
    let templateDescription = document.getElementById("templateDescription").value;

    //TODO: other error checks, length and not already in use

    //check inputs are valid
    if (templateName === "") {
        alert("Template Name must not be empty!");
        return;
    } else if (templateName.length >= 32) {
        alert("Template Name must not be more than 32 characters!")
        return;
    } else if (templateDescription === "") {
        alert("Template Description must not be empty!");
        return;
    }

    storeTemplate(templateName, templateDescription.split('\n'));
}

function storeTemplate(templateName, templateDescription) {
    
}








//=============================================================================================
//============================== Calculators Functionality ====================================
//=============================================================================================

// Sets twosCalcDiv as default tab and hides surchargeCalcDiv
let twosCalcDiv = document.getElementById("twosCalcDiv");
if (twosCalcDiv) { twosCalcDiv.style.display = "block"; }

let surchargeCalcDiv = document.getElementById("surchargeCalcDiv");
if (surchargeCalcDiv) { surchargeCalcDiv.style.display = "none"; }

//Swap between tabs onclick
let twosCalcTab = document.getElementById("twosCalcTab");
if (twosCalcTab) { twosCalcTab.addEventListener("click", function () {clickCalcTab("twosCalcDiv")}); }

let surchargeCalcTab = document.getElementById("surchargeCalcTab");
if (surchargeCalcTab) { surchargeCalcTab.addEventListener("click", function () {clickCalcTab("surchargeCalcDiv")}); }

function clickCalcTab(elementId) {

    document.getElementById("twosCalcDiv").style.display = "none";
    document.getElementById("surchargeCalcDiv").style.display = "none";

    document.getElementById(elementId).style.display = "block";
}

// ---------- TWoS Calculator logic ----------
let calculateBtn = document.getElementById("calculateBtn");
if (calculateBtn) {
    calculateBtn.addEventListener("click", calculateTimeWithoutService);
}

let copyAmountBtn = document.getElementById("copyAmountBtn");
if (copyAmountBtn) {
    copyAmountBtn.addEventListener("click", function () {copyText("resultAmount")});
}

let copyStringBtn = document.getElementById("copyStringBtn");
if (copyStringBtn) {
    copyStringBtn.addEventListener("click", function () {copyText("resultString")});
}

function calculateTimeWithoutService() {
    let monthlyCosts = document.getElementById("monthlyCosts").value;
    let timeWithoutService = document.getElementById("timeWithoutService").value;
    let approvedBy = document.getElementById("approvedBy").value;

    if (monthlyCosts === "") {
        alert("Monthly Costs field cannot be empty!");
        return;
    } else if (!isStringNumber(monthlyCosts)) {
        alert("Monthly Costs field must be a number!");
        return;
    } 

    if (timeWithoutService === "") {
        alert("Time Without Service field cannot be empty!");
        return;
    } else if (!isStringNumber(timeWithoutService)) {
        alert("Time Without Service field must be a number!");
        return;
    }

    if (approvedBy === "") {
        alert("Approved by field cannot be empty!");
        return;
    }
    
    let reversalAmount = ((monthlyCosts * 12 / 365) * timeWithoutService).toFixed(2);

    document.getElementById("resultAmount").value = reversalAmount;
    document.getElementById("resultString").value = "Hi team. Please reverse $" + reversalAmount + " for " + timeWithoutService + " days of TWoS. Approved by " + approvedBy + ".";
}

// ---------- Surcharge Calculator logic ----------
let calculateSurchargeBtn = document.getElementById("calculateSurchargeBtn");
if (calculateSurchargeBtn) {
    calculateSurchargeBtn.addEventListener("click", calculateSurcharge);
}

function calculateSurcharge () {
    let amount = document.getElementById("beforeSurcharge").value;
    
    //check is number and not empty
    if (amount == "") {
        alert("Amount cannot be empty!");
        return;
    } else if (isStringNumber(amount) == false) {
        alert("Amount must be a number!");
        return;
    }

    document.getElementById("surchargeAmount").value = (parseInt(amount) * 1.0175).toFixed(2);
}

//copy button
let copySurchargeBtn = document.getElementById("copySurchargeBtn");
if (copySurchargeBtn) { copySurchargeBtn.addEventListener("click", function () {copyText("surchargeAmount")});}

//=============================================================================================
//============================== Settings Functionality =======================================
//=============================================================================================



//=============================================================================================
//============================== About Page Functionality =====================================
//=============================================================================================

//Preset the two divs to show nothing just for now...
let aboutMenuDiv = document.getElementById("aboutMenuDiv");
if (aboutMenuDiv) { aboutMenuDiv.style.display = "block"; }

let reportMenuDiv = document.getElementById("reportMenuDiv");
if (reportMenuDiv) { reportMenuDiv.style.display = "none"; }

//About Page Tab control functionality
let aboutMenuTab = document.getElementById("aboutMenuTab");
if (aboutMenuTab) { aboutMenuTab.addEventListener("click", function () {clickNavTab("aboutMenuDiv")}); }

let reportMenuTab = document.getElementById("reportMenuTab");
if (reportMenuTab) { reportMenuTab.addEventListener("click", function () {clickNavTab("reportMenuDiv")}); }

function clickNavTab(elementId) {

    document.getElementById("aboutMenuDiv").style.display = "none";
    document.getElementById("reportMenuDiv").style.display = "none";

    document.getElementById(elementId).style.display = "block"; 
}
