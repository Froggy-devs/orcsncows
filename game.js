let week = 1;
let orcs = 10;
let unmilkedCows = 0;
let orcsBornThisWeek = 0;

// Milk cooldowns and stages
let milkCooldowns = [0, 0, 0, 0, 0];
let milkingStages = [0, 0, 0, 0, 0];
let unmilkableCows = 0;

// Function to calculate total milkable cows
function calculateMilkableCows() {
    return unmilkedCows + milkingStages.slice(0, 4).reduce((a, b) => a + b, 0);
}

// Function to progress cooldowns each week
function cooldownProgress() {
    orcs += milkCooldowns[4];
    for (let i = milkCooldowns.length - 1; i > 0; i--) {
        milkCooldowns[i] = milkCooldowns[i - 1];
    }
    milkCooldowns[0] = 0;
}

// Function for milking cows
function milking() {
    let milkableCows = calculateMilkableCows();
    let cowGroups = [unmilkedCows, ...milkingStages.slice(0, 4)];
    let orcsPerGroup = cowGroups.map(cows => Math.floor(orcs * (cows / milkableCows)));
    let totalMilked = 0;

    cowGroups.forEach((cows, i) => {
        if (cows === 0 || orcsPerGroup[i] === 0) return;

        let successRate = 0.7 * (1 - 1 / (1 + (orcsPerGroup[i] / cows)));
        let milked = Array.from({ length: cows }, () => Math.random() < successRate).filter(Boolean).length;

        if (i === 0) unmilkedCows -= milked;
        else milkingStages[i - 1] -= milked;

        milkCooldowns[0] += milked;
        totalMilked += milked;
    });

    orcsBornThisWeek = Math.floor(totalMilked / 2);
    orcs += orcsBornThisWeek;
}

// Function for stealing cows
function stealing() {
    let stolenCows = Math.floor(Math.random() * orcs);
    unmilkedCows += stolenCows;
    orcsBornThisWeek = 0;
}

// Function for relaxing
function relaxing() {
    orcsBornThisWeek = 0;
}

// Main function to handle player actions
function playerAction(action) {
    document.getElementById("action-img").src = `images/${action}.jpg`;
    
    if (action === 'milking') milking();
    else if (action === 'stealing') stealing();
    else if (action === 'relaxing') relaxing();

    // Display summary
    displaySummary(action);
}

// Function to display the weekly summary
function displaySummary(action) {
    let milkableCows = calculateMilkableCows();
    let totalCows = milkableCows + unmilkableCows + milkCooldowns.reduce((a, b) => a + b, 0);

    let summaryText = `This week, the orcs chose to ${action}.<br>
        Orcs born this week: ${orcsBornThisWeek}.<br>
        Total cows: ${totalCows}.<br>
        Milkable cows: ${milkableCows}.<br>
        Cows in cooldown stages: ${milkCooldowns.join(", ")}.<br>`;

    document.getElementById("summary-text").innerHTML = summaryText;
    document.getElementById("week-number").innerText = week;
    document.getElementById("orcs-count").innerText = orcs;
    document.getElementById("total-cows-count").innerText = totalCows;
    document.getElementById("milkable-cows-count").innerText = milkableCows;
    document.getElementById("orcs-born-count").innerText = orcsBornThisWeek;
}

// Function to proceed to the next week
function nextWeek() {
    week++;
    cooldownProgress();
    document.getElementById("summary-text").innerHTML = "";  // Clear summary for the new week
    document.getElementById("action-img").src = "images/summary.jpg";  // Reset image
}
