import { currentDate, placeholderDueDate } from './date.js';

const allTodos = [];
let listCount = 1;
let noteCount = 1;

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
        due_date: placeholderDueDate(days),
        priority: String(priority).toLowerCase(),
        notes: [],
        checklist: [],
    }
    storeTodo(todo);
    return todo
}
window.updateChecklist = updateChecklist;
window.updateNotes = updateNotes;

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
        date_created: currentDate(),
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
        date_created: currentDate(),
        note,
    }
}