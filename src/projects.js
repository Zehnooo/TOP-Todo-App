import { currentDate } from './date.js';
import { createTodo } from './todos.js';
import Swal from 'sweetalert2';

const allProjects = [];

function storeProject(project){
    allProjects.push(project);
}

function updateProjectStorage(){
     localStorage.setItem('user-projects', JSON.stringify(allProjects));
}

export function loadProjectStorage(){
    const projects = JSON.parse(localStorage.getItem('user-projects'));
    console.log(projects);
    if (projects) {
        projects.forEach(pj => {
            storeProject(pj);
        });
    }
}

export function getProjects(){
    return [...allProjects];
}

window.getProjects = getProjects;

export function createProject(title, description){
    const project = {
        id: crypto.randomUUID(),
        title,
        description,
        todos: [],
        created: currentDate('date-time'),
    }
    storeProject(project);
    updateProjectStorage();
    return project;
}

export function findProject(projectId){
    return allProjects.find(pj => pj.id === projectId);
}

export async function confirmDelete(project){
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

export function deleteProject(projectId){
    const project = findProject(projectId);
    allProjects.splice(allProjects.indexOf(project), 1);
    updateProjectStorage();
    return project;
}

export function addTodoToProject(projectId, todo){
    const project = getProjects().find(pj => pj.id === projectId);
    project.todos.push(todo);
}

