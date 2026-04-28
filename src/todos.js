import {currentDate, formatDate} from './date.js';
import {findTodoInProjects} from './projects.js';
import {fireGenericError, confirmDelete} from "./tools.js";
import {saveProjectsToStorage} from "./storage.js";

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

function removeItemFromTodo(arr, itemIndex){
    console.log('Index removed', itemIndex);
    return arr.splice(itemIndex, 1);
}

export async function handleTodoItemDelete(item) {
    const confirm = await confirmDelete(`Are you sure you want to delete this item?`);
    if (!confirm.isConfirmed) return false;
    const todo = findTodoInProjects(item.todo_id).todo;
    const itemArray = todo[item.type];
    console.log("Todo to delete from: ", todo);
    if (!todo) {
        console.error('Todo not found');
        return false;
    }
    try {
        const index = getTodoItemIndex(itemArray, item);
        if (index === null) {
            console.error('Item not found in todo', JSON.stringify({todo, item}, null, 1));
            return false;
        }
        removeItemFromTodo(itemArray, index);
        saveProjectsToStorage();
        console.log(todo);
        return true;
    } catch (err) {
        fireGenericError(err);
        return false;
    }
}

function getTodoItemIndex(arr, item){
    let i;
    i = arr?.findIndex(n => n.id === item.id);
    return i !== undefined && i !== -1 ? i : null;
}

export function completeTodo(todo){
    todo.isCompleted ? todo.isCompleted = false : todo.isCompleted = true;
    saveProjectsToStorage();
    return todo;
}