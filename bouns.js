const fs = require('fs');
/**
 * Load users from JSON file
 *
 * @param {string} dbFile
 *     This is the path to the json file
 */
function loadUsers(users, dbFile) {
    try {
        const data = fs.readFileSync(dbFile, 'utf8');
        const parsedData = JSON.parse(data);
        users.push(...parsedData);
    } catch (err) {
        console.error(`Error loading users from ${dbFile}:`, err);
    }
}

/**
 * Load tasks from JSON file
 *
 * @param {string} dbFile
 *     This is the path to the json file
 */
function loadTasks(tasks, dbFile) {
    try {
        const data = fs.readFileSync(dbFile, 'utf8');
        const parsedData = JSON.parse(data);
        tasks.push(...parsedData);
    } catch (err) {
        console.error(`Error loading tasks from ${dbFile}:`, err);
    }
}

/**
 * Save tasks to JSON file
 *
 * @param {string} dbFile
 *     This is the path to the json file
 */
function saveTasks(tasks, dbFile) {
    const data = JSON.stringify(tasks, null, 2);
    try {
        fs.writeFileSync(dbFile, data, 'utf8');
    } catch (err) {
        console.error(`Error saving tasks to ${dbFile}:`, err);
    }
}

/**
 * Save users to JSON file
 *
 * @param {string} dbFile
 *     This is the path to the json file
 */
function saveUsers(users, dbFile) {
    const data = JSON.stringify(users, null, 2);
    try {
        fs.writeFileSync(dbFile, data, 'utf8');
    } catch (err) {
        console.error(`Error saving users to ${dbFile}:`, err);
    }
}

module.exports = {
    loadUsers,
    loadTasks,
    saveTasks,
    saveUsers
};
