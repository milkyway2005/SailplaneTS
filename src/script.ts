interface ToDo {
    text: string;
    date: string;
    done: boolean;
}

const form = document.querySelector('#form') as HTMLFormElement;
const all_todos = document.querySelector('#all_todos') as HTMLElement;
const text_new = document.querySelector('#text_new') as HTMLInputElement;
const none_todo = document.querySelector('#none_todo') as HTMLElement;
let todos: HTMLCollection;
let array: ToDo[] = [];

window.addEventListener('load', loadPage);
form.addEventListener('submit', addTODO);
form.addEventListener('reset', deleteALL);
all_todos.addEventListener('click', checkTODO);

function loadPage(event: Event){
	const todosData = localStorage.getItem('todos');
	array = todosData ? JSON.parse(todosData) as ToDo[] : [];
    createHTML(array);
    updateArray();
	if(all_todos.childElementCount == 0){
		none_todo.classList.remove('none');
	}
}

function addTODO(event: Event){
    event.preventDefault();
    const todo_text = text_new.value;
    if(todo_text.trim() !== ''){
        if(!none_todo.classList.contains('none')){
            none_todo.classList.add('none');
        }
        let currentDate = new Date();
        const newToDo: ToDo = {
            text: todo_text,
            date: `${currentDate.getDate()}.${currentDate.getMonth() + 1}.${currentDate.getFullYear()}`,
            done: false
        };
        array.push(newToDo);
        localStorage.setItem('todos', JSON.stringify(array));
        createHTML(array);
    } else {
        alert("Вы не ввели текст");
    }
    text_new.value = "";
    text_new.focus();
}

function deleteALL(event: Event){
    event.preventDefault();
    array = [];
	localStorage.setItem('todos', JSON.stringify(array));
    createHTML(array);
    none_todo.classList.remove('none');
}

function checkTODO(event: Event){
    event.preventDefault();
    const target = event.target as HTMLElement;
    const parent = target.closest('.todo') as HTMLElement;
    if (parent && parent.parentNode) {
        const index = Array.from(parent.parentNode.children).indexOf(parent);
        if(target.classList.contains('delete_img')){
            array.splice(index, 1);
            localStorage.setItem('todos', JSON.stringify(array));
            createHTML(array);
			if(all_todos.childElementCount == 0){
				none_todo.classList.remove('none');
			}
        } else {
            array[index].done = !array[index].done;
            localStorage.setItem('todos', JSON.stringify(array));
            createHTML(array);
        }
    }
}

function updateArray(){
    todos = all_todos.children;
    array = Array.from(todos).map((todo: Element) => {
		const text = (todo as HTMLElement).querySelector('.text') ? (todo as HTMLElement).querySelector('.text')?.children[0].textContent || '' : '';
		const date = (todo as HTMLElement).querySelector('.text') ? (todo as HTMLElement).querySelector('.text')?.children[1]?.textContent?.slice(3) || '' : '';
		const done = (todo as HTMLElement).classList.contains('done');
		return { text, date, done };
	});
    localStorage.setItem('todos', JSON.stringify(array));
}

function createHTML(array: ToDo[]){
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