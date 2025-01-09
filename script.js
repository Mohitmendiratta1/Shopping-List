const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearButton = document.getElementById('clear');
const filterInput = document.getElementById('filter');
  
function addItem(e) {
  e.preventDefault();
  const newInput = itemInput.value.trim(); 
  if (newInput === "") {
    alert("Please add an item");
    return;
  }

  // Check for duplicates (case-insensitive)
  const existingItems = Array.from(itemList.querySelectorAll('li')).map(li =>
    li.firstChild.textContent.trim().toLowerCase()
  );

  if (existingItems.includes(newInput.toLowerCase())) {
    alert("This item already exists");
    return;
  }

  // Create a new list item
  const li = document.createElement('li');
  li.innerHTML = `${newInput} 
          <button class="remove-item btn-link text-red"> 
            <i class="fa-solid fa-xmark"></i> 
          </button>`;
  itemList.appendChild(li);

  // Add the item to local storage
  addItemToStorage(newInput);
  itemInput.value = ''; 
  resetUI();
}


function removeItem(e) {
  if (e.target.classList.contains('fa-xmark')) {
    const li = e.target.parentElement.parentElement;
    const itemName = li.firstChild.textContent.trim(); // Get the item name
    removeItemFromStorage(itemName); // Pass the correct item name
    li.remove();
  }
  resetUI();
}

function clearAll() {
  if (confirm("Are you sure you want to remove all items?")) {
    itemList.innerHTML = '';
    localStorage.removeItem('items');
  }
  resetUI();
}

function filterItems(e) {
  const filterText = e.target.value.toLowerCase();
  const items = itemList.querySelectorAll('li');
  console.log(items);

  items.forEach(item => {
    const itemName = item.firstChild.textContent.toLowerCase();
    if (itemName.indexOf(filterText) != -1){
      item.style.display = "flex"
    } else {
      item.style.display = 'none';
    }
  });

  // const items = Array.from(itemList.querySelectorAll('li'));

  // items.filter(item => {
  //   const itemName = item.textContent || item.innerText;
  // item.style.display = itemName.includes(filterText) ? '' : 'none';
  // });
}

function resetUI() {
  const items = itemList.querySelectorAll('li');
  if (items.length == 0){
    clearButton.style.display = 'none';
    filterInput.style.display = 'none';
  } else {
    clearButton.style.display = 'block';
    filterInput.style.display = 'block';
  }
}

function addItemToStorage(newItem){
  let itemsFromStorage
  if (localStorage.getItem("items")){
    itemsFromStorage = JSON.parse(localStorage.getItem("items"))
  } else {
    itemsFromStorage = [];
  }
  itemsFromStorage.push(newItem);
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}


function loadItemsFromStorage() {
  let itemsFromStorage = JSON.parse(localStorage.getItem("items"));
  if (itemsFromStorage) {
    itemsFromStorage.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `${item} 
              <button class="remove-item btn-link text-red"> 
                <i class="fa-solid fa-xmark"></i> 
              </button>`;
      itemList.appendChild(li);
    });
  }
  resetUI();
}

function removeItemFromStorage(item) {
  let itemsFromStorage = JSON.parse(localStorage.getItem('items')) || [];
  itemsFromStorage = itemsFromStorage.filter(storedItem => storedItem !== item);
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

filterInput.addEventListener('input', filterItems);
clearButton.addEventListener('click', clearAll);
itemList.addEventListener('click', removeItem);
itemForm.addEventListener('submit', addItem );
window.addEventListener('load', loadItemsFromStorage);
resetUI();


