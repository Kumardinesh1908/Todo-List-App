// Get references to the elements
const taskInput = document.getElementById("task-Input");
const addBtn = document.getElementById("add-Btn");
const taskList = document.getElementById("task-List");
const completeAll = document.getElementById("complete-All");
const clearComplete = document.getElementById("clear-Complete");
const all = document.getElementById("all");
const uncompleted = document.getElementById("uncompletd");
const completed = document.getElementById("completed");
const taskCounter = document.getElementById("task-Counter");
const deleteBtn = document.getElementById("delete-Btn");

//List in which tasks are stored
let tasks = [];

// Add task when "Add" button is clicked
addBtn.addEventListener('click', handleAddButton);

// Add task when Enter key is pressed in the input field
taskInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        handleAddButton();
    }
});

// Function to update the task object with task name given by user and also add unique ID.
function handleAddButton() {
    const text = taskInput.value;
    if (text != "") {
        const task = {
            title: text,
            id: Date.now(),
            completed: false,
        }
        taskInput.value = "";
        addTask(task);
    }
}

// Function to add a task to the tasks array
function addTask(task) {
    if (task) {
        tasks.push(task);
        renderList();
        return;
    }
}

// Load tasks from local storage when the page loads
window.onload = () => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        renderList();
    }
};

// Function to render the task list
function renderList() {
    taskList.innerHTML = '';
    let uncompletedCount = 0;
    for (let i = 0; i < tasks.length; i++) {
        addTaskToDOM(tasks[i]);
        if (!tasks[i].completed) {
            uncompletedCount++;
        }
    }
    taskCounter.innerHTML = uncompletedCount;
    removeActiveClassFromFilters();
    all.classList.add("active");
    updateLocalStorage();
}

// Function to add a task to the DOM
function addTaskToDOM(task) {
    const li = document.createElement("li");
    li.innerHTML = `
                <div>
                <input type="checkbox" id="${task.id}" ${task.completed ? 'checked' : ''} class="custom-checkbox">
                <label for="${task.id}" class="checkbox-label">
                <span id="task">${task.title}</span>
                </label>
                </div>
                <img data-id="${task.id}" id="delete-Btn" src="delete.png">
                `;
    taskList.appendChild(li);
    taskInput.value = "";
}

// Function to remove "active" class from all filters
function removeActiveClassFromFilters() {
    all.classList.remove("active");
    uncompleted.classList.remove("active");
    completed.classList.remove("active");
}

// Function to update local storage with tasks data
function updateLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Attach event listener to taskList for checkbox changes
taskList.addEventListener('change', (event) => {
    if (event.target.classList.contains('custom-checkbox')) {
        const taskId = event.target.id;
        toggleTask(taskId);
    }
});

// Function to toggle the completed status of a task
function toggleTask(taskId) {
    const task = tasks.find(task => task.id == taskId);
    if (task) {
        task.completed = !task.completed;
        renderList();
    }
}

// Attach event listener to taskList for delete button clicks
taskList.addEventListener('click', (event) => {
    if (event.target.matches('#delete-Btn')) {
        const taskId = event.target.dataset.id;
        deleteTask(taskId);
    }
});

// Function to delete a task
function deleteTask(taskId) {
    const newTasks = tasks.filter((task) =>
        task.id != taskId
    )
    tasks = newTasks;
    renderList();
}

// Event listener for the "Complete All" action
completeAll.addEventListener("click", completeAllTasks);

// Function to mark all tasks as completed
function completeAllTasks() {
    for (let i = 0; i < tasks.length; i++) {
        tasks[i].completed = true;
    }
    renderList();
}

// Event listener for the "Clear Completed" action
clearComplete.addEventListener("click", clearCompletedTasks);

// Function to clear completed tasks
function clearCompletedTasks() {
    const uncompletedTasksList = tasks.filter((task) =>
        task.completed != true
    )
    tasks = uncompletedTasksList;
    renderList();
}

// Event listener for the "All" filter
all.addEventListener("click", renderList);

// Event listener for the "Completed" filter
completed.addEventListener("click", renderCompleteList);

// Function to render completed tasks
function renderCompleteList() {
    taskList.innerHTML = '';
    const completed_tasks = tasks.filter((task) =>
        task.completed == true
    )
    for (let i = 0; i < completed_tasks.length; i++) {
        addTaskToDOM(completed_tasks[i]);
    }
    taskCounter.innerHTML = completed_tasks.length;
    removeActiveClassFromFilters();
    completed.classList.add("active");
}

// Event listener for the "Uncompleted" filter
uncompleted.addEventListener("click", renderUncompleteList);

// Function to render uncompleted tasks
function renderUncompleteList() {
    taskList.innerHTML = '';
    const uncompleted_tasks = tasks.filter((task) =>
        task.completed != true
    )
    for (let i = 0; i < uncompleted_tasks.length; i++) {
        addTaskToDOM(uncompleted_tasks[i]);
    }
    taskCounter.innerHTML = uncompleted_tasks.length;
    removeActiveClassFromFilters();
    uncompleted.classList.add("active");
}

