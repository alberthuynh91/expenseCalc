// Initialize Parse with Application ID and Javascript Key
Parse.initialize('sLmqqQCFp6VRZT3j11MlJGNAiHLR1iSv89n8YAvu', '9lebCJboDYWAnhwAv6gWFG8x2PeSOhULoujYZWpo');
var ascending = false;
var firstLoad = true;

// Returns the entire expense list from localStorage
function get_expenses() {
	return JSON.parse(localStorage.getItem('expenselist')) || [];
}

// Returns the current expense list from localStorage
function get_current_expenses(){
	return JSON.parse(localStorage.getItem('currentList')) || [];
}

// Function to set the list to localStorage
function set_expenses(expenses){
	localStorage.setItem('expenselist', JSON.stringify(expenses));
}

// Function to set the current list to localStorage
function set_current_expenses(filteredList){
	localStorage.setItem('currentList', JSON.stringify(filteredList));
}

// Adds an expense to the expense list (localStorage)
function add() {
	var expense = { Expense: document.getElementById('expense').value,
		Cost: parseFloat(document.getElementById('cost').value),
		Category: document.getElementById('category').value,
		ExpenseDate: document.getElementById('expenseDate').value
	};
	var expenses = get_expenses();
	expenses.push(expense);
	set_expenses(expenses);
	display();
}

// Removes expense from list of expenses
function remove() {
	var id = this.getAttribute('id');
	var expenses = get_expenses();
	expenses.splice(id, 1);
	localStorage.setItem('expenselist', JSON.stringify(expenses));
	display();
}

// Displays ALL expenses
function display(sortExpenses) {
	var expenses = get_expenses();
	if (sortExpenses) {
		expenses = sortExpenses;
	}
	var html = '<table class="table table-hover">'
	html += '<tr>';
	html += '<td><b><a class="button" id="sortByExpense" href="javascript:void(0)" onclick="sort(id)">Expense</a></b></td>';
	html += '<td><b><a class="button" id="sortByCost" href="javascript:void(0)" onclick="sort(id)">Cost</a></b></td>';
	html += '<td><b><a class="button" id="sortByCategory" href="javascript:void(0)" onclick="sort(id)">Category</a></b></td>';
	html += '<td><b><a class="button" id="sortByDate" href="javascript:void(0)" onClick="sort(id)">Date</a></b></td>';
	html += '<td></td>';
	html += '</tr>';

	forEach(expenses, function(expense, index) {
		html += '<tr>';
		html += '<td>' + expense.Expense + '</td>' +
		'<td>$' + expense.Cost + '</td>' +
		'<td>' + expense.Category + '</td>' +
		'<td>' + expense.ExpenseDate + '</td>' + 
		'<td><button class="remove btn btn-danger" id="' + index + '">Remove</button></td>';
		html += '</tr>';
	});
	html += '</table>';

	document.getElementById('displayAllExpenses').innerHTML = html;
	var buttons = document.getElementsByClassName('remove');

	forEach(buttons, function(button) {
		button.addEventListener('click', remove);
	});
}

// entireTotal function calculates the total of ALL expenses in the expense list and displays on page
function entireTotal() {
	var expenses = get_expenses();
	var total = reduce(expenses, function(prev, curr) {
		return {Cost: prev.Cost + curr.Cost};
	});
	document.getElementById('displayTotal').innerHTML = "<b>Grand Total of expenses</b>: $" + total.Cost;
}


// Filters expenses by category and/or date range and then calculates the total of
// 	all expenses in that category/date range and then displays on HTML page
function filteredTotal() {
	var selected_category = document.getElementById('categoryForTotal').value;
	var fromDate = document.getElementById('fromDate').value;
	var toDate = document.getElementById('toDate').value;
	var filteredTotal = 0;
	var expenses = get_expenses();

	if (selected_category !== "" && fromDate !== "" && toDate !== "") {
		console.log("Filter by date and category");
		forEach(expenses, function(expense) {
			if (expense.Category === selected_category && 
				expense.ExpenseDate >= fromDate && expense.ExpenseDate <= toDate) {
					filteredTotal += expense.Cost;
			}
		});
		var filteredExpenseList = expenses.filter(function(expense) {
			return expense.Category === selected_category && expense.ExpenseDate >= fromDate &&
							expense.ExpenseDate <= toDate;
		});
		document.getElementById('displayTotal').innerHTML = "<b>Total spent on " + selected_category + " from  " +
																													fromDate + " to " + toDate + " is</b>: $" + filteredTotal;
		display(filteredExpenseList);
		set_current_expenses(filteredExpenseList);
	} else if (selected_category !== "" && (fromDate === "" || toDate === "")) {
		console.log("Filter by category");
		forEach(expenses, function(expense) {
			if (expense.Category === selected_category) {
				filteredTotal += expense.Cost;
			}
		});
		var filteredExpenseList = expenses.filter(function(expense) {
			return expense.Category === selected_category;
		});
		document.getElementById('displayTotal').innerHTML = "<b>Total spent on " + selected_category + " is</b>: $" + filteredTotal;
		display(filteredExpenseList);
		set_current_expenses(filteredExpenseList);
	} else if (selected_category === "" && fromDate !== "" && toDate !== "") {
		console.log("Filter by date");
		forEach(expenses, function(expense) {
			if (expense.ExpenseDate >= fromDate && expense.ExpenseDate <= toDate) {
				filteredTotal += expense.Cost;
			}
		});
		var filteredExpenseList = expenses.filter(function(expense) {
  		return expense.ExpenseDate >= fromDate && expense.ExpenseDate <= toDate;
		});
		document.getElementById('displayTotal').innerHTML = "<b>Total spent from " + fromDate + " to " + toDate + " is</b>: $" + filteredTotal;
		display(filteredExpenseList);
		set_current_expenses(filteredExpenseList);
	} else if (selected_category === "" && fromDate == "" && toDate == "") {
			console.log("No filter criteria");
			var entireTotal = reduce(expenses, function(prev, curr) {
				return {Cost: prev.Cost + curr.Cost};
			})
			document.getElementById('displayTotal').innerHTML = "<b>Total of all expenses is</b>: $" +  entireTotal.Cost;
			display(expenses);
			set_current_expenses(expenses);
		}
}

// Sort function that sorts expenses by criteria
function sort(sortBy) {
	var expenses = get_current_expenses();

	if (sortBy === "sortByDate" && ascending === false) {
		expenses.sort(function(a, b) {
		return new Date(a.ExpenseDate) - new Date(b.ExpenseDate);
		});
		ascending = true;
	} else if (sortBy === "sortByDate" && ascending === true) {
		expenses.sort(function(a, b) {
			return new Date(b.ExpenseDate) - new Date(a.ExpenseDate);
		});
		ascending = false;
	} else if (sortBy === "sortByCategory" && ascending === false) {
		expenses.sort(function(a, b) {
			return a.Category > b.Category;
		});
		ascending = true;
	} else if (sortBy === "sortByCategory" && ascending === true) {
		expenses.sort(function(a, b) {
			return a.Category < b.Category;
		});
		ascending = false;
	} else if (sortBy === "sortByCost" && ascending === false) {
		expenses.sort(function(a, b) {
			return a.Cost - b.Cost;
		});
		ascending = true;
	} else if (sortBy === "sortByCost" && ascending === true) {
		expenses.sort(function(a, b) {
			return b.Cost - a.Cost;
		});
		ascending = false;
	} else if (sortBy === "sortByExpense" && ascending === false) {
		expenses.sort(function(a, b) {
			return a.Expense > b.Expense;
		});
		ascending = true;
	} else if (sortBy === "sortByExpense" && ascending === true) {
		expenses.sort(function(a, b) {
			return a.Expense < b.Expense;
		});
		ascending = false;
	}
	
	display(expenses);
}

// Function that saves the expense list and writes it out to Parse
function saveToParse() {
	var expenses = get_expenses();
	var ExpenseList = Parse.Object.extend("ExpenseList");
	var expenseList = new ExpenseList();
	expenseList.set('expenses', JSON.stringify(expenses));
	expenseList.save(null, {
		success: function() { 
			alert("List was successfully saved");
			console.log("Sucesss: File saved to Parse")
		}, 
		error: function() {
			alert("ERROR: Unable to save file");
			console.log("Error: Unable to save to Parse");
		}
	});
}

// Function to intially set the current expense list to entire expense list
//  Aids in resetting the current expense list so when sorting expenses it does not
//  retreive the existing sort list saved from previous session
function set_initial_current_expenses() {
	var expenses = get_expenses();
	set_current_expenses(expenses);
}

// Event listeners for buttons on HTML page
document.getElementById('add').addEventListener('click', add);
document.getElementById('save').addEventListener('click', saveToParse);
document.getElementById('filtered_total_btn').addEventListener('click', filteredTotal);

// Initially set the current expense list to entire expense list
set_initial_current_expenses();

// Display expenses list
display();




