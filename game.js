let orcCount = 10;
let cowCount = 0;
let milkCount = 0;
let meatCount = 0;
let weekCount = 1;
let orcStrength = 1;
let milkCooldownCows = [];
let successfulMilkings = [];

function initializeCows(count) {
    for (let i = 0; i < count; i++) {
        successfulMilkings.push(0);
    }
}

// Updates activity images based on allocations
function updateActivityImages() {
    let stealOrcs = parseInt(document.getElementById('stealOrcs').value) || 0;
    let tendOrcs = parseInt(document.getElementById('tendOrcs').value) || 0;
    let slaughterOrcs = parseInt(document.getElementById('slaughterOrcs').value) || 0;
    let totalAllocatedOrcs = stealOrcs + tendOrcs + slaughterOrcs;
    let unassignedOrcs = orcCount - totalAllocatedOrcs;

    document.getElementById('stealingOrcsImg').style.display = stealOrcs > 0 ? "inline-block" : "none";
    document.getElementById('milkingOrcsImg').style.display = tendOrcs > 0 ? "inline-block" : "none";
    document.getElementById('slaughteringOrcsImg').style.display = slaughterOrcs > 0 ? "inline-block" : "none";
    document.getElementById('relaxingOrcsImg').style.display = unassignedOrcs > 0 ? "inline-block" : "none";
}

// Resets orc allocations at the beginning of a new week
function resetAllocations() {
    document.getElementById('stealOrcs').value = 0;
    document.getElementById('tendOrcs').value = 0;
    document.getElementById('slaughterOrcs').value = 0;
    updateActivityImages();
}

// Update cow cooldowns and handle births
function updateCowCooldowns() {
    for (let i = 0; i < milkCooldownCows.length; i++) {
        milkCooldownCows[i].weeks--;
        if (milkCooldownCows[i].weeks <= 0) {
            cowCount++;
            orcCount++;
            milkCooldownCows.splice(i, 1);
            i--;
        }
    }
}

// Passes the week and processes allocations
function passWeek() {
    let stealOrcs = parseInt(document.getElementById('stealOrcs').value);
    let tendOrcs = parseInt(document.getElementById('tendOrcs').value);
    let slaughterOrcs = parseInt(document.getElementById('slaughterOrcs').value);
    let totalOrcsAllocated = stealOrcs + tendOrcs + slaughterOrcs;

    if (totalOrcsAllocated > orcCount) {
        document.getElementById('message').innerText = "You don't have enough orcs!";
        return;
    }

    let cowsStolen = Math.floor(Math.random() * stealOrcs * orcStrength);
    cowCount += cowsStolen;
    initializeCows(cowsStolen);

    let successfulMilkCount = 0;
    let orcsPerCow = tendOrcs / cowCount;
    let milkableCows = cowCount - milkCooldownCows.length;

    for (let i = 0; i < milkableCows; i++) {
        let milkingChance = Math.min(1, orcsPerCow * 0.3);
        if (Math.random() < milkingChance) {
            successfulMilkCount++;
            milkCooldownCows.push({ weeks: 5 });
            cowCount--;
            successfulMilkings[i]++;
            if (successfulMilkings[i] >= 5) {
                successfulMilkings.splice(i, 1);
                i--;
            }
        }
    }

    let cowsSlaughtered = Math.min(slaughterOrcs, cowCount);
    cowCount -= cowsSlaughtered;
    let meatGained = cowsSlaughtered * (cowsSlaughtered >= 10 ? 2 : 1);
    meatCount += meatGained;

    orcStrength += Math.floor(meatGained / 5);

    updateCowCooldowns();

    document.getElementById('orcCount').innerText = orcCount;
    document.getElementById('cowCount').innerText = cowCount;
    document.getElementById('milkCount').innerText = milkCount;
    document.getElementById('meatCount').innerText = meatCount;
    document.getElementById('weekCount').innerText = ++weekCount;
    document.getElementById('cooldownCows').innerText = milkCooldownCows.length;

    showWeekSummary(cowsStolen, successfulMilkCount, meatGained, cowsSlaughtered);
}

// Display summary screen between weeks
function showWeekSummary(cowsStolen, successfulMilkCount, meatGained, cowsSlaughtered) {
    let summaryText = `Week ${weekCount} Summary:\n`;
    summaryText += `Cows stolen: ${cowsStolen}\n`;
    summaryText += `Successful milkings: ${successfulMilkCount}\n`;
    summaryText += `Meat gained: ${meatGained}\n`;
    summaryText += `Cows slaughtered: ${cowsSlaughtered}`;

    document.getElementById('summaryText').innerText = summaryText;
    document.getElementById('gameScreen').style.display = 'none';
    document.getElementById('summaryScreen').style.display = 'block';
}

function continueGame() {
    document.getElementById('gameScreen').style.display = 'block';
    document.getElementById('summaryScreen').style.display = 'none';
    resetAllocations();
}
