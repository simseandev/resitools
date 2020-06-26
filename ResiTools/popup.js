//=============================================================================================
//====================================== Startup ==============================================
//=============================================================================================












//=============================================================================================
//======================================= Utils ===============================================
//=============================================================================================

//these should really go in another file but we'll leave them here for now

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

function getStorage(key) {

}

function setStorage(key, value) {


}

//=============================================================================================
//==================================== Tab Control ============================================
//=============================================================================================

//Lines of code to ensure the page is blank on startup and only shows welcome page
document.getElementById("launcherDiv").style.display = "none";
document.getElementById("templatesDiv").style.display = "none";
document.getElementById("emailsDiv").style.display = "none";
document.getElementById("TWoSDiv").style.display = "none";
document.getElementById("mySettingsDiv").style.display = "none";

document.getElementById("welcomeDiv").style.display = "block";

let launcherBtn = document.getElementById("launcherBtn");
if (launcherBtn) {
    launcherBtn.addEventListener("click", function () {clickTab("launcherDiv")});
}

let templatesBtn = document.getElementById("templatesBtn");
if (templatesBtn) {
    templatesBtn.addEventListener("click", function () {clickTab("templatesDiv")});
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
    mySettingsBtn.addEventListener("click", function () {clickTab("mySettingsDiv")});
}

function clickTab(elementId) {

    document.getElementById("launcherDiv").style.display = "none";
    document.getElementById("templatesDiv").style.display = "none";
    document.getElementById("emailsDiv").style.display = "none";
    document.getElementById("TWoSDiv").style.display = "none";
    document.getElementById("welcomeDiv").style.display = "none";
    document.getElementById("mySettingsDiv").style.display = "none";

    document.getElementById(elementId).style.display = "block";
}

//=============================================================================================
//============================== Internal Email Templates =====================================
//=============================================================================================

//this is just a test atm

let emailExceptionBtn = document.getElementById("emailExceptionBtn");
if (emailExceptionBtn) {
    emailExceptionBtn.addEventListener("click", function () {promptEmail("WFM@2degrees.nz", "Exception", "Hi team,%0D%0DI have been doing X from X:XX to " + new Date().toLocaleString() + "%0D%0DPlease make an exception for this.%0D%0DThanks,")});
}


//base email template, rather than populating many functions
function promptEmail(mailTo, subject, body) {

    //replace /n with %0D%0 for new line
    window.open('mailto:' + mailTo + '?subject=' + subject +'&body=' + body);
}

//=============================================================================================
//========================== TWoS Calculator Functionality ====================================
//=============================================================================================

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

//=============================================================================================
//============================== Settings Functionality =======================================
//=============================================================================================

let saveSettingsBtn = document.getElementById("saveSettingsBtn");
if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener("click", function () {saveSettings()});
}

function saveSettings() {
    console.log("saveSettings function called");
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let workEmail = document.getElementById("workEmail").value;

    chrome.storage.sync.set({
        "firstName": firstName,
        "lastName": lastName,
        "workEmail": workEmail
    }, function () {
        console.log("saveSettings function saved");
    });



}