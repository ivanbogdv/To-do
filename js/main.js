//  Find element
const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const taskList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");

let tasks = [];

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((task) => rendertask(task));
}

checkEmptyList();

// Add a task
form.addEventListener("submit", addTask);

// Delete a task
taskList.addEventListener("click", deleteTask);

// Done a task
taskList.addEventListener("click", doneTask);

// Functions
function addTask(event) {
  // Сancel form submission
  event.preventDefault();

  // Get text from input field
  const taskText = taskInput.value;

  // Describe the task as an object
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  // Add a task to the array with tasks
  tasks.push(newTask);
  saveToLocalStorage();

  rendertask(newTask);

  // Сlearing the input field
  taskInput.value = "";
  taskInput.focus();
  checkEmptyList();
}

function deleteTask(event) {
  // Button click check
  if (event.target.dataset.action !== "delete") {
    return;
  }
  const parentNode = event.target.closest(".list-group-item");

  const id = Number(parentNode.id);

  // Delete task
  tasks = tasks.filter((task) => task.id !== id);

  saveToLocalStorage();

  parentNode.remove();

  checkEmptyList();
}

function doneTask(event) {
  // Check task done
  if (event.target.dataset.action !== "done") return;
  const parentNode = event.target.closest(".list-group-item");

  const id = Number(parentNode.id);
  const task = tasks.find((task) => task.id === id);
  task.done = !task.done;

  saveToLocalStorage();

  const taskTitle = parentNode.querySelector(".task-title");
  taskTitle.classList.toggle("task-title--done");
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
        <img src="./img/work.jpg" alt="Empty" width="300" class="mt-3">
        <div class="empty-list__title">To-do list is empty</div>
    </li>`;
    taskList.insertAdjacentHTML("afterbegin", emptyListHTML);
  }
  if (tasks.length > 0) {
    const emptyListEl = document.querySelector("#emptyList");
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function rendertask(task) {
  const cssClass = task.done ? "task-title task-title--done" : "task-title";

  // Formatting the markup
  const taskHTML = `
                <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
					<span class="${cssClass}">${task.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="btn-action">
							<img src="./img/tick.svg" alt="Done" width="18" height="18">
						</button>
						<button type="button" data-action="delete" class="btn-action">
							<img src="./img/cross.svg" alt="Done" width="18" height="18">
						</button>
					</div>
				</li>`;

  // Add task to the page
  taskList.insertAdjacentHTML("beforeend", taskHTML);
}
