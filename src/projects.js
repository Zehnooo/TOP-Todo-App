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
        created: currentDate('date-time'),
    }
    storeProject(project);
    return project;
}

export function addTodoToProject(projectId, todo){
    const project = getProjects().find(pj => pj.id === projectId);
    project.todos.push(todo);
}

createProject('Project X', 'This is project X');
createProject('Project Y', 'This is project Y');
createProject('Project A', 'This is project A');
createProject('Project Z', 'This is project Z');
createProject('Project B', 'This is project B');