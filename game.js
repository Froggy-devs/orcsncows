let orcCount = 10;
let cowCount = 0;
let milkCount = 0;
let meatCount = 0;
let weekCount = 1;
let orcStrength = 1;
let milkCooldownCows = [];
let successfulMilkings = [];

// Initializes cow data with milk count for new cows
function initializeCows(count) {
    for (let i = 0; i < count; i++) {
        successfulMilkings.push(0);
    }
}

// Updates activity images dynamically based on current allocations
function updateActivityImages() {
    let stealOrcs = parseInt(document.getElementById('stealOrcs').value) || 0;
    let tendOrcs = parseInt(document.getElementById('tendOrcs').value) || 0;
    let slaughterOrcs = parseInt(document.getElementById('slaughterOrcs').value) || 0;
    let totalAllocatedOrcs = stealOrcs + tendOrcs + slaughterOrcs;
    let unassignedOrcs = orcCount - totalAllocatedOrcs;

    // Display relevant activity images based on allocations
    document.getElementById('stealingOrcsImg').style.display = stealOrcs > 0 ? "inline-block" : "none";
    document.getElementById('milkingOrcsImg').style.display = tendOrcs > 0 ? "inline-block" : "none";
    document.getElementById('slaughteringOrcsImg').style.display = slaughterOrcs > 0 ? "inline-block" : "none";
    document.getElementById('relaxingOrcsImg').style.display = unassignedOrcs > 0 ? "inline-block" : "none";

    // Check if allocations exceed available orcs and show/hide error message accordingly
    document.getElementById('message').innerText = (totalAllocatedOrcs > orcCount) ? "You don't have enough orcs!" : "";
}

// Reset all allocations at the beginning of a new week
function resetAllocations() {
    document.getElementById('stealOrcs').value = 0;
    document.getElementById('tendOrcs').value = 0;
    document.getElementById('slaughterOrcs').value = 0;
    updateActivityImages();
}

// Update cow cooldowns, process births, and add new orcs
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

// Passes the week, processes allocations, and calculates outcomes for each activity
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

// Show summary screen for each activity outcome
function showWeekSummary(cowsStolen, successfulMilkCount, meatGained, cowsSlaughtered) {
    let activityScreens = [
        { text: `Orcs stole ${cowsStolen} cows.`, img: 'images/stealing.jpg' },
        { text: `Orcs successfully milked ${successfulMilkCount} cows.`, img: 'images/milking.jpg' },
        { text: `Orcs gained ${meatGained} meat from slaughtering ${cowsSlaughtered} cows.`, img: 'images/slaughtering.jpg' },
        { text: `Some orcs relaxed in the camp.`, img: 'images/relaxing.jpg', condition: orcCount - totalOrcsAllocated > 0 }
    ];

    let summaryText = `Week ${weekCount} Summary:\n`;

    activityScreens = activityScreens.filter(screen => !screen.condition || screen.condition);
    let currentActivityIndex = 0;

    function nextActivityScreen() {
        if (currentActivityIndex >= activityScreens.length) {
            continueGame();
            return;
        }

        const { text, img } = activityScreens[currentActivityIndex++];
        document.getElementById('summaryText').innerText = text;
        document.getElementById('activityImage').src = img;
    }

    document.getElementById('summaryScreen').style.display = 'block';
    document.getElementById('gameScreen').style.display = 'none';
    nextActivityScreen();
}

// Proceeds to next activity or week
function continueGame() {
    document.getElementById('summaryScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';
    resetAllocations();
}
