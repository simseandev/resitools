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