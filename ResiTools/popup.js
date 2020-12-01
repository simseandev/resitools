//=============================================================================================
//====================================== Startup ==============================================
//=============================================================================================

//show only welcomeDiv on startup, set others to hidden

let launcherDiv = document.getElementById("launcherDiv");
if (launcherDiv) { launcherDiv.style.display = "none"; }

let templatesDiv = document.getElementById("templatesDiv");
if (templatesDiv) {
     templatesDiv.style.display = "none";
    }

let emailsDiv = document.getElementById("emailsDiv");
if (emailsDiv) { emailsDiv.style.display = "none"; }

let TWoSDiv = document.getElementById("TWoSDiv");
if (TWoSDiv) { TWoSDiv.style.display = "none"; }

let mySettingsDiv = document.getElementById("mySettingsDiv");
if (mySettingsDiv) { mySettingsDiv.style.display = "none"; }

let welcomeDiv = document.getElementById("welcomeDiv");
if (welcomeDiv) { welcomeDiv.style.display = "block";}

let aboutDiv = document.getElementById("aboutDiv");
    if (aboutDiv) { aboutDiv.style.display = "none"; }

//=============================================================================================
//======================================= Utils ===============================================
//=============================================================================================



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
//==================================== Tab Control ============================================
//=============================================================================================

let launcherBtn = document.getElementById("launcherBtn");
if (launcherBtn) {
    launcherBtn.addEventListener("click", function () {clickTab("launcherDiv")});
}

let templatesBtn = document.getElementById("templatesBtn");
if (templatesBtn) {
    templatesBtn.addEventListener("click", function () {
        clickTab("templatesDiv");
        // loadTemplates();
    });
}

let emailBtn = document.getElementById("emailsBtn");
if (emailBtn) {
    emailBtn.addEventListener("click", function () {clickTab("emailsDiv")});
}

let TWoSBtn = document.getElementById("TWoSBtn");
if (TWoSBtn) {
    TWoSBtn.addEventListener("click", function () {clickTab("TWoSDiv")});
}

let mySettingsBtn = document.getElementById("mySettingsBtn");
if (mySettingsBtn) {
    mySettingsBtn.addEventListener("click", function () {
        clickTab("mySettingsDiv");
        loadSettings();
    });
}

let aboutBtn = document.getElementById("aboutBtn");
if (aboutBtn) { 
    aboutBtn.addEventListener("click", function () {clickTab("aboutDiv")});
}

function clickTab(elementId) {

    document.getElementById("launcherDiv").style.display = "none";
    document.getElementById("templatesDiv").style.display = "none";
    // document.getElementById("emailsDiv").style.display = "none";
    document.getElementById("TWoSDiv").style.display = "none";
    document.getElementById("welcomeDiv").style.display = "none";
    document.getElementById("mySettingsDiv").style.display = "none";
    document.getElementById("aboutDiv").style.display = "none";

    document.getElementById(elementId).style.display = "block";
}

function loadSettings() {

    //firstName
    chrome.storage.sync.get(["firstName"], function (result) {
        if (result.firstName != undefined) {
            console.log("Retrieved Storage from Chrome: firstName");
            document.getElementById("firstName").value = result.firstName;
        }
      });

    //lastName
    chrome.storage.sync.get(["lastName"], function (result) {
        if (result.lastName != undefined) {
            console.log("Retrieved Storage from Chrome: lastName");
            document.getElementById("lastName").value = result.lastName;
        }
      });

    //workEmail
    chrome.storage.sync.get(["workEmail"], function (result) {
        if (result.workEmail != undefined) {
            console.log("Retrieved Storage from Chrome: workEmail");
            document.getElementById("workEmail").value = result.workEmail;
        }
      });
}

//=============================================================================================
//===================================== Templates =============================================
//=============================================================================================



//=============================================================================================
//============================== Calculators Functionality ====================================
//=============================================================================================

// --------- Preset the two divs... ----------
let twosCalcDiv = document.getElementById("twosCalcDiv");
if (twosCalcDiv) { 
    twosCalcDiv.style.display = "block";
}

let surchargeCalcDiv = document.getElementById("surchargeCalcDiv");
if (surchargeCalcDiv) { 
    surchargeCalcDiv.style.display = "none"; 
}

//Calculators Page Tab control functionality
let twosCalcTab = document.getElementById("twosCalcTab");
if (twosCalcTab) {
    twosCalcTab.addEventListener("click", function () {clickCalcTab("twosCalcDiv")});
}

let surchargeCalcTab = document.getElementById("surchargeCalcTab");
if (surchargeCalcTab) {
    surchargeCalcTab.addEventListener("click", function () {clickCalcTab("surchargeCalcDiv")});
}

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
if (copySurchargeBtn) {
    copySurchargeBtn.addEventListener("click", function () {copyText("surchargeAmount")});
}

//=============================================================================================
//============================== Settings Functionality =======================================
//=============================================================================================

let saveSettingsBtn = document.getElementById("saveSettingsBtn");
if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener("click", function () {saveSettings()});
}

function saveSettings() {
    let firstName = document.getElementById("firstName");
    let lastName = document.getElementById("lastName");
    let workEmail = document.getElementById("workEmail");

    //inputs must not be empty
    if (firstName.value == "") {
        alert("First name cannot be empty!");
        firstName.focus();
        return;
    } else if (lastName.value === "") {
        alert("Last name cannot be empty!");
        lastName.focus();
        return;
    } else if (workEmail.value === "") {
        alert("Work email cannot be empty!");
        workEmail.focus();
        return;
    }

    setStorage({
        "firstName": firstName.value,
        "lastName": lastName.value,
        "workEmail": workEmail.value
    });

    alert("Settings successfully updated!");
}

//=============================================================================================
//============================== About Page Functionality =====================================
//=============================================================================================

//Preset the two divs to show nothing just for now...
let aboutMenuDiv = document.getElementById("aboutMenuDiv");
if (aboutMenuDiv) { 
    aboutMenuDiv.style.display = "block";
}

let reportMenuDiv = document.getElementById("reportMenuDiv");
if (reportMenuDiv) { 
    reportMenuDiv.style.display = "none"; 
}

//About Page Tab control functionality
let aboutMenuTab = document.getElementById("aboutMenuTab");
if (aboutMenuTab) {
    aboutMenuTab.addEventListener("click", function () {clickNavTab("aboutMenuDiv")});
}

let reportMenuTab = document.getElementById("reportMenuTab");
if (reportMenuTab) {
    reportMenuTab.addEventListener("click", function () {clickNavTab("reportMenuDiv")});
}

function clickNavTab(elementId) {

    document.getElementById("aboutMenuDiv").style.display = "none";
    document.getElementById("reportMenuDiv").style.display = "none";

    document.getElementById(elementId).style.display = "block"; 
}
