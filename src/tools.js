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
    const data = collectFormData(e);
    const n = data.get('title').trim();
    const d = data.get('desc').trim();
    if (n === '' || d === '') {
       fireMissingDataError();
       return;
    }
    document.querySelector('#new-project-form').reset();
    return createProject(n, d);
}

export function handleTodoFormSubmission(e, id){
    const data = collectFormData(e);
    const title = data.get('title').trim();
    const desc = data.get('desc').trim();
    const due = data.get('due-date');
    const prio = data.get('priority');
    if ( title === '' || desc === '' || prio === String(0)) {
        fireMissingDataError();
        return;
    }

    document.querySelector('#new-todo-form').reset();
    return createTodo(id, title, desc, due, prio);
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
    e.preventDefault();
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