import { useState } from "react";
import "./App.css";
import MemoryGame from "./components/memoryGame";
import Footer from "./components/footer";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <MemoryGame />
      <Footer />
    </>
  );
}

export default App;
