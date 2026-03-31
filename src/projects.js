import { currentDate } from './date.js';
import Swal from 'sweetalert2';

const allProjects = [];

function storeProject(project){
    allProjects.push(project);
}

export function updateProjectStorage(){
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

export function deleteProject(projectId){
    const project = findProject(projectId);
    allProjects.splice(allProjects.indexOf(project), 1);
    updateProjectStorage();
    return project;
}

export function addTodoToProject(todo){
    const project = findProject(todo.project_id);
    if (project) {
        project.todos.push(todo);
        updateProjectStorage();
    }
}

export function findTodoInProjects(todoId){
    for (const project of allProjects) {
        const todo = project.todos.find(td => td.id === todoId);
        if (todo) return { project, todo };
    }
    return null;
}

export function removeTodoFromProject(todoId){
    const result = findTodoInProjects(todoId);
    if (result) {
        const { project, todo } = result;
        const index = project.todos.indexOf(todo);
        project.todos.splice(index, 1);
        updateProjectStorage();
        return todo;
    }
    return null;
}

