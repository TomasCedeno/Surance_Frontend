const BACKEND_URL = 'http://localhost:8000'
document.getElementById("btn_register").addEventListener("click", loadRegister);
document.getElementById("btn_login").addEventListener("click", loadLogin);
window.addEventListener("resize", resizing);

var forms_containers = document.querySelector(".forms_containers");
var login_form = document.querySelector(".login_form");
var register_form = document.querySelector(".register_form");
var register_container = document.querySelector(".register_container");
var login_container = document.querySelector(".login_container");

function resizing() {
    register_container.style.display = "block";

    if(window.innerWidth > 850){
        login_container.style.display = "block";
        if(login_form.style.opacity == 1){
            forms_containers.style.left = "410px";
        }
    }else{
        register_container.style.opacity = "1";
        login_container.style.display = "none";
        login_form.style.display = "block";
        register_form.style.display = "none";
        forms_containers.style.left = "0";
    }
}

resizing();

//#region CHANGE BETWEEN LOGIN AND SIGNUP

function loadRegister() {
    register_form.style.display = "block";
    login_form.style.display = "none";

    if(window.innerWidth > 850){
        // Acción del botón de registrar
        forms_containers.style.left = "10px";
        register_container.style.opacity = "0";
        login_container.style.opacity = "1";
    }else{
        // Acción del botón para pantalla pequeña (responsive)
        forms_containers.style.left = "0px";
        register_container.style.display = "none";
        login_container.style.display = "block";
        login_container.style.opacity = "1";
    }    
}

function loadLogin() {
    register_form.style.display = "none";
    login_form.style.display = "block";

    if(window.innerWidth > 850){
        // Acción del botón de login
        forms_containers.style.left = "410px";
        register_container.style.opacity = "1";
        login_container.style.opacity = "0";
    }else{
        // Acción del botón para pantalla pequeña (responsive)
        forms_containers.style.left = "0px";
        register_container.style.display = "block";
        login_container.style.display = "none";
        register_container.style.opacity = "1";
    }     
}
//#endregion


//#region LOGIN API
async function logIn(data) {
	try {
		const user = await fetch(`${BACKEND_URL}/login/`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		}).then(res => {
            if (res.status == 404){
                alert('El nombre de usuario ingresado no existe.')

            } else if (res.status == 403){
                alert('Contraseña Incorrecta.')

            } else if (res.status == 200){
                return res.json()
            }
        })

        return user.userId
	} catch (error) {
		console.error(error)
	}
}
//#endregion

//#region CREATE USER
async function createUser(user) {
	try {
		const userCreated = await fetch(`${BACKEND_URL}/user/`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(user)
		}).then(res => {
            if (res.status == 400){
                alert('Este nombre de usuario ya existe')

            } else if (res.status == 201){
                return res.json()
            }
        })

        return userCreated.id

	} catch (error) {
		console.error(error)
	}
}
//#endregion

//#region LOGIN SUBMIT
login_form.addEventListener('submit', async (event) => {
	event.preventDefault()

	loginData = {
		userName: document.querySelector('#loginUserName').value,
		password: document.querySelector('#loginPassword').value
	}

	userId = await logIn(loginData)

    if (userId){
        localStorage.setItem('userId', userId)
        event.target.reset()
        location.replace('home.html')
    }
    
})
//#endregion

//#region SIGNUP SUBMIT
register_form.addEventListener('submit', async (event) => {
	event.preventDefault()

	user = {
        name: document.querySelector('#name').value,
        email: document.querySelector('#email').value,
		userName: document.querySelector('#userName').value,
		password: document.querySelector('#password').value
	}

	userId = await createUser(user)

    if(userId){
        localStorage.setItem('userId', userId)
        location.replace('home.html')
        event.target.reset()
    }
})
//#endregion