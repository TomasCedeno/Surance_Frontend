//#region /*            cambiar pestañas     */
const tab        = document.querySelectorAll('.tab')
const tabShow    = document.querySelectorAll('.tabShow')

tab.forEach( ( cadaLi , i )=>{
    tab [i].addEventListener('click',()=>{

        tab .forEach( ( cadaLi , i )=>{
            tab[i].classList.remove('activo')
            tabShow[i].classList.remove('activo')
        })
        tab[i].classList.add('activo')
        tabShow[i].classList.add('activo')

    })
})
//#endregion


const BACKEND_URL = 'https://surance-db.herokuapp.com'
const userId = localStorage.getItem('userId')

if(!userId){
	logOut()
}

document.querySelector('#btnLogout').addEventListener('click', logOut)

function logOut(){
	localStorage.clear()
	alert('Se cerrará tu sesión')
	location.replace('index.html')
}


//#region GET USER API
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

//#region UPDATE USER API
async function updateUser(user) {
	try {
		await fetch(`${BACKEND_URL}/user/${userId}`, {
			method: 'PATCH',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(user)
		}).then(res => {
            if (res.status == 400){
                alert('Este nombre de usuario ya existe')

            } else if (res.status == 200){
                alert('Información actualizada con éxito.')
            }
        })

	} catch (error) {
		console.error(error)
	}
}
//#endregion

//#region CHANGE PASSWORD API
async function changePassword(data) {
	try {
		await fetch(`${BACKEND_URL}/user/${userId}`, {
			method: 'PATCH',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		}).then(res => {
            if (res.status == 400){
                alert('No se pudo cambiar la contraseña')

            } else if (res.status == 200){
                alert('Contraseña actualizada con éxito.')
            }
        })

	} catch (error) {
		console.error(error)
	}
}
//#endregion

//#region UPDATE USER INFO
document.querySelector('#btnUpdate').addEventListener('click', async (event) => {
	event.preventDefault()

	user = {
        name: document.querySelector('#name').value,
        userName: document.querySelector('#userName').value,
        email: document.querySelector('#email').value,
	}

	await updateUser(user)

    loadData()
})
//#endregion

//#region CHANGE PASSWORD
document.querySelector('#btnChangePassword').addEventListener('click', async (event) => {
	event.preventDefault()

	password1 = document.querySelector('#password1').value
	password2 = document.querySelector('#password2').value

    if (password1 != password2){
        alert('Las contraseñas no coinciden')

    } else {
        await changePassword({password: password1})
        document.querySelector('#password1').value = ''
	    document.querySelector('#password2').value = ''
    }

    loadData()
})
//#endregion

//#region LOAD DATA
async function loadData() {
    user = await getUser()

    document.querySelector('#name').value = user.name
    document.querySelector('#userName').value = user.userName
    document.querySelector('#email').value = user.email
}
//#endregion

loadData()