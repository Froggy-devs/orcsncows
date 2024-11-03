let week = 1;
let orcs = 10;
let unmilkedCows = 0;
let orcsBornThisWeek = 0;
let selectedAction = null;

// Cooldown and milking stages
let milkCooldowns = [0, 0, 0, 0, 0];
let milkingStages = [0, 0, 0, 0, 0];
let unmilkableCows = 0;

// Calculate total milkable cows
function calculateMilkableCows() {
    return unmilkedCows + milkingStages.slice(0, 4).reduce((a, b) => a + b, 0);
}

// Progress cow cooldowns each week
function cooldownProgress() {
    orcs += milkCooldowns[4];
    for (let i = milkCooldowns.length - 1; i > 0; i--) {
        milkCooldowns[i] = milkCooldowns[i - 1];
    }
    milkCooldowns[0] = 0;
}

// Function for selecting an action
function selectAction(action) {
    selectedAction = action;
    document.getElementById("action-img").src = `images/${action}.jpg`;
}

// Milking function
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

// Stealing function
function stealing() {
    let stolenCows = Math.floor(Math.random() * orcs);
    unmilkedCows += stolenCows;
    orcsBornThisWeek = 0;
}

// Relaxing function
function relaxing() {
    orcsBornThisWeek = 0;
}

// Function to execute the selected action, progress the week, and display the summary
function nextWeek() {
    if (!selectedAction) return;

    // Execute the chosen action
    if (selectedAction === 'milking') milking();
    else if (selectedAction === 'stealing') stealing();
    else if (selectedAction === 'relaxing') relaxing();

    // Progress to the next week
    cooldownProgress();
    displaySummary();

    // Reset for the next week
    selectedAction = null;
    document.getElementById("week-number").innerText = ++week;

    // Switch to summary screen
    document.getElementById("action-selection").style.display = "none";
    document.getElementById("summary-screen").style.display = "block";
}

// Display weekly summary
function displaySummary() {
    let milkableCows = calculateMilkableCows();
    let totalCows = milkableCows + unmilkableCows + milkCooldowns.reduce((a, b) => a + b, 0);

    let summaryText = `This week, the orcs chose to ${selectedAction}.<br>
        Orcs born this week: ${orcsBornThisWeek}.<br>
        Total cows: ${totalCows}.<br>
        Milkable cows: ${milkableCows}.<br>
        Cows in cooldown stages: ${milkCooldowns.join(", ")}.<br>`;

    document.getElementById("summary-text").innerHTML = summaryText;
    document.getElementById("orcs-count").innerText = orcs;
    document.getElementById("total-cows-count").innerText = totalCows;
    document.getElementById("milkable-cows-count").innerText = milkableCows;
    document.getElementById("orcs-born-count").innerText = orcsBornThisWeek;
}

// Return to action selection for the next week
function goToActionSelection() {
    document.getElementById("summary-screen").style.display = "none";
    document.getElementById("action-selection").style.display = "block";
}
