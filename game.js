let orcCount = 10;
let cowCount = 0;
let milkCount = 0;
let meatCount = 0;
let weekCount = 1;
let orcStrength = 1;  // Strength increases with more meat consumed
let milkingCooldown = [];  // Array to track milking cooldown for each cow
let successfulMilkings = [];  // Array to track how many successful milkings each cow has had

function initializeCows(count) {
    for (let i = 0; i < count; i++) {
        milkingCooldown.push(0);  // Initially, no cooldown
        successfulMilkings.push(0);  // Each cow starts with 0 milkings
    }
}

// Update cow milking cooldowns every week
function updateCowCooldowns() {
    for (let i = 0; i < cowCount; i++) {
        if (milkingCooldown[i] > 0) {
            milkingCooldown[i]--;  // Reduce cooldown for milking
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
    initializeCows(cowsStolen);  // Initialize any new cows with 0 cooldown and 0 milkings

    // Milking logic (chance of success depends on orcs per cow)
    let successfulMilkCount = 0;
    let orcsPerCow = tendOrcs / cowCount;
    for (let i = 0; i < cowCount; i++) {
        if (milkingCooldown[i] === 0) {  // Only attempt to milk if no cooldown
            let milkingChance = Math.min(1, orcsPerCow * 0.3);  // Orcs per cow increase chance
            if (Math.random() < milkingChance) {
                successfulMilkCount++;
                milkingCooldown[i] = 5;  // Start a 5-week cooldown after successful milking
                successfulMilkings[i]++;
                if (successfulMilkings[i] >= 5) {
                    // Cow dies after 5 successful milkings
                    successfulMilkings.splice(i, 1);
                    milkingCooldown.splice(i, 1);
                    cowCount--;
                    i--;
                }
            }
        }
    }

    // Slaughtering cows
    let cowsSlaughtered = Math.min(slaughterOrcs, cowCount);
    cowCount -= cowsSlaughtered;
    let meatGained = cowsSlaughtered * (cowsSlaughtered >= 10 ? 2 : 1);  // More meat for older cows
    meatCount += meatGained;

    // Orc reproduction (1 orc per successful milking)
    orcCount += successfulMilkCount;

    // Orc strength increases based on meat gained
    orcStrength += Math.floor(meatGained / 5);

    // Update cow cooldowns
    updateCowCooldowns();

    // Update stats display (hide game screen, show summary)
    document.getElementById('orcCount').innerText = orcCount;
    document.getElementById('cowCount').innerText = cowCount;
    document.getElementById('milkCount').innerText = milkCount;
    document.getElementById('meatCount').innerText = meatCount;
    document.getElementById('weekCount').innerText = ++weekCount;

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
