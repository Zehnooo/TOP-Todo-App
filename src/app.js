import { buildApp } from './index.js'
import { createProject, getProjects } from './project.js';
import "./styles.css";
// const root = document.getElementById('root');
const imports = {
    buildApp,
    createProject,
    getProjects
};

Object.entries(imports).forEach(([name, fn]) => {
    window[name] = fn;
});

createProject('Project X', 'This is project X');
createProject('Project Y', 'This is project Y');
createProject('Project A', 'This is project A');
createProject('Project Z', 'This is project Z');
createProject('Project B', 'This is project B');

