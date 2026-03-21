import {currentDate, dueDate} from './date.js';


const allTodos = [];
let listCount = 1;
let noteCount = 1;

function updateTodoStorage(){
    localStorage.setItem('user-todos', JSON.stringify(allTodos));
}

export function loadTodoStorage(){
    const todos = JSON.parse(localStorage.getItem('user-todos'));
    console.log(todos);
    if (todos) {
        todos.forEach(td => {
            storeTodo(td);
        });
    }
}

function storeTodo(todo){
    allTodos.push(todo);
}

export function getTodos(){
    return [...allTodos];
}

export function createTodo(project_id, title, description, due_date, priority, isCompleted = false) {
    const todo = {
        project_id,
        id: crypto.randomUUID(),
        title,
        description,
        isCompleted,
        created: currentDate('date-time'),
        due_date,
        priority: String(priority).toLowerCase(),
        notes: [],
        checklist: [],
    }
    storeTodo(todo);
    updateTodoStorage();
    return todo
}


function updateChecklist(todoId, listStr){
    const todo = getTodos().find(td => td.id === todoId);
    const item = createChecklistItem(listStr);
    todo.checklist.push(item);
}

function createChecklistItem(item){
    const formatted = String(listCount).padStart(3, '0');
    listCount++;
    return {
        id: `LI-${formatted}`,
        created: currentDate('date-time'),
        item,
    }
}

function updateNotes(todoId, noteStr){
    const todo = getTodos().find(td => td.id === todoId);
    const note = createNote(noteStr);
    todo.notes.push(note);
}

function createNote(note){
    const formatted = String(noteCount).padStart(3, '0');
    noteCount++;
    return {
        id: `NOTE-${formatted}`,
        date_created: currentDate('date-time'),
        note,
    }
}