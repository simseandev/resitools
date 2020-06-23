
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
    
    let reversalAmount = (monthlyCosts / 30.44 * timeWithoutService).toFixed(2);

    document.getElementById("resultAmount").value = "$" + reversalAmount;

    document.getElementById("resultString").value = "Hi team. Please reverse $" + reversalAmount + " for " + timeWithoutService + " days of TWoS. Approved by " + approvedBy + ".";
}

function copyAmount() {

}

function copyString() {

}

function isInteger(value) {
    return /^\d+$/.test(value);
  }