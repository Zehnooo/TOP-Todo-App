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

createProject('Work Tasks', 'Track job-related responsibilities and deadlines.');
createProject('Classwork', 'Keep up with homework, exams, and study goals.');
createProject('Household', 'Manage cleaning, maintenance, and home to-dos.');
createProject('Errands', 'Store runs, appointments, and quick tasks while out.');
createProject('Meal Planning', 'Plan meals, groceries, and food prep.');
createProject('Fitness Goals', 'Track workouts, recovery, and health habits.');
createProject('Budget', 'Monitor bills, payments, and financial reminders.');
createProject('Website Project', 'Organize tasks for building and improving your website.');
createProject('Weekend Plans', 'Keep track of things to do on days off.');