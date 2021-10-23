const form = document.querySelector('.form__todo-add');
const input = document.querySelector('.form__input-text');
const ulTodo = document.querySelector('.ul__todo');
const saveBtn = document.querySelector('.modal__button-save'); // save update of task
const modalText = document.querySelector('.modal__input-text');

let id = 0; // variable to save which task will be updated

async function getAllTasks() {
  const todo = await fetch('http://localhost:3000/todo/showAll');
  const data = await todo.json();
  // console.log(data);
  ulTodo.innerHTML = data.map((task, i) => `<li>
                <input type="checkbox" data-index="${i+1}" id="item${i}" ${task.isDone ? 'checked' : ''}>
                <label for="item${i}">${task.title}</label>
                <button class="li__button li__button-first btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-index="${i+1}">Edit</button>
                <button class="li__button li__button-second btn btn-danger" data-index="${i+1}">Delete</button>
            </li>`).join('');
  const deleteBtns = document.querySelectorAll('.li__button-second');
  const editBtns = document.querySelectorAll('.li__button-first')
  // eslint-disable-next-line no-use-before-define
  deleteBtns.forEach((btn) => btn.addEventListener('click', deleteTask));
  editBtns.forEach(btn => btn.addEventListener('click', function(e) {
    const el = e.target;
    id = el.dataset.index;
  }));
};

async function deleteTask(e) {
  const el = e.target;
  await fetch(`http://localhost:3000/todo/tasks/${el.dataset.index}`, {
    method: 'DELETE',
  });
  await getAllTasks();
};

async function addTask(e) {
  e.preventDefault();
  // without that program will cause "Unexpected token " in JSON at position 0"
  const taskText = input.value.replace('<', '');
  const task = {
    title: taskText,
  };

  await fetch('http://localhost:3000/todo/addTask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });
  await getAllTasks();
  console.log(task.title);
  input.value = '';
};

// function to handle toggling "checked" attribute in list elements
async function toggleDone(e) {
  if (!e.target.matches('input')) return;
  // console.log(e.target);
  const el = e.target;
  const { index } = el.dataset;
  // console.log(index);
  await fetch(`http://localhost:3000/todo/tasks/isDone/${index}`, {
    method: 'PUT',
  });
  await getAllTasks();
}

async function saveEdit() {
  await fetch(`http://localhost:3000/todo/tasks/${Number(id)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: modalText.value,
    })
  });
  modalText.value = '';
  await getAllTasks();
}

getAllTasks();
ulTodo.addEventListener('click', toggleDone);
form.addEventListener('submit', addTask);
saveBtn.addEventListener('click', saveEdit);