import { useEffect } from "react";
import "./App.css";
import { useState } from "react";

function App() {
  const [wordOfDay, setWordOfDay] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [temp, setTemp] = useState("");
  const [isGameWon, setIsGameWon] = useState(false);

  useEffect(() => {
    const handleUserInput = async (event) => {
      const charCode = event.which ? event.which : event.keyCode;
      if (event.key === "Enter") {
        if (isGameWon) return;
        if (!temp || temp.length !== 5) return;
        if (wordOfDay.toLowerCase() === temp) setIsGameWon(true);
        setGuesses((prev) => [...prev, temp]);
        setTemp("");
      }
      if (charCode) {
        if (
          charCode > 31 &&
          (charCode < 65 || charCode > 90) &&
          (charCode < 97 || charCode > 122)
        ) {
          return false;
        }
        if (event.key === "Backspace") {
          if (isGameWon) return;
          setTemp((prev) => prev.slice(0, -1));
        } else {
          if (isGameWon) return;
          if (temp.length > 4) return;
          setTemp((prev) => prev + event.key);
        }
      }
    };
    window.addEventListener("keydown", handleUserInput);
    return () => {
      window.removeEventListener("keydown", handleUserInput);
    };
  }, [temp, isGameWon, wordOfDay]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("http://localhost:4444");
      const data = await response.json();
      setWordOfDay(data.solution);
    }
    fetchData();
  }, []);

  const handleReset = () => {
    setTemp("");
    setGuesses([]);
    setIsGameWon(false);
  };

  return (
    <div>
      {isGameWon ? (
        <>
          <h1 className="animate-character">You Won!!</h1>
          <div className="card"></div>
          <button onClick={() => handleReset()}>Restart</button>
        </>
      ) : null}
      {!isGameWon && guesses.length > 5 ? (
        <>
          <div className="card">Game Over</div>
          <div className="card">Correct Answer was {wordOfDay}</div>
          <button onClick={() => handleReset()}>Restart</button>
        </>
      ) : (
        <Row
          isGameWon={isGameWon}
          answer={wordOfDay}
          guesses={guesses}
          temp={temp}
        />
      )}
    </div>
  );
}

const Row = ({ answer, guesses, temp, isGameWon }) => {
  const checkChar = (char, idx) => {
    const foundChar = answer.toLowerCase().includes(char);
    const checkIndex = answer.toLowerCase().indexOf(char) === idx;
    if (foundChar && checkIndex) return "right";
    if (foundChar) return "semi-right";
    return "";
  };
  return (
    <>
      <h1>WORDLE</h1>
      <h4>You have {6 - guesses.length} tries left</h4>
      <p className={`${isGameWon ? "d-none" : ""}`}>
        Type a 5 Letter word to get started: {temp}
      </p>
      <div className="card">
        {guesses.length > 0 &&
          guesses.map((guess) => {
            return guess.split("").map((char, idx) => {
              return (
                <div key={idx} className="box">
                  <div className={checkChar(char, idx)}>{char}</div>
                </div>
              );
            });
          })}
      </div>
    </>
  );
};

export default App;
