const BACKEND_URL = 'https://surance-db.herokuapp.com'
const userId = localStorage.getItem('userId')
const goalsDiv = document.querySelector('#goals')
let selectedGoalId


//#region LOGOUT SECTION
if(!userId){
	logOut()
}

document.querySelector('#btnLogout').addEventListener('click', logOut)

function logOut(){
	localStorage.clear()
	alert('Se cerrará tu sesión')
	location.replace('index.html')
}
//#endregion


//#region LOAD PROGRESSBAR
function loadProgress(){
	const allProgress = document.querySelectorAll(".circular-progress");

	allProgress.forEach(item => {
		const valueContainer = item.querySelector(".value-container");
		let progressValue = 0;
		let progressEndValue = item.dataset.value
		let speed = 25;

		progressValue += (progressEndValue==0)?0:1
		let progress = setInterval(() => {
			valueContainer.textContent = `${progressValue}%`;
			item.style.background = `conic-gradient(
				#48ACF0 ${progressValue * 3.6}deg,
				#cadcff ${progressValue * 3.6}deg
			)`;
			if (progressValue == progressEndValue) {
				clearInterval(progress);
			}
			progressValue++;
		}, speed);
	})
}
//#endregion


//#region MODAL CREATE NEW GOAL
const toggleCreateGoalModal = () => {
	document.querySelector('body').classList.toggle('modal-open')
	document.querySelector('#create_goal_modal').classList.toggle('hide')
}

document.querySelector('#form_create_goal').addEventListener('submit', async (event) => {
	event.preventDefault();

	const goal = {
		user: userId,
		name: document.querySelector('#txtGoalName').value,
		goalMoney: document.querySelector('#txtGoalMoney').value,
		description: document.querySelector('#txtGoalDes').value,
	}

	await createGoal(goal)

	event.target.reset()
	toggleCreateGoalModal()
	loadData()
})

document.querySelector('#btn_new_goal').addEventListener('click', toggleCreateGoalModal)
document.querySelector('#create_goal_modal .close-bar i').addEventListener('click', toggleCreateGoalModal)
//#endregion


//#region MODAL PAY GOAL
const togglePayGoalModal = (event) => {
	document.querySelector('body').classList.toggle('modal-open')
	document.querySelector('#pay_goal_modal').classList.toggle('hide')

	if (document.querySelector('body').classList.contains('modal-open')){
		const goalContainer = event.target.parentElement.parentElement.parentElement
		selectedGoalId = goalContainer.id
		goalName = goalContainer.querySelector('span').innerHTML
		document.querySelector('#pay_goal_modal div h3 span').innerHTML = goalName

	} else {
		selectedGoalId = null
	}
}

document.querySelector('#form_pay_goal').addEventListener('submit', async (event) => {
	event.preventDefault()

	moneyToPay = document.querySelector('#txtMoneyToPay').value

	await payGoal(selectedGoalId, moneyToPay)

	event.target.reset()
	togglePayGoalModal()
	loadData()
})

document.querySelector('#pay_goal_modal .close-bar i').addEventListener('click', togglePayGoalModal)
//#endregion


//#region MODAL DELETE GOAL
const toggleDeleteGoalModal = (event) => {
	document.querySelector('body').classList.toggle('modal-open')
	document.querySelector('#delete_goal_modal').classList.toggle('hide')

	if (document.querySelector('body').classList.contains('modal-open')){
		const goalContainer = event.target.parentElement.parentElement.parentElement
		selectedGoalId = goalContainer.id
		goalName = goalContainer.querySelector('span').innerHTML
		document.querySelector('#delete_goal_modal div h3 span').innerHTML = goalName

	} else {
		selectedGoalId = null
	}
}

document.querySelector('#form_delete_goal').addEventListener('submit', async (event) => {
	event.preventDefault()

	await deleteGoal(selectedGoalId)

	toggleDeleteGoalModal()
	loadData()
})

document.querySelector('#delete_goal_modal .close-bar i').addEventListener('click', toggleDeleteGoalModal)
//#endregion


//#region INSERT GOAL
function insertGoal(goal) {
	let li = document.createElement('li')
	let progress = Math.floor((goal.savedMoney/goal.goalMoney)*100)

	li.innerHTML = `
	<div class="goal_container" id="${goal.id}">

		<div class="external_container">
			<div class="internal_container">
				
				<p>
					<strong>Nombre de la meta</strong> <br>
					<span>${goal.name}</span>
				</p>
				<p>
					<strong>Descipción de la meta</strong> <br>
					${goal.description}
				</p>
				<p>
					<strong>Lo que te propones</strong> <br>
					${goal.goalMoney}
				</p>
				<p>
					<strong>Lo que llevas hasta el momento</strong> <br>
					${goal.savedMoney}
				</p>

				<button class="btn_pay_goal">Abonar a tu meta</button>
				<button class="btn_remove_goal">Eliminar meta</button>
			</div>
		</div>
	
		<div class="graphic_container">
			<h2>Progreso de la Meta</h2>
			<div class="circular-progress" data-value="${progress}">
				<div class="value-container">0%</div>
			</div>
		</div>
	</div>
	`
	goalsDiv.appendChild(li)
}
//#endregion

//#region LOAD DATA
async function loadData() {
    goals = await getGoals()

    goalsDiv.innerHTML = (goals.length>0)?'':`
	<h1 style="font-size: 40px; padding: 120px">
	Aún no tienes metas ...
	</h1>
	`
	
    goals.forEach((goal) => {
        insertGoal(goal)
    })

	loadProgress()

	document.querySelectorAll('.btn_pay_goal').forEach(btn=>{
		btn.addEventListener('click', togglePayGoalModal)
	})

	document.querySelectorAll('.btn_remove_goal').forEach(btn=>{
		btn.addEventListener('click', toggleDeleteGoalModal)
	})
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

//#region CREATE GOALS
async function createGoal(goal) {
	try {
		await fetch(`${BACKEND_URL}/goals/`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(goal)
		})
	} catch (error) {
		console.error(error)
	}
}
//#endregion

//#region PAY GOAL
async function payGoal(goalId, moneyToPay) {
	try {
		await fetch(`${BACKEND_URL}/goals/${goalId}`, {
			method: 'PATCH',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				moneyToPay: +moneyToPay
				
			})

		}).then(res => {
			if (res.status == 400){
				alert('La cantidad de dinero a abonar debe ser menor o igual al dinero restante para completar la meta.')

			} else if (res.status == 406){
				alert('Ya has completado esta meta, no puedes abonar más dinero.')
			}
		})
	} catch (error) {
		console.error(error)
	}
}
//#endregion

//#region DELETE GOAL
async function deleteGoal(goalId) {
	try {
		await fetch(`${BACKEND_URL}/goals/${goalId}`,
		{method: 'DELETE'})

	} catch (error) {
		console.error(error)
	}
}
//#endregion

loadData()