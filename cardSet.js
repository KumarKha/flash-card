/**
 * Represents a single flashcard with a front and backside.
 * Each card can be flipped between the two orientations.
 */
class FlashCard {
  /**
   * Create a new Flashcard
   * @param {string} frontData
   * @param {string} backData
   */
  constructor(frontData, backData) {
    this.frontData = frontData;
    this.backData = backData;
    this.currOrientation = "front";
  }
  /**
   * Flips the card orientation between front and back
   */
  swapOrientation() {
    this.currOrientation = this.currOrientation === "front" ? "back" : "front";
  }
  /**
   * Returns the content currently visible on the card.
   * @returns {string} - The text/data for the current side
   * @throws {Error} - If currOrientation is not 'front' or 'back'
   */
  getData() {
    if (this.currOrientation === "front") {
      return this.frontData;
    }
    if (this.currOrientation === "back") {
      return this.backData;
    }
    throw new Error("Unknown Card Oreintaion");
  }
}
/**
 * Represents a collection of FlashCard object grouped by topic
 */
class CardSet {
  constructor(topic) {
    this.topic = topic;
    this.arr = [];
  }
  getSize() {
    return this.arr.length;
  }

  add(front, back) {
    this.arr.push(new FlashCard(front, back));
  }
  remove(idx) {
    this.arr.splice(idx, 1);
  }
}

class CardSetManager {
  constructor(cardset) {
    if (cardset == null) {
      throw new Error(
        "Card Set Manager must be created with an existing Card Set"
      );
    }
    this.manager = [cardset];
  }
  add(cardset) {
    if (this.findSetIdxByName(cardset.topic) != -1) {
      throw new Error(`Card Set with topic ${cardset.topic} already exist`);
    }
    this.manager.push(cardset);
  }
  remove(idx) {
    this.manager.splice(idx, 1);
  }
  findSetIdxByName(name) {
    for (let i = 0; i < this.manager.length; i++) {
      if (this.manager[i].topic === name) {
        return i;
      }
    }
    return -1;
  }
  getSetByName(name) {
    const i = this.findSetIdxByName(name);
    return i === -1 ? null : this.manager[i];
  }
  size() {
    return this.manager.length;
  }
  listTopics() {
    return this.manager.map((s) => s.topic);
  }
}
