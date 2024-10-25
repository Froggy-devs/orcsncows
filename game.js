let orcCount = 10;
let cowCount = 0;
let milkCount = 0;
let meatCount = 0;
let weekCount = 1;
let orcStrength = 1;
let milkCooldownCows = [];
let successfulMilkings = [];

// Function to initialize cows
function initializeCows(count) {
    for (let i = 0; i < count; i++) {
        successfulMilkings.push(0);
    }
}

// Updates activity images based on allocations
function updateActivityImages() {
    let allocatedOrcs = parseInt(document.getElementById('orcInput').value) || 0;

    document.getElementById('stealingOrcsImg').style.display = "none";
    document.getElementById('milkingOrcsImg').style.display = "none";
    document.getElementById('slaughteringOrcsImg').style.display = "none";
    document.getElementById('relaxingOrcsImg').style.display = (orcCount - allocatedOrcs) > 0 ? "inline-block" : "none";

    // Show or clear error message based on allocation
    document.getElementById('message').innerText = allocatedOrcs > orcCount ? "You don't have enough orcs!" : "";
}

// Resets allocations to zero at the start of a new week
function resetAllocations() {
    document.getElementById('orcInput').value = 0;
    updateActivityImages();
}

// Process cooldown for milked cows and handle births
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

// Main function to pass the week and initiate activities
function passWeek() {
    let allocatedOrcs = parseInt(document.getElementById('orcInput').value) || 0;
    let activity = document.getElementById('activitySelect').value;

    if (allocatedOrcs > orcCount) {
        document.getElementById('message').innerText = "You don't have enough orcs!";
        return;
    }

    if (activity === "steal") {
        // Steal cows
        let cowsStolen = Math.floor(Math.random() * allocatedOrcs * orcStrength);
        cowCount += cowsStolen;
        initializeCows(cowsStolen);
        showActivitySummaries([{ text: `Orcs stole ${cowsStolen} cows.`, img: 'images/stealing.jpg' }]);

    } else if (activity === "tend") {
        // Handle milking
        let successfulMilkCount = 0;
        let milkableCows = cowCount - milkCooldownCows.length;

        let orcsPerCow = allocatedOrcs / milkableCows;
        for (let i = 0; i < milkableCows; i++) {
            let milkingChance = Math.min(1, orcsPerCow * 0.3);
            if (Math.random() < milkingChance) {
                successfulMilkCount++;
                milkCooldownCows.push({ weeks: 5 });
                cowCount--;
                successfulMilkings[i]++;
            }
        }

        showActivitySummaries([{ text: `Orcs successfully milked ${successfulMilkCount} cows.`, img: 'images/milking.jpg' }]);

    } else if (activity === "slaughter") {
        // Handle slaughtering
        let cowsSlaughtered = Math.min(allocatedOrcs, cowCount);
        cowCount -= cowsSlaughtered;
        let meatGained = cowsSlaughtered * (cowsSlaughtered >= 10 ? 2 : 1);
        meatCount += meatGained;
        orcStrength += Math.floor(meatGained / 5);

        showActivitySummaries([{ text: `Orcs gained ${meatGained} meat from slaughtering ${cowsSlaughtered} cows.`, img: 'images/slaughtering.jpg' }]);
    }

    updateCowCooldowns();

    // Update the UI as before
    document.getElementById('orcCount').innerText = orcCount;
    document.getElementById('cowCount').innerText = cowCount;
    document.getElementById('milkCount').innerText = milkCount;
    document.getElementById('meatCount').innerText = meatCount;
    document.getElementById('weekCount').innerText = ++weekCount;
    document.getElementById('cooldownCows').innerText = milkCooldownCows.length;

    // Reset allocations for the next week
    resetAllocations();
}

// Displays each activity summary screen one at a time
function showActivitySummaries(activitySummaries) {
    let currentActivityIndex = 0;

    function displayNextActivity() {
        if (currentActivityIndex >= activitySummaries.length) {
            continueGame();
            return;
        }

        const { text, img } = activitySummaries[currentActivityIndex++];
        document.getElementById('summaryText').innerText = text;
        document.getElementById('activityImage').src = img;
    }

    document.getElementById('gameScreen').style.display = 'none';
    document.getElementById('summaryScreen').style.display = 'block';
    displayNextActivity();

    document.getElementById('nextActivityButton').onclick = displayNextActivity;
}

// Continue to the next week, reset allocations, and show the main screen
function continueGame() {
    document.getElementById('summaryScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';
    resetAllocations();
}

function updateActivityFields() {
    // When the activity changes, reset the orc input to zero
    document.getElementById('orcInput').value = 0;
    updateActivityImages();
}
