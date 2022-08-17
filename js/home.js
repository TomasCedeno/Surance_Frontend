const BACKEND_URL = 'http://surance-db.herokuapp.com'
const goalsBox = document.querySelector('.goals ul')
const incomesTable = document.querySelector('.incomes tbody')
const expensesTable = document.querySelector('.expenses tbody')
const userId = localStorage.getItem('userId')

if (!userId) {
	logOut()
}

document.querySelector('#btnLogout').addEventListener('click', logOut)

function logOut() {
	localStorage.clear()
	alert('Se cerrará tu sesión')
	location.replace('index.html')
}


//#region  LOAD PROGRESSBAR
function loadProgress() {
	const allProgress = document.querySelectorAll('main .goals li .progress');

	allProgress.forEach(item => {
		item.style.setProperty('--value', item.dataset.value)
	})
}
//#endregion


//#region  LOAD GRAPHIC: APEXCHART CONFIGURATION
async function loadGraphic() {


	let monthlyIncomes = await getMonthlyIncomes()
	let monthlyExpenses = await getMonthlyExpenses()

	let incomes = []
	let expenses = []
	let totalIncomes = 0
	let totalExpenses = 0

	monthlyIncomes.map(i => {
		incomes.push(i.total)
		totalIncomes += i.total
	})

	monthlyExpenses.map(e => {
		expenses.push(e.total)
		totalExpenses += e.total
	})


	var options1 = {
		series: [{
			data: incomes
		}],
		chart: {
			type: 'area',
			height: 250,
			sparkline: {
				enabled: true
			},
		},
		stroke: {
			curve: 'straight'
		},
		fill: {
			opacity: 0.3,
		},
		yaxis: {
			min: 0
		},
		colors: ['#48ACF0'],
		title: {
			text: `$ ${totalIncomes}`,
			offsetX: 0,
			style: {
				fontSize: '24px',
				color: '#48ACF0'
			}
		},
		subtitle: {
			text: 'Ingresos',
			offsetX: 0,
			style: {
				fontSize: '16px',
			}
		}
	};

	var chart1 = new ApexCharts(document.querySelector("#chart1"), options1);
	chart1.render();

	var options2 = {
		series: [{
			data: expenses
		}],
		chart: {
			type: 'area',
			height: 250,
			sparkline: {
				enabled: true
			},
		},
		stroke: {
			curve: 'straight'
		},
		fill: {
			opacity: 0.3,
		},
		yaxis: {
			min: 0
		},
		colors: ['#7F5A83'],
		title: {
			text: `$ ${totalExpenses}`,
			offsetX: 0,
			style: {
				fontSize: '24px',
				color: '#7F5A83'
			}
		},
		subtitle: {
			text: 'Egresos',
			offsetX: 0,
			style: {
				fontSize: '16px',
			}
		}
	};

	var chart2 = new ApexCharts(document.querySelector("#chart2"), options2);
	chart2.render();
}
//#endregion


//#region INSERT GOAL
function insertGoal(goal) {
	let li = document.createElement('li')
	let progress = Math.floor((goal.savedMoney / goal.goalMoney) * 100)

	li.innerHTML = `
	<li>
		<h3>${goal.name}</h3>
		<span class="progress" data-value="${progress}%"></span>
		<span class="label">${progress}%</span>
	</li>
	`
	goalsBox.appendChild(li)
}
//#endregion

//#region INSERT INCOMES
function insertIncome(income) {
	let tr = document.createElement('tr')

	tr.innerHTML = `
	<td>${income.value}</td>
	<td>${income.description}</td>
	`
	incomesTable.appendChild(tr)
}
//#endregion

//#region INSERT EXPENSES
function insertExpense(expense) {
	let tr = document.createElement('tr')

	tr.innerHTML = `
	<td>${expense.value}</td>
	<td>${expense.description}</td>
	`
	expensesTable.appendChild(tr)
}
//#endregion

//#region GET GOALS
async function getGoals() {
	try {
		const response = await fetch(`${BACKEND_URL}/goals/${userId}`)
		const goals = await response.json()
		return goals
	} catch (error) {
		console.error(error)
	}
}
//#endregion

//#region GET INCOMES
async function getIncomes() {
	try {
		const response = await fetch(`${BACKEND_URL}/incomes/${userId}`)
		const incomes = await response.json()
		return incomes.slice(0, 5)
	} catch (error) {
		console.error(error)
	}
}
//#endregion

//#region GET EXPENSES
async function getExpenses() {
	try {
		const response = await fetch(`${BACKEND_URL}/expenses/${userId}`)
		const expenses = await response.json()
		return expenses.slice(0, 5)
	} catch (error) {
		console.error(error)
	}
}
//#endregion

//#region GET USER
async function getUser() {
	try {
		const response = await fetch(`${BACKEND_URL}/user/${userId}`)
		const user = await response.json()
		return user
	} catch (error) {
		console.error(error)
	}
}
//#endregion

//#region LOAD DATA
async function loadData() {
	user = await getUser()
	goals = await getGoals()
	incomes = await getIncomes()
	expenses = await getExpenses()

	document.querySelector('#userName').innerHTML = `Hola ${user.userName}`

	document.querySelector('#balance').innerHTML = `$ ${user.balance}`

	goalsBox.innerHTML = (goals.length > 0) ? '' : '<h2>Aún no tienes metas</h2>'
	goals.forEach((goal) => {
		insertGoal(goal)
	})

	incomesTable.innerHTML = ''
	incomes.forEach((income) => {
		insertIncome(income)
	})

	expensesTable.innerHTML = ''
	expenses.forEach((expense) => {
		insertExpense(expense)
	})

	loadProgress()
	loadGraphic()
}
//#endregion

//#region GET MONTHLY INCOMES
async function getMonthlyIncomes() {
	try {
		const response = await fetch(`${BACKEND_URL}/incomes/monthly/${userId}`)
		const monthlyIncomes = await response.json()
		return monthlyIncomes.reverse()
	} catch (error) {
		console.error(error)
	}
}
//#endregion

//#region GET MONTHLY EXPENSES
async function getMonthlyExpenses() {
	try {
		const response = await fetch(`${BACKEND_URL}/expenses/monthly/${userId}`)
		const monthlyExpenses = await response.json()
		return monthlyExpenses.reverse()
	} catch (error) {
		console.error(error)
	}
}
//#endregion

loadData()