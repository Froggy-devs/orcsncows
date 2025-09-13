// game.js

let week = 1;
let orcs = 10;
let availableElves = 0;
let orcsBornThisWeek = 0;
let selectedAction = null;

// Pregnancy stages (5 weeks until birth)
let pregnancyStages = [0, 0, 0, 0, 0];

// Calculate total breedable elves (only available ones)
function calculateBreedableElves() {
    return availableElves;
}

// Progress pregnancy stages each week
function pregnancyProgress() {
    orcsBornThisWeek = pregnancyStages[4];
    orcs += orcsBornThisWeek;
    availableElves += pregnancyStages[4]; // Elves recover after giving birth
    for (let i = pregnancyStages.length - 1; i > 0; i--) {
        pregnancyStages[i] = pregnancyStages[i - 1];
    }
    pregnancyStages[0] = 0;
}

// Function for selecting an action
function selectAction(action) {
    selectedAction = action;
    document.getElementById("action-img").src = `images/${action}.jpg`;
}

// Breeding function
function breeding() {
    let breedableElves = calculateBreedableElves();
    if (breedableElves === 0) return;

    // Improved success rate calculation for better scaling
    let successRate = 0.8 * (1 - Math.exp(-orcs / breedableElves)); // Approaches 0.8 as orcs per elf increases
    let bred = 0;

    for (let i = 0; i < breedableElves; i++) {
        if (Math.random() < successRate) bred++;
    }

    availableElves -= bred;
    pregnancyStages[0] += bred;
}

// Capturing function (improved to always capture at least 1 if orcs > 0, max up to orcs)
function capturing() {
    if (orcs === 0) return;
    let capturedElves = Math.floor(Math.random() * orcs) + 1;
    availableElves += capturedElves;
}

// Relaxing function (improved: small chance for natural orc growth or event, but keep simple for now)
function relaxing() {
    // Optional improvement: orcs recover or small bonus, but keeping as no-op for now
}

// Function to execute the selected action, progress the week, and display the summary
function nextWeek() {
    if (!selectedAction) return;

    // Progress pregnancies and births first (happens regardless of action)
    pregnancyProgress();

    // Execute the chosen action
    if (selectedAction === 'breeding') breeding();
    else if (selectedAction === 'capturing') capturing();
    else if (selectedAction === 'relaxing') relaxing();

    // Display summary
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
    let breedableElves = calculateBreedableElves();
    let totalElves = breedableElves + pregnancyStages.reduce((a, b) => a + b, 0);

    let summaryText = `This week, the orcs chose to ${selectedAction}.<br>
        New orcs born this week: ${orcsBornThisWeek}.<br>
        Total elves: ${totalElves}.<br>
        Breedable elves: ${breedableElves}.<br>
        Elves in pregnancy stages (weeks 1-5): ${pregnancyStages.join(", ")}.<br>`;

    document.getElementById("summary-text").innerHTML = summaryText;
    document.getElementById("orcs-count").innerText = orcs;
    document.getElementById("total-elves-count").innerText = totalElves;
    document.getElementById("breedable-elves-count").innerText = breedableElves;
    document.getElementById("orcs-born-count").innerText = orcsBornThisWeek;
}

// Return to action selection for the next week
function goToActionSelection() {
    document.getElementById("summary-screen").style.display = "none";
    document.getElementById("action-selection").style.display = "block";
}
