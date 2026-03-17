// Store the current calculation state
let currentInput = "";
let justCalculated = false;

// ---- INPUT A NUMBER ----
function inputNumber(num) {
  // If just calculated, start fresh
  if (justCalculated) {
    currentInput = "";
    justCalculated = false;
  }

  // Prevent numbers getting too long
  if (currentInput.length >= 15) return;

  currentInput += num;
  updateDisplay();
}

// ---- INPUT A DECIMAL POINT ----
function inputDecimal() {
  if (justCalculated) {
    currentInput = "0";
    justCalculated = false;
  }

  // Find the last number in the expression
  const parts = currentInput.split(/[\+\-\*\/]/);
  const lastPart = parts[parts.length - 1];

  // Only add decimal if last number doesn't already have one
  if (lastPart.includes(".")) return;

  currentInput += ".";
  updateDisplay();
}

// ---- INPUT AN OPERATOR ----
function inputOperator(op) {
  justCalculated = false;

  if (currentInput === "") return;

  // Replace last operator if expression ends with one
  const lastChar = currentInput.slice(-1);
  if (["+", "-", "*", "/"].includes(lastChar)) {
    currentInput = currentInput.slice(0, -1);
  }

  currentInput += op;
  updateDisplay();
}

// ---- CALCULATE THE RESULT ----
function calculate() {
  if (currentInput === "") return;

  try {
    // Store expression for display
    const expression = formatExpression(currentInput);

    // Evaluate the math
    const answer = Function('"use strict"; return (' + currentInput + ')')();

    // Handle division by zero
    if (!isFinite(answer)) {
      document.getElementById("result").textContent = "Error";
      document.getElementById("expression").textContent = expression + " =";
      currentInput = "";
      return;
    }

    // Round to avoid floating point errors like 0.1 + 0.2 = 0.30000000004
    const rounded = Math.round(answer * 1e10) / 1e10;

    document.getElementById("expression").textContent = expression + " =";
    document.getElementById("result").textContent = rounded;

    currentInput = String(rounded);
    justCalculated = true;

  } catch (e) {
    document.getElementById("result").textContent = "Error";
    currentInput = "";
  }
}

// ---- CLEAR ALL ----
function clearAll() {
  currentInput = "";
  justCalculated = false;
  document.getElementById("expression").textContent = "";
  document.getElementById("result").textContent = "0";
}

// ---- DELETE LAST CHARACTER ----
function deleteLast() {
  if (justCalculated) {
    clearAll();
    return;
  }
  currentInput = currentInput.slice(0, -1);
  updateDisplay();
}

// ---- UPDATE THE DISPLAY ----
function updateDisplay() {
  const result = document.getElementById("result");
  const expression = document.getElementById("expression");

  if (currentInput === "") {
    result.textContent = "0";
    expression.textContent = "";
  } else {
    result.textContent = formatExpression(currentInput);
    expression.textContent = "";
  }
}

// ---- FORMAT EXPRESSION FOR DISPLAY ----
// Replace * and / with × and ÷ for clean display
function formatExpression(expr) {
  return expr
    .replace(/\*/g, " × ")
    .replace(/\//g, " ÷ ")
    .replace(/\+/g, " + ")
    .replace(/-/g, " − ");
}
// ---- KEYBOARD SUPPORT ----
document.addEventListener("keydown", function(event) {
  const key = event.key;

  if (key >= "0" && key <= "9") {
    inputNumber(key);
  } else if (key === ".") {
    inputDecimal();
  } else if (key === "+") {
    inputOperator("+");
  } else if (key === "-") {
    inputOperator("-");
  } else if (key === "*") {
    inputOperator("*");
  } else if (key === "/") {
    event.preventDefault();
    inputOperator("/");
  } else if (key === "Enter" || key === "=") {
    calculate();
  } else if (key === "Backspace") {
    deleteLast();
  } else if (key === "Escape") {
    clearAll();
  }
});