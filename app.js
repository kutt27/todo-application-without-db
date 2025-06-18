const express = require('express');
const app = express();
const PORT = 3030;

let todos = [
    {id: 1, task: 'Learn express basics', completed: false},
    {id: 2, task: 'Build a simple api', completed: false},
    {id: 3, task: 'Understand middleware', completed: false}
];

let nextId = 4;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);

    if(todo){
        res.json(todo);
    }
    else{
        res.status(404).send('Todo not found');
    }
});

app.get('/todos', (req, res) => {
    res.json(todos);
});

app.post('/todos', (req, res) => {
    const { task } = req.body;

    if (!task) {
        return res.status(400).send('Task is required');
    }

    const newTodo = {
        id: nextId++,
        task,
        completed: false
    };

    todos.push(newTodo);
    res.status(201).json(newTodo);
});

app.put('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { task, completed } = req.body;

    const todoIndex = todos.findIndex(t => t.id === id);

    if (todoIndex === -1) {
        return res.status(404).send('Todo not found');
    }
    if (task !== undefined) {
        todos[todoIndex].task = task;
    }
    if (completed !== undefined) {
        todos[todoIndex].completed = completed;
    }

    res.json(todos[todoIndex]);
});

app.delete('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const initialLength = todos.length;
    todos = todos.filter(t => t.id !== id);

    if (todos.length < initialLength) {
        res.status(204).send();
    } else {
        res.status(404).send('Todo not found');
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
