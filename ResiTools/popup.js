//=============================================================================================
//====================================== Startup ==============================================
//=============================================================================================

//show only welcomeDiv on startup, set others to hidden

let notificationsDiv = document.getElementById("notificationsDiv");
if (notificationsDiv) { notificationsDiv.style.display = "block"; }

let remindersDiv = document.getElementById("remindersDiv");
if (remindersDiv) { remindersDiv.style.display = "none"; }

let templatesDiv = document.getElementById("templatesDiv");
if (templatesDiv) { templatesDiv.style.display = "none"; }

let TWoSDiv = document.getElementById("TWoSDiv");
if (TWoSDiv) { TWoSDiv.style.display = "none"; }

let mySettingsDiv = document.getElementById("mySettingsDiv");
if (mySettingsDiv) { mySettingsDiv.style.display = "none"; }


let aboutDiv = document.getElementById("aboutDiv");
if (aboutDiv) { aboutDiv.style.display = "none"; }

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

let notificationsBtn = document.getElementById("notificationsBtn");
if (notificationsBtn) { notificationsBtn.addEventListener("click", function () {clickTab("notificationsDiv")}) }

let remindersBtn = document.getElementById("remindersBtn");
if (remindersBtn) { remindersBtn.addEventListener("click", function () {clickTab("remindersDiv")}); }

let templatesBtn = document.getElementById("templatesBtn");
if (templatesBtn) {
    templatesBtn.addEventListener("click", function () {
    clickTab("templatesDiv");
    loadTemplates();
    });
}

let TWoSBtn = document.getElementById("TWoSBtn");
if (TWoSBtn) { TWoSBtn.addEventListener("click", function () {clickTab("TWoSDiv")}); }

let mySettingsBtn = document.getElementById("mySettingsBtn");
if (mySettingsBtn) { mySettingsBtn.addEventListener("click", function () {clickTab("mySettingsDiv");}); }

let aboutBtn = document.getElementById("aboutBtn");
if (aboutBtn) { aboutBtn.addEventListener("click", function () {clickTab("aboutDiv")}); }

function clickTab(elementId) {

    document.getElementById("notificationsDiv").style.display = "none";
    document.getElementById("remindersDiv").style.display = "none";
    document.getElementById("templatesDiv").style.display = "none";
    document.getElementById("TWoSDiv").style.display = "none";
    document.getElementById("mySettingsDiv").style.display = "none";
    document.getElementById("aboutDiv").style.display = "none";

    document.getElementById(elementId).style.display = "block";
}

//=============================================================================================
//================================== Default Templates ========================================
//=============================================================================================

//check for selected

//update template
let updateTemplateBtn = document.getElementById("updateTemplateBtn");
if (updateTemplateBtn) {
    updateTemplateBtn.addEventListener("click", updateTemplate);
}

function updateTemplate () {
    let confirmUpdate = confirm("Do you wish to update template?");
    if (confirmUpdate == false) {
        return;
    }

    //check title and desc are not empty
    let updateName = document.getElementById("editTemplateName").value;
    let updateDescription = document.getElementById("editTemplateDescription").value;

    if (updateName === "") {
        alert("Template name cannot be empty!");
        return;
    } else if (updateDescription === "") {
        alert("Template description cannot be empty!");
        return;
    }

    var templateId = document.getElementsByClassName("list-group-item active")[0].id;

    chrome.storage.sync.get(["myTemplates"], function (result) {
        if (result.myTemplates != undefined) {
            console.log("Retrieved Storage from Chrome: myTemplates");
            var myTemplates = result.myTemplates;
            for (i = 0; i < myTemplates.length; i++) {
                if (myTemplates[i][0] == templateId) {
                    myTemplates.splice(i, 1);
                    myTemplates.splice(i, 0, [updateName.replace(/\s+/g, '-'), updateDescription.split('\n')]);
                    setStorage({"myTemplates": myTemplates});
                    loadTemplates();
                    $('#editTemplate').modal('hide');
                    return;
                }
            }
        }
    });
}

//edit template, open modal with current information
let editTemplateBtn = document.getElementById("editTemplateBtn");
if (editTemplateBtn) {
    editTemplateBtn.addEventListener("click", editTemplate);
}

function editTemplate() {
    try {
        var templateId = document.getElementsByClassName("list-group-item active")[0].id;
        document.getElementById("editTemplateName").value = templateId.replace(/-/g, ' ');
        $('#editTemplate').modal('show');
        chrome.storage.sync.get(["myTemplates"], function (result) {
            if (result.myTemplates != undefined) {
                console.log("Retrieved Storage from Chrome: myTemplates");
                var myTemplates = result.myTemplates;
                for (i = 0; i < myTemplates.length; i++) {
                    if (myTemplates[i][0] == templateId) {
                        document.getElementById("editTemplateDescription").value = myTemplates[i][1].join('\n');
                    }
                }
            }
        });
    } catch(err) {
        console.log("editTemplate() Error: " + err);
        return;
    }
}

//delete button
let deleteTemplateBtn = document.getElementById("deleteTemplateBtn");
if (deleteTemplateBtn) {
    deleteTemplateBtn.addEventListener("click", deleteTemplate);
}

function deleteTemplate() {
    try {
        var templateId = document.getElementsByClassName("list-group-item active")[0].id;
        var confirmDeletion = confirm('Do you wish to delete template: "' + templateId.replace(/-/g, ' ') + '"');
        if (confirmDeletion == true) {
            //delete template with that id
            chrome.storage.sync.get(["myTemplates"], function (result) {
                if (result.myTemplates != undefined) {
                    console.log("Retrieved Storage from Chrome: myTemplates");
                    var myTemplates = result.myTemplates;
                    for (i = 0; i < myTemplates.length; i++) {
                        if (myTemplates[i][0] == templateId) {
                            myTemplates.splice(i, 1);
                            setStorage({"myTemplates": myTemplates});
                            loadTemplates();
                            return;
                        }
                    }
                }
            });
        }
        return;
    } catch(err) {
        console.log("deleteTemplate() Error: " + err);
        return;
    }
}

//add template
let addTemplateBtn = document.getElementById("addTemplateBtn");
if (addTemplateBtn) {
    addTemplateBtn.addEventListener("click", addTemplate);
}

function addTemplate() {
    let templateName = document.getElementById("templateName").value;
    let templateDescription = document.getElementById("templateDescription").value;

    //check not empty
    if (templateName === "") {
        alert("Template Name must not be empty!");
        return;
    } else if (templateDescription === "") {
        alert("Template Description must not be empty!");
        return;
    //} else if (checkSpecialChar(templateName)) {
        //alert("Template Name cannot contain special characters!")
        //return;
    }

    templateDescription = templateDescription.split('\n');

    storeName = templateName.replace(/\s+/g, '-');

    //store template isn sync
    storeTemplate(storeName, templateDescription);

}

function storeTemplate(name, description) {
    //check if templates exist already
    chrome.storage.sync.get(["myTemplates"], function (result) {
        if (result.myTemplates != undefined) { //if templates don't exist, then create
            console.log("Retrieved Storage from Chrome: myTemplates");
            var myTemplates = result.myTemplates;
            for (i = 0; i < myTemplates.length; i++) { // check doesn't exist
                if (myTemplates[i][0] === name) {
                    alert("Template Name already exists");
                    return;
                }
            }
            myTemplates.push([name, description]);
            setStorage({"myTemplates": myTemplates.sort()})
            console.log("Template " + name + " has been saved");
        } else { //if they exist, myTemplates += new template
            setStorage({"myTemplates": [[name, description]]});
            console.log("Template " + name + " has been saved");
        }

        //load new templates, close and reset modal
        loadTemplates();
        $('#addTemplate').modal('hide');
        document.getElementById("templateName").value = "";
        document.getElementById("templateDescription").value = "";
    });
}

function loadTemplates() {
    document.getElementById('myTemplates').innerHTML = "";
    document.getElementById("templateContent").innerHTML = "";

    document.getElementById("templateContent").innerHTML = "<textarea id='templateBlank' rows='7' cols='50'></textarea>";
    document.getElementById("templateBlank").disabled = true;

    chrome.storage.sync.get(["myTemplates"], function (result) {
        if (result.myTemplates != undefined) { 
            console.log("Retrieved Storage from Chrome: myTemplates");

            document.getElementById("templateContent").innerHTML = "";

            document.getElementById("editTemplateBtn").disabled = false;
            document.getElementById("deleteTemplateBtn").disabled = false;
            document.getElementById("copyTemplateBtn").disabled = false;

            var myTemplates = result.myTemplates;

            if (myTemplates.length == 0) {
                document.getElementById("templateContent").innerHTML = "<textarea id='templateBlank' rows='7' cols='50'></textarea>";
                document.getElementById("templateBlank").disabled = true;
                document.getElementById("copyTemplateBtn").disabled = true;
                document.getElementById("editTemplateBtn").disabled = true;
                document.getElementById("deleteTemplateBtn").disabled = true;
            }

            for (var i = 0; i < myTemplates.length; i++) {
                if (i == 0) {
                    document.getElementById('myTemplates').innerHTML += "<a class='list-group-item py-2 active list-group-item-action' id='" + myTemplates[i][0] + "' data-toggle='list' href='#list-" + myTemplates[i][0] + "' role='tab' aria-controls='" + myTemplates[i][0] +"'>" + myTemplates[i][0].replace(/-/g, ' '); + "</a>";
                    document.getElementById("templateContent").innerHTML += "<textarea class='tab-pane show active' id='list-" + myTemplates[i][0] + "' role='tabpanel' aria-labelledby='list-" + myTemplates[i][0] +"-list' rows='7' cols='50'>"+ myTemplates[i][1].join('\n') + "</textarea>";
                } else {
                document.getElementById('myTemplates').innerHTML += "<a class='list-group-item py-2 list-group-item-action' id='" + myTemplates[i][0] + "' data-toggle='list' href='#list-" + myTemplates[i][0] + "' role='tab' aria-controls='" + myTemplates[i][0] +"'>" + myTemplates[i][0].replace(/-/g, ' '); + "</a>";
                document.getElementById("templateContent").innerHTML += "<textarea class='tab-pane' id='list-" + myTemplates[i][0] + "' role='tabpanel' aria-labelledby='list-" + myTemplates[i][0] +"-list' rows='7' cols='50'>"+ myTemplates[i][1].join('\n') + "</textarea>";
                }
            }
        }
        return;
      });
}

let copyTemplateBtn = document.getElementById("copyTemplateBtn");
if (copyTemplateBtn) {
    copyTemplateBtn.addEventListener("click", copyTemplate);
}

function copyTemplate() {
    try {
        var templateId = document.getElementsByClassName("list-group-item active")[0].id;
        var description = document.getElementById("list-" + templateId).value;
        copyTemplateText(description);
    } catch(err) {
        console.log("copyTemplate() Error: " + err);
        return;
    }
}

//=============================================================================================
//========================== Calculators Functionality ====================================
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
