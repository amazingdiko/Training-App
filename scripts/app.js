'use strict';

let habbits = [];
const HABBIT_KEY = "HABBIT_KEY";
let globalActivaHabbitId;

const page = {
    menu: document.querySelector('.menuList'),
    header: {
        h1: document.querySelector('.h1'),
        progressPercent: document.querySelector('.progressPercent'),
        progressCoverBar: document.querySelector('.progressCoverBar')
    },
    content: {
        daysConteiner: document.getElementById('days'),
        nextDay: document.querySelector('.habbitDay')
    },
    popup: {
        index: document.getElementById('add-habbit-popup'),
        iconField: document.querySelector('.popup__form input[name="icon"]')
    }
}

function loadData() {
    const habbitsString = localStorage.getItem(HABBIT_KEY);
    const habbitArray = JSON.parse(habbitsString);
    if (Array.isArray(habbitArray)){
        habbits = habbitArray;
    }
    console.log(habbits)
}

function saveData() {
    localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}

function togglePopup() {
    if(page.popup.index.classList.contains('cover_hidden')){
        page.popup.index.classList.remove('cover_hidden');
    } else {
        page.popup.index.classList.add('cover_hidden');
    }
}

function validateForm(form, fields){ 
    const formData = new FormData(form);
    res = {};
    for (const field of fields){
        const fieldElement = data.get(field);
        form[field].classList.remove('error');
        if (!field){
            form[field].classList.add('error');
        }
    }
    const comment = data.get('comment');
    form['comment'].classList.remove('error');
    if (!comment){
        form['comment'].classList.add('error');
    }
}

function rerenderMenu(activeHabbit){
    if (!activeHabbit) {
        return ;
    }
    for (const habbit of habbits){
        const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`);
        console.log(!existed);
        if (!existed){
            const element = document.createElement('button');
            element.setAttribute('menu-habbit-id', habbit.id);
            element.classList.add('menuItem');
            element.addEventListener('click', () => rerender(habbit.id));
            element.innerHTML = `<img src="images/${habbit.icon}.svg" alt="${habbit.name}">`
            if (activeHabbit.id === habbit.id){
                element.classList.add('menuItemActive');
            }
            page.menu.appendChild(element);
            continue ;
        }
        if (activeHabbit.id === habbit.id){
            existed.classList.add('menuItemActive');
        } else {
            existed.classList.remove('menuItemActive');
        }
    }
}

function rerenderHead(activeHabbit){
    if (!activeHabbit) {
        return ;
    }
    page.header.h1.innerText = activeHabbit.name;
    const progress = activeHabbit.days.length / activeHabbit.target > 1
        ? 100
        : activeHabbit.days.length / activeHabbit.target * 100;
        page.header.progressPercent.innerText = progress.toFixed(0) + "%";
        page.header.progressCoverBar.setAttribute('style', `width: ${progress}%`)
}

function rerenderBody(activeHabbit){
    if (!activeHabbit) {
        return ;
    }
    page.content.daysConteiner.innerHTML = '';
    for (const index in activeHabbit.days){
        const element = document.createElement('div');
        element.classList.add('habbit');
        element.innerHTML = `<div class="habbitDay">День ${Number(index) + 1}</div>
                <div class="habbitComment">${activeHabbit.days[index].comment}</div>
                <button class="habbitDelete" onclick="deleteDay(${index})">
                    <img src="images/delete.svg" alt="delete day ${index + 1}">
                </button>
            </div>`;
        page.content.daysConteiner.appendChild(element);
    }
    page.content.nextDay.innerHTML = `День ${activeHabbit.days.length + 1}`;
}

function rerender(activeHabbitId){
    globalActivaHabbitId = activeHabbitId;
    const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);
    rerenderMenu(activeHabbit);
    rerenderHead(activeHabbit);
    rerenderBody(activeHabbit);
}

/* work with days */

function addDays(event){
    const form = event.target;
    event.preventDefault();
    const data = new FormData(form);
    const comment = data.get('comment');
    form['comment'].classList.remove('error');
    if (!comment){
        form['comment'].classList.add('error');
    }
    habbits = habbits.map(habbit => {
        if (habbit.id === globalActivaHabbitId){
            return {
                ...habbit,
                days: habbit.days.concat([{comment}])
            }
        }
        return habbit;
    });
    form['comment'].value = '';
    rerender(globalActivaHabbitId);
    saveData();
}

function deleteDay(index) {
    console.log("sadasddas");
     habbits = habbits.map(habbit => {
         if (habbit.id === globalActivaHabbitId){
             habbit.days.splice(index, 1);
             return {
                 ...habbit,
                 days: habbit.days
             };
         }
         return habbit;
     });
     rerender(globalActivaHabbitId);
     saveData();
}

/* working with habbits */

function setIcon(context, icon){
    page.popup.iconField.value = icon;
    const activeIcon = document.querySelector('.icon.icon_active');
    activeIcon.classList.remove('icon_active');
    context.classList.add('icon_active');
    console.log(page.popup.iconField.value);
}

function addHabbit(event) {
    event.preventDefault();
}


/* init */
(() => {
    loadData();
    rerender(habbits[0].id);
})()