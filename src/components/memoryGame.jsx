import { useEffect, useState, useCallback } from "react";

const memoryGame = () => {
  const getBestMovesFromLocalStorage = useCallback((size) => {
    const storedValue = localStorage.getItem(`bestMoves-${size}`);
    return storedValue ? Number(storedValue) : Infinity;
  }, []);

  const [gridSize, setGridSize] = useState(2);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);
  const [moveCount, setMoveCount] = useState(0);
  const [won, setWon] = useState(false);
  const [bestMovesCount, setBestMovesCount] = useState(() =>
    getBestMovesFromLocalStorage(2)
  );

  useEffect(() => {
    setBestMovesCount(getBestMovesFromLocalStorage(gridSize));
  }, [gridSize, getBestMovesFromLocalStorage]);

  useEffect(() => {
    localStorage.setItem(`bestMoves-${gridSize}`, bestMovesCount.toString());
  }, [bestMovesCount, gridSize]);

  const handleGridSizeChange = (e) => {
    const size = parseInt(e.target.value, 10);

    if (size >= 2 && size <= 8) {
      setGridSize(size);
    }
  };

  const initializeGame = () => {
    const totalCards = gridSize * gridSize;
    const pairCount = Math.floor(totalCards / 2);
    const numbers = [...Array(pairCount).keys()].map((n) => n + 1);
    const shuffledCards = [...numbers, ...numbers]
      .sort(() => Math.random() - 0.5)
      .slice(0, totalCards)
      .map((number, index) => ({ id: index, number }));

    setMoveCount(0);
    setMoves(0);
    setCards(shuffledCards);
    setFlipped([]);
    setSolved([]);
    setWon(false);
  };

  useEffect(() => {
    initializeGame();
  }, [gridSize]);

  const checkMatch = (secondId) => {
    const [firstId] = flipped;
    if (cards[firstId].number === cards[secondId].number) {
      setSolved([...solved, firstId, secondId]);
      setFlipped([]);
      setDisabled(false);
    } else {
      setTimeout(() => {
        setFlipped([]);
        setDisabled(false);
      }, 500);
    }
  };

  const handleClick = (id) => {
    if (parseInt(moveCount) % 2 === 0) {
      setMoves(moves + 1);
    }
    setMoveCount(moveCount + 1);

    if (flipped.length === 0) {
      setFlipped([id]);
      return;
    }

    if (flipped.length === 1) {
      setDisabled(true);
      if (id !== flipped[0]) {
        setFlipped([...flipped, id]);
        checkMatch(id);
      } else {
        setFlipped([]);
        setDisabled(false);
      }
    }
  };

  const isFlipped = (id) => flipped.includes(id) || solved.includes(id);
  const isSolved = (id) => solved.includes(id);

  useEffect(() => {
    if (solved.length === cards.length && cards.length > 0) {
      setWon(true);
      if (moves < bestMovesCount) {
        setBestMovesCount(moves);
      }
    }
  }, [solved, cards, moves, bestMovesCount]);

  return (
    <>
      <div className="bg-green-600 flex flex-row justify-around items-center text-white font-dmmono py-4 font-bold">
        <div className="text-2xl">Memory Tiles</div>
        <div className="flex flex-row justify-around items-center gap-[25px]">
          <div>
          <label htmlFor="gridSize" className="mr-2 font-bold text-white">
            Grid Size:(max 8)
          </label>
          <input
            type="number"
            id="gridSize"
            min="2"
            max="8"
            value={gridSize}
            onChange={handleGridSizeChange}
            className="border-2 border-gray-300 rounded px-2 py-1 text-white"
          /></div>
          <div className="bg-white text-black px-3 py-1 rounded-[5px]">
            Moves: {moves}
          </div>
          <div className="bg-white text-black px-3 py-1 rounded-[5px]">
            Best Move Count:{" "}
            {bestMovesCount === Infinity ? "N/A" : bestMovesCount}
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-[#091224]">
        <div className="min-h-screen font-dmmono flex flex-col items-center justify-center bg-grey-100">
          <div className="mb-4"></div>

          <div
            className={`grid gap-2 mb-1`}
            style={{
              gridTemplateColumns: `repeat(${gridSize}, minmax(0,1fr))`,
              width: `min(100%, ${gridSize * 5.5}rem)`,
            }}
          >
            {cards.map((card) => (
              <div
                key={card.id}
                onClick={() => handleClick(card.id)}
                className={`aspect-square flex items-center justify-center text-xl font-bold rounded-lg cursor-pointer transition-all duration-100  ${
                  isFlipped(card.id)
                    ? isSolved(card.id)
                      ? "bg-green-500 text-white"
                      : "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-400"
                }`}
              >
                {isFlipped(card.id) ? card.number : "?"}
              </div>
            ))}
          </div>

          {won && (
            <div className="mt-4 text-4xl font-bold text-green-600 animate-bounce">
              You Won!
            </div>
          )}
          <button
            onClick={initializeGame}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors mt-4"
          >
            {won ? "Play Again" : "Reset"}
          </button>
        </div>
      </div>
    </>
  );
};

export default memoryGame;
