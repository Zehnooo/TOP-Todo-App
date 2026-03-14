import { format, addDays } from 'date-fns';

function formatDate(date) {
    return format(date, 'Pp');
}

export function currentDate(){
    return formatDate(new Date());
}

export function dueDate(days){
    return formatDate(addDays(new Date(), Number(days)));
}