// Game state variables
let orcCount = 10;
let cowCount = 0;
let milkCount = 0;
let meatCount = 0;
let weekCount = 1;

let orcLifespan = 10;  // Orcs live for 10 weeks before dying
let orcAge = [];  // Array to track each orc's age
for (let i = 0; i < orcCount; i++) {
    orcAge.push(0);  // Each orc starts at age 0
}

// Update the displayed values on the screen
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

    if (stealOrcs + tendOrcs + slaughterOrcs > orcCount) {
        document.getElementById('message').innerText = "You cannot allocate more orcs than you have.";
        return;
    }

    document.getElementById('message').innerText = "";  // Clear message

    // Handle cow stealing
    let cowsStolen = stealCows(stealOrcs);
    cowCount += cowsStolen;

    // Handle cow tending (milk production)
    let milkGained = tendCows(tendOrcs);
    milkCount += milkGained;

    // Handle cow slaughtering (meat production)
    let meatGained = slaughterCows(slaughterOrcs);
    meatCount += meatGained;

    // Increase the age of all orcs, and remove those that die
    ageOrcs();

    // Orc reproduction based on milk production
    let newOrcs = reproduceOrcs(milkGained);
    orcCount += newOrcs;

    weekCount++;
    updateUI();
}

// Function to calculate cows stolen based on orcs allocated and meat (strength)
function stealCows(stealOrcs) {
    let cowsStolen = 0;
    for (let i = 0; i < stealOrcs; i++) {
        let successChance = 0.1 + meatCount / 100;  // Meat increases success rate
        if (Math.random() < successChance) {
            cowsStolen++;
        }
    }
    document.getElementById('message').innerText += `\nOrcs stole ${cowsStolen} cows.`;
    return cowsStolen;
}

// Function to calculate milk gained from tending cows
function tendCows(tendOrcs) {
    if (cowCount === 0 || tendOrcs === 0) {
        return 0;
    }
    return cowCount * 2;  // Each cow produces 2 units of milk
}

// Function to calculate meat gained from slaughtering cows
function slaughterCows(slaughterOrcs) {
    if (cowCount === 0 || slaughterOrcs === 0) {
        return 0;
    }
    let meatGained = slaughterOrcs * 5;  // Each orc can slaughter and get 5 meat per cow
    cowCount -= Math.min(slaughterOrcs, cowCount);  // Slaughter cows
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
            document.getElementById('message').innerText += `\nAn orc has died of old age.`;
        }
    }
    orcCount = aliveOrcs.length;
    orcAge = aliveOrcs;
}

// Function to handle orc reproduction (based on milk gained)
function reproduceOrcs(milkGained) {
    let newOrcs = Math.floor(milkGained / 10);  // Every 10 units of milk gives 1 new orc
    for (let i = 0; i < newOrcs; i++) {
        orcAge.push(0);  // New orcs start at age 0
    }
    document.getElementById('message').innerText += `\n${newOrcs} new orcs are born.`;
    return newOrcs;
}

// Initialize the game by updating the UI
updateUI();

