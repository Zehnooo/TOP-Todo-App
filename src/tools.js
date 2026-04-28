import randomcolor from 'randomcolor';
import {buildPlaceholder, moveTodoCard, removeTable} from './dom.js';
import {createProject, removeTodoFromProject, findTodoInProjects} from "./projects.js";
import {createTodo, createTodoItem, addItemToTodo, completeTodo} from "./todos.js";
import {
    initializeStorage,
    saveProjectsToStorage,
    saveTheme,
    getTheme
} from "./storage.js";
import Swal from "sweetalert2";

export { saveTheme, getTheme };

export function getColor(){
    return randomcolor({luminosity: 'bright', hue: 'random'});
}

export function loadLocalStorage(){
    initializeStorage();
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

export function handleTodoFormSubmission(e, projId){
    e.preventDefault();
    const data = collectFormData(e);
    const title = data.get('title').trim() || null;
    const desc = data.get('desc').trim() || null;
    const due = data.get('due-date') || null;
    const prio = data.get('priority') || null;
    if ( title === null || desc === null || prio === String(0) || prio === null)  {
        fireMissingDataError();
        return;
    }
        document.querySelector('#new-todo-form').reset();
        return createTodo(projId, title, desc, due, prio);

}

export function handleModalFormSubmission(e, todoId, title) {
    e.preventDefault();
    const data = collectFormData(e);
    const value = data.get('value').trim() || null;
    console.log('value', value);
    if (value === '' || value === null) {
        fireMissingDataError();
        return false;
    } else {
        const newItem = createTodoItem(todoId, title, value);
        addItemToTodo(newItem);
        saveProjectsToStorage();
        return newItem;
    }
}

function collectFormData(e){
    return new FormData(e.target);
}

function fireMissingDataError(){
    const theme = getTheme();
    const modal = document.querySelector('#cust-modal');
    Swal.fire({
        title: 'Missing Data',
        icon: 'error',
        text: 'Please fill out all options before saving',
        theme: String(theme),
        target: modal || document.body
    });
}

export function fireGenericError(error){
    const theme = getTheme();
    const modal = document.querySelector('#cust-modal');
    Swal.fire({
        title: 'Oops...',
        icon: 'error',
        text: `An error occurred while processing your request: ${error.message}`,
        theme: String(theme),
        target: modal || document.body
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
            updateTodosStatus(selectedTodos);
            break;
    }
}

export async function confirmDelete(str){
    const prompt = String(str);
    const theme = getTheme();
    const modal = document.querySelector('#cust-modal');
    return Swal.fire({
        title: prompt,
        icon: 'warning',
        theme: String(theme),
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#007FFF',
        confirmButtonText: 'DELETE',
        target: modal || document.body
    });
}

export async function confirmProjectDelete(project){
    let prompt = `Are you sure you want to delete <span style="color: red; font-weight: 800;">${project.title}</span>?`;
    const modal = document.querySelector('#cust-modal');
    const theme = getTheme();
    return Swal.fire({
        title: prompt,
        icon: 'warning',
        theme: String(theme),
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#007FFF',
        confirmButtonText: 'DELETE',
        target: modal || document.body
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

function updateTodosStatus(arr) {
    if (arr.length > 0) {
        for (const todoId of arr) {
            const data = findTodoInProjects(todoId);
            const { todo } = data;
            const { project } = data;
            completeTodo(todo);
            moveTodoCard(todo);
            removeTable(project);
    }
}
}

export function checkIfZeroTodos(project){
    const incomplete = project.todos.filter(td => !td.isCompleted).length;
    const complete = project.todos.filter(td => td.isCompleted).length;
    return {
        incomplete,
        complete,
    }
}