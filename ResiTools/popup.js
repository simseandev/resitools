// ============================================================================================
// ====================================== Utils ===============================================
// ============================================================================================

//these should really go in another file but we'll leave them here for now

function isInteger(value) { // returns true if integer
    return /^\d+$/.test(value);
}

function copyText(elementId) { //copy elements value to clipboard
    var text = document.getElementById(elementId).value;
    navigator.clipboard.writeText(text).then(function () {
        console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    });
}

// ============================================================================================
// =================================== Tab Control ============================================
// ============================================================================================

//Lines of code to ensure the page is blank on startup and only shows welcome page
document.getElementById("launcherDiv").style.display = "none";
document.getElementById("templatesDiv").style.display = "none";
document.getElementById("emailsDiv").style.display = "none";
document.getElementById("TWoSDiv").style.display = "none";

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

function clickTab(elementId) {

    document.getElementById("launcherDiv").style.display = "none";
    document.getElementById("templatesDiv").style.display = "none";
    document.getElementById("emailsDiv").style.display = "none";
    document.getElementById("TWoSDiv").style.display = "none";
    document.getElementById("welcomeDiv").style.display = "none";

    document.getElementById(elementId).style.display = "block";
}

// ============================================================================================
// ========================= TWoS Calculator Functionality ====================================
// ============================================================================================

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
    } else if (!isInteger(monthlyCosts)) {
        alert("Monthly Costs field must be a number!");
        return;
    }

    if (timeWithoutService === "") {
        alert("Time Without Service field cannot be empty!");
        return;
    } else if (!isInteger(timeWithoutService)) {
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