// Variables to keep track of the calculator's state
let operand1 = null;
let operand2 = null;
let operator = null;
let memoryValue = '0';
let recalledMemoryValue = null;

const display = document.querySelector('.display');
const historyList = document.querySelector('.history-list');
const memoryDisplay = document.querySelector('.memory-display');
const notificationBubble = document.querySelector('.notification-bubble');

// Function to update the main display
function updateDisplay(value) {
  display.textContent = value;
}

// Function to update the memory display
function updateMemoryDisplay() {
  if (memoryValue && memoryValue !== '0') {
    memoryDisplay.textContent = `Mem: ${memoryValue}`;
    memoryDisplay.classList.add('show');
  } else {
    memoryDisplay.classList.remove('show');
    memoryDisplay.textContent = '';
  }
}

// Function to show a notification bubble
function showNotification(message, duration = 3000) {
  notificationBubble.textContent = message;
  notificationBubble.style.opacity = 1;
  setTimeout(() => {
    notificationBubble.style.opacity = 0;
  }, duration);
}

// Function to handle memory button clicks
function handleMemoryButtonClick(operation) {
  switch (operation) {
    case 'memory-clear':
      memoryClear();
      break;
    case 'memory-recall':
      memoryRecall();
      break;
    case 'memory-add':
      memoryAdd();
      break;
    case 'memory-subtract':
      memorySubtract();
      break;
  }
}

// Function to add the current display value to memory
function memoryAdd() {
  const currentValue = parseFloat(display.textContent);
  memoryValue = (parseFloat(memoryValue) + currentValue).toString();
  updateMemoryDisplay();
  updateDisplay('0');
  showNotification(`${currentValue} added to memory (${memoryValue})`);
}

// Function to subtract the current display value from memory
function memorySubtract() {
  const currentValue = parseFloat(display.textContent);
  memoryValue = (parseFloat(memoryValue) - currentValue).toString();
  updateMemoryDisplay();
  updateDisplay('0');
  showNotification(`${currentValue} subtracted from memory (${memoryValue})`);
}

// Function to recall the memory value to the main display
function memoryRecall() {
  recalledMemoryValue = parseFloat(memoryValue);
  if (operator === null) {
    operand1 = recalledMemoryValue;
  } else {
    operand2 = recalledMemoryValue;
  }
  updateDisplay(memoryValue);
}

// Function to clear the memory
function memoryClear() {
  memoryValue = '0';
  updateMemoryDisplay();
  showNotification('Memory cleared');
}

// Function to clear the calculator
function clearCalculator() {
  operand1 = null;
  operand2 = null;
  operator = null;
  recalledMemoryValue = null;
  updateDisplay('0');
}

// Function to handle button clicks
function handleButtonClick(value) {
  if (value === 'AC') {
    clearCalculator();
  } else if (value === '+/-') {
    toggleSign();
  } else if (value === '%') {
    calculatePercentage();
  } else if (value === '.') {
    addDecimal();
  } else if (value === '+' || value === '-' || value === 'x' || value === '/') {
    handleOperator(value);
  } else if (value === '=') {
    calculateResult();
  } else if (value === 'MR') {
    memoryRecall();
  } else {
    appendNumber(value);
  }
}

// Function to toggle the sign of the displayed value
function toggleSign() {
  const currentValue = parseFloat(display.textContent);
  updateDisplay((-currentValue).toString());
}

// Function to calculate the percentage of the displayed value
function calculatePercentage() {
  const currentValue = parseFloat(display.textContent);
  updateDisplay((currentValue / 100).toString());
}

// Function to add a decimal point to the displayed value
function addDecimal() {
  if (!display.textContent.includes('.')) {
    updateDisplay(display.textContent + '.');
  }
}

// Function to handle operator clicks
function handleOperator(value) {
  if (operand1 === null) {
    operand1 = parseFloat(display.textContent);
  } else if (operator !== null) {
    calculateResult();
  }
  operator = value;
  operand2 = null;
  updateDisplay('0');
}

// Function to append a number to the displayed value
function appendNumber(value) {
  if (display.textContent === '0') {
    updateDisplay(value);
  } else {
    updateDisplay(display.textContent + value);
  }
}

// Function to calculate the result based on the operands and operator
function calculateResult() {
  if (operand1 !== null && operator !== null) {
    if (operand2 === null) {
      operand2 = parseFloat(display.textContent);
    }
    let result;
    switch (operator) {
      case '+':
        result = operand1 + operand2;
        break;
      case '-':
        result = operand1 - operand2;
        break;
      case 'x':
        result = operand1 * operand2;
        break;
      case '/':
        result = operand1 / operand2;
        break;
    }
    updateDisplay(result.toString());
    addToHistory(`${operand1} ${operator} ${operand2} = ${result}`);
    operand1 = result;
    operand2 = null;
    operator = null;
    recalledMemoryValue = null;
  }
}

// Function to add an entry to the history list
function addToHistory(entry) {
  const listItem = document.createElement('li');
  listItem.textContent = entry;
  historyList.appendChild(listItem);
}

// Function to toggle the history panel
function toggleHistory() {
  const historyPanel = document.querySelector('.history-panel');
  historyPanel.classList.toggle('show');
}

// Function to clear the history
function clearHistory() {
  historyList.innerHTML = '';
}

// Add event listeners for memory buttons
const memoryButtons = document.querySelectorAll('.memory');
memoryButtons.forEach(button => {
  button.addEventListener('click', () => {
    handleMemoryButtonClick(button.id);
  });
});

// Add event listeners for other calculator buttons
const buttons = document.querySelectorAll('.button:not(.memory):not(#history-toggle):not(#clear-history)');
buttons.forEach(button => {
  button.addEventListener('click', () => handleButtonClick(button.textContent));
});

// Add event listener for the history button
const historyButton = document.getElementById('history-toggle');
historyButton.addEventListener('click', () => {
  toggleHistory();
});

// Add event listener for the clear history button
const clearHistoryButton = document.getElementById('clear-history');
clearHistoryButton.addEventListener('click', () => {
  clearHistory();
});

// Update the initial memory display value
updateMemoryDisplay();

// Keyboard support
document.addEventListener('keydown', function(event) {
  // Prevent default behavior for keys that might cause the page to scroll or perform other actions
  if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '*', '/', '=', '.', 'Enter', 'Escape'].includes(event.key)) {
    event.preventDefault();
  }

  let key = event.key;
  switch (key) {
    case '0':
      handleButtonClick('0');
      break;
    case '1':
      handleButtonClick('1');
      break;
    case '2':
      handleButtonClick('2');
      break;
    case '3':
      handleButtonClick('3');
      break;
    case '4':
      handleButtonClick('4');
      break;
    case '5':
      handleButtonClick('5');
      break;
    case '6':
      handleButtonClick('6');
      break;
    case '7':
      handleButtonClick('7');
      break;
    case '8':
      handleButtonClick('8');
      break;
    case '9':
      handleButtonClick('9');
      break;
    case '+':
      handleButtonClick('+');
      break;
    case '-':
      handleButtonClick('-');
      break;
    case '*':
      handleButtonClick('x');
      break;
    case '/':
      handleButtonClick('/');
      break;
    case '=':
    case 'Enter': // Assume 'Enter' key behaves the same as '='
      handleButtonClick('=');
      break;
    case '.':
      handleButtonClick('.');
      break;
    case 'Escape': // Assume 'Escape' key clears the calculator
      handleButtonClick('AC');
      break;
    // Add any additional key mappings here
  }
});
