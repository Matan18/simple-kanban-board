const fs = require('fs')

let text = '';
let list;
const dropzones = document.querySelectorAll('.dropzone')
const garbage = document.querySelector('.garbage');

start()

async function start() {
  await readFile();
  settingInputFunctions();
  settingButtonFunctions();
  loadList();
}

async function readFile() {
  const value = await fs.readFileSync('list.json', { encoding: 'utf-8', flag: 'rs+' })
  list = JSON.parse(value);
}

function settingInputFunctions() {
  const input = document.querySelector('.new-input');
  input.addEventListener('change', inputChanged)
  function inputChanged() {
    text = this.value
  }
}

function settingButtonFunctions() {
  const button = document.querySelector('.confirm')
  button.addEventListener('click', addItem)
}

function loadList() {
  list.forEach(cart => createCard(cart))
  loadCardEvents();
}

function createCard({ name, severity }) {
  const card = document.createElement('div')
  card.draggable = true;
  card.classList.add('card');
  card.appendChild(createStatus());
  card.appendChild(createContent(name));
  dropzones[severity].innerHTML += card.outerHTML;
}

function createStatus(){
  const status = document.createElement('div')
  status.classList.add('status');
  return status
}

function createContent(name) {
  const content = document.createElement('div')
  content.innerText = name;
  content.classList.add('content');
  return content;
}

//Chamado ao carregar a lista, e atualizar a lista
function loadCardEvents() {
  const cards = document.querySelectorAll('.card')

  cards.forEach((card) => {
    card.addEventListener('dragstart', dragstart)
    card.addEventListener('drag', drag)
    card.addEventListener('dragend', dragend)
  })

  function dragstart() {
    dropzones.forEach(dropzone => dropzone.classList.add('highlight'))
    this.classList.add('is-dragging')
    garbage.classList.add('highlight')
  }
  function drag() {
  }
  function dragend() {
    dropzones.forEach(dropzone => dropzone.classList.remove('highlight'))
    this.classList.remove('is-dragging')
  }
}

// Escreve as alterações na lista de tarefas
function atualizarList() {
  fs.writeFileSync('list.json', JSON.stringify(list), { encoding: 'utf-8', flag: 'w+' })
  loadCardEvents();
}

// Adiciona um item a lista de tarefas (atualmente na parte To Do)
function addItem() {
  list.push({ name: text, severity: 0 })
  createCard({ name: text, severity: 0 })
  atualizarList();

}

//setting where cards will be dropped
dropzones.forEach(dropzone => {
  dropzone.addEventListener('dragenter', dragenter)
  dropzone.addEventListener('dragover', dragover)
  dropzone.addEventListener('dragleave', dragleave)
  dropzone.addEventListener('drop', drop)
})


function dragenter() {
}
function dragover() {
  this.classList.add('is-over')
  const cardBeingDragged = document.querySelector('.is-dragging');
  list = list.filter(item => item.name !== cardBeingDragged.childNodes[1].innerText)
  list = [...list,
    { name: cardBeingDragged.childNodes[1].innerText, severity: parseInt(this.classList[1]) - 1 }
  ]
  this.appendChild(cardBeingDragged)
  atualizarList();
}
function dragleave() {
  this.classList.remove('is-over')
}
function drop() {
  this.classList.remove('is-over')
}


// Setting way to delete cards
garbage.addEventListener('dragleave', dragleave)
garbage.addEventListener('dragover', removeItem)

function removeItem() {
  this.classList.add('highlight')
  const cardBeingDragged = document.querySelector('.is-dragging');
  list = list.filter(item => item.name !== cardBeingDragged.childNodes[1].innerText)
  cardBeingDragged.remove();
  atualizarList();
}