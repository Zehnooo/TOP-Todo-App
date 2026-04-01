import { getProjects, deleteProject, addTodoToProject } from './projects.js';
import { formatDate } from './date.js';
import {
    getColor,
    getTheme,
    saveTheme,
    sumTodos,
    validateContent,
    handleProjectFormSubmission,
    handleTodoFormSubmission,
    loadLocalStorage,
    handleTodoCheck,
    useTodoOption,
    confirmProjectDelete,
} from './tools.js';
import completesvg from './assets/complete.svg';
import copysvg from './assets/copy.svg';
import deletesvg from './assets/delete.svg';
import editsvg from './assets/edit.svg';
import plussvg from './assets/plus.svg';
import savesvg from './assets/save.svg';
import homesvg from './assets/home.svg';
import moonsvg from './assets/moon.svg';

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
        home.innerHTML = homesvg;
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
        newBtn.textContent = 'Project';
        newBtn.classList.add('btn', 'new-btn');
        newBtn.addEventListener('click', () => handleNewProjectForm());

    const plus = document.createElement('span');
    plus.innerHTML = plussvg;

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
        const confirm = await confirmProjectDelete(project);
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
        container.classList.add('project-page', 'scroll');
        container.dataset.project_id = project.id;

    const pageHead = buildProjectPageHead(copy);



    const todoContainer = document.createElement('div');
        todoContainer.classList.add('project-page-todo-container');

     const todoHeader = document.createElement('div');
        todoHeader.classList.add('project-page-todo-header');

    const todoHeading = document.createElement('h2');
        todoHeading.textContent = 'Todos';




    todoHeader.append(todoHeading);
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

function buildProjectPageHead(project){
    const pageHeadCon = document.createElement('div');
    pageHeadCon.classList.add('project-page-head-container');

    const pageHead = document.createElement('div');
    pageHead.classList.add('project-page-head');

    const details = document.createElement('div');
    details.classList.add('project-page-head-details');

    const title = document.createElement('h2');
    title.textContent = project.title;
    title.classList.add('project-page-title');

    const date = document.createElement('p');
    const d = formatDate(project.created, 'date');
    date.textContent = `Created on ${d}`;
    date.classList.add('project-page-date');

    const desc = document.createElement('p');
    desc.textContent = project.description;
    desc.classList.add('project-page-desc');



    const todoCounts = document.createElement('div');
        todoCounts.classList.add('project-page-head-counts');
    let todos = project.todos;
        const p1 = createBasicElement('p', 'Todos');
        p1.classList.add('project-count', 'count');
        const totalTodos = createBasicElement('span', String(todos.length));
        p1.append(totalTodos);
    let completed = todos.filter(td => td.isCompleted);
        const p2 = createBasicElement('p', 'Complete');
        p2.classList.add('project-count', 'completed');
        const completeTodos = createBasicElement('span', String(completed.length));
        p2.append(completeTodos);
    let incomplete = todos.filter(td => !td.isCompleted);
        const p3 = createBasicElement('p', 'Incomplete');
        p3.classList.add('project-count', 'incomplete');
        const incompleteTodos = createBasicElement('span', String(incomplete.length));
        p3.append(incompleteTodos);

    const newTodoBtn = document.createElement('button');
    newTodoBtn.classList.add('new-btn', 'btn');
    newTodoBtn.textContent = 'Todo';
    newTodoBtn.addEventListener('click', () => handleTodoForm());

    const plus = document.createElement('span');
    plus.innerHTML = plussvg;


    details.append(title, date, desc);
    newTodoBtn.prepend(plus);
    todoCounts.append(p1, p2, p3);
    pageHead.append(details, todoCounts, newTodoBtn);
    pageHeadCon.append(pageHead);

    return pageHeadCon;
}

function buildTableWrap(type){
    const wrap = document.createElement('div');
        wrap.id = `project-page-${type.toLowerCase()}-table-wrap`;
        wrap.classList.add('project-page-table-wrap');

    const headWrap = document.createElement('div');
    headWrap.classList.add('project-page-table-head');
    const tableHead = document.createElement('h3');
        tableHead.textContent = `${type} Todos`;
        tableHead.id = `${type}-heading`;

    headWrap.append(tableHead);
    wrap.append(headWrap);
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


function handleTodoOptions(){
    const head = document.querySelector('.project-page-head-container');
    const exists = document.querySelector('.project-page-todo-options');
    if (!exists) {
        const options = buildTodoOptions();
        head.append(options);
    }
}


function buildTodoOptions(){
    const options = document.createElement('div');
    options.classList.add('project-page-todo-options');
    const buttonTypes = [
        {name: 'delete', img: deletesvg}, {name: 'edit', img: editsvg}, {name: 'copy', img: copysvg}, {name: 'complete', img: completesvg}];
    buttonTypes.forEach(btn => {
        const b = document.createElement('button');
        const s = document.createElement('span');
        s.innerHTML = btn.img;
        b.id = `todo-${btn.name}`;
        b.classList.add('btn','todo-option');
        b.addEventListener("click",  (e) => {useTodoOption(e);})
        b.append(s);
        options.append(b);
    });

    return options;
}


function buildNewProjectForm(){
    const form = document.createElement('form');
    form.id = 'new-project-form';
    form.addEventListener('submit', (e) => {
        let newProject = handleProjectFormSubmission(e);
        if (newProject === undefined) return;
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
    span.innerHTML = savesvg;

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
        if (!form) return;
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
    themeToggle.innerHTML = moonsvg;

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
        if (newTodo === undefined) return;
        addTodoToList(newTodo);
        addTodoToProject(newTodo);
    });
    const container = document.createElement('div');

    const label1 = createBasicElement('label');
    const span1 = createBasicElement('span', 'Title');
        label1.htmlFor = 'input-todo-title';
    const titleInput = createInput('input-todo-title', 'text', 'title', 'Clean Kitchen');
    titleInput.classList.add('todo-input');
    label1.append(span1, titleInput);

    const label2 = createBasicElement('label');
    const span2 = createBasicElement('span', 'Description');
        label2.htmlFor = 'input-todo-desc';
    const descInput = createInput('input-todo-desc', 'text', 'desc', 'Do the dishes, mop the floor...');
    descInput.classList.add('todo-input');
    label2.append(span2, descInput);

    const label3 = createBasicElement('label');
    const span3 = createBasicElement('span', 'Due Date');
        label3.htmlFor = 'input-todo-date';
    const dueDateInput = createInput('input-todo-date', 'datetime-local', 'due-date');
    dueDateInput.classList.add('todo-input');
    label3.append(span3, dueDateInput);

    const label4 = createBasicElement('label');
    const span4 = createBasicElement('span', 'Priority');
    const priorityInput = document.createElement('select');
    priorityInput.name = 'priority';
    priorityInput.classList.add('todo-input');
        const priorityOptions = [
            {value: 'None', text: '-'},
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
    label4.append(span4, priorityInput);

    const btn = createSaveButton();

    container.append(label1, label2, label3, label4)
    form.append(container, btn);
    return form;
}

function handleTodoForm(){
    const head = document.querySelector('.project-page-head-container');
    let wrap = document.querySelector('#todo-form-wrap');
    if (!wrap) {
        const wrap = document.createElement('div');
        wrap.id = 'todo-form-wrap';
        let form = buildTodoForm();
        wrap.append(form);
        head.appendChild(wrap);
        setTimeout(() => wrap.classList.add('reveal'), 25);
    } else {
        wrap.classList.remove('reveal');
        setTimeout(() => wrap.remove(), 200);
    }
}

function createTodoRow(todo){
    const row = document.createElement('tr');
    row.dataset.todo_id = todo.id;
    row.addEventListener('click', () => handleTodoModal(todo));

    const checkbox = document.createElement('td');
    checkbox.classList.add('small-col');

    const check = document.createElement('input');
    check.classList.add('todo-checkbox');
    check.addEventListener('click', (e) => e.stopPropagation());
    check.addEventListener('change', (e) => {
        const check = handleTodoCheck(e);
        if (check !== null) {handleTodoOptions();} else {document.querySelector('.project-page-todo-options')?.remove();}
    });
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

    span.classList.add(`${todo.priority.toLowerCase()}-priority`, 'priority');
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

function createBasicElement(name, text = null){
    const el = document.createElement(String(name));
    if (text) el.textContent = String(text);
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

function buildModal(){
    const dialog = document.createElement('dialog');
    dialog.id = 'cust-modal';
    dialog.addEventListener('close', () => dialog.remove())
    const container = document.createElement('div');
    container.id = 'cust-modal-container';
    dialog.append(container);
    return dialog
}

function handleTodoModal(todo){
    const modal = buildModal();
    modal.dataset.todo_id = todo.id;
    const container = modal.querySelector('#cust-modal-container');
    container.append(buildTodoModalContent(todo));
    const closeBtn = document.createElement('button');
        closeBtn.textContent = 'X';
        closeBtn.classList.add('btn', 'close-modal');
    closeBtn.addEventListener('click', () => document.querySelector('#cust-modal').close());
    modal.appendChild(closeBtn);
    if (modal) document.body.append(modal); modal.showModal();
}

function buildTodoModalContent(todo){
    const prefix = 'cust-modal-';
    const container = document.createElement('div');
    const head = document.createElement('div');
    const status = document.createElement('div');
    status.classList.add(`${prefix}status`)


    const title = createBasicElement('h2', String(todo.title));
    title.classList.add(`${prefix}title`)
    const cDate = createBasicElement('p', `Created: ${String(todo.created)}`);
    cDate.classList.add(`${prefix}cdate`);
    const dDate = createBasicElement('p', `Due: ${String(todo.due_date)}`);
    dDate.classList.add(`${prefix}ddate`);
    const desc = createBasicElement('p', String(todo.description));
    desc.classList.add(`${prefix}desc`);
    const prio = createBasicElement('span', String(todo.priority));
    prio.classList.add(`${todo.priority.toLowerCase()}-priority`, 'priority');
    const completed = createBasicElement('span', String(todo.isCompleted ? 'Complete' : 'Incomplete'));
    completed.classList.add(`${prefix}check`);
    todo.isCompleted ? completed.classList.add('completed') : completed.classList.add('incomplete');


    head.append(title, desc);
    status.append(cDate, dDate, prio, completed);

    const section = document.createElement('div');
        section.classList.add(`${prefix}main`);

    const noteSection = buildTodoSection(todo.notes, 'Notes');
    const checklistSection = buildTodoSection(todo.checklist, 'Checklist');

    section.append(head, noteSection, checklistSection);
    container.append(status, section);
    return container
}

function buildTodoSection(arr, title) {

    const container = document.createElement('div');
    container.classList.add(`cust-modal-${title.toLowerCase()}`);

    const header = document.createElement('div');
    const sectionTitle = createBasicElement('h3', title);
    const newBtn = createBasicElement('button', title === 'Notes' ? 'Note' : 'List Item');
    newBtn.addEventListener('click', () => {handleTodoSectionForm(title.toLowerCase());})

    const plus = document.createElement('span');
        plus.innerHTML = plussvg;
    newBtn.prepend(plus);
    newBtn.classList.add('new-btn', 'btn');
    header.append(sectionTitle, newBtn);
    container.append(header);

    arr?.length > 0 ? arr.forEach(item => { container.appendChild(createBasicElement('p', String(item))) }) : container.appendChild(buildPlaceholder('No items found'));

    return container;
}

function handleTodoSectionForm(title){
    console.log(title);
    let head = document.querySelector(`.cust-modal-${title}`).firstElementChild;
    console.log(head);
    let wrap = document.querySelector(`#cust-modal-${title}-form-wrap`);
    if (!wrap){
        const wrap = document.createElement('div');
        wrap.id = `#cust-modal-${title}-form-wrap`;
        let form = buildTodoSectionForm();
        if (!form) {
            console.log('no form')
            return
        }
        wrap.append(form);
        head.append(wrap);
        setTimeout(() => wrap.classList.add('reveal'), 25);
    } else {
        wrap.classList.remove('reveal');
        setTimeout(() => wrap.remove(), 200);
    }
}

function buildTodoSectionForm(){
    return null;
}