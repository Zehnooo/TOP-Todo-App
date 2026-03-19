import randomcolor from 'randomcolor';

export function getColor(){
    return randomcolor({luminosity: 'bright', hue: 'random'});
}

export function sumTodos(projects, type) {
    switch(type) {
        case 'incomplete':
            return projects.reduce((sum, pj) => sum + (pj.todos.filter(td => !td.isCompleted)?.length || 0), 0);
        case 'complete':
            return projects.reduce((sum, pj) => sum + (pj.todos.filter(td => td.isCompleted)?.length || 0), 0);
        case 'all':
            return projects.reduce((sum, pj) => sum + (pj.todos?.length || 0), 0);
    }
}


