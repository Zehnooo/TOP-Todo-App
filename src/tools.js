import randomcolor from 'randomcolor';
import {buildPlaceholder} from './dom.js';
import {createProject, loadProjectStorage, updateProjectStorage} from "./projects.js";
import { createTodo, loadTodoStorage } from "./todos.js";
import Swal from "sweetalert2";

export function getColor(){
    return randomcolor({luminosity: 'bright', hue: 'random'});
}

export function loadLocalStorage(){
    loadProjectStorage();
    loadTodoStorage();
}

export function sumTodos(projects, type) {
    switch(type) {
        case 'incomplete':
            return projects.reduce((sum, pj) => sum + (pj?.todos?.filter(td => !td.isCompleted)?.length || 0), 0);
        case 'complete':
            return projects.reduce((sum, pj) => sum + (pj?.todos?.filter(td => td.isCompleted)?.length || 0), 0);
        case 'all':
            return projects.reduce((sum, pj) => sum + (pj?.todos?.length || 0), 0);
    }
}

export function saveTheme(){
    const theme = document.body.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
}

export function getTheme(){
    return localStorage.getItem('theme') || 'light';
}

export function validateContent(arr, contentName){
    if (arr.length === 0) {
        return buildPlaceholder(String(contentName));
    } else return null
}

export function handleProjectFormSubmission(e){
    e.preventDefault();
    const data = collectFormData(e);
    const title = data.get('title').trim() || null;
    const desc = data.get('desc').trim() || null;
    console.log("t", title);
    console.log("d", desc);
    if (title === null || desc === null) {
       fireMissingDataError();
    } else {
        document.querySelector('#new-project-form').reset();
        return createProject(title, desc);
    }
}

export function handleTodoFormSubmission(e, id){
    e.preventDefault();
    const data = collectFormData(e);
    const title = data.get('title').trim() || null;
    const desc = data.get('desc').trim() || null;
    const due = data.get('due-date') || null;
    const prio = data.get('priority') || null;
    if ( title === '' || desc === '' || prio === String(0) || prio === null)  {
        fireMissingDataError();
    } else {
        document.querySelector('#new-todo-form').reset();
        return createTodo(id, title, desc, due, prio);
    }
}

export function addTodoToProject(todo){
    try {
        const project = getProjects().find(pj => pj.id === todo.project_id);
        if (project) project?.todos?.push(todo);
        updateProjectStorage();
    } catch (err) {
        throw err
    }
}

function collectFormData(e){
    return new FormData(e.target);
}

function fireMissingDataError(){
    const theme = getTheme();
    Swal.fire({
        title: 'Missing Data',
        icon: 'error',
        text: 'Please fill out all options before saving',
        theme: String(theme)
    });
}


const selectedTodos = [];
export function handleTodoCheck(e){
    try {
        const status = e.target.checked || false;
        const todoId = e.target.parentElement.parentElement.dataset.todo_id;
        if (status) {
            selectedTodos.push(todoId);
        } else {
            selectedTodos.splice(selectedTodos.indexOf(todoId));
        }
    } catch (err) {
        throw err
    }
    return selectedTodos.length > 0 ? selectedTodos : null;
}

export function useTodoOption(e){
    console.log(selectedTodos);
    const op = String(e.target.id).replace('todo-','');
    switch(op){
        case 'delete':
            console.log('a');
            break;
        case 'edit':
            console.log('b');
            break;
        case 'copy':
            console.log('c');
            break;
        case 'complete':
            console.log('d');
            break;
    }
}
