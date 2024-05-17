"use strict";
const form = document.querySelector('#form');
const all_todos = document.querySelector('#all_todos');
const text_new = document.querySelector('#text_new');
const none_todo = document.querySelector('#none_todo');
let todos;
let array = [];
window.addEventListener('load', loadPage);
form.addEventListener('submit', addTODO);
form.addEventListener('reset', deleteALL);
all_todos.addEventListener('click', checkTODO);
function loadPage(event) {
    const todosData = localStorage.getItem('todos');
    array = todosData ? JSON.parse(todosData) : [];
    createHTML(array);
    updateArray();
    if (all_todos.childElementCount == 0) {
        none_todo.classList.remove('none');
    }
}
function addTODO(event) {
    event.preventDefault();
    const todo_text = text_new.value;
    if (todo_text.trim() !== '') {
        if (!none_todo.classList.contains('none')) {
            none_todo.classList.add('none');
        }
        let currentDate = new Date();
        const newToDo = {
            text: todo_text,
            date: `${currentDate.getDate()}.${currentDate.getMonth() + 1}.${currentDate.getFullYear()}`,
            done: false
        };
        array.push(newToDo);
        localStorage.setItem('todos', JSON.stringify(array));
        createHTML(array);
    }
    else {
        alert("Вы не ввели текст");
    }
    text_new.value = "";
    text_new.focus();
}
function deleteALL(event) {
    event.preventDefault();
    array = [];
    localStorage.setItem('todos', JSON.stringify(array));
    createHTML(array);
    none_todo.classList.remove('none');
}
function checkTODO(event) {
    event.preventDefault();
    const target = event.target;
    const parent = target.closest('.todo');
    if (parent && parent.parentNode) {
        const index = Array.from(parent.parentNode.children).indexOf(parent);
        if (target.classList.contains('delete_img')) {
            array.splice(index, 1);
            localStorage.setItem('todos', JSON.stringify(array));
            createHTML(array);
            if (all_todos.childElementCount == 0) {
                none_todo.classList.remove('none');
            }
        }
        else {
            array[index].done = !array[index].done;
            localStorage.setItem('todos', JSON.stringify(array));
            createHTML(array);
        }
    }
}
function updateArray() {
    todos = all_todos.children;
    array = Array.from(todos).map((todo) => {
        var _a, _b, _c, _d;
        const text = todo.querySelector('.text') ? ((_a = todo.querySelector('.text')) === null || _a === void 0 ? void 0 : _a.children[0].textContent) || '' : '';
        const date = todo.querySelector('.text') ? ((_d = (_c = (_b = todo.querySelector('.text')) === null || _b === void 0 ? void 0 : _b.children[1]) === null || _c === void 0 ? void 0 : _c.textContent) === null || _d === void 0 ? void 0 : _d.slice(3)) || '' : '';
        const done = todo.classList.contains('done');
        return { text, date, done };
    });
    localStorage.setItem('todos', JSON.stringify(array));
}
function createHTML(array) {
    all_todos.innerHTML = '';
    array.forEach(todo => {
        const todoHTML = `<li class="todo ${todo.done ? 'done' : ''}">
                            <div class="note">
                                <input class="checkbox" type="checkbox" ${todo.done ? 'checked' : ''}>
                                <label class="text">
                                    <span ${todo.done ? 'class="line"' : ''}>${todo.text}</span>
                                    <sub>от ${todo.date}</sub>
                                </label>
                            </div>
                            <img class="delete_img" src="images/cross.svg">
                        </li>`;
        all_todos.insertAdjacentHTML('beforeend', todoHTML);
    });
}
