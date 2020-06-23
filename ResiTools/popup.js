
// TAB Control functionality, will hide and show tabs on button click

function navigateTab(evt, tabName){
    // Declare all variables
    var i, tabcontent, tablinks;

     // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

     // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}
//============================================================================================

//TWoS Calculator Functionality
let calculateBtn = document.getElementById("calculateBtn");
if (calculateBtn) {
    calculateBtn.addEventListener("click", calculateTimeWithoutService);
}

let copyAmount = document.getElementById("copyAmount");
if (copyAmount) {
    calculateBtn.addEventListener("click", copyAmountToClipboard);
}

let copyString = document.getElementById("copyString");
if (copyString) {
    calculateBtn.addEventListener("click", copyStringToClipboard);
}

function isInteger(value) {
    return /^\d+$/.test(value);
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

function copyAmountToClipboard() {
    var text = document.getElementById("resultAmount").value;
    navigator.clipboard.writeText(text).then(function(){
        console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
        console.error('Async: Could not copy text: ', err);
    });
}

function copyStringToClipboard() {
    var text = document.getElementById("resultString").value;
    navigator.clipboard.writeText(text).then(function(){
        console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
        console.error('Async: Could not copy text: ', err);
    });
}

