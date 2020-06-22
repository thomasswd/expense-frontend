const listForm = document.querySelector('.shopping');
const list = document.querySelector('.list');
const completedButton = document.querySelector('.showComplete');
const deleteButton = document.querySelector('.deleteAll')
const checkAllButton = document.querySelector('.checkAll')

// data state
let items = [];

function handleSubmit(e) {
   //console.log(e.currentTarget)
    e.preventDefault();
    const name = e.currentTarget.item.value;
    const item = {
        name: name,
        id: Date.now(),
        completed: false
    }
    items.push(item);

    listForm.reset();

    list.dispatchEvent(new CustomEvent('updatedItems'))
}

function updateDisplay() {
    const html = items.map(item => {
        return `
        <li class = "shopping-item">
            <input value="${item.id}" type="checkbox" ${item.completed ? 'checked' : ''}>
            <span class = "itemName">${item.name} </span>
            <button value="${item.id}" aria-label="Remove ${item.name}"> &times; </button>
        </li>
        `
    }).join('');
    list.innerHTML = html;
}

function updateLocalStorage() {
    localStorage.setItem('item', JSON.stringify(items))
}

function restoreFromLocalStorage() {
    const lsItems = JSON.parse(localStorage.getItem('item'))
    //get object and update the items state array
    items.push(...lsItems);

    //update the display
    updateDisplay();

}

function deleteItem(id) {
    //fitler through items array and filter out the id that matches
    const newItems = items.filter(item => item.id !== id)
    items = newItems;
    list.dispatchEvent(new CustomEvent('updatedItems'))
}

function markAsComplete(id) {

    const itemRef = items.find(item => item.id === id); 
    itemRef.completed = !itemRef.completed; //how does this change the original array?

    list.dispatchEvent(new CustomEvent('updatedItems'))
}

function handleShowButton(e) {
    const uncompletedItems = items.filter(item => item.completed === false);
    uncompletedItems.forEach(item => {
        const listItem = document.querySelector(`input[value="${item.id}"`)
        listItem.parentElement.classList.toggle('complete')
    })
}

function handleDeleteButton() {
    const noItems = items.splice(0)
    
    list.dispatchEvent(new CustomEvent('updatedItems'))
}

function handleCheckAllButton() {
    const checkAllItems = items.forEach(item => item.completed = !item.completed)

    list.dispatchEvent(new CustomEvent('updatedItems'))
}

listForm.addEventListener('submit', handleSubmit)

list.addEventListener('click', e => {
    if(e.target.matches('button')) {
        itemID = parseInt(e.target.value);
        deleteItem(itemID);
    }

    if(e.target.matches('input[type="checkbox"]')){
        markAsComplete(parseInt(e.target.value));
    }
})

list.addEventListener('updatedItems', updateDisplay)
list.addEventListener('updatedItems', updateLocalStorage)

completedButton.addEventListener('click', handleShowButton)
deleteButton.addEventListener('click', handleDeleteButton)
checkAllButton.addEventListener('click', handleCheckAllButton)

restoreFromLocalStorage();

console.log(items)