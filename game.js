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
        totalCowCount += cowsStolen;
        initializeCows(cowsStolen);

        summaryText += `- ${allocatedOrcs} orcs went out to steal cows.\n`;
        summaryText += `- Orcs successfully stole ${cowsStolen} cows.\n`;

    } else if (currentActivity === "tend") {
        // Handle milking
        let successfulMilkCount = 0;

        if (cowCount > 0) {
            let orcsPerCow = allocatedOrcs / cowCount;

            for (let i = 0; i < cowCount; i++) {
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
        totalCowCount -= cowsSlaughtered;
        let meatGained = cowsSlaughtered * (cowsSlaughtered >= 10 ? 2 : 1);
        meatCount += meatGained;
        orcStrength += Math.floor(meatGained / 5);

        summaryText += `- ${allocatedOrcs} orcs slaughtered cows.\n`;
        summaryText += `- Orcs slaughtered ${cowsSlaughtered} cows and gained ${meatGained} meat.\n`;
    }

    // Update cooldown and count cows exiting cooldown this week
    let cowsExitingCooldown = updateCowCooldowns();

    // Add cows exiting cooldown to cowCount at the *start of the next week*
    // Here we simply store them in a temporary variable until next week
    let nextWeekMilkableCows = cowsExitingCooldown;

    // Append detailed cooldown information to the summary
    summaryText += `- ${newCowsInCooldown} cows entered cooldown this week.\n`;
    summaryText += `- ${cowsExitingCooldown} cows left cooldown this week.\n`;
    summaryText += `- ${milkCooldownCows.length} cows are currently in cooldown.\n`;
    summaryText += `- Current number of unmilked cows: ${cowCount}\n`;
    summaryText += `- Total number of cows: ${totalCowCount}\n`;
    summaryText += `- Current number of orcs: ${orcCount}\n`;

    // Update the UI with the latest counts
    document.getElementById('orcCount').innerText = orcCount;
    document.getElementById('cowCount').innerText = cowCount;
    document.getElementById('milkCount').innerText = milkCount;
    document.getElementById('meatCount').innerText = meatCount;
    document.getElementById('weekCount').innerText = ++weekCount;
    document.getElementById('cooldownCows').innerText = milkCooldownCows.length;

    // Show the weekly summary
    showActivitySummaries([{ text: summaryText, img: 'images/summary.jpg' }]);

    // Reset selections and prepare cows exiting cooldown for next week
    resetSelections();
    cowCount += nextWeekMilkableCows;
}
