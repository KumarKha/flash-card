const cardContent = document.getElementById("card-content");
const idxDisplay = document.getElementById("idx");
const topicTitle = document.getElementById("topic-title");
const contextMenu = document.getElementById("context-menu");
const overlay = document.getElementById("overlay");

const setManger = new CardSetManager();
let currentCardSet;
const loadedSet = loadFromLocalStorage(setManger);
if (loadedSet) {
  currentCardSet = loadedSet;
} else {
  currentCardSet = setManger.manager[0];
}

topicTitle.innerHTML = currentCardSet.topic;

let idx = 0;

function createBtn(btnContent, callback) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.innerText = btnContent;
  btn.addEventListener("click", callback);
  return btn;
}
function menuOn() {
  contextMenu.classList.remove("hidden");
  overlay.classList.remove("hidden");
  requestAnimationFrame(() => {
    overlay.classList.add("active");
  });
}
function menuOff() {
  contextMenu.classList.add("hidden");
  overlay.classList.remove("active");
  overlay.addEventListener(
    "transitionend",
    () => overlay.classList.add("hidden"),
    { once: true }
  );
}

topicTitle.addEventListener("click", () => {
  if (!setManger || setManger.size() === 0) {
    return;
  }
  if (contextMenu.classList.contains("hidden")) {
    renderTopicMenu();
    menuOn();
  } else {
    menuOff();
  }
});
overlay.addEventListener("click", () => {
  menuOff();
});
// Opens Menu for Set Management
function renderTopicMenu() {
  const header = document.createElement("h2");
  header.innerText = "Card Sets";
  const topics = setManger.listTopics();
  contextMenu.innerHTML = ""; // Clear the menu
  contextMenu.appendChild(header);
  //Create button for each Topic
  topics.forEach((topic) => {
    const btn = createBtn(topic, () => selectTopic(topic));
    contextMenu.appendChild(btn);
  });

  //  Set Management Buttons
  const div = document.createElement("div");
  div.id = "menu-controls";
  const plusBtn = createBtn("Add Set", () => {
    addSet();
  });
  const subBtn = createBtn("Remove Set", () => {
    removeSet();
  });

  div.appendChild(plusBtn);
  div.appendChild(subBtn);
  contextMenu.appendChild(div);
}

function selectTopic(topic) {
  const set = setManger.getSetByName(topic);
  if (!set) return;
  currentCardSet = set;
  idx = 0;
  topicTitle.textContent = currentCardSet.topic;
  displayCard();
  menuOff();
}

// Button Functions

function increaseIdx() {
  idx++;
  // Wrap around if idx is too big
  if (idx > currentCardSet.getSize() - 1) {
    idx = 0;
  }
  idxDisplay.innerText = idx;
  displayCard();
}
function decreaseIdx() {
  idx--;
  // Wrap around if idx get to 0
  if (idx < 0) {
    idx = currentCardSet.getSize() - 1;
  }
  // Fixes bug that removeCard cause (leave phantom card behind)
  if (idx == -1) {
    idx = 0;
  }
  idxDisplay.innerText = idx;
  displayCard();
}
function flipCard() {
  const card = currentCardSet.arr[idx];
  card.swapOrientation();
  const flashcard = document.getElementById("flashcard-container");
  // Plays flip animation
  flashcard.classList.add("flip-animation");
  flashcard.addEventListener(
    "animationend",
    () => {
      flashcard.classList.remove("flip-animation");
    },
    { once: true }
  );

  displayCard();
}

// Display current Card from the selected Set
function displayCard() {
  if (!currentCardSet || currentCardSet.getSize() === 0) {
    cardContent.innerText = "No cards to display.";
    return;
  }
  const card = currentCardSet.arr[idx];
  cardContent.innerText = card.getData();
  idxDisplay.innerText = idx + 1;
  topicTitle.innerText = currentCardSet.topic;
}
// Creates Add Card form
function addFlashcard() {
  contextMenu.innerHTML = "";
  const frontInput = document.createElement("input");
  frontInput.type = "text";
  frontInput.placeholder = "Enter front text...";
  const backInput = document.createElement("input");
  backInput.type = "text";
  backInput.placeholder = "Enter back text...";
  const createFlashBtn = createBtn("Create", () => {
    let front = frontInput.value;
    let back = backInput.value;
    if (!front && !back) {
      alert("Please fill at least one field");
      return;
    }
    if (!front) {
      front = "";
    }
    if (!back) {
      back = "";
    }
    currentCardSet.add(front, back);
    saveToLocalStorage(setManger);
    menuOff();
    idx = currentCardSet.getSize() - 1;
    displayCard();
  });
  contextMenu.appendChild(frontInput);
  contextMenu.appendChild(backInput);
  contextMenu.appendChild(createFlashBtn);
  menuOn();
}
function removeFlashcard() {
  currentCardSet.remove(idx);
  saveToLocalStorage(setManger);
  decreaseIdx();
}
function addSet() {
  contextMenu.innerHTML = "";
  const setInput = document.createElement("input");
  setInput.type = "text";
  setInput.placeholder = "Enter topic text...";
  const createSetBtn = createBtn("Create", () => {
    const set = setInput.value;

    if (!set) {
      alert("Please fill in fields");
      return;
    }
    try {
      setManger.add(new CardSet(set));
      saveToLocalStorage(setManger);
    } catch (error) {
      alert(error);
    }

    menuOff();
    currentCardSet = setManger.getSetByName(set);
    topicTitle.innerText = set;
    displayCard();
  });

  contextMenu.appendChild(setInput);
  contextMenu.appendChild(createSetBtn);
  menuOn();
}

function removeSet() {
  contextMenu.innerHTML = "";
  const setInput = document.createElement("input");
  setInput.type = "text";
  setInput.placeholder = "Enter topic title...";
  const removeBtn = createBtn("Remove Set", () => {
    const set = setInput.value;

    if (!set) {
      alert("Please fill in fields");
      return;
    }
    // Find the Set in the Manager
    let idxToRemove = setManger.findSetIdxByName(set);
    if (idxToRemove === -1) {
      // Alert if Set was not found
      alert("Unable to Find Set to Remove");
      return;
    }
    setManger.remove(idxToRemove);
    saveToLocalStorage(setManger);
    // Show the first  set in the manager
    currentCardSet = setManger.manager[0];
    idx = 0;
    topicTitle.textContent = currentCardSet.topic;
    displayCard();
    menuOff();
  });
  contextMenu.appendChild(setInput);
  contextMenu.appendChild(removeBtn);
  menuOn();
}

displayCard();
