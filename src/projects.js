import { currentDate } from './date.js';
import {
    getProjectsRef,
    saveProjectsToStorage,
    addProjectToMemory,
    removeProjectFromMemory,
    reloadStorage
} from './storage.js';

export function getProjects(){
    return [...getProjectsRef()];
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
    addProjectToMemory(project);
    saveProjectsToStorage();
    return project;
}

export function findProject(projectId){
    return getProjectsRef().find(pj => pj.id === projectId);
}

export function deleteProject(projectId){
    const project = findProject(projectId);
    const projects = getProjectsRef();
    removeProjectFromMemory(projects.indexOf(project));
    saveProjectsToStorage();
    return project;
}

export function addTodoToProject(todo){
    const project = findProject(todo.project_id);
    if (project) {
        project.todos.push(todo);
        saveProjectsToStorage();
    }
}

export function findTodoInProjects(todoId){
    for (const project of getProjectsRef()) {
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
        saveProjectsToStorage();
        return todo;
    }
    return null;
}

