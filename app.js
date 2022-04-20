const addInputField = document.getElementById("add-input-field");
const todoCollection = document.querySelector(".todo-collection-tasks");
const pagination = document.getElementById("pagination");
let todoItems = [];
let current_page = 1;
const rows_items = 5;
   

// Adding To-Do Tasks
	function addTodo(event){
	event.preventDefault();
	if (addInputField.value.trim().length !== 0) {
	todoItems.push({task: addInputField.value, id: Date.now(), done: false});
	addInputField.value = "";
	renderTodo(todoItems);	
	}; 

	const lastElement = pagination.lastChild;
	if (lastElement) {
		lastElement.classList.add("active");
	}
	current_page = Number(lastElement?.textContent);
	let start = rows_items * (current_page - 1); 
	let end = start + rows_items;

    if (todoItems.length >= 0) {
		todoCollection.innerHTML = todoItems.slice(start, end)?.map((task) => {
				return `<div id="mainDiv${task.id}" class="task" > 
					<input onclick=onCheckBox(${task.id}) id="checkBox${task.id}" type="checkbox" /> 
					<span id="mutableValue${task.id}" class="todoInput">${task.task}</span>
                	<input style="display:none" value="${task.task}" id="ident${task.id}" class="hideTodo"/>
					<button onclick=editMode(${task.id}) type="button" id="edit${task.id}">Edit</button>
                	<button onclick=deleteButton(${task.id}) id="delete${task.id}" type="button">Delete</button>
                </div>`;
			})
			.join("");
	}
};

// Change page of to-do app
function changePage(pageNumber) {
	const lastElement = pagination.lastChild;
	let activeButton = pagination.children.item(pageNumber - 1);
	current_page = pageNumber;
	let allPaginationButton = document.querySelectorAll(".paginationButton");
	if (allPaginationButton) {
		allPaginationButton.forEach((button) => {
			button.classList.remove("active");
		});
	}

	if (activeButton) {
		activeButton.classList.add('active');
	}

	if (lastElement && pageNumber - 1 === Number(lastElement.textContent) && todoItems.length % 5 === 0) {
		current_page--;
		lastElement.classList.add('active');
	}

	let start = rows_items * (current_page - 1); 
	let end = start + rows_items; 
	if (todoItems.length >= 0) {
		todoCollection.innerHTML = todoItems.slice(start, end)?.map((task) => {
				let doneClass = task.done ? "done" : "";
				let isChecked = task.done ? "checked" : "";
				return `<div id="mainDiv${task.id}" class="task" > 
				<input onclick=onCheckBox(${task.id}) id="checkBox${task.id}" type="checkbox" ${isChecked} />
				<span id="mutableValue${task.id}" class="todoInput ${doneClass}">${task.task}</span>
				<input style="display:none" value="${task.task}" id="ident${task.id}" class="hideTodo"/>
				<button onclick=editMode(${task.id}) type="button" id="edit${task.id}">Edit</button>
				<button onclick=deleteButton(${task.id}) id="delete${task.id}" type="button">Delete</button>
			</div>`;
			})
			.join("");
	}
};

addInputField.addEventListener("click", (e) => {
	if (e.keyCode === 13) {
		addTodo();
		addInputField.value = "";
	}
});



// Pagination processing
function renderTodo() {
	pagination.innerHTML = '';
	for (let i = 1; i <= Math.ceil(todoItems.length / rows_items); i++) {
		const paginationButton = document.createElement('button');
		paginationButton.innerHTML = i;
		paginationButton.setAttribute('class', 'paginationButton');
		paginationButton.setAttribute('id', `paginationBtn${i}`);
		paginationButton.addEventListener('click', () => {
			changePage(i);
		});
		pagination.append(paginationButton);
	}
};



// Edit, save and cancel to-do tasks
function editMode(pointer) {
	const inputEdit = document.getElementById(`ident${pointer}`);
	const editButton = document.getElementById(`edit${pointer}`);
	const initialValue = document.getElementById(`mutableValue${pointer}`);
	const deleteButton = document.getElementById(`delete${pointer}`);

	inputEdit.style.display = "none";
	initialValue.style.display = "initial"; 

	if (editButton.innerHTML === 'Edit') {
		editButton.innerHTML = "Save";
		deleteButton.innerHTML = "Cancel";
		initialValue.classList.add("hideTodo");
		inputEdit.classList.remove("hideTodo");

		inputEdit.style.display = "initial";
		initialValue.style.display = "none"; 


	} else if (editButton.innerHTML === "Save" && inputEdit.value.length > 0) {
		editButton.innerHTML = "Edit";
		deleteButton.innerHTML = "Delete";
		inputEdit.classList.add("hideTodo");
		initialValue.classList.remove("hideTodo");
		initialValue.innerHTML = inputEdit.value; 

		todoItems.find((data) => {
			if (data.id === pointer) {
				data.task = inputEdit.value;
			}
		});
	}
};

// Checking to-do tasks and marking them
function onCheckBox(pointer) {
	const onCheckBox = document.getElementById(`checkBox${pointer}`);
	let targetItem = todoItems.filter((i) => {
		return i.id == pointer;
	})[0];
	if (onCheckBox.checked === true) {
		targetItem.done = true;
	} else {
		targetItem.done = false;
	}
	renderTodo();
	changePage(current_page);
};



// Delete Tasks
function deleteButton(pointer) {
	const deleteButton = document.getElementById(`delete${pointer}`);
	todoItems = todoItems.filter((i) => {
		if (deleteButton.innerHTML === "Delete") {
			return i.id !== pointer;
		} else {
			return i;
		}
	});
	renderTodo();
	changePage(current_page);
};