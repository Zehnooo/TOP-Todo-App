import { getProjects } from './projects.js';
import { formatDate } from './date.js';

export const buildDom = (() => {
   return buildDefaultMain();
})();

function buildDefaultMain(){
    const grid = document.createElement('div');
    grid.classList.add('grid');
    grid.id = 'default';
    const sidebar = buildDefaultSidebar();
    const dash = buildDefaultDash();
    grid.append(sidebar, dash);

    return grid;
}

function buildDefaultSidebar(){
    const projects = getProjects();
    console.log(projects);

    const sidebar = document.createElement('div');
        sidebar.classList.add('sidebar');

    const list = document.createElement('ul');
    list.classList.add('sidebar-list');
    projects.length > 0 ?
        projects.forEach(pj => {
            const item = document.createElement('li');
            item.id = pj.id;
            item.classList.add('sidebar-item');
            item.textContent = pj.title;
            list.appendChild(item);
        })
        : list.textContent = 'No projects';

    list.prepend(document.createElement('li').textContent = 'All Projects')
    sidebar.appendChild(list);
    return sidebar;
}

function buildDefaultDash(){
    const dash = document.createElement('div');
    dash.classList.add('dash');
    const projects = getProjects();
    projects.length > 0 ?
        projects.forEach(pj => {
            const c = buildProjectCard(pj);
            dash.append(c);
        }) : dash.textContent = 'No projects';

    return dash;
}

function buildProjectCard(project){
    const card = document.createElement('div');
    card.classList.add('project-card');
    console.log(project);

    const head = document.createElement('div');
        head.classList.add('project-head');

    const title = document.createElement('h3');
        title.textContent = project.title;

    const date = document.createElement('p');
        date.textContent = formatDate(project.created, 'date');

    head.append(title, date);

    const todoCount = document.createElement('p');
        todoCount.textContent = `${project.todos.length} todos`;

    card.append(head, todoCount);
    return card;
}