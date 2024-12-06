document.addEventListener("DOMContentLoaded", () => {
    initDraggable();
    manipulateWithMenuTask();
    manipulateWithMenuKalendar();
    manipulateWithReadMenuTask();
});

function manipulateWithMenuTask() {
    const openButton = document.querySelector('img[data-open-task-menu]');
    const menu = document.querySelector('div[data-add-task-menu]');
    const closeButton = document.querySelector('img[data-close-task-menu]');

    if (!openButton || !menu || !closeButton) {
        console.error("Elements not found.");
        return;
    }

    closeButton.addEventListener('click', () => {
        menu.style.display = 'none';
    });

    openButton.addEventListener('click', () => {
        menu.style.display = 'block';
    });
}
function manipulateWithReadMenuTask() {
    const menu = document.querySelector('div[data-read-task-menu]');
    const closeButton = document.querySelector('img[data-close-read-task-menu]');

    if (!menu || !closeButton) {
        console.error("Elements not found.");
        return;
    }

    closeButton.addEventListener('click', () => {
        menu.style.display = 'none';
    });


}
function manipulateWithMenuKalendar() {
    const openButton = document.querySelector('button[data-open-calendar]');
    const menu = document.querySelector('div [data-calendar-nemu]');
    const closeButton = document.querySelector('img[data-close-task-menu]');

    if (!openButton || !menu || !closeButton) {
        console.error("Elements not found.");
        return;
    }

    closeButton.addEventListener('click', () => {
        menu.style.display = 'none';
    });

    openButton.addEventListener('click', () => {
        menu.style.display = 'block';
    });
}
function initDraggable() {
    const draggableElements = document.querySelectorAll("div[data-dragble-item]");

    if (draggableElements.length === 0) {
        console.error("Draggable elements not found!");
        return;
    }

    draggableElements.forEach(draggableElement => {
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        function calculateOffsets(event, element) {
            offsetX = event.clientX - element.offsetLeft;
            offsetY = event.clientY - element.offsetTop;
        }

        draggableElement.addEventListener("mousedown", (event) => {
            isDragging = true;
            calculateOffsets(event, draggableElement);
            draggableElement.style.cursor = 'grabbing';


            draggableElement.style.zIndex = 1000;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                draggableElement.style.left = `${e.clientX - offsetX}px`;
                draggableElement.style.top = `${e.clientY - offsetY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                draggableElement.style.cursor = 'default';
                draggableElement.style.zIndex = '';
            }
        });
    });
}


