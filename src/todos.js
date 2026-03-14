import { placeholderDueDate } from './date.js';

const allTodos = [];

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