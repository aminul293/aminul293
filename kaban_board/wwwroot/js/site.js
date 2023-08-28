document.addEventListener('DOMContentLoaded', () => {
    // Fetch and populate tasks
    fetchAndPopulateTasks();

    // Add task form submit
    document.getElementById('add-task-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const title = document.getElementById('title-input').value;
        const description = document.getElementById('description-input').value;

        await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description })
        });

        fetchAndPopulateTasks();
        clearAddTaskForm(); // Clear form fields after submission
    });

    // Delete task
    document.addEventListener('click', async (event) => {
        if (event.target.classList.contains('delete-button')) {
            const taskCard = event.target.closest('.task-card');
            const taskId = taskCard.getAttribute('data-task-id');

            await fetch(`/api/tasks/${taskId}`, {
                method: 'DELETE'
            });

            taskCard.remove();
        }
    });

    // Drag and drop functionality
    document.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', event.target.dataset.taskId);
    });

    document.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    document.addEventListener('drop', async (event) => {
        event.preventDefault();
        const taskId = event.dataTransfer.getData('text/plain');
        const newStatus = event.target.id.replace('-column', '');

        await fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });

        fetchAndPopulateTasks();
    });

    // Fetch and populate tasks function
    async function fetchAndPopulateTasks() {
        const response = await fetch('/api/tasks');
        const tasks = await response.json();

        // Clear existing task cards
        document.querySelectorAll('.task-card').forEach(card => card.remove());

        tasks.forEach(task => {
            const taskCard = createTaskCard(task);
            const column = document.getElementById(`${task.status.toLowerCase()}-column`);
            column.appendChild(taskCard);
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        // ...

        // Edit task
        document.addEventListener('click', async (event) => {
            if (event.target.classList.contains('edit-button')) {
                const taskCard = event.target.closest('.task-card');
                const taskId = taskCard.getAttribute('data-task-id');

                const editForm = taskCard.querySelector('.edit-form');
                const editTitleInput = taskCard.querySelector('.edit-title-input');
                const editDescriptionInput = taskCard.querySelector('.edit-description-input');
                const saveEditButton = taskCard.querySelector('.save-edit-button');
                const cancelEditButton = taskCard.querySelector('.cancel-edit-button');

                // Show the edit form and hide other elements
                taskCard.querySelector('h3').style.display = 'none';
                taskCard.querySelector('p').style.display = 'none';
                event.target.style.display = 'none';
                editForm.style.display = 'block';

                // Populate form with existing data
                const currentTitle = taskCard.querySelector('h3').textContent;
                const currentDescription = taskCard.querySelector('p').textContent;
                editTitleInput.value = currentTitle;
                editDescriptionInput.value = currentDescription;

                // Save edit
                saveEditButton.addEventListener('click', async () => {
                    const newTitle = editTitleInput.value;
                    const newDescription = editDescriptionInput.value;

                    await fetch(`/api/tasks/${taskId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ title: newTitle, description: newDescription })
                    });

                    // Update task card display with new data
                    taskCard.querySelector('h3').textContent = newTitle;
                    taskCard.querySelector('p').textContent = newDescription;

                    // Hide edit form and show other elements
                    taskCard.querySelector('h3').style.display = 'block';
                    taskCard.querySelector('p').style.display = 'block';
                    editForm.style.display = 'none';
                    event.target.style.display = 'inline-block';
                });

                // Cancel edit
                cancelEditButton.addEventListener('click', () => {
                    // Hide edit form and show other elements
                    taskCard.querySelector('h3').style.display = 'block';
                    taskCard.querySelector('p').style.display = 'block';
                    editForm.style.display = 'none';
                    event.target.style.display = 'inline-block';
                });
            }
        });

        // ...
    });

    // Create task card function
    function createTaskCard(task) {
        const taskCard = document.createElement('div');
        taskCard.classList.add('task-card');
        taskCard.dataset.taskId = task.id;

        const titleElement = document.createElement('h3');
        titleElement.textContent = task.title;

        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = task.description;

        const editButton = document.createElement('button');
        editButton.classList.add('edit-button');
        editButton.textContent = 'Edit';

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.textContent = 'Delete';

        taskCard.appendChild(titleElement);
        taskCard.appendChild(descriptionElement);
        taskCard.appendChild(editButton);
        taskCard.appendChild(deleteButton);

        return taskCard;
    }

    // Clear Add Task form fields
    function clearAddTaskForm() {
        document.getElementById('title-input').value = '';
        document.getElementById('description-input').value = '';
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const editForms = document.querySelectorAll(".edit-form");

    editForms.forEach(form => {
        const taskId = form.closest(".task-card").getAttribute("data-task-id");
        const titleInput = form.querySelector(".edit-title-input");
        const descriptionInput = form.querySelector(".edit-description-input");
        const saveButton = form.querySelector(".save-edit-button");
        const cancelButton = form.querySelector(".cancel-edit-button");

        saveButton.addEventListener("click", () => {
            // Send the edited data to the server using AJAX (fetch or axios)
            fetch(`/Tasks/Edit/${taskId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Id: taskId,
                    Title: titleInput.value,
                    Description: descriptionInput.value
                })
            })
                .then(response => response.json())
                .then(updatedTask => {
                    // Update the UI with the new task data
                    // (you can update the task card's title and description)
                })
                .catch(error => console.error(error));

            // Hide the edit form
            form.style.display = "none";
        });

        cancelButton.addEventListener("click", () => {
            // Hide the edit form without saving
            form.style.display = "none";
        });

        // Show the edit form when the "Edit" button is clicked
        form.previousElementSibling.addEventListener("click", () => {
            form.style.display = "block";
            titleInput.value = ""; // Set initial values
            descriptionInput.value = "";
        });
    });

    // Similar logic for delete and add actions
});
