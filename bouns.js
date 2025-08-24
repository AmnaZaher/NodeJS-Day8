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

/**
 * This function will save logged in user to a file named "data/loggedInUser.json"
 *
 * @param {{username: string, email: string, role: 'ADMIN' | 'USER'}} user
 *     This is the user object that will be saved to the file
 */
function saveLoggedInUser(user) {
    const data = JSON.stringify(user, null, 2);
    try {
        fs.writeFileSync("loggedInUser.json", data, 'utf8');
    } catch (err) {
        console.error(`Error saving logged in user to loggedInUser.json:`, err);
    }
}

/**
 * This function will load logged in user from a file named "data/loggedInUser.json"
 * if file does not exist or file is empty it will return null
 *
 * @returns {{username: string, email: string, role: 'ADMIN' | 'USER'} | null} user
 *     This is the user object that will be loaded from the file or null
 *     if file does not exist or file is empty
 */
function loadLoggedInUser() {
    try {
        const data = fs.readFileSync("loggedInUser.json", 'utf8');
        if (data) {
            return JSON.parse(data);
        } else {
            return null;
        }
    } catch (err) {
        console.error(`Error loading logged in user from loggedInUser.json:`, err);
        return null;
    }
}


module.exports = {
    loadUsers,
    loadTasks,
    saveTasks,
    saveUsers,
    saveLoggedInUser,
    loadLoggedInUser
};
