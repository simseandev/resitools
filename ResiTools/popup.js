//=============================================================================================
//====================================== Startup ==============================================
//=============================================================================================

//config states not showing just yet


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
if (welcomeDiv) {
    getSettings();
    welcomeDiv.style.display = "block"; 
}

let aboutDiv = document.getElementById("aboutDiv");
    if (aboutDiv) { aboutDiv.style.display = "none"; }

//=============================================================================================
//======================================= Utils ===============================================
//=============================================================================================

function getSettings() {

    //firstName
    chrome.storage.sync.get(["firstName"], function (result) {
        if (result.firstName == undefined) {
            document.getElementById("configOK").style.display = "none";
            document.getElementById("configNOK").style.display = "block";
            return;
        }
    });

    //lastName
    chrome.storage.sync.get(["lastName"], function (result) {
        if (result.lastName == undefined) {
            document.getElementById("configOK").style.display = "none";
            document.getElementById("configNOK").style.display = "block";
            return;
        }
    });

    //workEmail
    chrome.storage.sync.get(["workEmail"], function (result) {
        if (result.workEmail == undefined) {
            document.getElementById("configOK").style.display = "none";
            document.getElementById("configNOK").style.display = "block";
            return;
        }
    });
    
    document.getElementById("configOK").style.display = "block";
    document.getElementById("configNOK").style.display = "none";
}

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
        loadTemplates();
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
    document.getElementById("emailsDiv").style.display = "none";
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
            setStorage({"myTemplates": myTemplates})
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
    document.querySelector(".list-group").innerHTML = "";
    document.querySelector(".tab-content").innerHTML = "";


    chrome.storage.sync.get(["myTemplates"], function (result) {
        if (result.myTemplates != undefined) { 
            console.log("Retrieved Storage from Chrome: myTemplates");

            document.getElementById("editTemplateBtn").disabled = false;
            document.getElementById("deleteTemplateBtn").disabled = false;
            document.getElementById("copyTemplateBtn").disabled = false;

            var myTemplates = result.myTemplates;

            if (myTemplates.length == 0) {
                document.getElementById("copyTemplateBtn").disabled = true;
                document.querySelector(".tab-content").innerHTML = "<textarea id='templateBlank' rows='7' cols='50'></textarea>";
                document.getElementById("templateBlank").disabled = true;
                document.getElementById("editTemplateBtn").disabled = true;
                document.getElementById("deleteTemplateBtn").disabled = true;
            }

            for (var i = 0; i < myTemplates.length; i++) {
                if (i == 0) {
                    document.querySelector(".list-group").innerHTML += "<a class='list-group-item py-2 active list-group-item-action' id='" + myTemplates[i][0] + "' data-toggle='list' href='#list-" + myTemplates[i][0] + "' role='tab' aria-controls='" + myTemplates[i][0] +"'>" + myTemplates[i][0].replace(/-/g, ' '); + "</a>";
                    document.querySelector(".tab-content").innerHTML += "<textarea class='tab-pane show active' id='list-" + myTemplates[i][0] + "' role='tabpanel' aria-labelledby='list-" + myTemplates[i][0] +"-list' rows='7' cols='50'>"+ myTemplates[i][1].join('\n') + "</textarea>";

                } else {

                
                document.querySelector(".list-group").innerHTML += "<a class='list-group-item py-2 list-group-item-action' id='" + myTemplates[i][0] + "' data-toggle='list' href='#list-" + myTemplates[i][0] + "' role='tab' aria-controls='" + myTemplates[i][0] +"'>" + myTemplates[i][0].replace(/-/g, ' '); + "</a>";
                document.querySelector(".tab-content").innerHTML += "<textarea class='tab-pane' id='list-" + myTemplates[i][0] + "' role='tabpanel' aria-labelledby='list-" + myTemplates[i][0] +"-list' rows='7' cols='50'>"+ myTemplates[i][1].join('\n') + "</textarea>";
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
//============================== Internal Email Templates =====================================
//=============================================================================================

//this is just a test atm

let emailExceptionBtn = document.getElementById("emailExceptionBtn");
if (emailExceptionBtn) {
    emailExceptionBtn.addEventListener("click", function () {promptEmail("WFM@2degrees.nz", "Exception", "Hi team,%0D%0DI have been doing Emails from X:XX to " + new Date().toLocaleString() + "%0D%0DPlease make an exception for this.%0D%0DThanks,")});
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