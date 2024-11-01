let orcCount = 10;
let cowCount = 0;             // Counts milkable (unmilked) cows
let totalCowCount = 0;        // Tracks total number of cows including those in cooldown
let milkCount = 0;
let meatCount = 0;
let weekCount = 1;
let orcStrength = 1;
let milkCooldownCows = [];    // Array to track each cow's cooldown time
let successfulMilkings = [];
let currentActivity = "";

// Function to initialize new cows
function initializeCows(count) {
    for (let i = 0; i < count; i++) {
        successfulMilkings.push(0);
    }
}

// Function to set the current activity
function setActivity(activity) {
    currentActivity = activity;
    updateActivityImages();
}

// Updates activity images based on the selected activity
function updateActivityImages() {
    document.getElementById('stealingOrcsImg').style.display = currentActivity === "steal" ? "inline-block" : "none";
    document.getElementById('milkingOrcsImg').style.display = currentActivity === "tend" ? "inline-block" : "none";
    document.getElementById('slaughteringOrcsImg').style.display = currentActivity === "slaughter" ? "inline-block" : "none";
}

// Resets selections at the start of a new week
function resetSelections() {
    currentActivity = "";
    updateActivityImages();
}

// Process cooldown for milked cows, returning the count of cows exiting cooldown
function updateCowCooldowns() {
    let cowsExitingCooldown = 0;

    // Update each cow's cooldown
    for (let i = 0; i < milkCooldownCows.length; i++) {
        milkCooldownCows[i].weeks--;
        if (milkCooldownCows[i].weeks <= 0) {
            cowCount++;
            orcCount++;
            milkCooldownCows.splice(i, 1);
            cowsExitingCooldown++;
            i--;
        }
    }
    return cowsExitingCooldown;
}

// Main function to pass the week and initiate activities
function passWeek() {
    if (!currentActivity) {
        document.getElementById('message').innerText = "Please select an activity!";
        return;
    }

    let allocatedOrcs = orcCount;
    let summaryText = `Week ${weekCount} Summary:\n`;

    // Temporary variable to count cows entering cooldown this week
    let newCowsInCooldown = 0;

    if (currentActivity === "steal") {
        // Steal cows
        let cowsStolen = Math.floor(Math.random() * allocatedOrcs * orcStrength);
        cowCount += cowsStolen;
        totalCowCount += cowsStolen; // Increase total cow count by stolen cows
        initializeCows(cowsStolen);

        summaryText += `- ${allocatedOrcs} orcs went out to steal cows.\n`;
        summaryText += `- Orcs successfully stole ${cowsStolen} cows.\n`;

    } else if (currentActivity === "tend") {
        // Handle milking
        let successfulMilkCount = 0;
        let milkableCows = cowCount - milkCooldownCows.length;

        if (milkableCows > 0) {
            let orcsPerCow = allocatedOrcs / milkableCows;

            for (let i = 0; i < milkableCows; i++) {
                let milkingChance = Math.min(1, orcsPerCow * 0.3);
                if (Math.random() < milkingChance) {
                    successfulMilkCount++;
                    milkCooldownCows.push({ weeks: 5 });
                    cowCount--;       // Decrease milkable cow count
                    newCowsInCooldown++;
                }
            }
            summaryText += `- ${allocatedOrcs} orcs tended to cows.\n`;
            summaryText += `- Orcs successfully milked ${successfulMilkCount} cows.\n`;
        } else {
            summaryText += `- ${allocatedOrcs} orcs tried to milk, but no cows were available.\n`;
        }

    } else if (currentActivity === "slaughter") {
        // Handle slaughtering
        let cowsSlaughtered = Math.min(allocatedOrcs, cowCount);
        cowCount -= cowsSlaughtered;
        totalCowCount -= cowsSlaughtered; // Reduce total cow count by slaughtered cows
        let meatGained = cowsSlaughtered * (cowsSlaughtered >= 10 ? 2 : 1);
        meatCount += meatGained;
        orcStrength += Math.floor(meatGained / 5);

        summaryText += `- ${allocatedOrcs} orcs slaughtered cows.\n`;
        summaryText += `- Orcs slaughtered ${cowsSlaughtered} cows and gained ${meatGained} meat.\n`;
    }

    // Update cooldown and calculate the number of cows exiting cooldown
    let cowsExitingCooldown = updateCowCooldowns();
    let totalCowsInCooldown = milkCooldownCows.length;

    // Append detailed cooldown information to the summary
    summaryText += `- ${newCowsInCooldown} cows entered cooldown this week.\n`;
    summaryText += `- ${cowsExitingCooldown} cows left cooldown this week.\n`;
    summaryText += `- ${totalCowsInCooldown} cows are currently in cooldown.\n`;
    summaryText += `- Current number of unmilked cows: ${cowCount}\n`;  // Updated label for milkable cows
    summaryText += `- Total number of cows: ${totalCowCount}\n`;          // New statistic for total cows
    summaryText += `- Current number of orcs: ${orcCount}\n`;

    // Update the UI with the latest counts
    document.getElementById('orcCount').innerText = orcCount;
    document.getElementById('cowCount').innerText = cowCount;
    document.getElementById('milkCount').innerText = milkCount;
    document.getElementById('meatCount').innerText = meatCount;
    document.getElementById('weekCount').innerText = ++weekCount;
    document.getElementById('cooldownCows').innerText = totalCowsInCooldown;

    // Show the weekly summary
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
