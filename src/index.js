import { createProject, getProjects, addTodoToProject } from './projects.js';
import { createTodo, getTodos } from './todos.js';

export function buildApp(){
    return 'hello wall';
}


const imports = {
    createProject,
    getProjects,
    createTodo,
    getTodos,
    addTodoToProject
};

Object.entries(imports).forEach(([name, fn]) => {
    window[name] = fn;
});

createProject('Project X', 'This is project X');
createProject('Project Y', 'This is project Y');
createProject('Project A', 'This is project A');
createProject('Project Z', 'This is project Z');
createProject('Project B', 'This is project B');
