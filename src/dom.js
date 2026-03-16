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
                item.dataset.id = pj.id;
                item.classList.add('sidebar-item');
                item.textContent = pj.title;
                item.addEventListener('click', (e) => {
                    setSelectedItem(e.target.dataset.id);
                    showProjectPage(e.target.dataset.id);
                });
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

    const home = document.createElement('li');
        home.textContent = 'Home';
        home.addEventListener('click', () => { goHome(); setSelectedItem('home'); });
        home.id = 'home';

    list.prepend(home);
    sidebar.appendChild(list);
    return sidebar;
}

function goHome(){
    const dash = document.getElementById('project-dash');
    dash.innerHTML = '';
    dash.append(buildDefaultDash());
}

function buildDefaultDash(){
    const container = document.createElement('div');
    container.id = 'project-dash';

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
    const item = document.querySelector(`[data-id="${(id)}"]`);
    console.log(item);
    if (item) item.remove();
}

function setSelectedItem(id){
    const selected = document.querySelector('.selected');
    if (selected) selected.classList.remove('selected');
    let item;
    id !== "home" ? item = document.querySelector(`[data-id="${(id)}"]`) : item = document.getElementById('home');
    if (item) item.classList.add('selected');
}

function showProjectPage(id){
    const dash = document.getElementById('project-dash');
    const projectPage = buildProjectPage(getProjects().find(pj => pj.id === id));
    dash.innerHTML = '';
    dash.append(projectPage);
}

function buildProjectPage(project){
    const container = document.createElement('div');
        container.classList.add('project-page');

    const pageHead = document.createElement('div');
    pageHead.classList.add('project-page-head');

    const title = document.createElement('h2');
    title.textContent = project.title;

    const date = document.createElement('p');
    const d = formatDate(project.created, 'date');
    date.textContent = `Created on ${d}`;

    const desc = document.createElement('p');
    desc.textContent = project.description;
    let todoTable;
    const todoHeading = document.createElement('h3');
        todoHeading.textContent = 'Todo List';

    if (project.todos.length > 0) {
        todoTable = buildProjectTodoList(project);
    } else {
        todoTable = document.createElement('p');
        todoTable.textContent = 'No todos';
    }

    pageHead.append(title, date, desc);
    container.append(pageHead);
    if (todoTable) container.append(todoHeading, todoTable);
    return container;
}

function buildProjectTodoList(project){
    const todos = document.createElement('table');
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    const date = document.createElement('th');
    date.textContent = 'Date';
    const title = document.createElement('th');
    title.textContent = 'Title';
    const due = document.createElement('th');
    due.textContent = 'Due';
    const priority = document.createElement('th');
    priority.textContent = 'Priority';

    tr.append(date, title, due, priority);
    thead.append(tr);
    todos.append(thead);

    project.todos.forEach(td => {
        const row = document.createElement('tr');
            row.dataset.id = td.id;

        const date = document.createElement('td');
            date.textContent = formatDate(td.created, 'date');

        const title = document.createElement('td');
            title.textContent = td.title;

        const due = document.createElement('td');
            due.textContent = td.due_date;

        const priority = document.createElement('td');
            priority.textContent = td.priority;

        row.append(date, title, due, priority);
        todos.append(row);
    });
    return todos;
}

