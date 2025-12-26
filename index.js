let income = 0;
let expenses = [];
let totalExpenses = 0;
let remainingBudget = 0;
let exchangeRate = 0; // Exchange rate for selected currency
let selectedCurrency = "USD"; // Default selected currency

// DOM elements
const incomeInput = document.getElementById('income');
const expenseInput = document.getElementById('expense');
const expenseComment = document.getElementById('expenseComment');
const budgetAmount = document.getElementById('budgetAmount');
const expenseList = document.getElementById('expenseList');
const errorMessage = document.getElementById('error-message');
const addExpenseButton = document.getElementById('addExpense');
const resetButton = document.getElementById('reset');
const fetchExchangeRateButton = document.getElementById('fetchExchangeRate');
const exchangeRateElement = document.getElementById('exchangeRate');
const convertedBudgetElement = document.getElementById('convertedBudget');
const currencySelect = document.getElementById('currencySelect');

// Functions & Callbacks
function calculateRemainingBudget() {
    remainingBudget = income - totalExpenses;
    budgetAmount.textContent = remainingBudget.toFixed(2);
}

function renderExpenses() {
    expenseList.innerHTML = '';
    expenses.forEach(expense => {
        let li = document.createElement('li');
        li.textContent = `${expense.name} - ₹${expense.amount}`;
        expenseList.appendChild(li);
    });
}

function updateUI() {
    calculateRemainingBudget();
    renderExpenses();
}

function populateCurrencyDropdown(conversionRates) {
    // Clear existing options
    currencySelect.innerHTML = '';

    // Populate dropdown with currencies from the API response
    Object.keys(conversionRates).forEach(currencyCode => {
        if (currencyCode !== "INR") { // Exclude INR itself from the dropdown
            const option = document.createElement('option');
            option.value = currencyCode;
            option.textContent = currencyCode;
            currencySelect.appendChild(option);
        }
    });
}

// Event Listeners
incomeInput.addEventListener('input', function() {
    income = parseFloat(incomeInput.value);
    calculateRemainingBudget(); // Recalculate remaining budget
});

currencySelect.addEventListener('change', function() {
    selectedCurrency = currencySelect.value; // Update selected currency
});

addExpenseButton.addEventListener('click', function() {
    const expenseValue = parseFloat(expenseInput.value);
    const expenseCategory = expenseComment.value.trim();

    // Input Handling & Validation
    if (isNaN(income) || income <= 0) {
        errorMessage.textContent = 'Please enter your income first!';
        return;
    }

    if (!expenseCategory || isNaN(expenseValue) || expenseValue <= 0) {
        errorMessage.textContent = 'Please enter a valid expense!';
        return;
    }

    if (expenseValue > remainingBudget) {
        errorMessage.textContent = 'Expense cannot exceed remaining budget!';
        return;
    }

    errorMessage.textContent = '';

    // Store expense in an array
    const newExpense = {
        name: expenseCategory,
        amount: expenseValue
    };
    expenses.push(newExpense);
    totalExpenses += expenseValue;

    renderExpenses();
    calculateRemainingBudget();

    // Reset expense input fields
    expenseInput.value = '';
    expenseComment.value = '';
});

resetButton.addEventListener('click', function() {
    // Reset all values
    income = 0;
    totalExpenses = 0;
    expenses = [];
    remainingBudget = 0;

    incomeInput.value = '';
    expenseInput.value = '';
    expenseComment.value = '';
    errorMessage.textContent = '';
    exchangeRateElement.textContent = '';
    convertedBudgetElement.textContent = '';

    renderExpenses();
    calculateRemainingBudget();
});

// Fetch Exchange Rate using Asynchronous JavaScript & HTTP Requests
fetchExchangeRateButton.addEventListener('click', async function() {
    try {
        const response = await fetch('https://v6.exchangerate-api.com/v6/bf1261144646b887e70c5a3e/latest/INR'); // Replace YOUR_API_KEY with actual API key
        const data = await response.json();

        // Fetch the conversion rate for the selected currency
        exchangeRate = data.conversion_rates[selectedCurrency];
        const convertedBudget = remainingBudget * exchangeRate; // Convert remaining budget to selected currency

        exchangeRateElement.textContent = `Conversion Rate: 1 INR = ${exchangeRate.toFixed(4)} ${selectedCurrency}`;
        convertedBudgetElement.textContent = `Remaining Budget in ${selectedCurrency}: ${selectedCurrency} ${convertedBudget.toFixed(2)}`;
    } catch (error) {
        exchangeRateElement.textContent = 'Failed to fetch exchange rate.';
        convertedBudgetElement.textContent = '';
    }
});

// Initialize UI
updateUI();

// Populate Currency Dropdown on Page Load
async function initializeCurrencyDropdown() {
    try {
        const response = await fetch('https://v6.exchangerate-api.com/v6/bf1261144646b887e70c5a3elatest/INR'); // Replace YOUR_API_KEY with actual API key
        const data = await response.json();

        populateCurrencyDropdown(data.conversion_rates);
    } catch (error) {
        console.error('Failed to fetch conversion rates:', error);
    }
}

initializeCurrencyDropdown();