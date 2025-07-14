// Game data
const officeItems = [
  { id: 'desk', name: 'Desk', img: '🪑', price: 50 },
  { id: 'chair', name: 'Chair', img: '💺', price: 50 },
  { id: 'computer', name: 'Computer', img: '💻', price: 50 },
  { id: 'bookshelf', name: 'Bookshelf', img: '📚', price: 50 },
  { id: 'plant', name: 'Plant', img: '🪴', price: 50 },
];

const items = [
  { id: 'bed', name: 'Bed', img: '🛏️', price: 50 },
  { id: 'lamp', name: 'Lamp', img: '💡', price: 50 },
  { id: 'wardrobe', name: 'Wardrobe', img: '🗄️', price: 50 },
  { id: 'rug', name: 'Rug', img: '🧺', price: 50 },
  { id: 'dining', name: 'Dining Table', img: '🍽️', price: 50 },
  { id: 'kitchen', name: 'Kitchen', img: '🍳', price: 50 },
  { id: 'bookcupboard', name: 'Book Cupboard', img: '📚', price: 50 },
  ...officeItems
];

const backgrounds = [
  { id: 'plain', name: 'Plain', color: '#f5e1c6' },
  { id: 'wallpaper', name: 'Wallpaper', color: '#ffe5b4' },
  { id: 'wood', name: 'Wood', color: '#e2c290' },
  { id: 'blue', name: 'Blue', color: '#b3d8f7' },
];

function getFamily() {
  return [
    { id: 'main_girl', name: 'Main Girl', img: 'main_girl.png', type: 'img', x: 60, y: 200, w: 140, h: 140 },
    { id: 'short_girl_straight', name: 'Short Girl Straight', img: 'assets/short_girl_straight.svg', type: 'svg', x: 180, y: 220, w: 120, h: 120 },
    { id: 'short_girl_curly', name: 'Short Girl Curly', img: 'assets/short_girl_curly.svg', type: 'svg', x: 270, y: 220, w: 120, h: 120 },
    { id: 'man', name: 'Man', img: 'assets/man.svg', type: 'svg', x: 350, y: 200, w: 140, h: 140 },
  ];
}

let houses = [
  { id: 1, name: "amma's gift room", rooms: [createNewRoom('Room 1')] },
  { id: 2, name: 'House 2', rooms: [createNewRoom('Room 1')] },
  { id: 3, name: 'House 3', rooms: [createNewRoom('Room 1')] },
  { id: 'office', name: 'Office', rooms: [createNewRoom('Office')] },
];
let currentHouseIndex = 0;
let currentRoomIndex = 0;
let inNeighborhood = true;

const storeItemsDiv = document.getElementById('store-items');
const roomDiv = document.getElementById('room');
const addRoomBtn = document.getElementById('add-room-btn');
const roomSelect = document.getElementById('room-select');

let coins = 500;
const coinsSpan = document.getElementById('coins');

let inventory = [];
const inventoryBtn = document.getElementById('inventory-btn');
const inventoryModal = document.getElementById('inventory-modal');

const storeBtn = document.getElementById('store-btn');
const storeModal = document.getElementById('store-modal');

function saveGame() {
  localStorage.setItem('mala_game_coins', JSON.stringify(coins));
  localStorage.setItem('mala_game_inventory', JSON.stringify(inventory));
  localStorage.setItem('mala_game_houses', JSON.stringify(houses));
}

function loadGame() {
  const savedCoins = localStorage.getItem('mala_game_coins');
  const savedInventory = localStorage.getItem('mala_game_inventory');
  const savedHouses = localStorage.getItem('mala_game_houses');
  if (savedCoins !== null) coins = JSON.parse(savedCoins);
  if (savedInventory !== null) inventory = JSON.parse(savedInventory);
  if (savedHouses !== null) houses = JSON.parse(savedHouses);
}

function updateCoins() {
  coinsSpan.textContent = coins;
  saveGame();
}

function createNewRoom(name) {
  return {
    name,
    items: [],
    background: backgrounds[0].id,
  };
}

function renderStore() {
  const storeItemsDiv = document.getElementById('store-items');
  storeItemsDiv.innerHTML = '';
  items.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'store-item';
    div.innerHTML = `
      <span class='emoji'>${item.img}</span>
      <span>${item.name}</span>
      <span class='price' style='color:#a67c52;font-weight:bold;'>50🪙</span>
    `;
    div.onclick = () => {
      if (coins < 50) {
        alert('Not enough coins!');
        return;
      }
      coins -= 50;
      updateCoins();
      inventory.push({ ...item });
      renderInventoryItems();
      renderStore();
      alert(`${item.name} added to your inventory!`);
    };
    storeItemsDiv.appendChild(div);
  });
}

function onStoreItemDragStart(e) {
  const itemId = e.target.dataset.itemId;
  e.dataTransfer.setData('text/plain', itemId);
  e.dataTransfer.effectAllowed = 'copy';
}

inventoryBtn.onclick = () => {
  renderInventoryModal();
  inventoryModal.style.display = 'flex';
};

function closeInventoryModal() {
  inventoryModal.style.display = 'none';
}

function renderInventoryModal() {
  inventoryModal.innerHTML = `
    <div class='inventory-panel'>
      <h3>Your Inventory</h3>
      <div class='inventory-items' id='inventory-items'></div>
      <button id='close-inventory'>Close</button>
    </div>
  `;
  document.getElementById('close-inventory').onclick = closeInventoryModal;
  renderInventoryItems();
}

function renderInventoryItems() {
  // Remove any watering can from inventory
  inventory = inventory.filter(item => item.id !== 'office_watering_can' && item.name !== 'Watering Can');
  const invDiv = document.getElementById('inventory-items');
  invDiv.innerHTML = '';
  inventory.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'inventory-item';
    div.innerHTML = `<span class='emoji'>${item.img}</span>`;
    // Button row
    const btnRow = document.createElement('div');
    btnRow.className = 'inventory-buttons';
    // Add to Room button
    const addBtn = document.createElement('button');
    addBtn.className = 'add-to-room-btn';
    addBtn.textContent = 'Add';
    addBtn.title = 'Add to Room';
    addBtn.onclick = (e) => {
      e.stopPropagation();
      addInventoryItemToRoom(item);
      inventory.splice(idx, 1);
      renderInventoryItems();
      closeInventoryModal();
      saveGame();
      if (inventory.length === 0) {
        coins = 500;
        updateCoins();
      }
    };
    // Sell button
    const sellBtn = document.createElement('button');
    sellBtn.className = 'sell-btn';
    sellBtn.textContent = 'Sell';
    sellBtn.title = 'Sell';
    sellBtn.onclick = (e) => {
      e.stopPropagation();
      inventory.splice(idx, 1);
      coins += 50;
      updateCoins();
      renderInventoryItems();
      closeInventoryModal();
      alert('Item sold for 50 coins!');
      saveGame();
      if (inventory.length === 0) {
        coins = 500;
        updateCoins();
      }
    };
    btnRow.appendChild(addBtn);
    btnRow.appendChild(sellBtn);
    div.appendChild(btnRow);
    invDiv.appendChild(div);
  });
  saveGame();
  if (inventory.length === 0) {
    coins = 500;
    updateCoins();
  }
}

roomDiv.addEventListener('dragover', e => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
});

roomDiv.addEventListener('drop', e => {
  e.preventDefault();
  // Check if dragging from inventory
  const invIdx = e.dataTransfer.getData('text/inventory');
  if (invIdx !== '') {
    const item = inventory[invIdx];
    if (!item) return;
    // Place from inventory (no coin cost)
    addInventoryItemToRoom(item);
    inventory.splice(invIdx, 1);
    renderInventoryItems();
    closeInventoryModal();
    return;
  }
  // Otherwise, dragging from store
  const itemId = e.dataTransfer.getData('text/plain');
  const item = items.find(i => i.id === itemId);
  if (!item) return;
  if (coins < item.price) {
    alert('Not enough coins!');
    return;
  }
  coins -= item.price;
  updateCoins();
  addItemToRoom(item);
});

function addInventoryItemToRoom(item) {
  const room = houses[currentHouseIndex].rooms[currentRoomIndex];
  room.items.push({ ...item, isoX: 250, isoY: 300 });
  renderRoom();
  saveGame();
}

function addItemToRoom(item) {
  const room = houses[currentHouseIndex].rooms[currentRoomIndex];
  room.items.push({ ...item, isoX: 250, isoY: 300 });
  renderRoom();
  saveGame();
}

function makeIsoRoomItemDraggable(itemDiv, item, idx, room) {
  let isDragging = false;
  let startX, startY, origIsoX, origIsoY;
  // Remove delete button for all items in the Office room
  const isOffice = houses[currentHouseIndex].name === 'Office';
  // Only show delete button if not in Office and not giftbox
  if (!isOffice && item.id !== 'giftbox') {
    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.innerHTML = '🗑️';
    delBtn.onclick = (e) => {
      e.stopPropagation();
      // Remove from room, add to inventory
      inventory.push({ ...item });
      room.items.splice(idx, 1);
      renderRoom();
      saveGame();
    };
    itemDiv.appendChild(delBtn);
  }
  // Make all items draggable
  itemDiv.addEventListener('mousedown', e => {
    if (e.target.classList.contains('delete-btn')) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    origIsoX = item.isoX;
    origIsoY = item.isoY;
    itemDiv.style.zIndex = 1000;
    document.body.style.userSelect = 'none';
  });
  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    let newIsoX = origIsoX + dx;
    let newIsoY = origIsoY + dy;
    newIsoX = Math.max(80, Math.min(newIsoX, 620));
    newIsoY = Math.max(120, Math.min(newIsoY, 500));
    itemDiv.style.left = newIsoX + 'px';
    itemDiv.style.top = newIsoY + 'px';
    room.items[idx].isoX = newIsoX;
    room.items[idx].isoY = newIsoY;
    saveGame(); // Save position on move
  });
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      itemDiv.style.zIndex = 1;
      document.body.style.userSelect = '';
      saveGame();
    }
  });
}

function renderRoom() {
  if (inNeighborhood) {
    renderNeighborhood();
    return;
  }
  const room = houses[currentHouseIndex].rooms[currentRoomIndex];
  // Always center the gift box in amma's gift room
  if (houses[currentHouseIndex].name === "amma's gift room") {
    let box = room.items.find(item => item.id === 'giftbox');
    let note = room.items.find(item => item.id === 'mothersday_note');
    // If both box and note are present, remove the note so only the box is visible
    if (box && note) {
      room.items = room.items.filter(item => item.id !== 'mothersday_note');
      note = null;
    }
    // Only restore the gift box if neither the box nor the note is present
    if (!box && !note) {
      room.items.push({ id: 'giftbox', name: 'Gift Box', img: '🎁', isoX: 400, isoY: 350 });
    } else if (box) {
      box.isoX = 400;
      box.isoY = 350;
      box.img = '🎁';
      delete box.type;
    }
  }
  roomDiv.innerHTML = '';
  // Render larger isometric room SVG
  roomDiv.style.background = 'none';
  roomDiv.style.display = 'flex';
  roomDiv.style.alignItems = 'center';
  roomDiv.style.justifyContent = 'center';
  const isoRoom = document.createElement('div');
  isoRoom.style.position = 'relative';
  isoRoom.style.width = '800px';
  isoRoom.style.height = '600px';
  isoRoom.innerHTML = `
    <svg width='800' height='600' viewBox='0 0 800 600'>
      <!-- Floor -->
      <polygon points='180,480 400,570 620,480 400,390' fill='#f5e1c6' stroke='#bfa77a' stroke-width='4'/>
      <!-- Left wall -->
      <polygon points='180,480 180,220 400,130 400,390' fill='#ffe5b4' stroke='#bfa77a' stroke-width='4'/>
      <!-- Right wall -->
      <polygon points='620,480 620,220 400,130 400,390' fill='#e2c290' stroke='#bfa77a' stroke-width='4'/>
    </svg>
  `;
  // Place items in isometric positions
  room.items.forEach((item, idx) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'room-item';
    itemDiv.style.position = 'absolute';
    itemDiv.style.left = (item.isoX || 250 + idx * 60) + 'px';
    itemDiv.style.top = (item.isoY || 300 + idx * 30) + 'px';
    if (item.id === 'giftbox') {
      itemDiv.innerHTML = `<span class=\"emoji\">🎁</span>`;
      itemDiv.style.cursor = 'pointer';
      itemDiv.onclick = function(e) {
        e.stopPropagation();
        launchConfettiFullScreen(() => {
          // Remove the gift box and add the note at the same position
          const room = houses[currentHouseIndex].rooms[currentRoomIndex];
          const boxIdx = room.items.findIndex(i => i.id === 'giftbox');
          if (boxIdx !== -1) {
            const box = room.items[boxIdx];
            room.items.splice(boxIdx, 1);
            room.items.push({
              id: 'mothersday_note',
              name: "Mother's Day Note",
              isoX: box.isoX,
              isoY: box.isoY
            });
            renderRoom();
          }
        });
      };
    } else if (item.id === 'mothersday_note') {
      // Render the note, styled and sized like an object
      itemDiv.innerHTML = `<div style='width:100px;height:100px;display:flex;align-items:center;justify-content:center;background:#fffbe6;border:3px solid #a67c52;border-radius:18px;font-family:serif;font-size:1.1em;color:#a67c52;text-align:center;box-shadow:2px 2px 12px #bfa77a33;padding:8px;'>Happy<br>Mother's Day, Amma</div>`;
    } else if (item.type === 'svg' || (item.img && item.img.endsWith('.svg'))) {
      const img = document.createElement('img');
      img.src = item.img;
      img.width = item.w || 80;
      img.height = item.h || 80;
      itemDiv.appendChild(img);
    } else if (item.type === 'img' || (item.img && (item.img.endsWith('.png') || item.img.endsWith('.jpg'))) ) {
      const img = document.createElement('img');
      img.src = item.img;
      img.width = item.w || 100;
      img.height = item.h || 100;
      img.style.borderRadius = '16px';
      itemDiv.appendChild(img);
    } else {
      itemDiv.innerHTML = `<span class=\"emoji\">${item.img}</span>`;
    }
    // Prevent deleting the gift box, note, or balloon in all rooms
    if (item.id !== 'giftbox' && item.id !== 'mothersday_note' && item.id !== 'balloon') {
      makeIsoRoomItemDraggable(itemDiv, item, idx, room);
    }
    isoRoom.appendChild(itemDiv);
  });
  roomDiv.appendChild(isoRoom);

  // Show office info title and chores list above the room if in Office and not in neighborhood
  if (!inNeighborhood && houses[currentHouseIndex].name === 'Office') {
    // Get the office room
    const officeRoom = houses[currentHouseIndex].rooms[currentRoomIndex];
    // Remove any emoji-based plant from office room
    officeRoom.items = officeRoom.items.filter(item => !(item.id === 'plant' && item.img === '🪴'));
    // Always add plant at fixed position next to watering can
    let plantIdx = officeRoom.items.findIndex(item => item.id === 'office_plant');
    if (plantIdx === -1) {
      officeRoom.items.push({
        id: 'office_plant',
        name: 'Plant',
        img: 'assets/plant.png',
        type: 'img',
        isoX: 320,
        isoY: 300,
        w: 140,
        h: 140,
        draggable: true
      });
    } else {
      // Ensure position and properties are correct
      officeRoom.items[plantIdx] = {
        id: 'office_plant',
        name: 'Plant',
        img: 'assets/plant.png',
        type: 'img',
        isoX: 320,
        isoY: 300,
        w: 140,
        h: 140,
        draggable: true
      };
    }
    // Debug log for office items
    
    // Render the instructions panel above the room
    const infoDiv = document.createElement('div');
    infoDiv.className = 'chores-panel';
    infoDiv.id = 'office-instructions';
    // Track completed chores and displayed chores in localStorage
    let completedChores = JSON.parse(localStorage.getItem('office_completed_chores') || '[]');
    let displayedChores = JSON.parse(localStorage.getItem('office_displayed_chores') || '[]');
    const chores = [
      'Water the plants by clicking the watering can',
      'Email the executive by clicking on the computer',
      'Read your assigned work by clicking the book'
    ];
    const numChoreSlots = 3; // Number of buttons/slots

    // Helper to get a random available chore index
    function getRandomAvailableChoreIdx(exclude = []) {
      const available = chores
        .map((_, idx) => idx)
        .filter(idx => !completedChores.includes(idx) && !exclude.includes(idx));
      if (available.length === 0) return null;
      return available[Math.floor(Math.random() * available.length)];
    }

    // On first load or if displayedChores is invalid, fill with random chores
    if (!Array.isArray(displayedChores) || displayedChores.length !== numChoreSlots) {
      displayedChores = [];
      let used = [];
      for (let i = 0; i < numChoreSlots; i++) {
        let idx = getRandomAvailableChoreIdx(used);
        if (idx === null) break;
        displayedChores.push(idx);
        used.push(idx);
      }
      // If not enough chores, fill with nulls
      while (displayedChores.length < numChoreSlots) displayedChores.push(null);
      localStorage.setItem('office_displayed_chores', JSON.stringify(displayedChores));
    }

    function handleChoreClick(slotIdx) {
      const choreIdx = displayedChores[slotIdx];
      if (choreIdx === null || completedChores.includes(choreIdx)) return;
      completedChores.push(choreIdx);
      localStorage.setItem('office_completed_chores', JSON.stringify(completedChores));
      // After marking as done, pick a new random available chore for this slot
      setTimeout(() => {
        let newIdx = getRandomAvailableChoreIdx(displayedChores.concat(completedChores));
        if (newIdx === null) {
          displayedChores[slotIdx] = null;
        } else {
          displayedChores[slotIdx] = newIdx;
        }
        localStorage.setItem('office_displayed_chores', JSON.stringify(displayedChores));
        coins += 50;
        updateCoins();
        renderRoom();
      }, 500); // Short delay for user to see 'Done!'
      renderRoom(); // Immediate update to show 'Done!'
    }

    // Build the chores panel
    let choresHtml = '';
    let allDone = completedChores.length >= chores.length;
    for (let i = 0; i < numChoreSlots; i++) {
      const choreIdx = displayedChores[i];
      if (choreIdx === null) {
        choresHtml += `<button disabled style='display:block;width:100%;margin:8px 0;padding:10px 18px;font-size:1em;font-family:inherit;border-radius:8px;border:2px solid #bfa77a;background:#eee;color:#bbb;cursor:default;'>No more chores</button>`;
        continue;
      }
      const isDone = completedChores.includes(choreIdx);
      choresHtml += `<button 
        style='display:block;width:100%;margin:8px 0;padding:10px 18px;font-size:1em;font-family:inherit;border-radius:8px;border:2px solid #bfa77a;background:${isDone ? "#eee" : "#ffe5b4"};color:${isDone ? "#bbb" : "#a67c52"};cursor:${isDone ? "default" : "pointer"};transition:background 0.2s;' 
        ${isDone ? "disabled" : ""}
        onclick='window.handleChoreClick&&handleChoreClick(${i})'>
        ${chores[choreIdx]} ${isDone ? "<span style='font-size:0.9em;'>(Done!)</span>" : ""}
      </button>`;
    }
    if (allDone) {
      choresHtml = `<div style='margin:16px 0;font-size:1.1em;color:#a67c52;'>All chores complete!</div>`;
      // Optionally, clear displayedChores for next session
      localStorage.removeItem('office_displayed_chores');
    }
    infoDiv.innerHTML = `
      <div style='font-size:1.25em;font-weight:bold;margin-bottom:10px;'>Do these chores:</div>
      <div style='font-size:1em;margin-bottom:10px;'>
        water the plants by clicking the watering can<br>
        email the executive by clicking on the computer<br>
        read your assigned work by clicking the book<br>
        <span style='color:#a67c52;display:block;margin-top:8px;'>If you finish the set for the day, you can get 50 coins each task</span>
      </div>
      <div style='text-align:left;font-size:1em;margin:0 auto 0 auto;max-width:320px;'>
        ${choresHtml}
      </div>
    `;
    // Expose handler globally for inline onclick
    window.handleChoreClick = handleChoreClick;
    // Insert the instructions panel above the room
    if (roomArea && !document.getElementById('office-instructions')) {
      roomArea.insertBefore(infoDiv, document.getElementById('room'));
    }
  } else {
    // Remove the instructions panel if not in Office or in neighborhood
    const oldInfo = document.getElementById('office-instructions');
    if (oldInfo) oldInfo.remove();
  }
}

function renderRoomSelect() {
  roomSelect.innerHTML = '';
  houses[currentHouseIndex].rooms.forEach((room, idx) => {
    const opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = room.name;
    opt.style.fontFamily = "'Nunito', 'Quicksand', Arial, sans-serif";
    opt.style.fontWeight = '700';
    opt.style.color = '#b48bbd';
    roomSelect.appendChild(opt);
  });
  // Add rename button for current room
  let renameBtn = document.getElementById('rename-room-btn');
  if (!renameBtn) {
    renameBtn = document.createElement('button');
    renameBtn.id = 'rename-room-btn';
    renameBtn.textContent = '✏️';
    renameBtn.style.marginLeft = '8px';
    renameBtn.style.fontSize = '1em';
    renameBtn.style.cursor = 'pointer';
    renameBtn.style.background = 'none';
    renameBtn.style.border = 'none';
    renameBtn.style.color = '#b48bbd';
    renameBtn.style.outline = 'none';
    renameBtn.onmouseover = () => { renameBtn.style.color = '#e7b6c9'; };
    renameBtn.onmouseleave = () => { renameBtn.style.color = '#b48bbd'; };
    roomSelect.parentNode.insertBefore(renameBtn, roomSelect.nextSibling);
    renameBtn.onclick = () => {
      const room = houses[currentHouseIndex].rooms[currentRoomIndex];
      const newName = prompt('Enter new room name:', room.name);
      if (newName && newName.trim()) {
        room.name = newName.trim();
        saveGame();
        renderRoomSelect();
      }
    };
  }
}

function renderBackgroundSelector() {
  let bgSelector = document.getElementById('bg-selector');
  if (!bgSelector) {
    bgSelector = document.createElement('select');
    bgSelector.id = 'bg-selector';
    bgSelector.style.marginLeft = '10px';
    document.getElementById('room-area').insertBefore(bgSelector, document.getElementById('room'));
    bgSelector.addEventListener('change', e => {
      houses[currentHouseIndex].rooms[currentRoomIndex].background = e.target.value;
      renderRoom();
    });
  }
  bgSelector.innerHTML = '';
  backgrounds.forEach(bg => {
    const opt = document.createElement('option');
    opt.value = bg.id;
    opt.textContent = bg.name;
    bgSelector.appendChild(opt);
  });
  bgSelector.value = houses[currentHouseIndex].rooms[currentRoomIndex].background;
}

addRoomBtn.addEventListener('click', () => {
  houses[currentHouseIndex].rooms.push(createNewRoom(`Room ${houses[currentHouseIndex].rooms.length + 1}`));
  currentRoomIndex = houses[currentHouseIndex].rooms.length - 1;
  renderRoomSelect();
  renderRoom();
  renderBackgroundSelector();
});

roomSelect.addEventListener('change', e => {
  currentRoomIndex = parseInt(e.target.value, 10);
  renderRoom();
  renderBackgroundSelector();
});

function renderNeighborhoodButton() {
  let btn = document.getElementById('neigh-btn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'neigh-btn';
    btn.textContent = 'Neighborhood';
    btn.style.margin = '16px 0 16px 16px';
    btn.style.fontSize = '1.2em';
    btn.style.background = '#fff6fa';
    btn.style.border = '2px solid #e7b6c9';
    btn.style.borderRadius = '18px';
    btn.style.padding = '10px 24px';
    btn.style.fontFamily = "'Nunito', 'Quicksand', Arial, sans-serif";
    btn.style.color = '#b48bbd';
    btn.style.fontWeight = 'bold';
    btn.style.boxShadow = '0 2px 8px #e7b6c933';
    btn.style.transition = 'background 0.2s, transform 0.1s, color 0.2s';
    btn.onmouseover = () => { btn.style.background = '#e7b6c9'; btn.style.color = '#fff'; btn.style.transform = 'scale(1.05)'; };
    btn.onmouseleave = () => { btn.style.background = '#fff6fa'; btn.style.color = '#b48bbd'; btn.style.transform = 'scale(1)'; };
    btn.onclick = () => {
      inNeighborhood = true;
      renderRoom();
    };
    document.body.insertBefore(btn, document.getElementById('game-container'));
  }
  btn.style.display = inNeighborhood ? 'none' : 'inline-block';
}

function renderNeighborhood() {
  roomDiv.innerHTML = '';
  roomDiv.style.background = 'repeating-linear-gradient(135deg, #f9e7ef, #f9e7ef 40px, #f7f3e9 40px, #f7f3e9 80px)';
  roomDiv.style.display = 'flex';
  roomDiv.style.flexWrap = 'wrap';
  roomDiv.style.alignItems = 'flex-start';
  roomDiv.style.justifyContent = 'center';
  houses.forEach((house, idx) => {
    const houseDiv = document.createElement('div');
    houseDiv.style.width = '180px';
    houseDiv.style.height = '200px';
    houseDiv.style.margin = '40px 32px 24px 32px';
    houseDiv.style.display = 'flex';
    houseDiv.style.flexDirection = 'column';
    houseDiv.style.alignItems = 'center';
    houseDiv.style.justifyContent = 'center';
    houseDiv.style.cursor = 'pointer';
    houseDiv.style.background = '#fff6fa';
    houseDiv.style.borderRadius = '18px';
    houseDiv.style.boxShadow = '0 4px 16px #e7b6c933';
    houseDiv.style.border = '2px solid #e7b6c9';
    houseDiv.style.transition = 'box-shadow 0.2s, transform 0.1s';
    houseDiv.onmouseover = () => { houseDiv.style.boxShadow = '0 8px 32px #e7b6c955'; houseDiv.style.transform = 'scale(1.04)'; };
    houseDiv.onmouseleave = () => { houseDiv.style.boxShadow = '0 4px 16px #e7b6c933'; houseDiv.style.transform = 'scale(1)'; };
    // House image
    const img = document.createElement('img');
    if (house.name === "amma's gift room") {
      img.src = 'assets/mothersday.jpg';
    } else {
      img.src = 'assets/home.webp';
    }
    img.style.width = '90px';
    img.style.height = '90px';
    img.style.objectFit = 'cover';
    img.style.background = 'transparent';
    img.style.borderRadius = '14px';
    img.style.display = 'block';
    img.style.margin = '0 auto';
    houseDiv.appendChild(img);
    // House name and rename button
    const nameDiv = document.createElement('div');
    nameDiv.style.fontFamily = "'Nunito', 'Quicksand', Arial, sans-serif";
    nameDiv.style.fontWeight = '700';
    nameDiv.style.fontSize = '1.15em';
    nameDiv.style.marginTop = '10px';
    nameDiv.style.display = 'flex';
    nameDiv.style.alignItems = 'center';
    nameDiv.style.color = '#b48bbd';
    nameDiv.style.justifyContent = 'center';
    nameDiv.style.padding = '0 12px 0 12px';
    nameDiv.style.width = '100%';
    nameDiv.style.boxSizing = 'border-box';
    nameDiv.style.textAlign = 'center';
    nameDiv.textContent = house.name;
    const renameBtn = document.createElement('button');
    renameBtn.textContent = '✏️';
    renameBtn.style.marginLeft = '8px';
    renameBtn.style.fontSize = '1em';
    renameBtn.style.cursor = 'pointer';
    renameBtn.style.background = 'none';
    renameBtn.style.border = 'none';
    renameBtn.style.color = '#b48bbd';
    renameBtn.style.outline = 'none';
    renameBtn.onmouseover = () => { renameBtn.style.color = '#e7b6c9'; };
    renameBtn.onmouseleave = () => { renameBtn.style.color = '#b48bbd'; };
    renameBtn.onclick = (e) => {
      e.stopPropagation();
      const newName = prompt('Enter new house name:', house.name);
      if (newName && newName.trim()) {
        house.name = newName.trim();
        saveGame();
        renderNeighborhood();
      }
    };
    nameDiv.appendChild(renameBtn);
    houseDiv.appendChild(nameDiv);
    houseDiv.addEventListener('click', () => {
      inNeighborhood = false;
      currentHouseIndex = idx;
      currentRoomIndex = 0;
      renderRoomSelect();
      renderRoom();
      renderBackgroundSelector();
      renderNeighborhoodButton();
    });
    roomDiv.appendChild(houseDiv);
  });
}

addRoomBtn.disabled = false;
addRoomBtn.style.opacity = 1;

// On page load, load game data
loadGame();
ensureGiftBox();
if (inventory.length === 0) {
  coins = 500;
}
updateCoins();
renderStore();
renderRoomSelect();
renderRoom();
renderBackgroundSelector();
renderNeighborhoodButton();

storeBtn.onclick = () => {
  renderStoreModal();
  storeModal.style.display = 'flex';
};

function closeStoreModal() {
  storeModal.style.display = 'none';
}

function renderStoreModal() {
  storeModal.innerHTML = `
    <div class='store-panel-modal'>
      <h3>Store</h3>
      <div class='store-items-modal' id='store-items-modal'></div>
      <button id='close-store'>Close</button>
    </div>
  `;
  document.getElementById('close-store').onclick = closeStoreModal;
  renderStoreItemsModal();
}

function renderStoreItemsModal() {
  const storeDiv = document.getElementById('store-items-modal');
  storeDiv.innerHTML = '';
  items.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'store-item-modal';
    div.innerHTML = `<span class='emoji'>${item.img}</span><div class='price'>50🪙</div>`;
    div.onclick = () => {
      if (coins < 50) {
        alert('Not enough coins!');
        return;
      }
      coins -= 50;
      updateCoins();
      inventory.push({ ...item });
      renderInventoryItems();
      alert(`${item.name} added to your inventory!`);
    };
    storeDiv.appendChild(div);
  });
}

// Add a box to amma's gift room on game start
function ensureGiftBox() {
  const ammaRoom = houses[0].rooms[0];
  let box = ammaRoom.items.find(item => item.id === 'giftbox');
  if (!box) {
    ammaRoom.items.push({ id: 'giftbox', name: 'Gift Box', img: '🎁', isoX: 400, isoY: 350 });
  } else {
    box.isoX = 400;
    box.isoY = 350;
    box.img = '🎁';
    delete box.type;
  }
  
  // Add balloon if it doesn't exist
  let balloon = ammaRoom.items.find(item => item.id === 'balloon');
  if (!balloon) {
    ammaRoom.items.push({ id: 'balloon', name: 'Balloon', img: '🎈', isoX: 300, isoY: 250 });
  }
}

// Full screen confetti effect, with callback after 3s
function launchConfettiFullScreen(cb) {
  // Remove any existing confetti
  const old = document.getElementById('confetti-canvas');
  if (old) old.remove();
  const confettiCanvas = document.createElement('canvas');
  confettiCanvas.id = 'confetti-canvas';
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  confettiCanvas.style.position = 'fixed';
  confettiCanvas.style.left = '0';
  confettiCanvas.style.top = '0';
  confettiCanvas.style.pointerEvents = 'none';
  confettiCanvas.style.zIndex = 9999;
  document.body.appendChild(confettiCanvas);
  const ctx = confettiCanvas.getContext('2d');
  const confettiCount = 120;
  const confetti = [];
  const colors = ['#f7c873', '#f76c6c', '#6cf7c8', '#6c8ff7', '#f7e36c', '#e36cf7'];
  for (let i = 0; i < confettiCount; i++) {
    confetti.push({
      x: Math.random() * window.innerWidth,
      y: -20 - Math.random() * 100,
      r: 6 + Math.random() * 8,
      d: Math.random() * 80,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 5,
      tiltAngle: 0,
      tiltAngleIncremental: (Math.random() * 0.07) + 0.05
    });
  }
  let angle = 0;
  let animationFrame;
  function drawConfetti() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    angle += 0.01;
    for (let i = 0; i < confettiCount; i++) {
      let c = confetti[i];
      c.tiltAngle += c.tiltAngleIncremental;
      c.y += (Math.cos(angle + c.d) + 2 + c.r / 2) * 0.9;
      c.x += Math.sin(angle);
      c.tilt = Math.sin(c.tiltAngle) * 15;
      ctx.beginPath();
      ctx.lineWidth = c.r;
      ctx.strokeStyle = c.color;
      ctx.moveTo(c.x + c.tilt + c.r / 2, c.y);
      ctx.lineTo(c.x + c.tilt, c.y + c.r * 2);
      ctx.stroke();
    }
    animationFrame = requestAnimationFrame(drawConfetti);
  }
  drawConfetti();
  setTimeout(() => {
    cancelAnimationFrame(animationFrame);
    confettiCanvas.remove();
    if (cb) cb();
  }, 3000);
}

// Utility: Check if a point is inside a polygon
function isPointInPolygon(x, y, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi + 0.00001) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
} 
