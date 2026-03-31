import {currentDate, formatDate} from './date.js';

export function createTodo(project_id, title, description, due_date, priority, isCompleted = false) {
    return {
        project_id,
        id: crypto.randomUUID(),
        title,
        description,
        isCompleted,
        created: currentDate('date-time'),
        due_date: formatDate(due_date,'date-time'),
        priority: String(priority).toLowerCase(),
        notes: [],
        checklist: [],
    };
}