const BACKEND_URL = 'http://localhost:8000'
const goalsBox = document.querySelector('.goals ul')
const incomesTable = document.querySelector('.incomes tbody')
const expensesTable = document.querySelector('.expenses tbody')

//#region  LOAD PROGRESSBAR
function loadProgress(){
	const allProgress = document.querySelectorAll('main .goals li .progress');

	allProgress.forEach(item => {
		item.style.setProperty('--value', item.dataset.value)
	})
}
//#endregion


//#region  APEXCHART CONFIGURATION
var fakeData = {
	series: [{
		name: 'Ingresos',
		data: [35000, 20000, 12000, 15000, 45000, 30000, 22000],
		color: '#48ACF0',
	}, {
		name: 'Egresos',
		data: [15000, 30000, 22000, 10000, 20000, 17000, 28000],
		color: '#7F5A83',
	}],
	chart: {
		height: 350,
		type: 'area'
	},
	dataLabels: {
		enabled: false
	},
	stroke: {
		curve: 'smooth'
	},
	xaxis: {
		type: 'month',
		categories: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
	}
};

var chart = new ApexCharts(document.querySelector('#chart'), fakeData);
chart.render();
//#endregion


//#region INSERT GOAL
function insertGoal(goal) {
	let li = document.createElement('li')
	let progress = Math.floor((goal.savedMoney/goal.goalMoney)*100)

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

//#region GET GOALS
async function getGoals() {
	try {
		const response = await fetch(`${BACKEND_URL}/goals/`)
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
		const response = await fetch(`${BACKEND_URL}/incomes/`)
		const incomes = await response.json()
		return incomes.slice(0, 5)
	} catch (error) {
		console.error(error)
	}
}
//#endregion

//#region LOAD DATA
async function loadData() {
	goals = await getGoals()
	incomes = await getIncomes()

    goalsBox.innerHTML = (goals.length>0)?'':'<h2>Aún no tienes metas</h2>'
    goals.forEach((goal) => {
        insertGoal(goal)
    })

	incomesTable.innerHTML = ''
	incomes.forEach((income) => {
		insertIncome(income)
	})

	loadProgress()
}
//#endregion

loadData()