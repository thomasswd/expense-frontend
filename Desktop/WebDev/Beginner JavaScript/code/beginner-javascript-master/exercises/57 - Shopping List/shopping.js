const shoppingForm = document.querySelector('.shopping')
const list = document.querySelector('.list')
const shoppingInput = shoppingForm.querySelector('[name="item"]')
const filterChecked = document.querySelector('.showComplete')
const deleteComplete = document.querySelector('.deleteComplete')

let items = []

function handleSubmit(e) {
    e.preventDefault()
    const item = {
        name: shoppingInput.value,
        id: Date.now(),
        completed: false
    }
    items.push(item)

    shoppingForm.reset();

    list.dispatchEvent(new CustomEvent('updatedItems'))
}

function displayItems() {
    const itemsList = items.map( item => {
        return `
        <li class = "shopping-item"> 
            <input name = "name" type = "checkbox" value = "${item.id}" ${item.completed ? 'checked' : ''}> 
            <span>${item.name} </span>
            <button value = "${item.id}" class = "edit"> edit </button>
            <button value = "${item.id}" class = "close"> delete </button>
        </li>
        `
    })

    list.innerHTML = itemsList.join('');
}

function copyToLocalStorage() {
    localStorage.setItem('items', JSON.stringify(items))
}

function getFromLocalStorage() {
    const storedItems = JSON.parse(localStorage.getItem('items'))
    items.push(...storedItems)

    list.dispatchEvent(new CustomEvent('updatedItems'))
}

function deleteItem(id) {
    const newItems = items.filter(item => {
        return item.id !== id
    })

    items = newItems

    console.log(items)

    list.dispatchEvent(new CustomEvent('updatedItems'))
}

function markComplete(id) {
    const theItem = items.find(item => {
        return item.id === id
    })

    theItem.completed = !theItem.completed

    list.dispatchEvent(new CustomEvent('updatedItems'))

}

function handleFilterChecked() {

    const checkedItem = items.filter( item => {
        return item.completed !== true
    })

    checkedItem.forEach( item => {
        const checkedItemDOM = document.querySelector(`input[value="${item.id}"]`)
        checkedItemDOM.parentElement.classList.toggle('complete')
    })
}

function handleDeleteComplete() {
    const itemsNotComplete = items.filter( item => {
        return item.completed === false
    })

    items = itemsNotComplete;

    list.dispatchEvent(new CustomEvent('updatedItems'))
}

function editListItem(id) {

    const shoppingItem = document.querySelector(`button[value="${id}"]`)

    //hide the checkbox, the item name, edit button,
    shoppingItem.parentElement.children[0].classList.add('hide')
    shoppingItem.parentElement.children[1].classList.add('hide')
    shoppingItem.parentElement.children[2].classList.add('hide')

    //add in a new input for a new name
    const editInputForm = document.createElement('form')
    editInputForm.classList.add('editMe')
    const editInputHtml = `
    <input type = "text" name = "item"> 
    `
    //add cancel button to cancel the edit
    const cancelButton = document.createElement('button')
    cancelButton.classList.add('cancelEdit')
    cancelButton.textContent = 'cancel'
    shoppingItem.parentElement.insertAdjacentElement('afterbegin', cancelButton)

    editInputForm.innerHTML = editInputHtml
    shoppingItem.parentElement.insertAdjacentElement('afterbegin', editInputForm)
    console.log(editInputForm)

    cancelButton.addEventListener('click', e => {
        list.dispatchEvent(new CustomEvent('updatedItems'))
    })

    //add listener for submit on new name
    editInputForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const editVal = e.target.item.value
        const thisItem = items.find( item => item.id === id)
        thisItem.name = editVal
        console.log(items)
        list.dispatchEvent(new CustomEvent('updatedItems'))
    })

    
}

list.addEventListener('updatedItems', displayItems)
list.addEventListener('updatedItems', copyToLocalStorage)

list.addEventListener('click', (e) => {
    if(e.target.matches('button[class="close"]')) {
        const itemID = parseInt(e.target.value)
        deleteItem(itemID) 
    }
    if(e.target.matches('input[name="name"]')) {
        const itemID = parseInt(e.target.value)
        console.log(e.currentTarget)
        markComplete(itemID) 
    }
    if(e.target.matches('button[class="edit"]')){
        const itemID = parseInt(e.target.value);
        editListItem(itemID)
    }
})

shoppingForm.addEventListener('submit', handleSubmit)

filterChecked.addEventListener('click', handleFilterChecked)
deleteComplete.addEventListener('click', handleDeleteComplete)

getFromLocalStorage()
