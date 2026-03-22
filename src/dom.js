import { getProjects, deleteProject, confirmDelete} from './projects.js';
import { getTodos } from './todos.js'
import { formatDate } from './date.js';
import {getColor, getTheme, saveTheme, sumTodos, validateContent, handleProjectFormSubmission, handleTodoFormSubmission, loadLocalStorage, addTodoToProject} from './tools.js';

export const buildDom = (() => {
    loadLocalStorage();
    getTheme() === 'dark' ? document.body.classList.add('dark') : document.body.classList.remove('dark');
    document.body.append(buildFooter());
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

    const listContainer = document.createElement('div');
    listContainer.classList.add('sidebar-list-container');

    const list = document.createElement('ul');
    list.classList.add('sidebar-list', 'scroll');
    if (projects.length > 0) {
        projects.forEach(pj => {
            const item = createSidebarItem(pj);
            list.appendChild(item);
        });
    } else {
        const placeholder = buildPlaceholder('No projects');
        placeholder.classList.add('sidebar-placeholder');
        list.append(placeholder);
    }
        const home = document.createElement('button');
        home.innerHTML = `<svg width="48px" height="48px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M19 9.77806V16.2C19 17.8801 19 18.7202 18.673 19.3619C18.3854 19.9264 17.9265 20.3854 17.362 20.673C17.2111 20.7499 17.0492 20.8087 16.868 20.8537M5 9.7774V16.2C5 17.8801 5 18.7202 5.32698 19.3619C5.6146 19.9264 6.07354 20.3854 6.63803 20.673C6.78894 20.7499 6.95082 20.8087 7.13202 20.8537M21 12L15.5668 5.96393C14.3311 4.59116 13.7133 3.90478 12.9856 3.65138C12.3466 3.42882 11.651 3.42887 11.0119 3.65153C10.2843 3.90503 9.66661 4.59151 8.43114 5.96446L3 12M7.13202 20.8537C7.65017 18.6447 9.63301 17 12 17C14.367 17 16.3498 18.6447 16.868 20.8537M7.13202 20.8537C7.72133 21 8.51495 21 9.8 21H14.2C15.485 21 16.2787 21 16.868 20.8537M14 12C14 13.1045 13.1046 14 12 14C10.8954 14 10 13.1045 10 12C10 10.8954 10.8954 9.99996 12 9.99996C13.1046 9.99996 14 10.8954 14 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`;
        home.addEventListener('click', () => { goHome(); setSelectedItem('home'); });
        home.id = 'home';
        home.classList.add('selected', 'btn', 'home-btn');

    sidebar.prepend(home);
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
        }) : dash.append(buildPlaceholder("No projects"));

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

    const totalCount = project.todos?.length;
    const todoCount = document.createElement('span');
    totalCount === 1 ? todoCount.textContent = `${totalCount} todo` : todoCount.textContent = `${totalCount} todos`;
    totalCount > 0 ? todoCount.classList.add('project-count', 'count') : todoCount.classList.add('project-count', 'empty');

    counts.append(todoCount);
    body.append(desc, counts);

    if (project.todos?.length > 0) {

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

function removeDOMCard(card) {
    const dash = document.querySelector('.dash');
    const check = validateContent(getProjects(), 'No projects');
    if (check) {  dash.append(check); }
    card.remove();
}

function removeSidebarItem(id){
    const item = document.querySelector(`[data-id="${(id)}"]`);
    const list = item.parentElement;
    const check = validateContent(getProjects(), 'No projects');
    if (item) item.remove();
    if (check) { check.classList.add('sidebar-placeholder'); list.append(check); }
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
    const todos = copy.todos;
    const container = document.createElement('div');
        container.classList.add('project-page');
        container.dataset.project_id = project.id;

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
        newTodoBtn.addEventListener('click', () => handleTodoForm());

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
    pageHead.append(title, date, desc, newTodoBtn);
    container.append(pageHead);

    let incompleteTable;
    let incompleteTodos = todos.filter(td => !td.isCompleted);
    const incompleteWrap = buildTableWrap('Incomplete');
    incompleteTodos.length > 0 ? incompleteTable = buildProjectTodoTable('incomplete', incompleteTodos) : incompleteTable = buildPlaceholder('No incomplete todos', 'empty-incomplete-todos');
    if (incompleteTable) { incompleteWrap.append(incompleteTable); todoContainer.append(incompleteWrap);
    }

    let completeTable;
    let completeTodos = todos.filter(td => td.isCompleted);
    const completeWrap = buildTableWrap('Complete');
    completeTodos.length > 0 ? completeTable = buildProjectTodoTable('complete', completeTodos) : completeTable = buildPlaceholder('No complete todos', 'empty-complete-todos');
    if (completeTable) { completeWrap.append(completeTable); todoContainer.append(completeWrap)
    }

    container.append(todoContainer);
    return container;
}

function buildTableWrap(type){
    const wrap = document.createElement('div');
        wrap.id = `project-page-${type.toLowerCase()}-table-wrap`;
        wrap.classList.add('project-page-table-wrap');
    const tableHead = document.createElement('h3');
        tableHead.textContent = `${type} Todos`;
        tableHead.id = `${type}-heading`;
    wrap.append(tableHead);
    return wrap;
}

export function buildPlaceholder(text, id = null){
    const placeholder = document.createElement('div');
    const p = document.createElement('p');
    p.textContent = String(text);
    placeholder.classList.add('empty-placeholder');
    placeholder.append(p);
    if (id) placeholder.id = id;
    return placeholder;
}

function buildProjectTodoTable(type, todos){
    const table = document.createElement('table');
    table.id = `project-page-${type}-table`;
    table.classList.add('project-page-todo-table');
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
    table.append(thead);

    const tbody = document.createElement('tbody');
    tbody.id = `todo-table-tbody-${type}`;

    if (todos?.length > 0) {
        todos.forEach(td => {const row = createTodoRow(td); tbody.append(row);});
    }

    table.append(tbody);
    return table;
}

function buildNewProjectForm(){
    const form = document.createElement('form');
    form.id = 'new-project-form';
    form.addEventListener('submit', (e) => {
        let newProject = handleProjectFormSubmission(e);
        addNewCard(newProject);
        addNewSidebarOption(newProject);
    });

    const container = document.createElement('div');

    const label1 = document.createElement('label');
        label1.textContent = 'Title';

    const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.name = 'title';
        titleInput.placeholder = 'Household';
        titleInput.id = 'input-project-title';
        label1.htmlFor = 'input-project-title';
    label1.append(titleInput);

    const label2 = document.createElement('label');
        label2.textContent = 'Description';
    const descInput = document.createElement('input');
        descInput.type = 'text';
        descInput.name = 'desc';
        descInput.placeholder = 'Manage cleaning, maintenance, etc.';
        descInput.id = 'input-project-desc';
        label2.htmlFor = 'input-project-desc';
    label2.append(descInput);

    const btn = createSaveButton();
    container.append(label1, label2)
    form.append(container, btn);
    return form;
}

function createSaveButton(){
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
    return btn;
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



function addNewCard(project){
    removePlaceholder('.dash .empty-placeholder');
    const dash = document.querySelector('.dash');
    const c = buildProjectCard(project);
    dash.append(c);
}

function addNewSidebarOption(project){
    removePlaceholder('.sidebar-list .sidebar-placeholder');
    const list = document.querySelector('.sidebar-list');
    const item = createSidebarItem(project);
    list.append(item);
}

function createSidebarItem(project){
    const item = document.createElement('li');
    item.dataset.id = project.id;
    item.classList.add('sidebar-item');

    const label = document.createElement('span');
    label.textContent = project.title;
    label.classList.add('sidebar-item-label');

    item.addEventListener('click', () => {
        setSelectedItem(item.dataset.id);
        showProjectPage(item.dataset.id);
    });

    const mark = document.createElement('span');
    mark.innerHTML = '&#9632';
    mark.style.color = getColor();

    item.append(mark, label);
    return item;
}
function buildFooter(){
    const footer = document.createElement('footer');
    footer.classList.add('site-footer');

    const footerWrap = document.createElement('div');
    footerWrap.classList.add('footer-wrap');

    const textContainer = document.createElement('div');
    textContainer.classList.add('footer-text-container');
    const p = document.createElement('p');
    p.innerHTML = `Zehno's Todo App &copy; 2026 Zehno All Rights Reserved.`;

    const a = document.createElement('a');
    a.href = 'https://github.com/Zehnooo';
    a.target = '_blank';
    a.textContent = 'My Github';
    a.classList.add('footer-link');

    const options = buildOptions();

    textContainer.append(p, a);
    footerWrap.append(options, textContainer);
    footer.append(footerWrap);
    return footer;
}

function buildOptions(){
    const options = document.createElement('div');
    options.id = 'options';

    const themeToggle = document.createElement('button');
    themeToggle.classList.add('theme-toggle', 'btn');
    themeToggle.innerHTML = `<svg height="64px" width="64px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 47.54 47.54" xml:space="preserve" fill="currentColor"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path style="fill:currentColor;" d="M24.997,47.511C11.214,47.511,0,36.298,0,22.515C0,12.969,5.314,4.392,13.869,0.132 c0.385-0.191,0.848-0.117,1.151,0.186s0.381,0.766,0.192,1.15C13.651,4.64,12.86,8.05,12.86,11.601 c0,12.681,10.316,22.997,22.997,22.997c3.59,0,7.033-0.809,10.236-2.403c0.386-0.191,0.848-0.117,1.151,0.186 c0.304,0.303,0.381,0.766,0.192,1.15C43.196,42.153,34.597,47.511,24.997,47.511z M12.248,3.372C5.862,7.608,2,14.709,2,22.515 c0,12.68,10.316,22.996,22.997,22.996c7.854,0,14.981-3.898,19.207-10.343c-2.668,0.95-5.464,1.43-8.346,1.43 c-13.783,0-24.997-11.214-24.997-24.997C10.861,8.761,11.327,6.005,12.248,3.372z"></path> </g> </g> </g></svg>`

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark')
        saveTheme();
    });


    options.append(themeToggle);
    return options;
}

function buildTodoForm(){
    const form = document.createElement('form');
    form.id = 'new-todo-form';
    form.addEventListener('submit', (e) => {
        const projectId = document.querySelector('.project-page').dataset.project_id;
        const newTodo = handleTodoFormSubmission(e, projectId);
        addTodoToList(newTodo);
        addTodoToProject(newTodo);
    });
    const container = document.createElement('div');

    const label1 = createBasicElement('label', 'Title');
        label1.htmlFor = 'input-todo-title';
    const titleInput = createInput('input-todo-title', 'text', 'title', 'Clean Kitchen');
    titleInput.classList.add('todo-input');
    label1.append(titleInput);

    const label2 = createBasicElement('label', 'Description');
        label2.htmlFor = 'input-todo-desc';
    const descInput = createInput('input-todo-desc', 'text', 'desc', 'Do the dishes, mop the floor...');
    descInput.classList.add('todo-input');
    label2.append(descInput);

    const label3 = createBasicElement('label', 'Due Date');
        label3.htmlFor = 'input-todo-date';
    const dueDateInput = createInput('input-todo-date', 'datetime-local', 'due-date');
    dueDateInput.classList.add('todo-input');
    label3.append(dueDateInput);

    const label4 = createBasicElement('label', 'Priority');
    const priorityInput = document.createElement('select');
    priorityInput.name = 'priority';
    priorityInput.classList.add('todo-input');
        const priorityOptions = [
            {value: null, text: '-'},
            {value: 'Low', text: 'Low'},
            {value: 'Medium', text: 'Medium'},
            {value: 'High', text: 'High'}
        ];
        priorityOptions.forEach(op => {
            const x = document.createElement('option');
            x.value = op.value;
            x.textContent = op.text;
            priorityInput.appendChild(x);
        });
    label4.append(priorityInput);

    const btn = createSaveButton();

    container.append(label1, label2, label3, label4)
    form.append(container, btn);
    return form;
}

function handleTodoForm(){
    const head = document.querySelector('.project-page-head');
    let wrap = document.querySelector('#todo-form-wrap');
    if (!wrap) {
        const wrap = document.createElement('div');
        wrap.id = 'todo-form-wrap';
        let form = buildTodoForm();
        wrap.append(form);
        head.append(wrap);
        setTimeout(() => wrap.classList.add('reveal'), 25);
    } else {
        wrap.classList.remove('reveal');
        setTimeout(() => wrap.remove(), 200);
    }
}

function createTodoRow(todo){
    const row = document.createElement('tr');
    row.dataset.id = todo.id;

    const checkbox = document.createElement('td');
    checkbox.classList.add('small-col');

    const check = document.createElement('input');
    check.classList.add('todo-checkbox');
    check.type = 'checkbox';
    check.checked = false;

    const date = document.createElement('td');
    date.textContent = formatDate(todo.created, 'date');

    const title = document.createElement('td');
    title.textContent = todo.title;

    const due = document.createElement('td');
    due.textContent = formatDate(todo.due_date, 'date-time');

    const priority = document.createElement('td');
    const span = document.createElement('span');
    console.log(todo.priority);
    span.classList.add(`${todo.priority}-priority`, 'priority');
    span.textContent = todo.priority;

    priority.append(span);
    checkbox.append(check);
    row.append(checkbox, date, title, due, priority);
    return row;
}

function addTodoToList(td){
    const newRow = createTodoRow(td);
    let name = td.isCompleted ? "complete"  : "incomplete";
    const tbody = document.querySelector(`#todo-table-tbody-${name}`);
    if (tbody) {
        console.log('tbody found', tbody);
        tbody.appendChild(newRow);
    }
    else {
        console.log('tbody not found... creating');
        const tbody = updateTable(name);
        tbody.appendChild(newRow);
    }
}

function updateTable(name){
    removePlaceholder(`#empty-${name}-todos`);
    const wrap = document.querySelector(`#project-page-${name}-table-wrap`);
    const table = buildProjectTodoTable(name);
    wrap.appendChild(table);
    return document.querySelector(`#todo-table-tbody-${name}`)
}

function createBasicElement(name, text){
    const el = document.createElement(String(name));
    el.textContent = String(text);
    return el;
}

function createInput(id, type, name, placeholder = null){
    const input = document.createElement('input');
    input.id = id;
    input.type = type;
    input.name = name;
    if (placeholder) input.placeholder = placeholder;
    return input;
}

function removePlaceholder(selector) {
    const placeholder = document.querySelector(String(selector));
    if (placeholder) placeholder.remove();
}