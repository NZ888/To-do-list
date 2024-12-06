let taskCounter = 0; 
let taskList = [];  

document.addEventListener("DOMContentLoaded", () => {
    loadTasksFromLocalStorage();
    checkCheckbox();
});

let isEventAttached = false;

let currentClickTaskId = 0
const tasksContainer = document.querySelector('.tasks-container');
const readMenu = document.querySelector('div[data-read-task-menu]');
tasksContainer.addEventListener('click', (element)=>{
    const target = element.target;
    if(target.tagName === "A" && target.hasAttribute('data-id-for-read-task-menu')){
        currentClickTaskId = target.attributes[0].value
        displayReadTaskMenu(readMenu, currentClickTaskId)
    }
})

export function GetInfFromForm() {
    return new Promise((resolve) => {
        if (isEventAttached) return; 
        isEventAttached = true;
        const submitBtn = document.querySelector('button[data-submit-button]');
        const cleanBtn = document.querySelector('button[data-clean-button]');

        const taskTitle = document.querySelector('input[data-name-of-task]');
        const descriptionOfTask = document.querySelector('textarea[data-description-of-task]');
        const dateOfTask = document.querySelector('input[data-date-of-task]');

        const handleSubmit = (event) => {
            let nameText = taskTitle.value.trim(); 
            let descriptionText = descriptionOfTask.value.trim();

            if (!nameText) {
                alert("Task name is required");
                return;
            } else if (!descriptionText) {
                alert("Task description is required");
                return;
            }

            const newTask = {
                id: taskCounter++, 
                title: nameText,
                description: descriptionText,
                date: dateOfTask.value,
            };

            taskList.push(newTask);
            saveTaskToLocalStorage(newTask)
            taskTitle.value = "";
            descriptionOfTask.value = "";
            dateOfTask.value = "";

            submitBtn.style.background = "green";
            setTimeout(() => {
                submitBtn.style.background = "rgb(82, 9, 137)";
            }, 3000);
            displayTask(tasksContainer,newTask.title,newTask.description,newTask.date,newTask.id)
            resolve(newTask);
        };

        submitBtn.addEventListener('click', handleSubmit);

        cleanBtn.addEventListener('click', () => {
            taskTitle.value = "";
            descriptionOfTask.value = "";
            dateOfTask.value = "";
        });
    });
}

(async function handleTasks() {
    try {
        const newTask = await GetInfFromForm();
        checkCheckbox();
        handleTasks(); 
    } catch (err) {
        console.error("Error while adding task:", err);
    }
})();

function saveTaskToLocalStorage(task){
    const savedTask = JSON.parse(localStorage.getItem("tasks")) || []
    savedTask.push(task)
    localStorage.setItem("tasks", JSON.stringify(savedTask))
}
function loadTasksFromLocalStorage(){
    const savedTask = JSON.parse(localStorage.getItem("tasks")) || []
    taskList = savedTask;
    taskCounter = taskList.length
    savedTask.forEach(task => {
        displayTask(tasksContainer, task.title, task.description, task.date, task.id)
    });
}

async function displayTask(tasksContainer, title, description, date, id) {
    const toDoCounter = document.querySelector('.todo-counter')
    toDoCounter.textContent = taskCounter
    let normalDate = date
    if (normalDate) {
        
    } else {
        
    }
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task-div';
    taskDiv.innerHTML = `
        <div class="task-article">
            <label class="custom-checkbox">
                <input id="${id}" type="checkbox">
                <span data-span="" id="${id}"></span>
            </label>
                <a data-id-for-read-task-menu="${id}">${title}</a>
        </div>
        <div class="task-description">
            <p>${description}</p>
        </div>
        <div class="task-date">
            <img src="assets/icons/calendar.png" alt="Calendar icon">
            <p>${normalDate}</p>
        </div>
        <div class="underline"></div>
    `;
    tasksContainer.appendChild(taskDiv);
}

function getTaskFromId(id){
    const task = taskList.find(task => task.id === parseInt(id, 10))
    if (!task) {
        console.error(`Task with id ${id} not found.`);
        return null;
    }
    return task;
}

async function displayReadTaskMenu(readMenu, id) {
    const task = getTaskFromId(id);


    readMenu.querySelector('h1[data-task-title]').textContent = task.title;
    readMenu.querySelector('p[data-task-description]').textContent = task.description;

   
    if (task.date) {
        readMenu.querySelector('p[data-task-date]').textContent = task.date;
        readMenu.querySelector('div[data-icon-div-footer-img]').style.display = `block`; 
    } else {
        readMenu.querySelector('p[data-task-date]').textContent = ''; 
        readMenu.querySelector('div[data-icon-div-footer-img]').style.display = `none`; 
    }

    readMenu.style.display = `block`;
}

function checkCheckbox() {
    let removedTasks = []; 

    if (taskList.length === 0 && removedTasks.length === 0) {
        console.warn("Список задач пуст, нечего проверять.");
        return;
    }

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        checkbox.replaceWith(checkbox.cloneNode(true)); 
    });

    const updatedCheckboxes = document.querySelectorAll('input[type="checkbox"]');

    updatedCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (event) => {
            const title = document.querySelector(`a[data-id-for-read-task-menu="${event.target.id}"]`);

            if (event.target.checked) {
                const taskIndex = taskList.findIndex(obj => obj.id === parseInt(event.target.id, 10));
                title.style.textDecoration = 'line-through';
                if (taskIndex >= 0 && taskList.length) {
                    const removedTask = taskList.splice(taskIndex, 1)[0];
                    removedTasks.push(removedTask);
                }
            } else {
                title.style.textDecoration = 'none';
                const taskIndex = removedTasks.findIndex(obj => obj.id === parseInt(event.target.id, 10));
                if (taskIndex >= 0 && removedTasks.length) {
                    const restoredTask = removedTasks.splice(taskIndex, 1)[0];
                    taskList.push(restoredTask);
                }
            }
        });
    });


    window.addEventListener('beforeunload', () => {
        if (removedTasks.length > 0) {
            const currentTasks = JSON.parse(localStorage.getItem("tasks")) || [];
            const updatedTasks = currentTasks.filter(task => !removedTasks.some(removed => removed.id === task.id));
            localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        }
    });
}



