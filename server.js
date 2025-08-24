// Express Server Entry Point
const express = require('express');
const { loadTasks, loadUsers, saveTasks, saveUsers } = require('./bouns');

const app = express();
const PORT = 6060;

// Local Database
const tasks = [];
const users = [];

loadTasks(tasks, "data/tasks.json");
loadUsers(users, "data/users.json");
const loggedInUser = loadLoggedInUser(users, "data/loggedInUser.json");


// Middleware
app.use(express.json());

// Routes
app.get('/api/tasks', (req, res) => {
    // should get all tasks from tasks array
    res.json(tasks);
});

app.get('/api/tasks/search', (req, res) => {
    // query string should contain keyword and we should search in tasks array using this keyword
    // If the keyword exists on title or description we should respond with this task
    const keyword = req.query.keyword;
    const results = tasks.filter(task =>
        task.title.includes(keyword) || task.description.includes(keyword)
    );
    res.json(results);
});

// YOU MUST BE LOGGED IN TO DO IT
app.post('/api/tasks', (req, res) => {
    // body should contain these info title, description
    // priority(high, low, medium) + the username who created the task
    const { title, description, priority } = req.body;
    const validPriorities = ['high', 'medium', 'low'];

    if (!loggedInUser) {
        return res.json({ error: 'You must be logged in to create a task' });
    }
    if (!title || !description || !priority) {
        return res.json({ error: 'Missing required fields' });
    }
    if (!validPriorities.includes(priority)) {
        return res.json({ error: 'Invalid priority value' });
    }

    const task = {
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        username: loggedInUser.username,
    }

    tasks.push(task);

    // KEEP THIS CODE AFTER ADDING TASK TO TASKS ARRAY
    saveTasks(tasks, "data/tasks.json");
    res.json(task);
});

app.delete('/api/tasks/', (req, res) => {
    // request should contain id of task to delete

    const id = req.query.id;

    const task = tasks.find(task => task.id === parseInt(id));
    if (!task) {
        return res.json({ error: 'Task not found' });
    }
    if (task.username !== loggedInUser.username && loggedInUser.role !== 'ADMIN') {
        return res.json({ error: 'You are not authorized to delete this task' });
    }

    tasks.splice(tasks.indexOf(task), 1);
    res.json({ message: 'Task deleted successfully' });

    // KEEP THIS CODE AFTER ADDING TASK TO TASKS ARRAY
    saveTasks(tasks, "data/tasks.json");
});



app.get("/profile", (req, res)  => {
    // we get query string from req and search user in users array

    const username = req.query.username;
    const user = users.find(u => u.username === username);

    if (user)
        res.json(user);

    else 
        res.json({ error: 'User not found' });
});

app.delete("/profile", (req, res)  => {
    // we get query string from req and search user in users array then delete this user
    if (loggedInUser.role !== 'ADMIN')
        return res.json({ error: 'You are not authorized to delete this user' });
    

    const username = req.query.username;
    const index = users.findIndex(u => u.username === username);

    if (index !== -1) {
        users.splice(index, 1);
        res.json({ message: 'User deleted successfully' });
    } else
        res.json({ error: 'User not found' });
    
});

app.post("/register", (req, res)  => {
    // body should contain these info username, email, password
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) 
        return res.json({ error: 'Missing required fields' });

    const newUser = { id: users.length + 1, username, email, password, role };
    users.push(newUser);
    res.json(newUser);

    // KEEP THIS CODE AFTER ADDING USER TO USERS ARRAY
    saveUsers(users, "data/users.json");
});

app.post("/login", (req, res)  => {
    // body should contain these info username or email, password
    // After logging user data will be saved into a file named "data/loggedInUser.json"
    // And we will use this file to check authentication for users in specifiec routes

    const { username, password } = req.body;
    const user = users.find(
        user => user.username === username || user.email === username
    );
    if (!user) {
        return res.status(401).json({ message: "User Not Found" });
    }
    if (user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    saveLoggedInUser(user);
});

app.post("/logout", (req, res)  => {
    const fs = require('fs');
    fs.unlink("data/loggedInUser.json", (err) => {
        if (err)
            return res.json({ message: "Error logging out" });
        res.json({ message: "Logged out successfully" });
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
