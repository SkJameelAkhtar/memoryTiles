import { useEffect, useState, useCallback } from "react";

const memoryGame = () => {
  const getBestMovesFromLocalStorage = useCallback((size) => {
    const storedValue = localStorage.getItem(`bestMoves-${size}`);
    return storedValue ? Number(storedValue) : Infinity;
  }, []);

  const [gridSize, setGridSize] = useState(4);
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

  const gridSizeIncrement = () => {
    if (gridSize >= 2 && gridSize < 8) {
      setGridSize(gridSize + 1);
    }
  };

  const gridSizeDecrement = () => {
    if (gridSize > 2 && gridSize <= 8) {
      setGridSize(gridSize - 1);
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
      <div className="bg-green-600 flex flex-row justify-around items-center text-white font-dmmono py-4 font-bold flex-wrap gap-2">
        <div className="text-2xl">Memory Tiles</div>
        <div className="flex flex-row justify-center items-center gap-[10px] flex-wrap">
          <div className="flex row gap-3">
            <div className="rounded-[5px] py-1 px-3 bg-white text-black cursor-pointer flex justify-center items-center" onClick={gridSizeDecrement}>-</div>
            <div className="border rounded px-3 py-1">{gridSize}</div>
            <div className="rounded-[5px] py-1 px-3 bg-white text-black cursor-pointer flex justify-center items-center" onClick={gridSizeIncrement}>+</div>
          </div>
          <div className="bg-white text-black px-3 py-1 rounded-[5px]">
            Moves: {moves}
          </div>
          <div className="bg-white text-black px-3 py-1 rounded-[5px]">
            Best:{" "}
            {bestMovesCount === Infinity ? "N/A" : bestMovesCount} Moves
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-[#091224] pb-5">
        <div className="min-h-screen font-dmmono flex flex-col items-center justify-center bg-grey-100">
          <div className="mb-4"></div>

          <div
            className={`grid gap-2 mb-1`}
            style={{
              gridTemplateColumns: `repeat(${gridSize}, minmax(0,1fr))`,
              width: `min(100%, ${Math.min(gridSize * 5.5, 90)}rem)`, // Reduced max width
              maxWidth: '90vw' //Added max width to be 90% of viewport width
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