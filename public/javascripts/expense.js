Parse.initialize('sLmqqQCFp6VRZT3j11MlJGNAiHLR1iSv89n8YAvu', '9lebCJboDYWAnhwAv6gWFG8x2PeSOhULoujYZWpo');


// Returns the expense list from localStorage
function get_expenses() {
	return JSON.parse(localStorage.getItem('expenselist')) || [];
}

// Function to set the list to localStorage
function set_expenses(expenses){
	localStorage.setItem('expenselist', JSON.stringify(expenses));
}

// Adds an expense to the expense list (localStorage)
function add() {
	var expense = { Expense: document.getElementById('expense').value,
		Cost: parseInt(document.getElementById('cost').value),
		Category: document.getElementById('category').value,
		ExpenseDate: document.getElementById('expenseDate').value
	};

	var expenses = get_expenses();
	expenses.push(expense);
	set_expenses(expenses);
	display();
}


//	Removes expense from list of expenses
function remove() {
	var id = this.getAttribute('id');
	var expenses = get_expenses();
	expenses.splice(id, 1);
	localStorage.setItem('expenselist', JSON.stringify(expenses));
	display();
}


// Displays ALL expenses
function display() {
	var expenses = get_expenses();
	var html = '<table class="table table-hover">'

	each(expenses, function(expense, index) {
		html += '<tr>';
		html += '<td>' + expense.Expense + '</td>' +
		'<td>Cost: $' + expense.Cost + '</td>' +
		'<td>Category: ' + expense.Category + '</td>' +
		'<td>Date: ' + expense.ExpenseDate + '</td>' + 
		'<td><button class="remove btn btn-danger" id="' + index + '">Remove</button></td>';
		html += '</tr>';
	});
	html += '</table>';

	document.getElementById('displayAllExpenses').innerHTML = html;
	var buttons = document.getElementsByClassName('remove');

	each(buttons, function(button) {
		button.addEventListener('click', remove);
	});
}


// Calculates total of ALL expenses in the expense list
function entireTotal() {
	var expenses = get_expenses();
	var total = 0;
	each(expenses, function(expense) {
		total += expense.Cost;
	});

	document.getElementById('displayTotal').innerHTML = "<b>Grand Total of expenses</b>: $" + total;;
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
		each(expenses, function(expense) {
			if (expense.Category === selected_category && 
				expense.ExpenseDate >= fromDate && expense.ExpenseDate <= toDate) {
					filteredTotal += expense.Cost;
			}
		});
		document.getElementById('displayTotal').innerHTML = "<b>Total spent on " + selected_category + " from  " +
																													fromDate + " to " + toDate + " is</b>: $" + filteredTotal;
	} else if (selected_category !== "" && fromDate === "" || toDate === "") {
		each(expenses, function(expense) {
			if (expense.Category === selected_category) {
				filteredTotal += expense.Cost;
			}
		});
		document.getElementById('displayTotal').innerHTML = "<b>Total spent on " + selected_category + " is</b>: $" + filteredTotal;
	} else if (selected_category === "" && fromDate !== "" && toDate !== "") {
		each(expenses, function(expense) {
			if (expense.ExpenseDate >= fromDate && expense.ExpenseDate <= toDate) {
				filteredTotal += expense.Cost;
			}
		});
		document.getElementById('displayTotal').innerHTML = "<b>Total spent from " + fromDate + " to " + toDate + " is</b>: $" + filteredTotal;
	}	
}


// Saves the expense list and writes it out to Parse
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


// Event listeners for buttons on HTML page
document.getElementById('add').addEventListener('click', add);
document.getElementById('total_btn').addEventListener('click', entireTotal);
document.getElementById('save').addEventListener('click', saveToParse);
document.getElementById('filtered_total_btn').addEventListener('click', filteredTotal);


// Display expenses
display();

