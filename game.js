function passWeek() {
    if (!currentActivity) {
        document.getElementById('message').innerText = "Please select an activity!";
        return;
    }

    let allocatedOrcs = orcCount;
    let summaryText = `Week ${weekCount} Summary:\n`;
    let newCowsInCooldown = 0;  // Track cows going into cooldown this week

    console.log(`Starting Week ${weekCount}`);
    console.log(`Initial Unmilked Cows: ${cowCount}`);
    console.log(`Initial Cows in Cooldown: ${milkCooldownCows.length}`);

    if (currentActivity === "steal") {
        // Steal cows
        let cowsStolen = Math.floor(Math.random() * allocatedOrcs * orcStrength);
        cowCount += cowsStolen;
        totalCowCount += cowsStolen;
        initializeCows(cowsStolen);

        summaryText += `- ${allocatedOrcs} orcs went out to steal cows.\n`;
        summaryText += `- Orcs successfully stole ${cowsStolen} cows.\n`;

    } else if (currentActivity === "tend") {
        // Handle milking with available unmilked cows
        let successfulMilkCount = 0;
        let milkableCows = cowCount; // Explicitly define milkable cows from the unmilked cow count

        if (milkableCows > 0) {
            let orcsPerCow = allocatedOrcs / milkableCows;

            for (let i = 0; i < milkableCows; i++) {
                let milkingChance = Math.min(1, orcsPerCow * 0.3);
                if (Math.random() < milkingChance) {
                    successfulMilkCount++;
                    milkCooldownCows.push({ weeks: 5 });
                    cowCount--;       // Decrease unmilked cow count as this cow is milked
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

    // Only add cows leaving cooldown to the milkable pool next week
    let nextWeekMilkableCows = cowsExitingCooldown;

    // Append detailed cooldown information to the summary
    summaryText += `- ${newCowsInCooldown} cows entered cooldown this week.\n`;
    summaryText += `- ${cowsExitingCooldown} cows left cooldown this week.\n`;
    summaryText += `- ${milkCooldownCows.length} cows are currently in cooldown.\n`;
    summaryText += `- Current number of unmilked cows: ${cowCount}\n`;
    summaryText += `- Total number of cows: ${totalCowCount}\n`;
    summaryText += `- Current number of orcs: ${orcCount}\n`;

    console.log(`End of Week ${weekCount}`);
    console.log(`Unmilked Cows After Milking: ${cowCount}`);
    console.log(`Cows in Cooldown After Updates: ${milkCooldownCows.length}`);

    // Update the UI with the latest counts
    document.getElementById('orcCount').innerText = orcCount;
    document.getElementById('cowCount').innerText = cowCount;
    document.getElementById('milkCount').innerText = milkCount;
    document.getElementById('meatCount').innerText = meatCount;
    document.getElementById('weekCount').innerText = ++weekCount;
    document.getElementById('cooldownCows').innerText = milkCooldownCows.length;

    // Show the weekly summary
    showActivitySummaries([{ text: summaryText, img: 'images/summary.jpg' }]);

    // Prepare cows exiting cooldown for next week by adding them to milkable cows
    cowCount += nextWeekMilkableCows;

    resetSelections();
}
