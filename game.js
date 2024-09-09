let orcCount = 10;
let cowCount = 0;
let milkCount = 0;
let meatCount = 0;
let weekCount = 1;
let orcStrength = 1;  // Strength increases with more meat consumed

// Weekly actions allocation
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

    // Weekly cow theft (random based on strength)
    let cowsStolen = Math.floor(Math.random() * stealOrcs * orcStrength);
    cowCount += cowsStolen;

    // Milk production and slaughter
    let milkGained = Math.min(tendOrcs, cowCount);  // Max cows that can be tended
    milkCount += milkGained;
    
    let cowsSlaughtered = Math.min(slaughterOrcs, cowCount);
    cowCount -= cowsSlaughtered;
    let meatGained = cowsSlaughtered * (cowCount >= 10 ? 2 : 1);  // More meat for older cows
    meatCount += meatGained;

    // Orc reproduction and strength based on milk and meat
    let newOrcs = Math.floor(milkGained / 2);  // Every 2 milk produces 1 orc
    orcCount += newOrcs;
    orcStrength += Math.floor(meatGained / 5);  // Strength increases with more meat

    // Age cows and check if they die without slaughter
    let agedOutCows = cowCount >= 10 ? Math.floor(cowCount / 10) : 0;
    cowCount -= agedOutCows;

    // Update stats display
    document.getElementById('orcCount').innerText = orcCount;
    document.getElementById('cowCount').innerText = cowCount;
    document.getElementById('milkCount').innerText = milkCount;
    document.getElementById('meatCount').innerText = meatCount;
    document.getElementById('weekCount').innerText = ++weekCount;

    // Show summary for the week
    showWeekSummary(cowsStolen, milkGained, meatGained, newOrcs, agedOutCows);
}

// Display image and summary based on what happened during the week
function showWeekSummary(cowsStolen, milkGained, meatGained, newOrcs, agedOutCows) {
    let message = `Week ${weekCount} Summary:\n`;
    message += `Cows stolen: ${cowsStolen}\n`;
    message += `Milk gained: ${milkGained}\n`;
    message += `Meat gained: ${meatGained}\n`;
    message += `New orcs born: ${newOrcs}\n`;
    message += `Cows died of old age: ${agedOutCows}`;
    
    document.getElementById('message').innerText = message;

    // Show appropriate image based on events
    let summaryImage = document.getElementById('summaryImage');
    
    // If cows are stolen, show the orc image
    if (cowsStolen > 0) {
        summaryImage.src = "images/orc.jpg";
        summaryImage.style.display = "block";
    }
    // If more milk gained, show the elf image (arbitrary event, replace if needed)
    else if (milkGained > 0) {
        summaryImage.src = "images/elf.jpeg";
        summaryImage.style.display = "block";
    }
    else {
        // Hide image if nothing major happened
        summaryImage.style.display = "none";
    }
}
