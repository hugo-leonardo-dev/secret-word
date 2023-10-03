import './App.css';
import { useCallback, useState, useEffect } from 'react';
import {wordsList} from './data/words'
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  {id: 1, name: "start" },
  {id: 2, name: "game" },
  {id: 3, name: "end" },
]

const guessesQty = 3;

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);
  
  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([])
  
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];
    const word = words[category][Math.floor(Math.random() * words[category].length)];
    
    return {word, category};
  }, [words]);

  const startGame = useCallback(() => {
    clearAllStates();

    const {word, category} = pickWordAndCategory();

    let wordLetters = word.split('');
    wordLetters = wordLetters.map((l) => l.toLowerCase());
    
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)){
      return;
    } 

    if(letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [   ...actualGuessedLetters, normalizedLetter ]);

    } else {
      setWrongLetters((actualWrongLetters) => [ ...actualWrongLetters, normalizedLetter ]);
      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };
  
  const clearAllStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }

  useEffect(() => {
    if(guesses <= 0) {
      clearAllStates();
      setGameStage(stages[2].name);
    }
  }, [guesses])

  useEffect(() => {
    const uniqueLetters = [... new Set(letters)]
    if(guessedLetters.length === uniqueLetters.length  && gameStage === stages[1].name) {
      setScore((actualScore) => actualScore += 100)
      startGame();
    }
  }, [guessedLetters, letters, startGame, gameStage])

  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);
    setGameStage(stages[0].name);
  }

  return (
    <div>
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {gameStage === 'game' && (
        <Game 
          verifyLetter={verifyLetter} 
          pickedWord={pickedWord} 
          pickedCategory={pickedCategory} 
          letters={letters} 
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === 'end' && <GameOver retry={retry} score={score} />}
    </div>
  )
}

export default App
