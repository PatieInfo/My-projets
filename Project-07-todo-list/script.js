// Array to store all tasks
let tasks = [];

// Current filter being applied
let currentFilter = "all";

// Show today's date in the header
const today = new Date();
const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
document.getElementById("date").textContent = today.toLocaleDateString("en-CA", options);

// ---- ADD A TASK ----
function addTask() {

  // Get what the user typed
  const input = document.getElementById("taskInput");
  const text = input.value.trim();

  // Don't add empty tasks
  if (text === "") {
    input.focus();
    return;
  }

  // Create a task object and add it to the array
  const newTask = {
    id: Date.now(),
    text: text,
    completed: false
  };

  tasks.push(newTask);

  // Clear the input field
  input.value = "";
  input.focus();

  // Refresh the displayed list
  renderTasks();
}

// ---- HANDLE ENTER KEY ----
function handleKeyPress(event) {
  if (event.key === "Enter") {
    addTask();
  }
}

// ---- TOGGLE TASK COMPLETE ----
function toggleTask(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  renderTasks();
}

// ---- DELETE A TASK ----
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  renderTasks();
}

// ---- CLEAR ALL COMPLETED ----
function clearCompleted() {
  tasks = tasks.filter(task => !task.completed);
  renderTasks();
}

// ---- FILTER TASKS ----
function filterTasks(filter, btn) {
  currentFilter = filter;

  // Update active button style
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  renderTasks();
}

// ---- RENDER TASKS TO SCREEN ----
function renderTasks() {
  const list = document.getElementById("taskList");

  // Apply current filter
  let filtered = tasks;
  if (currentFilter === "active") {
    filtered = tasks.filter(task => !task.completed);
  } else if (currentFilter === "completed") {
    filtered = tasks.filter(task => task.completed);
  }

  // Show empty state if no tasks
  if (filtered.length === 0) {
    list.innerHTML = '<li class="empty-state">No tasks here! 🎉</li>';
  } else {
    // Build HTML for each task
    list.innerHTML = filtered.map(task => `
      <li class="task-item ${task.completed ? "completed" : ""}">
        <input
          type="checkbox"
          ${task.completed ? "checked" : ""}
          onchange="toggleTask(${task.id})"
        >
        <span class="task-text">${task.text}</span>
        <button class="delete-btn" onclick="deleteTask(${task.id})">✕</button>
      </li>
    `).join("");
  }

  // Update remaining count
  const remaining = tasks.filter(task => !task.completed).length;
  document.getElementById("remaining").textContent =
    `${remaining} task${remaining !== 1 ? "s" : ""} remaining`;
}

// Initialize the list on page load
renderTasks();