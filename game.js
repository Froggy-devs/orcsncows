let orcCount = 10;
let cowCount = 0;
let milkCount = 0;
let meatCount = 0;
let weekCount = 1;
let orcStrength = 1;  // Strength increases with more meat consumed
let milkCooldownCows = [];  // Tracks cows currently in cooldown and their remaining cooldown weeks
let successfulMilkings = [];  // Tracks how many successful milkings each cow has had

function initializeCows(count) {
    for (let i = 0; i < count; i++) {
        successfulMilkings.push(0);  // Each cow starts with 0 milkings
    }
}

// Update cow milking cooldowns and birth new orcs when cooldown ends
function updateCowCooldowns() {
    for (let i = 0; i < milkCooldownCows.length; i++) {
        milkCooldownCows[i].weeks--;  // Reduce cooldown for milking
        if (milkCooldownCows[i].weeks <= 0) {
            // Cow can now be milked again
            cowCount++;
            orcCount++;  // A new orc is born after the cooldown ends
            milkCooldownCows.splice(i, 1);
            i--;
        }
    }
}

// Function to handle passing of a week
function passWeek() {
    let stealOrcs = parseInt(document.getElementById('stealOrcs').value);
    let tendOrcs = parseInt(document.getElementById('tendOrcs').value);
    let slaughterOrcs = parseInt(document.getElementById('slaughterOrcs').value);
    let totalOrcsAllocated = stealOrcs + tendOrcs + slaughterOrcs;

    // Ensure orc allocation doesn't exceed total orcs
    if (totalOrcsAllocated > orcCount) {
        document.getElementById('message').innerText = "You don't have enough orcs!";
        return;
    }

    // Stealing cows logic
    let cowsStolen = Math.floor(Math.random() * stealOrcs * orcStrength);
    cowCount += cowsStolen;
    initializeCows(cowsStolen);  // Initialize any new cows with 0 milkings

    // Milking logic (chance of success depends on orcs per cow)
    let successfulMilkCount = 0;
    let orcsPerCow = tendOrcs / cowCount;
    let milkableCows = cowCount - milkCooldownCows.length;  // Only milk cows that are not on cooldown

    for (let i = 0; i < milkableCows; i++) {
        let milkingChance = Math.min(1, orcsPerCow * 0.3);  // Orcs per cow increase chance
        if (Math.random() < milkingChance) {
            successfulMilkCount++;
            // Put this cow into the cooldown list
            milkCooldownCows.push({ weeks: 5 });  // 5-week cooldown
            cowCount--;  // Remove the cow from milkable cows
            successfulMilkings[i]++;
            if (successfulMilkings[i] >= 5) {
                // Cow dies after 5 successful milkings
                successfulMilkings.splice(i, 1);
                i--;
            }
        }
    }

    // Slaughtering cows
    let cowsSlaughtered = Math.min(slaughterOrcs, cowCount);
    cowCount -= cowsSlaughtered;
    let meatGained = cowsSlaughtered * (cowsSlaughtered >= 10 ? 2 : 1);  // More meat for older cows
    meatCount += meatGained;

    // Orc strength increases based on meat gained
    orcStrength += Math.floor(meatGained / 5);

    // Update cow cooldowns and birth new orcs if applicable
    updateCowCooldowns();

    // Update stats display (hide game screen, show summary)
    document.getElementById('orcCount').innerText = orcCount;
    document.getElementById('cowCount').innerText = cowCount;
    document.getElementById('milkCount').innerText = milkCount;
    document.getElementById('meatCount').innerText = meatCount;
    document.getElementById('weekCount').innerText = ++weekCount;
    document.getElementById('cooldownCows').innerText = milkCooldownCows.length;

    // Show summary screen for the week
    showWeekSummary(cowsStolen, successfulMilkCount, meatGained, cowsSlaughtered);
}

// Display image and summary screen between weeks
function showWeekSummary(cowsStolen, successfulMilkCount, meatGained, cowsSlaughtered) {
    let summaryText = `Week ${weekCount} Summary:\n`;
    summaryText += `Cows stolen: ${cowsStolen}\n`;
    summaryText += `Successful milkings: ${successfulMilkCount}\n`;
    summaryText += `Meat gained: ${meatGained}\n`;
    summaryText += `Cows slaughtered: ${cowsSlaughtered}`;

    document.getElementById('summaryText').innerText = summaryText;

    // Display the correct image based on results
    let summaryImage = document.getElementById('summaryImage');
    
    if (cowsStolen > 0) {
        summaryImage.src = "images/orc.jpg";  // Show orc image if cows were stolen
    } else if (successfulMilkCount > 0) {
        summaryImage.src = "images/elf.jpeg";  // Show elf image if successful milking
    }

    // Hide game screen, show summary screen
    document.getElementById('gameScreen').style.display = "none";
    document.getElementById('summaryScreen').style.display = "block";
}

// Function to continue to the next week after showing the summary
function continueGame() {
    document.getElementById('summaryScreen').style.display = "none";
    document.getElementById('gameScreen').style.display = "block";
    document.getElementById('message').innerText = "";  // Clear the message
}
