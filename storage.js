function saveToLocalStorage(setManger) {
  const data = JSON.stringify(setManger.manager);
  localStorage.setItem("flashcardData", data);
  console.log("Saved data to local storage");
}

function loadFromLocalStorage(setManger) {
  const data = localStorage.getItem("flashcardData");
  if (!data) return null;

  try {
    const parsed = JSON.parse(data);
    setManger.manager = parsed.map((setData) => {
      const set = new CardSet(setData.topic);
      set.arr = setData.arr.map(
        (card) => new FlashCard(card.frontData, card.backData)
      );
      return set;
    });
    console.log("Loaded");
    return setManger.manager[0];
  } catch (error) {
    console.error(error);
  }
}
