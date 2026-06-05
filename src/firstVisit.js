import { createProject, addTodoToProject } from "./projects.js";
import { currentDate } from "./date.js";
import { createTodo, addItemToTodo, createTodoItem } from "./todos.js";


export function checkFirstVisit(){
    let firstVisit;
    firstVisit = localStorage.getItem('firstVisit');
    if (firstVisit === null || firstVisit === true) {
        startFirstVisit();
        return;
    } 
    return;
}


function startFirstVisit(){
    const today = new Date();
    today.setDate(today.getDate() + 7);
    const formattedDate = today.toLocaleDateString('en-US');
    const firstProject = createProject('Household', 'Manage household maintenance, chores, shopping, etc.');
    const firstTodo = createTodo(firstProject.id, 'Clean Kitchen', 'Make sure the kitchen is fully cleaned once a week', formattedDate, 'high');
    addTodoToProject(firstTodo);
    addItemToTodo(createTodoItem(firstTodo.id, 'checklist', 'Mop the floor'));
    addItemToTodo(createTodoItem(firstTodo.id, 'checklist', 'Do the dishes'));
    addItemToTodo(createTodoItem(firstTodo.id, 'notes', 'Need to buy dish soap before doing the dishes'));
    localStorage.setItem('firstVisit', JSON.parse('false'));
}