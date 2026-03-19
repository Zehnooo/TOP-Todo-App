import { getProjects, deleteProject, confirmDelete } from './projects.js';
import { formatDate } from './date.js';
import {getColor, sumTodos} from './tools.js';

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

    const sidebar = document.createElement('div');
        sidebar.classList.add('sidebar');

    const list = document.createElement('ul');
    list.classList.add('sidebar-list', 'scroll');
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
            mark.style.color = getColor();

            item.prepend(mark);
            list.appendChild(item);
        })
        : list.textContent = 'No projects';

    const home = document.createElement('li');
        home.textContent = 'Home';
        home.addEventListener('click', () => { goHome(); setSelectedItem('home'); });
        home.id = 'home';
        home.classList.add('selected');

    list.prepend(home);
    sidebar.appendChild(list);
    return sidebar;
}

function goHome(){
    const root = document.getElementById('root');
    root.innerHTML = '';
    root.append(buildDefaultMain());
}

function buildDefaultDash(){
    const projects = getProjects();
    const container = document.createElement('div');
    container.id = 'default-dash';

    const head = document.createElement('div');
    head.classList.add('dash-top-bar');

    const headContainer = document.createElement('div');
    headContainer.classList.add('dash-top-inputs');

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
        newBtn.addEventListener('click', () => handleNewProjectForm());

    const plus = document.createElement('span');
    plus.innerHTML = `<svg width="18px" height="18px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000">
<g id="SVGRepo_bgCarrier" stroke-width="0"/>
<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
<g id="SVGRepo_iconCarrier"> <title>plus_circle [#1427]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-179.000000, -600.000000)" fill="currentColor"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M137.7,450 C137.7,450.552 137.2296,451 136.65,451 L134.55,451 L134.55,453 C134.55,453.552 134.0796,454 133.5,454 C132.9204,454 132.45,453.552 132.45,453 L132.45,451 L130.35,451 C129.7704,451 129.3,450.552 129.3,450 C129.3,449.448 129.7704,449 130.35,449 L132.45,449 L132.45,447 C132.45,446.448 132.9204,446 133.5,446 C134.0796,446 134.55,446.448 134.55,447 L134.55,449 L136.65,449 C137.2296,449 137.7,449.448 137.7,450 M133.5,458 C128.86845,458 125.1,454.411 125.1,450 C125.1,445.589 128.86845,442 133.5,442 C138.13155,442 141.9,445.589 141.9,450 C141.9,454.411 138.13155,458 133.5,458 M133.5,440 C127.70085,440 123,444.477 123,450 C123,455.523 127.70085,460 133.5,460 C139.29915,460 144,455.523 144,450 C144,444.477 139.29915,440 133.5,440" id="plus_circle-[#1427]"> </path> </g> </g> </g> </g>
</svg>`;


    newBtn.prepend(plus);
    label.append(filter);
    headContainer.append(label, newBtn);
    head.append(headContainer);
    container.append(head);


    container.append(buildProjectMeasures(projects));

    const dash = document.createElement('div');
    dash.classList.add('dash', 'scroll');
    container.append(dash);


    projects.length > 0 ?
        projects.forEach(pj => {
            const c = buildProjectCard(pj);
            dash.append(c);
        }) : dash.textContent = 'No projects';

    return container;
}

function buildProjectMeasures(projects){
    const measures = document.createElement('div');
    measures.classList.add('measures');
    console.log(projects);

    const projectMeasure = buildMeasureCard('Projects', projects.length);
        projectMeasure.classList.add('project-count', 'empty');

    const allTodos = buildMeasureCard('Todos', sumTodos(projects, 'all'));
        allTodos.classList.add('project-count', 'count');

    const incompleteMeasure = buildMeasureCard('Incomplete Todos',  sumTodos(projects, 'incomplete'));
        incompleteMeasure.classList.add('project-count', 'incomplete');

    const completeMeasure = buildMeasureCard('Complete Todos', sumTodos(projects, 'complete'));
        completeMeasure.classList.add('project-count', 'completed');

    measures.append(projectMeasure, allTodos, completeMeasure, incompleteMeasure)
    return measures
}

function buildMeasureCard(title, count){
    const card = document.createElement('div');
        card.classList.add('measure-card');

    const hr = document.createElement('hr');
        hr.classList.add('measure-hr');

    const t = document.createElement('h3');
        t.textContent = String(title);
    const c = document.createElement('p');
        c.textContent = String(count);

    card.append(t, hr, c);
    return card;
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
        delBtn.innerHTML = '&#8942;';
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

    head.append(title, delBtn);

    const body = document.createElement('div');
        body.classList.add('project-body');

    const desc = document.createElement('p');
        desc.textContent = project.description;
        desc.classList.add('project-desc');

    const counts = document.createElement('div');
    counts.classList.add('project-counts');

    const totalCount = project.todos.length;
    const todoCount = document.createElement('span');
    totalCount === 1 ? todoCount.textContent = `${totalCount} todo` : todoCount.textContent = `${totalCount} todos`;
    totalCount > 0 ? todoCount.classList.add('project-count', 'count') : todoCount.classList.add('project-count', 'empty');

    counts.append(todoCount);
    body.append(desc, counts);

    if (project.todos.length > 0) {

        const completedCount = project.todos.filter(td => td.isCompleted).length;

        if (completedCount > 0) {
            const completed = document.createElement('span');
            completed.textContent = `${completedCount} completed`;
            completed.classList.add('project-count', 'completed');
            counts.append(completed);
        }
        const incompleteCount = totalCount - completedCount;
        if (incompleteCount > 0) {
            const incomplete = document.createElement('span');
            incomplete.textContent = `${incompleteCount} incomplete`;
            incomplete.classList.add('project-count', 'incomplete');
            counts.append(incomplete);
        }
    }

    card.append(head, body);
    return card;
}

function removeDOMCard(card){
    card.remove();
}

function removeSidebarItem(id){
    const item = document.querySelector(`[data-id="${(id)}"]`);
    if (item) item.remove();
}

function setSelectedItem(id){
    const selected = document.querySelector('.selected');
    if (selected) selected.classList.remove('selected');
    let item;
    id !== 'home' ? item = document.querySelector(`[data-id="${(id)}"]`) : item = document.getElementById('home');
    if (item) item.classList.add('selected');
}

function showProjectPage(id){

    let dash = document.getElementById('default-dash');
    if (dash === null) { dash = document.getElementById('project-dash') }
    dash.id = 'project-dash';
    const projectPage = buildProjectPage(getProjects().find(pj => pj.id === id));
    dash.innerHTML = '';
    dash.append(projectPage);
}

function buildProjectPage(project){
    const copy = {...project};
    const container = document.createElement('div');
        container.classList.add('project-page');

    const pageHead = document.createElement('div');
        pageHead.classList.add('project-page-head');

    const title = document.createElement('h2');
        title.textContent = copy.title;
        title.classList.add('project-page-title');

    const date = document.createElement('p');
    const d = formatDate(copy.created, 'date');
        date.textContent = `Created on ${d}`;
        date.classList.add('project-page-date');

    const desc = document.createElement('p');
        desc.textContent = copy.description;
        desc.classList.add('project-page-desc');

    const newTodoBtn = document.createElement('button');
        newTodoBtn.classList.add('new-btn', 'btn');
        newTodoBtn.textContent = 'New Todo';
        newTodoBtn.addEventListener('click', () => {});

    const todoContainer = document.createElement('div');
        todoContainer.classList.add('project-page-todo-container');

     const todoHeader = document.createElement('div');
        todoHeader.classList.add('project-page-todo-header');

    const todoHeading = document.createElement('h2');
        todoHeading.textContent = 'Todos';

    const plus = document.createElement('span');
        plus.innerHTML = '+';

    newTodoBtn.prepend(plus);
    todoHeader.append(todoHeading);

    const tdTableHead = document.createElement('h3');
    tdTableHead.textContent = 'Incomplete Todos';

    let todoTable;
    if (copy.todos.length > 0) {
        todoTable = buildProjectTodoList(copy, 'incomplete');
        todoTable.classList.add('project-page-todo-table');
    } else { todoTable = buildTablePlaceholder(); }

    const complTableHead = document.createElement('h3');
    complTableHead.textContent = 'Complete Todos';

    let completeTable;
    if (copy.todos.filter(td => td.isCompleted).length > 0){
        completeTable = buildProjectTodoList(copy, 'complete');
        completeTable.classList.add('project-page-todo-table');
    } else { completeTable = buildTablePlaceholder(); }

    pageHead.append(title, date, desc, newTodoBtn);
    container.append(pageHead);
    if (todoTable) {
        let tableWrap = document.createElement('div');
        tableWrap.classList.add('project-page-table-wrap');
        tableWrap.append(tdTableHead, todoTable);
        todoContainer.append(tableWrap)
    }
    if (completeTable) {
        let tableWrap = document.createElement('div');
        tableWrap.append(complTableHead, completeTable);
        tableWrap.classList.add('project-page-table-wrap');
        todoContainer.append(tableWrap);
    }
    container.append(todoContainer);
    return container;
}

function buildTablePlaceholder(){
    const placeholder = document.createElement('div');
    const p = document.createElement('p');
    p.textContent = 'No todos';
    placeholder.classList.add('project-page-todo-empty');
    placeholder.append(p);
    return placeholder;
}

function buildProjectTodoList(project, status){
    const copy = {...project};
    const todos = document.createElement('table');
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');

    const mark = document.createElement('th');
        mark.textContent = ' ';
        mark.classList.add('small-col');

    const date = document.createElement('th');
        date.textContent = 'Date';

    const title = document.createElement('th');
        title.textContent = 'Title';

    const due = document.createElement('th');
        due.textContent = 'Due';

    const priority = document.createElement('th');
        priority.textContent = 'Priority';

    tr.append(mark, date, title, due, priority);
    thead.append(tr);
    todos.append(thead);

    const tbody = document.createElement('tbody');

    copy.todos.sort((a, b) => {
        return a.isCompleted - b.isCompleted
    });

    status === 'incomplete' ? copy.todos = copy.todos.filter(td => !td.isCompleted ) : copy.todos = copy.todos.filter(td => td.isCompleted );


    copy.todos.forEach(td => {
        const row = document.createElement('tr');
            row.dataset.id = td.id;

        const checkbox = document.createElement('td');
            checkbox.classList.add('small-col');

        const check = document.createElement('input');
            check.classList.add('todo-checkbox');
            check.type = 'checkbox';
            check.checked = false;

        const date = document.createElement('td');
            date.textContent = formatDate(td.created, 'date');

        const title = document.createElement('td');
            title.textContent = td.title;

        const due = document.createElement('td');
            due.textContent = td.due_date;

        const priority = document.createElement('td');
        const span = document.createElement('span');
            span.classList.add(`${td.priority}-priority`, 'priority');
            span.textContent = td.priority;

        priority.append(span);
        checkbox.append(check);
        row.append(checkbox, date, title, due, priority);
        tbody.append(row);
    });
    todos.append(tbody);
    return todos;
}

function buildNewProjectForm(){
    const form = document.createElement('form');
    form.id = 'new-project-form';
    const container = document.createElement('div');

    const label1 = document.createElement('label');
        label1.textContent = 'Title';

    const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.placeholder = 'Household';
        titleInput.id = 'input-project-title';
        label1.htmlFor = 'input-project-title';
    label1.append(titleInput);

    const label2 = document.createElement('label');
        label2.textContent = 'Description';
    const descInput = document.createElement('input');
        descInput.type = 'text';
        descInput.placeholder = 'Manage cleaning, maintenance, etc.';
        descInput.id = 'input-project-desc';
        label2.htmlFor = 'input-project-desc';
    label2.append(descInput);

    const btn = document.createElement('button');
    btn.textContent = 'Save';
    btn.classList.add('btn', 'save-btn');
    btn.type = 'submit';
    const span = document.createElement('span');
    span.innerHTML = `<svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="SVGRepo_bgCarrier" stroke-width="0"/>
<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
<g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M18.1716 1C18.702 1 19.2107 1.21071 19.5858 1.58579L22.4142 4.41421C22.7893 4.78929 23 5.29799 23 5.82843V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H18.1716ZM4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21L5 21L5 15C5 13.3431 6.34315 12 8 12L16 12C17.6569 12 19 13.3431 19 15V21H20C20.5523 21 21 20.5523 21 20V6.82843C21 6.29799 20.7893 5.78929 20.4142 5.41421L18.5858 3.58579C18.2107 3.21071 17.702 3 17.1716 3H17V5C17 6.65685 15.6569 8 14 8H10C8.34315 8 7 6.65685 7 5V3H4ZM17 21V15C17 14.4477 16.5523 14 16 14L8 14C7.44772 14 7 14.4477 7 15L7 21L17 21ZM9 3H15V5C15 5.55228 14.5523 6 14 6H10C9.44772 6 9 5.55228 9 5V3Z" fill="currentColor"/> </g>
</svg>`

    btn.prepend(span);
    container.append(label1, label2)
    form.append(container, btn);
    return form;
}

function handleNewProjectForm(){
    const head = document.querySelector('.dash-top-bar');
    let wrap = document.querySelector('#new-project-form-wrap');
    if (!wrap){
        const wrap = document.createElement('div');
        wrap.id = 'new-project-form-wrap';
        let form = buildNewProjectForm();
        wrap.append(form);
        head.append(wrap);
        setTimeout(() => wrap.classList.add('reveal'), 25);
    } else {
        wrap.classList.remove('reveal');
        setTimeout(() => wrap.remove(), 200);
    }
}