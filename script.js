const cardContent = document.getElementById("card-content");
const idxDisplay = document.getElementById("idx");
const topicTitle = document.getElementById("topic-title");
const topicMenu = document.getElementById("topic-menu");

const defaultCardSet = new CardSet("Deafult");
const defauldtCardSet = new CardSet("Deafdsult");
defauldtCardSet.add("Frosdnt...", "Bsdack..");

defaultCardSet.add("Front...", "Back..");
defaultCardSet.add("Front", "Back");
const setManger = new CardSetManager(defaultCardSet);
setManger.add(defauldtCardSet);

let currentCardSet = defaultCardSet;

let idx = 0;

topicTitle.addEventListener("click", () => {
  if (!setManger || setManger.size() === 0) {
    return;
  }
  if (topicMenu.classList.contains("hidden")) {
    renderTopicMenu();
    topicMenu.classList.remove("hidden");
  } else {
    topicMenu.classList.add("hidden");
  }
});

function renderTopicMenu() {
  const topics = setManger.listTopics();
  topicMenu.innerHTML = "";
  topics.forEach((topic) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = topic;
    btn.addEventListener("click", () => {
      selectTopic(topic);
    });
    topicMenu.appendChild(btn);
  });
  const plusBtn = document.createElement("button");
  plusBtn.type = "button";
  plusBtn.textContent = "+";
  plusBtn.addEventListener("click", () => {
    console.log("WIP");
  });
  topicMenu.appendChild(plusBtn);
}

function selectTopic(topic) {
  const set = setManger.getSetByName(topic);
  if (!set) return;
  currentCardSet = set;
  idx = 0;
  topicTitle.textContent = currentCardSet.topic;
  displayCard();
  topicMenu.classList.add("hidden");
}

function increaseIdx() {
  idx++;
  if (idx == currentCardSet.getSize()) {
    idx = 0;
  }
  idxDisplay.innerText = idx;
  displayCard();
}
function decreaseIdx() {
  idx--;
  if (idx < 0) {
    idx = currentCardSet.getSize() - 1;
  }
  idxDisplay.innerText = idx;
  displayCard();
}
function flipCard() {
  const card = currentCardSet.arr[idx];
  card.swapOrientation();
  const flashcard = document.getElementById("flashcard-container");
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
