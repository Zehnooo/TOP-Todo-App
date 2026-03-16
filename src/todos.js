import {currentDate, dueDate} from './date.js';
import {addTodoToProject} from "./projects.js";

const allTodos = [];
let listCount = 1;
let noteCount = 1;

window.getTodos = getTodos;

function storeTodo(todo){
    allTodos.push(todo);
}

export function getTodos(){
    return [...allTodos];
}

export function createTodo(title, description, days, priority) {
    const todo = {
        id: crypto.randomUUID(),
        title,
        description,
        isCompleted: false,
        created: currentDate('date-time'),
        due_date: dueDate(days),
        priority: String(priority).toLowerCase(),
        notes: [],
        checklist: [],
    }
    storeTodo(todo);
    return todo
}


function updateChecklist(todoId, listStr){
    const todo = getTodos().find(td => td.id === todoId);
    const item = createListItem(listStr);
    todo.checklist.push(item);
}

function createListItem(item){
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