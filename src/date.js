import { format, addDays } from 'date-fns';

function formatDate(date) {
    return format(date, 'MM/dd/yyyy');
}

export function currentDate(){
    return formatDate(new Date());
}

export function placeholderDueDate(days){
    return formatDate(addDays(new Date(), Number(days)));
}