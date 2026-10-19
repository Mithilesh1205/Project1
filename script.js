// =============================================
// ECE TOOLKIT — COMPLETE JAVASCRIPT
// Unit Converter
// Ohm's Law Calculator
// Series & Parallel Resistance Calculator
// Resistor Color Code Calculator
// =============================================


// =============================================
// 1. UNIVERSAL TOOL OPEN/CLOSE SYSTEM
// =============================================

function toggleTool(toolId) {
    const selectedTool = document.getElementById(toolId);

    if (!selectedTool) {
        console.error("Tool not found:", toolId);
        return;
    }

    // Check whether the selected calculator is already open.
    const isAlreadyOpen = selectedTool.classList.contains("active");

    // Close all calculators.
    document.querySelectorAll(".converter").forEach(tool => {
        tool.classList.remove("active");
    });

    // If it was closed, open it.
    if (!isAlreadyOpen) {
        selectedTool.classList.add("active");

        selectedTool.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    } else {
        // If it was already open, return to the dashboard.
        document.querySelector(".tools")?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}


// Functions called by the dashboard buttons.

function openConverter() {
    toggleTool("converter");
}

function openOhmsLaw() {
    toggleTool("ohmsCalculator");
}

function openResistanceCalculator() {
    toggleTool("resistanceCalculator");
}

function openColorCalculator() {
    toggleTool("colorCalculator");
}


// Placeholder for tools that are not implemented yet.
function comingSoon() {
    alert("This tool is coming soon!");
}


// =============================================
// 2. UNIT CONVERTER
// =============================================

const units = {
    Voltage: {
        V: 1,
        mV: 0.001,
        kV: 1000
    },

    Resistance: {
        ohm: 1,
        kohm: 1000,
        Mohm: 1000000
    },

    Frequency: {
        Hz: 1,
        kHz: 1000,
        MHz: 1000000
    }
};


const category = document.getElementById("category");
const valueInput = document.getElementById("value");
const fromUnit = document.getElementById("fromUnit");
const toUnit = document.getElementById("toUnit");
const convertBtn = document.getElementById("convertBtn");
const result = document.getElementById("result");


function updateUnits() {
    if (!category || !fromUnit || !toUnit || !result) {
        return;
    }

    const selectedUnits = units[category.value];

    if (!selectedUnits) {
        return;
    }

    // Clear previous options.
    fromUnit.innerHTML = "";
    toUnit.innerHTML = "";

    // Populate both dropdowns.
    Object.keys(selectedUnits).forEach(unit => {
        fromUnit.add(new Option(unit, unit));
        toUnit.add(new Option(unit, unit));
    });

    // Select a different target unit when possible.
    if (toUnit.options.length > 1) {
        toUnit.selectedIndex = 1;
    }

    result.textContent = "Your result will appear here.";
}


function convert() {
    if (
        !category ||
        !valueInput ||
        !fromUnit ||
        !toUnit ||
        !result
    ) {
        return;
    }

    const rawValue = valueInput.value;
    const value = Number(rawValue);

    // Validate the input.
    if (rawValue.trim() === "" || !Number.isFinite(value)) {
        result.textContent = "Please enter a valid number.";
        return;
    }

    const selectedUnits = units[category.value];

    const answer =
        value *
        selectedUnits[fromUnit.value] /
        selectedUnits[toUnit.value];

    if (!Number.isFinite(answer)) {
        result.textContent = "The result is too large to calculate.";
        return;
    }

    const roundedAnswer = Number(answer.toPrecision(10));

    result.textContent =
        `${value} ${fromUnit.value} = ` +
        `${roundedAnswer} ${toUnit.value}`;
}


// Register Unit Converter events.
if (category) {
    category.addEventListener("change", updateUnits);
}

if (convertBtn) {
    convertBtn.addEventListener("click", convert);
}


// =============================================
// 3. OHM'S LAW CALCULATOR
// =============================================

// Enter any two of voltage, current and resistance
// to calculate the third using Ohm's Law.


function calculateOhmsLaw() {
    const voltageInput = document.getElementById("voltage");
    const currentInput = document.getElementById("current");
    const resistanceInput = document.getElementById("resistance");
    const ohmsResult = document.getElementById("ohmsResult");

    if (
        !voltageInput ||
        !currentInput ||
        !resistanceInput ||
        !ohmsResult
    ) {
        return;
    }

    const voltageText = voltageInput.value.trim();
    const currentText = currentInput.value.trim();
    const resistanceText = resistanceInput.value.trim();

    const voltage = Number(voltageText);
    const current = Number(currentText);
    const resistance = Number(resistanceText);

    const values = [
        {
            text: voltageText,
            value: voltage,
            name: "Voltage"
        },
        {
            text: currentText,
            value: current,
            name: "Current"
        },
        {
            text: resistanceText,
            value: resistance,
            name: "Resistance"
        }
    ];

    const knownValues = values.filter(item =>
        item.text !== "" &&
        Number.isFinite(item.value) &&
        item.value >= 0
    );

    // Exactly two values must be entered.
    if (knownValues.length !== 2) {
        ohmsResult.textContent =
            "Please enter exactly two valid, non-negative values.";
        return;
    }

    let answer;
    let message;

    // Calculate voltage: V = I × R.
    if (voltageText === "") {
        answer = current * resistance;

        message =
            `Voltage = ${Number(answer.toPrecision(10))} V`;
    }

    // Calculate current: I = V / R.
    else if (currentText === "") {
        if (resistance === 0) {
            ohmsResult.textContent =
                "Resistance cannot be zero when calculating current.";
            return;
        }

        answer = voltage / resistance;

        message =
            `Current = ${Number(answer.toPrecision(10))} A`;
    }

    // Calculate resistance: R = V / I.
    else {
        if (current === 0) {
            ohmsResult.textContent =
                "Resistance cannot be calculated when current is zero.";
            return;
        }

        answer = voltage / current;

        message =
            `Resistance = ${Number(answer.toPrecision(10))} Ω`;
    }

    if (!Number.isFinite(answer)) {
        ohmsResult.textContent =
            "The result is too large to calculate.";
        return;
    }

    ohmsResult.textContent = message;
}


function clearOhmsLaw() {
    document.getElementById("voltage").value = "";
    document.getElementById("current").value = "";
    document.getElementById("resistance").value = "";

    document.getElementById("ohmsResult").textContent =
        "Enter any two values to calculate the third.";
}


// =============================================
// 4. SERIES & PARALLEL RESISTANCE CALCULATOR
// =============================================


function calculateResistance() {
    const type = document.getElementById("circuitType").value;

    const input =
        document.getElementById("resistorValues").value.trim();

    const result =
        document.getElementById("resistanceResult");

    if (!input) {
        result.textContent = "Please enter resistor values.";
        return;
    }

    // Convert comma-separated values to numbers.
    const resistors = input
        .split(",")
        .map(value => value.trim())
        .map(Number);

    // All resistance values must be positive and finite.
    if (
        resistors.some(value =>
            !Number.isFinite(value) || value <= 0
        )
    ) {
        result.textContent =
            "Enter valid positive resistance values separated by commas.";
        return;
    }

    let totalResistance;

    if (type === "series") {
        // Series: R = R1 + R2 + R3 + ...
        totalResistance = resistors.reduce(
            (total, resistance) => total + resistance,
            0
        );
    } else {
        // Parallel: 1/R = 1/R1 + 1/R2 + ...
        totalResistance = 1 / resistors.reduce(
            (total, resistance) => total + 1 / resistance,
            0
        );
    }

    if (!Number.isFinite(totalResistance)) {
        result.textContent =
            "The result is too large to calculate.";
        return;
    }

    totalResistance = Number(totalResistance.toPrecision(10));

    result.textContent =
        `Equivalent Resistance = ${totalResistance} Ω`;
}


function clearResistance() {
    document.getElementById("resistorValues").value = "";

    document.getElementById("resistanceResult").textContent =
        "Your equivalent resistance will appear here.";
}


// =============================================
// 5. RESISTOR COLOR CODE CALCULATOR
// =============================================


const resistorDigits = {
    Black: 0,
    Brown: 1,
    Red: 2,
    Orange: 3,
    Yellow: 4,
    Green: 5,
    Blue: 6,
    Violet: 7,
    Grey: 8,
    White: 9
};


const resistorMultipliers = {
    Black: 1,
    Brown: 10,
    Red: 100,
    Orange: 1000,
    Yellow: 10000,
    Green: 100000,
    Blue: 1000000,
    Violet: 10000000,
    Grey: 100000000,
    Gold: 0.1,
    Silver: 0.01
};


const resistorTolerances = {
    Brown: 1,
    Red: 2,
    Green: 0.5,
    Blue: 0.25,
    Violet: 0.1,
    Grey: 0.05,
    Gold: 5,
    Silver: 10
};


// Populate a dropdown with the permitted colors.
function populateColorDropdown(id, colorOptions) {
    const dropdown = document.getElementById(id);

    if (!dropdown) {
        return;
    }

    dropdown.innerHTML = "";

    colorOptions.forEach(color => {
        const option = document.createElement("option");

        option.value = color;
        option.textContent = color;

        dropdown.appendChild(option);
    });
}


// Initialize all four resistor bands.
function initializeColorCalculator() {
    const digitColors = Object.keys(resistorDigits);
    const multiplierColors = Object.keys(resistorMultipliers);
    const toleranceColors = Object.keys(resistorTolerances);

    populateColorDropdown("band1", digitColors.slice(1));
    populateColorDropdown("band2", digitColors);
    populateColorDropdown("band3", multiplierColors);
    populateColorDropdown("band4", toleranceColors);

    // Default example: Brown, Black, Red, Gold = 1 kΩ ±5%.
    const band1 = document.getElementById("band1");
    const band2 = document.getElementById("band2");
    const band3 = document.getElementById("band3");
    const band4 = document.getElementById("band4");

    if (band1) band1.value = "Brown";
    if (band2) band2.value = "Black";
    if (band3) band3.value = "Red";
    if (band4) band4.value = "Gold";
}


function calculateColorCode() {
    const band1 = document.getElementById("band1")?.value;
    const band2 = document.getElementById("band2")?.value;
    const band3 = document.getElementById("band3")?.value;
    const band4 = document.getElementById("band4")?.value;

    const result = document.getElementById("colorResult");

    if (!band1 || !band2 || !band3 || !band4 || !result) {
        return;
    }

    const firstDigit = resistorDigits[band1];
    const secondDigit = resistorDigits[band2];
    const multiplier = resistorMultipliers[band3];
    const tolerance = resistorTolerances[band4];

    const resistance =
        (firstDigit * 10 + secondDigit) * multiplier;

    if (!Number.isFinite(resistance)) {
        result.textContent =
            "Unable to calculate this resistance.";
        return;
    }

    let formattedResistance;

    if (resistance >= 1000000) {
        formattedResistance =
            `${Number((resistance / 1000000).toPrecision(6))} MΩ`;
    } else if (resistance >= 1000) {
        formattedResistance =
            `${Number((resistance / 1000).toPrecision(6))} kΩ`;
    } else {
        formattedResistance =
            `${Number(resistance.toPrecision(6))} Ω`;
    }

    const lowerLimit = resistance * (1 - tolerance / 100);
    const upperLimit = resistance * (1 + tolerance / 100);

    result.innerHTML =
        `Resistance: ${formattedResistance}<br>` +
        `Tolerance: ±${tolerance}%<br>` +
        `Minimum: ${Number(lowerLimit.toPrecision(10))} Ω<br>` +
        `Maximum: ${Number(upperLimit.toPrecision(10))} Ω`;
}


function clearColorCalculator() {
    const band1 = document.getElementById("band1");
    const band2 = document.getElementById("band2");
    const band3 = document.getElementById("band3");
    const band4 = document.getElementById("band4");
    const result = document.getElementById("colorResult");

    if (band1) band1.value = "Brown";
    if (band2) band2.value = "Black";
    if (band3) band3.value = "Red";
    if (band4) band4.value = "Gold";

    if (result) {
        result.textContent = "Your resistance will appear here.";
    }
}


// =============================================
// 6. INITIALIZE CALCULATORS
// =============================================

// Set up the Unit Converter dropdowns.
updateUnits();

// Set up the Resistor Color Code dropdowns.
initializeColorCalculator();


// =============================================
// 7. NEON GLITCH BUTTON EFFECT
// =============================================

document.addEventListener("click", function (event) {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    // Restart the effect when the button is clicked.
    button.classList.remove("glitch");

    void button.offsetWidth;

    button.classList.add("glitch");

    button.addEventListener(
        "animationend",
        function () {
            button.classList.remove("glitch");
        },
        { once: true }
    );
});