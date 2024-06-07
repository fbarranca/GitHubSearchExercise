/**
 * Save the selected theme to local storage
 * @param {string} theme The theme name 
 */
export const saveTheme = theme => {
    localStorage.setItem(`theme`, theme);
}

/**
 * Get the saved theme from local storage
 * @returns {string} The theme name
 */
export const getTheme = () => {
    if (!localStorage.getItem('theme')) {
        saveTheme('dark');
    }
    
    return localStorage.getItem(`theme`);
}