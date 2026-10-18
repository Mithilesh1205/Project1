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
const converter = document.getElementById("converter");

function openConverter() {
    converter.classList.add("active");
    converter.scrollIntoView({ behavior: "smooth" });
}

function comingSoon() {
    alert("This tool is coming soon!");
}

function updateUnits() {
    const selectedUnits = units[category.value];

    fromUnit.innerHTML = "";
    toUnit.innerHTML = "";

    Object.keys(selectedUnits).forEach(unit => {
        fromUnit.add(new Option(unit, unit));
        toUnit.add(new Option(unit, unit));
    });

    if (toUnit.options.length > 1) {
        toUnit.selectedIndex = 1;
    }

    result.textContent = "Your result will appear here.";
}

function convert() {
    const rawValue = valueInput.value;
    const value = Number(rawValue);

    if (rawValue.trim() === "" || !Number.isFinite(value)) {
        result.textContent = "Please enter a valid number.";
        return;
    }

    const selectedUnits = units[category.value];

    const answer =
        value * selectedUnits[fromUnit.value] /
        selectedUnits[toUnit.value];

    const roundedAnswer = Number(answer.toPrecision(10));

    result.textContent =
        `${value} ${fromUnit.value} = ${roundedAnswer} ${toUnit.value}`;
}

category.addEventListener("change", updateUnits);
convertBtn.addEventListener("click", convert);

updateUnits();

// ===== OHM'S LAW CALCULATOR =====

function calculateOhmsLaw() {
    const voltageInput = document.getElementById("voltage");
    const currentInput = document.getElementById("current");
    const resistanceInput = document.getElementById("resistance");
    const ohmsResult = document.getElementById("ohmsResult");

    const voltageText = voltageInput.value.trim();
    const currentText = currentInput.value.trim();
    const resistanceText = resistanceInput.value.trim();

    const voltage = Number(voltageText);
    const current = Number(currentText);
    const resistance = Number(resistanceText);

    const values = [
        { text: voltageText, value: voltage, name: "Voltage" },
        { text: currentText, value: current, name: "Current" },
        { text: resistanceText, value: resistance, name: "Resistance" }
    ];

    const knownValues = values.filter(
        item => item.text !== "" &&
                Number.isFinite(item.value) &&
                item.value >= 0
    );

    if (knownValues.length !== 2) {
        ohmsResult.textContent =
            "Please enter exactly two valid, non-negative values.";
        return;
    }

    let result;
    let message;

    if (voltageText === "") {
        if (resistance === 0) {
            ohmsResult.textContent =
                "Resistance cannot be zero when calculating current.";
            return;
        }

        result = current * resistance;
        message = `Voltage = ${result} V`;

    } else if (currentText === "") {
        result = resistance === 0
            ? (voltage === 0 ? 0 : Infinity)
            : voltage / resistance;

        if (!Number.isFinite(result)) {
            ohmsResult.textContent =
                "Current cannot be calculated with these values.";
            return;
        }

        message = `Current = ${Number(result.toPrecision(10))} A`;

    } else {
        if (current === 0) {
            ohmsResult.textContent =
                "Resistance cannot be calculated when current is zero.";
            return;
        }

        result = voltage / current;
        message = `Resistance = ${Number(result.toPrecision(10))} Ω`;
    }

    if (!Number.isFinite(result)) {
        ohmsResult.textContent = "The result is too large to calculate.";
        return;
    }

    ohmsResult.textContent = message;
}

function openOhmsLaw() {
    const calculator = document.getElementById("ohmsCalculator");

    // Hide the Unit Converter if it is open.
    document.getElementById("converter").classList.remove("active");

    // Show the Ohm's Law Calculator.
    calculator.classList.add("active");
    calculator.scrollIntoView({ behavior: "smooth" });
}

function clearOhmsLaw() {
    document.getElementById("voltage").value = "";
    document.getElementById("current").value = "";
    document.getElementById("resistance").value = "";

    document.getElementById("ohmsResult").textContent =
        "Enter any two values to calculate the third.";
}

// ===== SERIES & PARALLEL RESISTANCE CALCULATOR =====

function openResistanceCalculator() {
    // Hide the other calculators.
    document.getElementById("converter").classList.remove("active");

    document.getElementById("ohmsCalculator").classList.remove("active");

    // Show this calculator.
    const calculator = document.getElementById("resistanceCalculator");

    calculator.classList.add("active");

    calculator.scrollIntoView({ behavior: "smooth" });
}


function calculateResistance() {
    const type = document.getElementById("circuitType").value;

    const input = document.getElementById("resistorValues").value.trim();

    const result = document.getElementById("resistanceResult");

    // Check whether the input is empty.
    if (input === "") {
        result.textContent = "Please enter resistor values.";
        return;
    }

    // Convert the comma-separated values into numbers.
    const resistors = input.split(",").map(value => value.trim()).map(Number);

    // Check that every value is a valid positive resistance.
    if (
        resistors.some(value => !Number.isFinite(value) || value <= 0)
    ) {
        result.textContent =
            "Enter valid positive resistance values separated by commas.";
        return;
    }

    let totalResistance;

    if (type === "series") {

        // Series: add all resistances.
        totalResistance = resistors.reduce(
            (total, resistance) => total + resistance,
            0
        );

    } else {

        // Parallel: reciprocal of the sum of reciprocals.
        totalResistance = 1 / resistors.reduce(
            (total, resistance) => total + 1 / resistance,
            0
        );
    }

    if (!Number.isFinite(totalResistance)) {
        result.textContent = "The result is too large to calculate.";
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

// ===== RESISTOR COLOR CODE CALCULATOR =====

// Color digits used in resistor markings.
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

// Multiplier values in ohms.
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

// Tolerance values.
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

    dropdown.innerHTML = "";

    colorOptions.forEach(color => {
        const option = document.createElement("option");

        option.value = color;
        option.textContent = color;

        dropdown.appendChild(option);
    });
}


// Initialize all four bands.
function initializeColorCalculator() {
    const digitColors = Object.keys(resistorDigits);
    const multiplierColors = Object.keys(resistorMultipliers);
    const toleranceColors = Object.keys(resistorTolerances);

    populateColorDropdown("band1", digitColors.slice(1));
    populateColorDropdown("band2", digitColors);
    populateColorDropdown("band3", multiplierColors);
    populateColorDropdown("band4", toleranceColors);

    // Common example: Brown, Black, Red, Gold = 1 kΩ ±5%.
    document.getElementById("band1").value = "Brown";
    document.getElementById("band2").value = "Black";
    document.getElementById("band3").value = "Red";
    document.getElementById("band4").value = "Gold";
}


// Show the calculator and hide other calculators.
function openColorCalculator() {
    document.getElementById("converter").classList.remove("active");
    document.getElementById("ohmsCalculator").classList.remove("active");
    document.getElementById("resistanceCalculator").classList.remove("active");

    const calculator = document.getElementById("colorCalculator");

    calculator.classList.add("active");
    calculator.scrollIntoView({ behavior: "smooth" });
}


// Calculate resistance from the four selected bands.
function calculateColorCode() {
    const band1 = document.getElementById("band1").value;
    const band2 = document.getElementById("band2").value;
    const band3 = document.getElementById("band3").value;
    const band4 = document.getElementById("band4").value;

    const firstDigit = resistorDigits[band1];
    const secondDigit = resistorDigits[band2];
    const multiplier = resistorMultipliers[band3];
    const tolerance = resistorTolerances[band4];

    const resistance =
        (firstDigit * 10 + secondDigit) * multiplier;

    const result = document.getElementById("colorResult");

    if (!Number.isFinite(resistance)) {
        result.textContent = "Unable to calculate this resistance.";
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
        formattedResistance = `${Number(resistance.toPrecision(6))} Ω`;
    }

    const lowerLimit = resistance * (1 - tolerance / 100);
    const upperLimit = resistance * (1 + tolerance / 100);

    result.innerHTML =
        `Resistance: ${formattedResistance}<br>` +
        `Tolerance: ±${tolerance}%<br>` +
        `Minimum: ${lowerLimit} Ω<br>` +
        `Maximum: ${upperLimit} Ω`;
}


// Reset the calculator to the example colors.
function clearColorCalculator() {
    document.getElementById("band1").value = "Brown";
    document.getElementById("band2").value = "Black";
    document.getElementById("band3").value = "Red";
    document.getElementById("band4").value = "Gold";

    document.getElementById("colorResult").textContent =
        "Your resistance will appear here.";
}


// Initialize the dropdowns when the page loads.
initializeColorCalculator();

// ===== ELECTRIC GLITCH CLICK EFFECT =====

document.addEventListener("click", function (event) {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    // Restart the animation even when the same button is clicked repeatedly.
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