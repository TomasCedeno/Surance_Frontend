//PROGRESSBAR
const allProgress = document.querySelectorAll(".circular-progress");

allProgress.forEach(item => {
	const valueContainer = item.querySelector(".value-container");
	let progressValue = 0;
	let progressEndValue = item.dataset.value
	let speed = 25;

	let progress = setInterval(() => {
		progressValue++;
		valueContainer.textContent = `${progressValue}%`;
		item.style.background = `conic-gradient(
			#48ACF0 ${progressValue * 3.6}deg,
			#cadcff ${progressValue * 3.6}deg
		)`;
		if (progressValue == progressEndValue) {
			clearInterval(progress);
		}
	}, speed);
})



// MODAL CREATE NEW GOAL
const toggleCreateGoalModal = () => {
	document.querySelector('body').classList.toggle('modal-open')
	document.querySelector('#create_goal_modal').classList.toggle('hide');
}

document.querySelector('#form_create_goal').addEventListener('submit', (event) => {
	event.preventDefault();
	toggleCreateGoalModal();
})

document.querySelector('#btn_new_goal').addEventListener('click', toggleCreateGoalModal);
document.querySelector('#create_goal_modal .close-bar i').addEventListener('click', toggleCreateGoalModal);



//MODAL PAY GOAL
const togglePayGoalModal = (event) => {
	document.querySelector('body').classList.toggle('modal-open')
	document.querySelector('#pay_goal_modal').classList.toggle('hide');

	if (document.querySelector('body').classList.contains('modal-open')){
		const goalContainer = event.target.parentElement.parentElement.parentElement
		goalName = goalContainer.querySelector('span').innerHTML
		document.querySelector('#pay_goal_modal div h3 span').innerHTML = goalName
	}
}

document.querySelector('#form_pay_goal').addEventListener('submit', (event) => {
	event.preventDefault();
	togglePayGoalModal();
})

const allBtnPayGoal = document.querySelectorAll('.btn_pay_goal')

allBtnPayGoal.forEach(btn=>{
	btn.addEventListener('click', togglePayGoalModal)
})

document.querySelector('#pay_goal_modal .close-bar i').addEventListener('click', togglePayGoalModal)



//MODAL DELETE GOAL
const toggleDeleteGoalModal = (event) => {
	document.querySelector('body').classList.toggle('modal-open')
	document.querySelector('#delete_goal_modal').classList.toggle('hide');

	if (document.querySelector('body').classList.contains('modal-open')){
		const goalContainer = event.target.parentElement.parentElement.parentElement
		goalName = goalContainer.querySelector('span').innerHTML
		document.querySelector('#delete_goal_modal div h3 span').innerHTML = goalName
	}
}

document.querySelector('#form_delete_goal').addEventListener('submit', (event) => {
	event.preventDefault();
	toggleDeleteGoalModal();
})

const allBtnDeleteGoal = document.querySelectorAll('.btn_remove_goal')

allBtnDeleteGoal.forEach(btn=>{
	btn.addEventListener('click', toggleDeleteGoalModal)
})

document.querySelector('#delete_goal_modal .close-bar i').addEventListener('click', toggleDeleteGoalModal)