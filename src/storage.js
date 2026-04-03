const STORAGE_KEYS = {
    PROJECTS: 'user-projects',
    THEME: 'theme'
};

let allProjects = [];

export function getProjectsRef() {
    return allProjects;
}

export function saveProjectsToStorage() {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(allProjects));
}

export function loadProjectsFromStorage() {
    allProjects.length = 0;
    const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS));
    if (projects) {
        projects.forEach(pj => allProjects.push(pj));
    }
    return allProjects;
}

export function reloadStorage() {
    saveProjectsToStorage();
    loadProjectsFromStorage();
}

export function addProjectToMemory(project) {
    allProjects.push(project);
}

export function removeProjectFromMemory(index) {
    allProjects.splice(index, 1);
}

export function saveTheme() {
    const theme = document.body.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
}

export function getTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
}

export function initializeStorage() {
    loadProjectsFromStorage();
    localStorage.removeItem('user-todos');
}
