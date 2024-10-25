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
    let stealOrcs = parseInt(document.getElementById('stealOrcs').value) || 0;
    let tendOrcs = parseInt(document.getElementById('tendOrcs').value) || 0;
    let slaughterOrcs = parseInt(document.getElementById('slaughterOrcs').value) || 0;
    let totalAllocatedOrcs = stealOrcs + tendOrcs + slaughterOrcs;

    document.getElementById('stealingOrcsImg').style.display = stealOrcs > 0 ? "inline-block" : "none";
    document.getElementById('milkingOrcsImg').style.display = tendOrcs > 0 ? "inline-block" : "none";
    document.getElementById('slaughteringOrcsImg').style.display = slaughterOrcs > 0 ? "inline-block" : "none";
    document.getElementById('relaxingOrcsImg').style.display = (orcCount - totalAllocatedOrcs) > 0 ? "inline-block" : "none";

    // Show or clear error message based on allocation
    document.getElementById('message').innerText = totalAllocatedOrcs > orcCount ? "You don't have enough orcs!" : "";
}

// Resets allocations to zero at the start of a new week
function resetAllocations() {
    document.getElementById('stealOrcs').value = 0;
    document.getElementById('tendOrcs').value = 0;
    document.getElementById('slaughterOrcs').value = 0;
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
    // All orcs are used, so we don't need to check allocations anymore.
    let stealOrcs = 1; // All orcs go stealing
    let tendOrcs = parseInt(document.getElementById('tendOrcs').value);
    let slaughterOrcs = parseInt(document.getElementById('slaughterOrcs').value);
    
    // Update the counts based on focus
    let cowsStolen = Math.floor(Math.random() * orcCount * orcStrength);
    cowCount += cowsStolen;
    initializeCows(cowsStolen);

    // Handle milking
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

    // Handle slaughtering
    let cowsSlaughtered = Math.min(slaughterOrcs, cowCount);
    cowCount -= cowsSlaughtered;
    let meatGained = cowsSlaughtered * (cowsSlaughtered >= 10 ? 2 : 1);
    meatCount += meatGained;

    orcStrength += Math.floor(meatGained / 5);

    updateCowCooldowns();
    
    // Update the UI as before
    document.getElementById('orcCount').innerText = orcCount;
    document.getElementById('cowCount').innerText = cowCount;
    document.getElementById('milkCount').innerText = milkCount;
    document.getElementById('meatCount').innerText = meatCount;
    document.getElementById('weekCount').innerText = ++weekCount;
    document.getElementById('cooldownCows').innerText = milkCooldownCows.length;

    showActivitySummaries([
        { text: `Orcs stole ${cowsStolen} cows.`, img: 'images/stealing.jpg', condition: stealOrcs > 0 },
        { text: `Orcs successfully milked ${successfulMilkCount} cows.`, img: 'images/milking.jpg', condition: tendOrcs > 0 },
        { text: `Orcs gained ${meatGained} meat from slaughtering ${cowsSlaughtered} cows.`, img: 'images/slaughtering.jpg', condition: slaughterOrcs > 0 }
    ]);
}


// Displays each activity summary screen one at a time
function showActivitySummaries(activitySummaries) {
    activitySummaries = activitySummaries.filter(activity => activity.condition);

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
