Parse.initialize('sLmqqQCFp6VRZT3j11MlJGNAiHLR1iSv89n8YAvu', '9lebCJboDYWAnhwAv6gWFG8x2PeSOhULoujYZWpo');

function get_expenses() {
	return JSON.parse(localStorage.getItem('expenselist')) || [];
}

function set_expenses(expenses){
	localStorage.setItem('expenselist', JSON.stringify(expenses));
}

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


function display() {
	var expenses = get_expenses();
	var html = '<ol>';

	each(expenses, function(expense, index) {
		html += '<li>' + "Expense: " + expense.Expense + 
		"<br>Cost: $" + expense.Cost + 
		"<br>Category: " + expense.Category + 
		"<br>Date: " + expense.ExpenseDate + '<br><button class="remove btn btn-danger" id="' +
		index + '">Remove</button></li>';
	});
	html += '</ol>';

	document.getElementById('displayHere').innerHTML = html;
	var buttons = document.getElementsByClassName('remove');

	each(buttons, function(button) {
		button.addEventListener('click', remove);
	});
}

// Remove Function
//	Removes expense from list of expenses
function remove() {
	var id = this.getAttribute('id');
	var expenses = get_expenses();
	expenses.splice(id, 1);
	localStorage.setItem('expenselist', JSON.stringify(expenses));
	display();
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


function calcCategory() {
	var selected_category = document.getElementById('categoryForTotal').value;
	var expenses = get_expenses();
	var category_total = 0;
	for (var j = 0; j < expenses.length; j++) {
		if (expenses[j].Category == selected_category) {
			category_total += expenses[j].Cost;
		}
	}
	console.log("calculating category total");
	var displayCategoryTotal = "Total spent on "  + selected_category + " is: " + category_total;
	document.getElementById('displayCategoryTotal').innerHTML = displayCategoryTotal;
}

function calcDate() {
	var expenses = get_expenses();
	var dateTotal = 0;
	var fromDate = document.getElementById('fromDate').value;
	var toDate = document.getElementById('toDate').value
	if (fromDate === '') {
		alert("Please choose a start date");
	} else if (toDate === '') {
		alert("Please choose a end date")
	} else {
		for (var i = 0; i < expenses.length; i++) {
			if(expenses[i].ExpenseDate >= fromDate && expenses[i].ExpenseDate <= toDate) {
				dateTotal += expenses[i].Cost;
			}
		}
	}

	console.log("calculating total from date range");
	var displayDateTotal = "Total spent from " + fromDate + " to " + toDate + " is: " + dateTotal;
	document.getElementById('displayCategoryTotal').innerHTML = displayDateTotal;

	var html = '<ol>';
	for (var j = 0; j < expenses.length; j++) {
		if (expenses[j].ExpenseDate >= fromDate && expenses[j].ExpenseDate <= toDate) {
			html += '<li>' + "Expense: " + expenses[j].Expense + 
		"<br>Cost: $" + expenses[j].Cost + 
		"<br>Category: " + expenses[j].Category + 
		"<br>Date: " + expenses[j].ExpenseDate + '<button class="remove btn btn-danger" id="' +
		i + '">x</button></li>';
		}
	}
		
	html += '</ol>';

	// Display the entire expenses in the 'displayHere' div element 
	document.getElementById('filtered').innerHTML = html;
}

function saveToParse() {
	var expenses = get_expenses();
	var ExpenseList = Parse.Object.extend("ExpenseList");
	var expenseList = new ExpenseList();
	expenseList.set('expenses', JSON.stringify(expenses));
	expenseList.save(null, {
		success: function() { 
			console.log("success")
		}, 
		error: function() {
			console.log("error");
		}
	});
	console.log("saving");

}

document.getElementById('add').addEventListener('click', add);
document.getElementById('total_btn').addEventListener('click', entireTotal);
document.getElementById('save').addEventListener('click', saveToParse);
document.getElementById('filtered_total_btn').addEventListener('click', filteredTotal);
display();



