/*            cambiar pestañas     */
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