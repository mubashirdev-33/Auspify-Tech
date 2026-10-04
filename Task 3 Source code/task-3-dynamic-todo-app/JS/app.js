/* Projects */

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");
const progressPercent = document.getElementById("progressPercent");

const clearCompleted = document.getElementById("clearCompleted");


let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


/* Toast */

const showToast = (message, type = "error") => {

    Toastify({
        text: message,
        duration: 2500,
        gravity: "top",
        position: "right",
        close: true,
        stopOnFocus: true,
        style: {
            background: type === "success"
                ? "#16a34a"
                : "#ef4444",

            color: "#ffffff",
            borderRadius: "10px",
            padding: "12px 18px",
            fontSize: "14px"
        }
    }).showToast();

};


/* Save Tasks */

const saveTasks = () => {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

};


/* Render Tasks */

const renderTasks = () => {

    taskList.innerHTML = "";


    if (tasks.length === 0) {

        emptyState.style.display = "block";

    } else {

        emptyState.style.display = "none";

    }


    tasks.forEach((task) => {

        const taskElement = document.createElement("div");

        taskElement.className = `task ${
            task.completed ? "completed" : ""
        }`;


        taskElement.innerHTML = `
            <button
                class="complete-btn"
                title="Complete Task">
            </button>

            <span class="task-text">
                ${task.text}
            </span>

            <button
                class="delete-btn"
                title="Delete Task">
                ×
            </button>
        `;


        /* Complete Task */

        const completeBtn =
            taskElement.querySelector(".complete-btn");


        completeBtn.addEventListener("click", () => {

            task.completed = !task.completed;

            saveTasks();
            renderTasks();

        });


        /* Delete Task */

        const deleteBtn =
            taskElement.querySelector(".delete-btn");


        deleteBtn.addEventListener("click", () => {

            tasks = tasks.filter(  (item) => item.id !== task.id);
            
            saveTasks();
            renderTasks();
            showToast( "Task deleted successfully", "success");
        });

        taskList.appendChild(taskElement);
    });
    updateStats();
};

/* Update Stats */
const updateStats = () => {

    const total = tasks.length;
    const completed = tasks.filter( (task) => task.completed ).length;
   
    const pending = total - completed;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
    
    totalTasks.textContent = total;
    pendingTasks.textContent = pending;
    completedTasks.textContent = completed;
    progressPercent.textContent = `${progress}%`;

};


/* Add Task */
const addTask = () => {
    const text = taskInput.value.trim();
    /* Empty Input */
    if (text === "") {
        showToast("Please enter a task");
        taskInput.focus();
        return;
    }

    /* Duplicate Task */
    const duplicateTask = tasks.some( (task) => task.text.toLowerCase() === text.toLowerCase()
    );
           
       

    if (duplicateTask) {
        showToast("This task already exists");
        taskInput.focus();
        return;
    }

    /* Create Task */
    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = "";
    taskInput.focus();
    showToast("Task added successfully", "success");
};

/* Add Button */
addTaskBtn.addEventListener( "click",   addTask);

/* Enter Key */
taskInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            addTask();
        }
    }
    
);

/* Clear Completed */
clearCompleted.addEventListener( "click",() => {
        const completedExist = tasks.some((task) => task.completed);
        if (!completedExist) {
            showToast("No completed tasks to clear");
            return;
        }
        tasks = tasks.filter((task) => !task.completed);
            
        saveTasks();
        renderTasks();
        showToast(
            "Completed tasks cleared",
            "success"
        );
    }
   
    
);

/* Load Tasks */
renderTasks();