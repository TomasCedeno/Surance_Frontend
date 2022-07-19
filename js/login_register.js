document.getElementById("btn_register").addEventListener("click", register);
document.getElementById("btn_login").addEventListener("click", login);
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

function register() {
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

function login() {
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