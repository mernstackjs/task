const loginUsername = document.querySelector("#loginUsername");
const loginPassword = document.querySelector("#loginPassword");
const registerUsername = document.querySelector("#registerUsername");
const registerPassword = document.querySelector("#registerPassword");
const loginBtn = document.querySelector("#loginBtn");
const registerBtn = document.querySelector("#registerBtn");
const taskInput = document.querySelector("#task");
const prioritySelect = document.querySelector("#priority");
const addBtn = document.querySelector("#addBtn");
const taskList = document.querySelector("#taskList");
const completedTasks = document.querySelector("#completedTasks");
const loginForm = document.querySelector("#loginForm");
const taskForm = document.querySelector("#taskForm");
const logoutBtn = document.querySelector("#logoutBtn");

let currentUser = null;

const hashPassword = (password) => {
  return btoa(password); // For simplicity, use base64 encoding as a placeholder for hashing.
};

const loadTasks = () => {
  if (!currentUser) return;
  const userTasks = JSON.parse(localStorage.getItem(currentUser)) || {
    tasks: [],
    completedTasks: [],
  };

  taskList.innerHTML = "";
  completedTasks.innerHTML = "";

  userTasks.tasks.forEach((taskObj) => {
    createTaskElement(taskObj, false);
  });

  userTasks.completedTasks.forEach((taskObj) => {
    createTaskElement(taskObj, true);
  });
};

const saveTasks = (userTasks) => {
  localStorage.setItem(currentUser, JSON.stringify(userTasks));
};

const addTask = () => {
  let taskV = taskInput.value.trim();
  let priorityV = prioritySelect.value;
  if (taskV === "") {
    alert("Please enter a task.");
    return;
  }

  let taskObj = { task: taskV, priority: priorityV, completed: false };
  createTaskElement(taskObj, false);

  const userTasks = JSON.parse(localStorage.getItem(currentUser)) || {
    tasks: [],
    completedTasks: [],
  };
  userTasks.tasks.push(taskObj);
  saveTasks(userTasks);

  taskInput.value = "";
  prioritySelect.value = "low";
};

const createTaskElement = (taskObj, isCompleted) => {
  let ul = isCompleted
    ? completedTasks.querySelector("ul")
    : taskList.querySelector("ul");
  if (!ul) {
    ul = document.createElement("ul");
    (isCompleted ? completedTasks : taskList).appendChild(ul);
  }

  let li = document.createElement("li");
  li.classList.add(taskObj.priority);

  let checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = isCompleted;
  checkbox.addEventListener("change", () => {
    taskObj.completed = checkbox.checked;
    updateTaskStatus(taskObj);
  });

  li.appendChild(checkbox);
  li.appendChild(document.createTextNode(taskObj.task));
  ul.appendChild(li);
};

const updateTaskStatus = (taskObj) => {
  let userTasks = JSON.parse(localStorage.getItem(currentUser)) || {
    tasks: [],
    completedTasks: [],
  };

  if (taskObj.completed) {
    userTasks.tasks = userTasks.tasks.filter((t) => t.task !== taskObj.task);
    userTasks.completedTasks.push(taskObj);
  } else {
    userTasks.completedTasks = userTasks.completedTasks.filter(
      (t) => t.task !== taskObj.task
    );
    userTasks.tasks.push(taskObj);
  }

  saveTasks(userTasks);
  loadTasks();
};

const register = () => {
  const username = registerUsername.value.trim();
  const password = registerPassword.value.trim();
  if (username === "" || password === "") {
    alert("Please enter both username and password.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || {};
  if (users[username]) {
    alert("Username already exists.");
    return;
  }

  users[username] = hashPassword(password);
  localStorage.setItem("users", JSON.stringify(users));
  alert("Registration successful. Please login.");
};

const login = () => {
  const username = loginUsername.value.trim();
  const password = loginPassword.value.trim();
  if (username === "" || password === "") {
    alert("Please enter both username and password.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || {};
  if (!users[username] || users[username] !== hashPassword(password)) {
    alert("Invalid username or password.");
    return;
  }

  currentUser = username;
  loginForm.style.display = "none";
  taskForm.style.display = "block";
  loadTasks();
};

const logout = () => {
  currentUser = null;
  taskForm.style.display = "none";
  loginForm.style.display = "block";
};

registerBtn.addEventListener("click", register);
loginBtn.addEventListener("click", login);
logoutBtn.addEventListener("click", logout);
addBtn.addEventListener("click", addTask);
document.addEventListener("DOMContentLoaded", loadTasks);
