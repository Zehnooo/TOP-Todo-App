import randomcolor from 'randomcolor';
import {buildPlaceholder} from './dom.js';
import {createProject, loadProjectStorage, removeTodoFromProject} from "./projects.js";
import { createTodo } from "./todos.js";
import Swal from "sweetalert2";

export function getColor(){
    return randomcolor({luminosity: 'bright', hue: 'random'});
}

export function loadLocalStorage(){
    loadProjectStorage();
    localStorage.removeItem('user-todos');
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

export async function useTodoOption(e) {
    const todos = selectedTodos;

    const op = String(e.target.id).replace('todo-', '');
    switch (op) {
        case 'delete':
            const confirm = await confirmDelete('Are you sure you want to delete the selected todos?');
            if (!confirm.isConfirmed) return;
            deleteTodos(selectedTodos);
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

async function confirmDelete(str){
    const prompt = String(str);
    return Swal.fire({
        title: prompt,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#007FFF',
        confirmButtonText: 'DELETE',
    });
}

export async function confirmProjectDelete(project){
    let prompt = `Are you sure you want to delete <span style="color: red; font-weight: 800;">${project.title}</span>?`
    return Swal.fire({
        title: prompt,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#007FFF',
        confirmButtonText: 'DELETE',
    });
}

function deleteTodos(arr) {
    if (arr.length > 0) {
        for (const todoId of arr) {
            removeTodoFromProject(todoId);
            const row = document.querySelector(`[data-todo_id="${todoId}"]`);
            if (row) row.remove();
        }
        selectedTodos.length = 0;
    }
}