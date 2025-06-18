document.addEventListener('DOMContentLoaded', () => {
    const todoList = document.getElementById('todo-list');
    const newTodoInput = document.getElementById('new-todo');
    const addBtn = document.getElementById('add-btn');
    
    // Load todos when page loads
    fetchTodos();
    
    // Add event listener for the add button
    addBtn.addEventListener('click', addTodo);
    
    // Add event listener for the Enter key in the input field
    newTodoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
    
    // Function to fetch all todos from the API
    function fetchTodos() {
        fetch('/todos')
            .then(response => response.json())
            .then(todos => {
                renderTodos(todos);
            })
            .catch(error => console.error('Error fetching todos:', error));
    }
    
    // Function to render todos in the list
    function renderTodos(todos) {
        todoList.innerHTML = '';
        
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.dataset.id = todo.id;
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'todo-checkbox';
            checkbox.checked = todo.completed;
            checkbox.addEventListener('change', () => toggleTodoStatus(todo.id, checkbox.checked));
            
            const span = document.createElement('span');
            span.className = 'todo-text';
            span.textContent = todo.task;
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
            
            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(deleteBtn);
            
            todoList.appendChild(li);
        });
    }
    
    // Function to add a new todo
    function addTodo() {
        const task = newTodoInput.value.trim();
        
        if (task) {
            fetch('/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ task })
            })
            .then(response => response.json())
            .then(() => {
                newTodoInput.value = '';
                fetchTodos();
            })
            .catch(error => console.error('Error adding todo:', error));
        }
    }
    
    // Function to toggle todo status (completed/not completed)
    function toggleTodoStatus(id, completed) {
        fetch(`/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed })
        })
        .then(() => fetchTodos())
        .catch(error => console.error('Error updating todo:', error));
    }
    
    // Function to delete a todo
    function deleteTodo(id) {
        fetch(`/todos/${id}`, {
            method: 'DELETE'
        })
        .then(() => fetchTodos())
        .catch(error => console.error('Error deleting todo:', error));
    }
});