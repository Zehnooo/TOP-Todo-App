import { getProjects, deleteProject, confirmDelete } from './projects.js';
import { formatDate } from './date.js';
import {getColor, sumTodos} from './tools.js'

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
    plus.textContent = '+';


    newBtn.prepend(plus);
    label.append(filter);
    head.append(label, newBtn);
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

