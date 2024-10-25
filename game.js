let orcCount = 10;
let cowCount = 0;
let milkCount = 0;
let meatCount = 0;
let weekCount = 1;
let orcStrength = 1;
let milkCooldownCows = [];
let successfulMilkings = [];
let currentActivity = ""; // Variable to hold the current activity

// Function to initialize cows
function initializeCows(count) {
    for (let i = 0; i < count; i++) {
        successfulMilkings.push(0);
    }
}

// Function to set the current activity based on button click
function setActivity(activity) {
    currentActivity = activity; // Update the current activity
    updateActivityImages(); // Update the images based on the activity
}

// Updates activity images based on the current activity
function updateActivityImages() {
    // Show or hide images based on selected activity
    document.getElementById('stealingOrcsImg').style.display = currentActivity === "steal" ? "inline-block" : "none";
    document.getElementById('milkingOrcsImg').style.display = currentActivity === "tend" ? "inline-block" : "none";
    document.getElementById('slaughteringOrcsImg').style.display = currentActivity === "slaughter" ? "inline-block" : "none";
}

// Resets selections at the start of a new week
function resetSelections() {
    currentActivity = ""; // Clear the current activity
    updateActivityImages(); // Clear images
}

// Process cooldown for milked cows and handle births
function updateCowCooldowns() {
    for (let i = 0; i < milkCooldownCows.length; i++) {
        milkCooldownCows[i].weeks--;
        if (milkCooldownCows[i].weeks <= 0) {
            cowCount++;
            orcCount++; // New orc born
            milkCooldownCows.splice(i, 1);
            i--;
        }
    }
}

// Main function to pass the week and initiate activities
function passWeek() {
    if (!currentActivity) {
        document.getElementById('message').innerText = "Please select an activity!";
        return;
    }

    // Use all available orcs for the chosen activity
    let allocatedOrcs = orcCount;
    let summaryText = `Week ${weekCount} Summary:\n`;

    if (currentActivity === "steal") {
        // Steal cows
        let cowsStolen = Math.floor(Math.random() * allocatedOrcs * orcStrength);
        cowCount += cowsStolen;
        initializeCows(cowsStolen);
        
        summaryText += `- ${allocatedOrcs} orcs went out to steal cows.\n`;
        summaryText += `- Orcs successfully stole ${cowsStolen} cows.\n`;

    } else if (currentActivity === "tend") {
        // Handle milking
        let successfulMilkCount = 0;
        let milkableCows = cowCount - milkCooldownCows.length;

        // If there are cows to milk, proceed with the milking
        if (milkableCows > 0) {
            let orcsPerCow = allocatedOrcs / milkableCows;

            for (let i = 0; i < milkableCows; i++) {
                let milkingChance = Math.min(1, orcsPerCow * 0.3);
                if (Math.random() < milkingChance) {
                    successfulMilkCount++;
                    milkCooldownCows.push({ weeks: 5 });
                    cowCount--;
                }
            }
            summaryText += `- ${allocatedOrcs} orcs tended to cows.\n`;
            summaryText += `- Orcs successfully milked ${successfulMilkCount} cows.\n`;
            summaryText += `- ${successfulMilkCount} cows are now in cooldown.\n`;
        } else {
            summaryText += `- ${allocatedOrcs} orcs tried to milk, but no cows were available.\n`;
        }

    } else if (currentActivity === "slaughter") {
        // Handle slaughtering
        let cowsSlaughtered = Math.min(allocatedOrcs, cowCount);
        cowCount -= cowsSlaughtered;
        let meatGained = cowsSlaughtered * (cowsSlaughtered >= 10 ? 2 : 1);
        meatCount += meatGained;
        orcStrength += Math.floor(meatGained / 5);

        summaryText += `- ${allocatedOrcs} orcs slaughtered cows.\n`;
        summaryText += `- Orcs slaughtered ${cowsSlaughtered} cows and gained ${meatGained} meat.\n`;
    }

    updateCowCooldowns();

    // Show cows leaving cooldown
    let cowsLeavingCooldown = milkCooldownCows.length > 0 ? milkCooldownCows.filter(cow => cow.weeks <= 0).length : 0;
    summaryText += `- ${cowsLeavingCooldown} cows have left cooldown.\n`;
    summaryText += `- Current number of cows: ${cowCount}\n`;
    summaryText += `- Current number of orcs: ${orcCount}\n`;

    // Update the UI
    document.getElementById('orcCount').innerText = orcCount;
    document.getElementById('cowCount').innerText = cowCount;
    document.getElementById('milkCount').innerText = milkCount;
    document.getElementById('meatCount').innerText = meatCount;
    document.getElementById('weekCount').innerText = ++weekCount;
    document.getElementById('cooldownCows').innerText = milkCooldownCows.length;

    // Show the detailed summary
    showActivitySummaries([{ text: summaryText, img: 'images/summary.jpg' }]);
    
    // Reset selections for the next week
    resetSelections();
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

// Continue to the next week, reset selections, and show the main screen
function continueGame() {
    document.getElementById('summaryScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';
}
