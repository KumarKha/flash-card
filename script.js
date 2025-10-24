const cardContent = document.getElementById("card-content");
const idxDisplay = document.getElementById("idx");
const topicTitle = document.getElementById("topic-title");
const contextMenu = document.getElementById("context-menu");
const overlay = document.getElementById("overlay");

const defaultCardSet = new CardSet("Default");
const setManger = new CardSetManager(defaultCardSet);

let currentCardSet = defaultCardSet;
topicTitle.innerHTML = defaultCardSet.topic;

let idx = 0;

topicTitle.addEventListener("click", () => {
  if (!setManger || setManger.size() === 0) {
    return;
  }
  if (contextMenu.classList.contains("hidden")) {
    renderTopicMenu();
    contextMenu.classList.remove("hidden");
  } else {
    contextMenu.classList.add("hidden");
    overlay.classList.remove("active");
  }
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
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = topic;
    btn.addEventListener("click", () => {
      selectTopic(topic);
    });
    contextMenu.appendChild(btn);
  });

  //  Set Management Buttons
  const div = document.createElement("div");
  div.id = "menu-controls";
  const plusBtn = document.createElement("button");
  plusBtn.type = "button";
  plusBtn.textContent = "Add Set";
  plusBtn.addEventListener("click", () => {
    addSet();
  });
  const subBtn = document.createElement("button");
  subBtn.type = "button";
  subBtn.textContent = "Remove Set";
  subBtn.addEventListener("click", () => {
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
  contextMenu.classList.add("hidden");
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
  const createBtn = document.createElement("button");
  createBtn.type = "button";
  createBtn.textContent = "Create";
  createBtn.addEventListener("click", () => {
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
    contextMenu.classList.add("hidden");
    idx = currentCardSet.getSize() - 1;
    displayCard();
  });

  contextMenu.appendChild(frontInput);
  contextMenu.appendChild(backInput);
  contextMenu.appendChild(createBtn);
  contextMenu.classList.remove("hidden");
}
function removeFlashcard() {
  currentCardSet.remove(idx);
  decreaseIdx();
}
function addSet() {
  contextMenu.innerHTML = "";
  const setInput = document.createElement("input");
  setInput.type = "text";
  setInput.placeholder = "Enter topic text...";
  const createBtn = document.createElement("button");
  createBtn.type = "button";
  createBtn.textContent = "Create";
  createBtn.addEventListener("click", () => {
    const set = setInput.value;

    if (!set) {
      alert("Please fill in fields");
      return;
    }
    try {
      setManger.add(new CardSet(set));
    } catch (error) {
      alert(error);
    }

    contextMenu.classList.add("hidden");
    currentCardSet = setManger.getSetByName(set);
    topicTitle.innerText = set;
    displayCard();
  });
  contextMenu.appendChild(setInput);
  contextMenu.appendChild(createBtn);
  contextMenu.classList.remove("hidden");
}

function removeSet() {
  contextMenu.innerHTML = "";
  const setInput = document.createElement("input");
  setInput.type = "text";
  setInput.placeholder = "Enter topic title...";
  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.textContent = "Remove";
  removeBtn.addEventListener("click", () => {
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
    // Show the first  set in the manager
    currentCardSet = setManger.manager[0];
    idx = 0;
    topicTitle.textContent = currentCardSet.topic;
    displayCard();
    contextMenu.classList.add("hidden");
  });
  contextMenu.appendChild(setInput);
  contextMenu.appendChild(removeBtn);
  contextMenu.classList.remove("hidden");
}

displayCard();
