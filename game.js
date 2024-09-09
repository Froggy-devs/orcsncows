// Game state variables
let orcCount = 10;
let cowCount = 0;
let milkCount = 0;
let meatCount = 0;
let weekCount = 1;

let orcLifespan = 10;  // Orcs live for 10 weeks before dying
let orcAge = [];
for (let i = 0; i < orcCount; i++) {
    orcAge.push(0);  // Initialize all orcs with age 0
}

let cowLifespan = 10;  // Cows can be milked for 10 weeks before becoming unusable
let cowMilkAge = [];   // Track the milkage (number of weeks cows have been milked) for each cow

// Helper function to update the UI
function updateUI() {
    document.getElementById('orcCount').innerText = orcCount;
    document.getElementById('cowCount').innerText = cowCount;
    document.getElementById('milkCount').innerText = milkCount;
    document.getElementById('meatCount').innerText = meatCount;
    document.getElementById('weekCount').innerText = weekCount;
}

// Function to handle the passing of a week
function passWeek() {
    const stealOrcs = parseInt(document.getElementById('stealOrcs').value);
    const tendOrcs = parseInt(document.getElementById('tendOrcs').value);
    const slaughterOrcs = parseInt(document.getElementById('slaughterOrcs').value);

    // Prevent over-allocation of orcs
    if (stealOrcs + tendOrcs + slaughterOrcs > orcCount) {
        document.getElementById('message').innerText = "You cannot allocate more orcs than you have.";
        return;  // Stop execution if over-allocated
    }

    // Clear the message display
    document.getElementById('message').innerText = "";  

    // Handle stealing cows
    let cowsStolen = stealCows(stealOrcs);
    cowCount += cowsStolen;

    // Handle tending cows (milk production) and cow aging
    let milkGained = tendCows(tendOrcs);
    milkCount += milkGained;

    // Handle slaughtering cows (meat production)
    let meatGained = slaughterCows(slaughterOrcs);
    meatCount += meatGained;

    // Age orcs and remove those that die
    ageOrcs();

    // Age cows and check for those that become unusable after 10 weeks of milking
    ageCows();

    // Orc reproduction based on milk gained
    let newOrcs = reproduceOrcs(milkGained);
    orcCount += newOrcs;

    // Move to the next week
    weekCount++;

    // Show end-of-week visual feedback (images or messages)
    showWeekSummary(cowsStolen, milkGained, meatGained, newOrcs);

    // Update the UI for the new week
    updateUI();
}

// Function to calculate cows stolen based on orcs allocated and meat (strength)
function stealCows(stealOrcs) {
    let cowsStolen = 0;
    for (let i = 0; i < stealOrcs; i++) {
        let successChance = 0.1 + meatCount / 100;  // Meat increases success rate
        if (Math.random() < successChance) {
            cowsStolen++;
            cowMilkAge.push(0);  // Newly stolen cows are fresh
        }
    }
    return cowsStolen;
}

// Function to calculate milk gained from tending cows and age cows
function tendCows(tendOrcs) {
    if (cowCount === 0 || tendOrcs === 0) {
        return 0;
    }
    let milkProduced = 0;
    for (let i = 0; i < Math.min(tendOrcs, cowCount); i++) {
        if (cowMilkAge[i] < cowLifespan) {
            milkProduced += 2;  // Each cow produces 2 units of milk per week
            cowMilkAge[i]++;  // Increase the age of the cow as it's milked
        }
    }
    return milkProduced;
}

// Function to calculate meat gained from slaughtering cows
function slaughterCows(slaughterOrcs) {
    let meatGained = 0;
    for (let i = 0; i < Math.min(slaughterOrcs, cowCount); i++) {
        if (cowMilkAge[i] >= cowLifespan - 1) {  // Cows are fattest in their final week
            meatGained += 10;  // Final week cows yield more meat
        } else {
            meatGained += 5;   // Normal meat yield for other cows
        }
    }
    // Remove the slaughtered cows
    cowCount -= Math.min(slaughterOrcs, cowCount);
    cowMilkAge.splice(0, Math.min(slaughterOrcs, cowCount));
    return meatGained;
}

// Function to age orcs and remove any that die of old age
function ageOrcs() {
    let aliveOrcs = [];
    for (let i = 0; i < orcAge.length; i++) {
        orcAge[i]++;
        if (orcAge[i] < orcLifespan) {
            aliveOrcs.push(orcAge[i]);  // Orc stays alive
        } else {
            document.getElementById('message').innerText += "\nAn orc has died of old age.";
        }
    }
    orcCount = aliveOrcs.length;
    orcAge = aliveOrcs;
}

// Function to age cows and handle cow death
function ageCows() {
    let aliveCows = [];
    let aliveMilkAges = [];
    for (let i = 0; i < cowCount; i++) {
        if (cowMilkAge[i] < cowLifespan) {
            aliveCows.push(1);  // Cow stays alive
            aliveMilkAges.push(cowMilkAge[i]);
        } else {
            document.getElementById('message').innerText += "\nA cow has died of old age.";
        }
    }
    cowCount = aliveCows.length;
    cowMilkAge = aliveMilkAges;
}

// Function to handle orc reproduction based on milk produced
function reproduceOrcs(milkGained) {
    let newOrcs = Math.floor(milkGained / 10);  // Every 10 units of milk gives 1 new orc
    for (let i = 0; i < newOrcs; i++) {
        orcAge.push(0);  // New orcs start at age 0
    }
    return newOrcs;
}

// Function to display end-of-week images or messages
function showWeekSummary(cowsStolen, milkGained, meatGained, newOrcs) {
    let message = `Week ${weekCount} Summary:\n`;
    message += `Cows stolen: ${cowsStolen}\n`;
    message += `Milk gained: ${milkGained}\n`;
    message += `Meat gained: ${meatGained}\n`;
    message += `New orcs born: ${newOrcs}`;
    alert(message);  // Temporary, replace with image display logic if needed
}

// Initialize the UI
updateUI();

updateUI();

