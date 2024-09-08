// Game state variables
let orcCount = 10;
let cowCount = 0;
let milkCount = 0;
let meatCount = 0;
const riskFactor = 0.2; // 20% chance to lose an orc for each cow stolen

// Update the displayed values on the screen
function updateUI() {
    document.getElementById('orcCount').innerText = orcCount;
    document.getElementById('cowCount').innerText = cowCount;
    document.getElementById('milkCount').innerText = milkCount;
    document.getElementById('meatCount').innerText = meatCount;
}

// Steal cows logic
function stealCows() {
    let cowsToSteal = prompt("How many cows do you want to steal?", "1");
    cowsToSteal = parseInt(cowsToSteal);

    if (isNaN(cowsToSteal) || cowsToSteal <= 0) {
        document.getElementById('message').innerText = "Invalid input. Please enter a valid number.";
        return;
    }

    if (cowsToSteal > orcCount) {
        document.getElementById('message').innerText = "You don't have enough orcs to attempt stealing that many cows.";
        return;
    }

    let orcsLost = 0;
    let cowsStolen = 0;

    for (let i = 0; i < cowsToSteal; i++) {
        if (Math.random() < riskFactor) {
            orcsLost++;
            orcCount--;
            if (orcCount <= 0) {
                document.getElementById('message').innerText = "All your orcs are dead!";
                orcCount = 0;
                updateUI();
                return;
            }
        } else {
            cowsStolen++;
        }
    }

    cowCount += cowsStolen;
    document.getElementById('message').innerText = `You successfully stole ${cowsStolen} cows but lost ${orcsLost} orcs.`;
    updateUI();
}

// Tend cows logic (gather milk)
function tendCows() {
    if (cowCount > 0) {
        const milkGained = cowCount * 2; // Each cow produces 2 units of milk
        milkCount += milkGained;
        document.getElementById('message').innerText = `Your cows produced ${milkGained} units of milk.`;
    } else {
        document.getElementById('message').innerText = "You don't have any cows to milk.";
    }
    updateUI();
}

// Slaughter cows logic (get meat)
function slaughterCows() {
    if (cowCount > 0) {
        const meatGained = cowCount * 5; // Each cow gives 5 units of meat
        meatCount += meatGained;
        document.getElementById('message').innerText = `You slaughtered all your cows for ${meatGained} units of meat.`;
        cowCount = 0; // All cows are slaughtered
    } else {
        document.getElementById('message').innerText = "You don't have any cows to slaughter.";
    }
    updateUI();
}

// Rest logic
function rest() {
    document.getElementById('message').innerText = "The tribe rests for the day.";
}

// Initialize the game by updating the UI
updateUI();
