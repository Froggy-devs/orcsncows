let orcCount = 10;
let cowCount = 0;
let totalCowCount = 0;
let milkCount = 0;
let meatCount = 0;
let weekCount = 1;
let orcStrength = 1;
let milkCooldownCows = [];
let currentActivity = null;

function setActivity(activity) {
    currentActivity = activity;
    updateActivityImages();
}

function updateActivityImages() {
    document.getElementById('stealingOrcsImg').style.display = currentActivity === 'steal' ? "inline-block" : "none";
    document.getElementById('milkingOrcsImg').style.display = currentActivity === 'tend' ? "inline-block" : "none";
    document.getElementById('slaughteringOrcsImg').style.display = currentActivity === 'slaughter' ? "inline-block" : "none";
}

function resetSelections() {
    currentActivity = null;
    updateActivityImages();
}

function updateCowCooldowns() {
    let cowsExitingCooldown = 0;
    for (let i = 0; i < milkCooldownCows.length; i++) {
        milkCooldownCows[i].weeks--;
        if (milkCooldownCows[i].weeks <= 0) {
            milkCooldownCows.splice(i, 1);
            cowsExitingCooldown++;
        }
    }
    return cowsExitingCooldown;
}

function passWeek() {
    if (!currentActivity) {
        document.getElementById('message').innerText = "Please select an activity!";
        return;
    }

    let allocatedOrcs = orcCount;
    let summaryText = `Week ${weekCount} Summary:\n`;
    let newCowsInCooldown = 0;

    if (currentActivity === "steal") {
        let cowsStolen = Math.floor(Math.random() * allocatedOrcs * orcStrength);
        cowCount += cowsStolen;
        totalCowCount += cowsStolen;

        summaryText += `- ${allocatedOrcs} orcs went to steal cows.\n`;
        summaryText += `- Orcs stole ${cowsStolen} cows.\n`;

    } else if (currentActivity === "tend") {
        let successfulMilkCount = 0;
        let milkableCows = cowCount;
        
        if (milkableCows > 0) {
            let orcsPerCow = allocatedOrcs / milkableCows;

            for (let i = 0; i < milkableCows; i++) {
                let milkingChance = Math.min(1, orcsPerCow * 0.3);
                if (Math.random() < milkingChance) {
                    successfulMilkCount++;
                    milkCooldownCows.push({ weeks: 5 });
                    cowCount--;
                    newCowsInCooldown++;
                }
            }

            summaryText += `- ${allocatedOrcs} orcs tended cows.\n`;
            summaryText += `- Orcs milked ${successfulMilkCount} cows.\n`;
        } else {
            summaryText += `- ${allocatedOrcs} orcs tried to milk, but no cows were available.\n`;
        }

    } else if (currentActivity === "slaughter") {
        let cowsSlaughtered = Math.min(allocatedOrcs, cowCount);
        cowCount -= cowsSlaughtered;
        totalCowCount -= cowsSlaughtered;
        let meatGained = cowsSlaughtered * (cowsSlaughtered >= 10 ? 2 : 1);
        meatCount += meatGained;
        orcStrength += Math.floor(meatGained / 5);

        summaryText += `- ${allocatedOrcs} orcs slaughtered cows.\n`;
        summaryText += `- Orcs gained ${meatGained} meat from ${cowsSlaughtered} cows.\n`;
    }

    let cowsExitingCooldown = updateCowCooldowns();
    summaryText += `- ${newCowsInCooldown} cows entered cooldown.\n`;
    summaryText += `- ${cowsExitingCooldown} cows left cooldown.\n`;
    summaryText += `- ${milkCooldownCows.length} cows are in cooldown.\n`;
    summaryText += `- Unmilked cows: ${cowCount}\n`;
    summaryText += `- Total cows: ${totalCowCount}\n`;

    document.getElementById('orcCount').innerText = orcCount;
    document.getElementById('cowCount').innerText = cowCount;
    document.getElementById('totalCowCount').innerText = totalCowCount;
    document.getElementById('milkCount').innerText = milkCount;
    document.getElementById('meatCount').innerText = meatCount;
    document.getElementById('weekCount').innerText = ++weekCount;
    document.getElementById('cooldownCows').innerText = milkCooldownCows.length;

    showActivitySummaries([{ text: summaryText, img: 'images/summary.jpg' }]);
    resetSelections();
}

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
    document.getElementById('nextActivityButton').onclick = displayNextActivity;
    displayNextActivity();
}

function continueGame() {
    document.getElementById('gameScreen').style.display = 'block';
    document.getElementById('summaryScreen').style.display = 'none';
}
