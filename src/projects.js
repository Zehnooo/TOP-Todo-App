import { currentDate } from './date.js';
import Swal from 'sweetalert2';

const allProjects = [];

function storeProject(project){
    allProjects.push(project);
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
    return project;
}

export function findProject(projectId){
    return allProjects.find(pj => pj.id === projectId);
}

export async function confirmDelete(project){
    let prompt = `Are you sure you want to delete <span style="color: red;">${project.title}</span>?`
    return Swal.fire({
        title: prompt,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#ccc',
        confirmButtonText: 'DELETE!',
    });
}

export function deleteProject(projectId){
    const project = findProject(projectId);
    allProjects.splice(allProjects.indexOf(project), 1);
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