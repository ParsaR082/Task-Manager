const apiUrl = "https://67e04b047635238f9aad2134.mockapi.io/tasks";
let tasks = [];

// Fetch tasks from API
async function fetchTasks() {
    try {
        const res = await fetch(apiUrl);
        tasks = await res.json();
        renderTasks(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
}

// Render tasks
function renderTasks(tasks) {
    const todoList = document.getElementById("todo-list");
    const inProgressList = document.getElementById("inprogress-list");
    const closedList = document.getElementById("closed-list");
    const frozenList = document.getElementById("frozen-list");

    // Clear lists
    todoList.innerHTML = "";
    inProgressList.innerHTML = "";
    closedList.innerHTML = "";
    frozenList.innerHTML = "";

    // Filter tasks based on search and filters
    const searchQuery = document.getElementById("search").value.toLowerCase();
    const priorityFilter = document.getElementById("filter-priority").value;
    const statusFilter = document.getElementById("filter-status").value;

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery) || task.description.toLowerCase().includes(searchQuery);
        const matchesPriority = priorityFilter ? task.priority.toLowerCase() === priorityFilter : true;
        const matchesStatus = statusFilter ? task.status === statusFilter : true;
        return matchesSearch && matchesPriority && matchesStatus;
    });

    // Render filtered tasks
    filteredTasks.forEach(task => {
        const li = createTaskElement(task);
        if (task.status === "To Do") todoList.appendChild(li);
        else if (task.status === "In Progress") inProgressList.appendChild(li);
        else if (task.status === "Closed") closedList.appendChild(li);
        else if (task.status === "Frozen") frozenList.appendChild(li);
    });
}

// Create a task element
function createTaskElement(task) {
    const li = document.createElement("li");
    li.className = "task-item p-3 rounded-lg shadow-md cursor-pointer transition duration-300";
    li.draggable = true;
    li.dataset.taskId = task.id;

    const priorityColor = task.priority.toLowerCase() === "low" ? "priority-low" :
                        task.priority.toLowerCase() === "medium" ? "priority-medium" :
                        "priority-high";

    li.innerHTML = `
        <h4 class="font-bold">${task.title} <span class="text-xs ${priorityColor} px-2 py-1 rounded">${task.priority}</span></h4>
        <p class="text-xs opacity-75">Due: ${new Date(task.dueDate * 1000).toLocaleDateString()}</p>
        <div class="mt-2 flex gap-2">
            <button onclick="editTask('${task.id}')" class="text-xs bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
            <button onclick="deleteTask('${task.id}')" class="text-xs bg-red-500 text-white px-2 py-1 rounded">Delete</button>
        </div>
    `;

    li.addEventListener("click", () => showTaskDetails(task));

    li.addEventListener("dragstart", () => {
        li.classList.add("dragging");
    });

    li.addEventListener("dragend", () => {
        li.classList.remove("dragging");
    });

    return li;
}

// Show task details with animation
function showTaskDetails(task) {
    const details = document.getElementById("task-details");

    // Update task details content
    document.getElementById("task-details-title").textContent = task.title;
    document.getElementById("task-details-name").textContent = `Name: ${task.name}`;
    document.getElementById("task-details-description").textContent = `Description: ${task.description}`;
    document.getElementById("task-details-due-date").textContent = `Due: ${new Date(task.dueDate * 1000).toLocaleDateString()}`;
    document.getElementById("task-details-priority").textContent = `Priority: ${task.priority}`;
    document.getElementById("task-details-status").textContent = `Status: ${task.status}`;

    // Add a delay before showing the details
    setTimeout(() => {
        details.classList.add("visible");
    }, 100); // 100ms delay
}

// Drag and Drop functionality
document.querySelectorAll(".task-column").forEach(column => {
    column.addEventListener("dragover", e => {
        e.preventDefault();
        const draggingItem = document.querySelector(".dragging");
        column.querySelector("ul").appendChild(draggingItem);
    });

    column.addEventListener("drop", async e => {
        const taskId = e.target.closest(".task-item").dataset.taskId;
        const newStatus = column.dataset.status;
        await updateTaskStatus(taskId, newStatus);
    });
});

// Update task status
async function updateTaskStatus(taskId, newStatus) {
    const task = tasks.find(task => task.id === taskId);
    if (task.status === newStatus) return; 

    task.status = newStatus; 
    await fetch(`${apiUrl}/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task) 
    });
    fetchTasks();
}

// Add/Edit Task Modal
const modal = document.getElementById("task-modal");
const addTaskBtn = document.getElementById("add-task-btn");
const closeModalBtn = document.getElementById("close-modal");
const taskForm = document.getElementById("task-form");

// Open modal for adding a new task
addTaskBtn.addEventListener("click", () => {
    document.getElementById("modal-title").textContent = "Add Task";
    taskForm.reset();
    taskForm.dataset.taskId = ""; 
    modal.classList.remove("hidden");
});

// Close modal when clicking Cancel
closeModalBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
});

// Close modal when clicking outside the modal
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.add("hidden");
    }
});

// Handle form submission for adding/editing a task
taskForm.addEventListener("submit", async e => {
    e.preventDefault();
    const taskId = taskForm.dataset.taskId;

    const taskData = {
        name: document.getElementById("task-name").value,
        title: document.getElementById("task-title").value,
        description: document.getElementById("task-description").value,
        dueDate: Math.floor(new Date(document.getElementById("task-due-date").value).getTime() / 1000),
        priority: document.getElementById("task-priority").value,
        status: document.getElementById("task-status").value,
        createdAt: taskId ? tasks.find(task => task.id === taskId).createdAt : Math.floor(Date.now() / 1000)
    };

    if (taskId) {
        await fetch(`${apiUrl}/${taskId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(taskData)
        });
    } else {
        await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(taskData)
        });
    }

    modal.classList.add("hidden");
    fetchTasks();
});

// Edit Task
async function editTask(taskId) {
    const task = tasks.find(task => task.id === taskId);
    document.getElementById("modal-title").textContent = "Edit Task";
    document.getElementById("task-name").value = task.name;
    document.getElementById("task-title").value = task.title;
    document.getElementById("task-description").value = task.description;
    document.getElementById("task-due-date").value = new Date(task.dueDate * 1000).toISOString().split("T")[0];
    document.getElementById("task-priority").value = task.priority.toLowerCase();
    document.getElementById("task-status").value = task.status;
    taskForm.dataset.taskId = taskId; // Set task ID for form submission
    modal.classList.remove("hidden");
}

// Delete Task
async function deleteTask(taskId) {
    if (confirm("Are you sure you want to delete this task?")) {
        await fetch(`${apiUrl}/${taskId}`, { method: "DELETE" });
        fetchTasks();
    }
}


document.getElementById("search").addEventListener("input", () => renderTasks(tasks));
document.getElementById("filter-priority").addEventListener("change", () => renderTasks(tasks));
document.getElementById("filter-status").addEventListener("change", () => renderTasks(tasks));

fetchTasks();