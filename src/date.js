import { format, addDays } from 'date-fns';

export function formatDate(date, type) {
    switch (type) {
        case 'date-time':
            return format(date, 'Pp');
        case 'date':
            return format(date, 'PP');
    }
}

export function currentDate(type){
    return formatDate(new Date(), type);
}

export function dueDate(days){
    return formatDate(addDays(new Date(), Number(days)), 'date');
}