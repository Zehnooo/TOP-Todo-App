import {currentDate, formatDate} from './date.js';
import {findTodoInProjects} from './projects.js';

export function createTodo(project_id, title, description, due_date, priority, isCompleted = false) {
    return {
        project_id,
        id: crypto.randomUUID(),
        title,
        description,
        isCompleted,
        created: currentDate('date-time'),
        due_date: formatDate(due_date,'date-time'),
        priority: String(priority),
        notes: [],
        checklist: [],
    };
}

export function createTodoItem(todoId, itemType, itemValue){
    return {
        todo_id: todoId,
        id: crypto.randomUUID(),
        date_created: currentDate('date-time'),
        value: String(itemValue),
        type: String(itemType)
    }
}

export function addItemToTodo(item) {
    const x = findTodoInProjects(item.todo_id).todo;
    if (Object.hasOwn(x, String(item.type))){
        x[String(item.type)].push(item);
    }
    return item;
}