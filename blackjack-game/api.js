// api.js
export const fetchNewDeck = async () => {
    try {
      const response = await fetch('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
      const data = await response.json();
      return data.deck_id;
    } catch (error) {
      console.error(error);
    }
  };
  
  export const drawCards = async (deckId, count) => {
    try {
      const response = await fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=${count}`);
      const data = await response.json();
      return data.cards;
    } catch (error) {
      console.error(error);
    }
  };
  