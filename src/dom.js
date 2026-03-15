import { getProjects, deleteProject, confirmDelete } from './projects.js';
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
    const colors = ['#6F00FF', '#B284BE', '#0093AF','#011F5B','#007FFF','#FF4F00','#FFD700','#FDBCB4', '#FB607F','#FF0800', '#343434','#000000', '#00FFBF',  '#50C878', '#013220'];
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

            const mark = document.createElement('span');
            mark.innerHTML = '&#9632';
            if (colors.length > 0){
                const color = colors[Math.floor(Math.random() * colors.length)];
                colors.splice(colors.indexOf(color), 1);
                mark.style.color = color;
            } else {
                mark.style.color = '#000000';
            }
            item.prepend(mark);
            list.appendChild(item);
        })
        : list.textContent = 'No projects';
    const all = document.createElement('li');
    all.textContent = 'Home';
    list.prepend(all);
    sidebar.appendChild(list);
    return sidebar;
}

function buildDefaultDash(){
    const container = document.createElement('div');
    container.classList.add('container');

    const head = document.createElement('div');
    head.classList.add('dash-top-bar');

    const label = document.createElement('label');
        label.textContent = 'Search';
        label.htmlFor = 'filter';

    const filter = document.createElement('input');
        filter.id = 'filter';
        filter.type = 'text';
        filter.placeholder = 'Project name...';

    const newBtn = document.createElement('button');
        newBtn.textContent = 'New Project';
        newBtn.classList.add('btn', 'new-btn');
        newBtn.addEventListener('click', () => {})

    const plus = document.createElement('span');
    plus.innerHTML = '&#43;';


    newBtn.append(plus);
    label.append(filter);
    head.append(label, newBtn);
    container.append(head);

    const dash = document.createElement('div');
    dash.classList.add('dash');
    container.append(dash);

    const projects = getProjects();
    projects.length > 0 ?
        projects.forEach(pj => {
            const c = buildProjectCard(pj);
            dash.append(c);
        }) : dash.textContent = 'No projects';

    return container;
}

function buildProjectCard(project){
    const card = document.createElement('div');
    card.classList.add('project-card');

    const head = document.createElement('div');
        head.classList.add('project-head');

    const title = document.createElement('h3');
        title.textContent = project.title;

    const date = document.createElement('p');
        date.textContent = formatDate(project.created, 'date');

    const delBtn = document.createElement('button');
    delBtn.innerHTML = '&#128465;️';
    delBtn.classList.add('del-btn', 'btn');
    delBtn.dataset.id = project.id;
    delBtn.addEventListener('click',  async (e) => {
        const confirm = await confirmDelete(project);
        console.log(confirm);
        if (confirm.isConfirmed){
            deleteProject(e.target.dataset.id);
            removeDOMCard(e.target.parentElement.parentElement);
            removeSidebarItem(e.target.dataset.id);
        }
    });

    head.append(date, title, delBtn);

    const desc = document.createElement('p');
        desc.textContent = project.description;
        desc.classList.add('project-desc');

    const todoCount = document.createElement('p');
        todoCount.textContent = `${project.todos.length} todos`;
        todoCount.classList.add('project-count');

    card.append(head, desc, todoCount);
    return card;
}

function removeDOMCard(card){
    card.remove();
}

function removeSidebarItem(id){
    const item = document.querySelector(`[id="${(id)}"]`);
    console.log(item);
    if (item) item.remove();
}