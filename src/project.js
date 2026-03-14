import { currentDate } from './date.js';

const allProjects = [];

function storeProject(project){
    allProjects.push(project);
}

export function getProjects(){
    return [...allProjects];
}

export function createProject(title, description){
    const project = {
        id: crypto.randomUUID(),
        title,
        description,
        todos: [],
        date_created: currentDate(),
    }
    storeProject(project);
    return project;
}

