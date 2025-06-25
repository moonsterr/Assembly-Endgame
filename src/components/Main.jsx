import { useEffect, useState } from 'react';
import { languages } from '../languages';
import { getFarewellText } from '../utils';
import { random } from '../utils';
import ConfettiComponent from './confetti';

export default function Main() {
  const [gameOver, setGameOver] = useState({ status: false, result: 'false' });
  const [currentWord, setCurrentWord] = useState(random());
  const [guessedLetters, setGuessedLetters] = useState([]);
  console.log(guessedLetters);

  const wrongCount = guessedLetters.filter(
    (letter) => !currentWord.includes(letter)
  ).length;
  console.log(wrongCount);

  const alphabet = 'abcdefghijklmnopqrstuvwxyz';

  function addGuessedLetter(letter) {
    setGuessedLetters((prevLetters) => {
      const lettersSet = new Set(prevLetters);
      lettersSet.add(letter);
      return Array.from(lettersSet);
    });
  }

  const languagesElements = languages.map((language, index) => {
    const wrong = index < wrongCount;
    return (
      <div
        key={language.name}
        className={`chip ${wrong ? 'lost' : ''}`}
        style={{
          backgroundColor: language.backgroundColor,
          color: language.color,
        }}
      >
        {language.name}
      </div>
    );
  });

  const wordLetters = currentWord.split('').map((letter, index) => (
    <span key={index} className="line">
      {gameOver.status || guessedLetters.includes(letter)
        ? letter.toUpperCase()
        : ''}
    </span>
  ));

  const letters = alphabet.split('').map((letter, index) => {
    const isGuessed = guessedLetters.includes(letter);
    const isCorrect = isGuessed && currentWord.split('').includes(letter);
    const isWrong = isGuessed && !currentWord.split('').includes(letter);
    let className = '';
    if (isCorrect) className = 'correct';
    if (isWrong) className = 'wrong';
    return (
      <button
        key={index}
        className={className}
        onClick={() => addGuessedLetter(letter)}
        disabled={(gameOver.status ? true : false) || isGuessed}
      >
        {letter.toUpperCase()}
      </button>
    );
  });
  function getLanguageText() {
    return getFarewellText(languages[wrongCount - 1].name);
  }
  function resetGame() {
    setGuessedLetters([]);
    setGameOver({ status: false, result: 'false' });
    setCurrentWord(random());
  }

  useEffect(() => {
    if (wrongCount === 8) {
      setGameOver({ status: true, result: 'lose' });
    } else if (
      currentWord.split('').every((letter) => guessedLetters.includes(letter))
    ) {
      setGameOver({ status: true, result: 'win' });
    }
  }, [wrongCount, guessedLetters]);
  const lastGuessedIn = currentWord.includes(
    guessedLetters[guessedLetters.length - 1]
  );
  return (
    <main>
      {gameOver.result === 'win' && <ConfettiComponent />}
      <div
        className={`result-container   ${
          gameOver.result === 'win'
            ? 'win'
            : gameOver.result === 'lose'
            ? 'lose'
            : wrongCount > 0 && !lastGuessedIn && gameOver.result === 'false'
            ? 'noHide'
            : ''
        }`}
      >
        {gameOver.result === 'win' && (
          <>
            <h1>You Win</h1>
            <h2>Well Done🎊</h2>
          </>
        )}
        {gameOver.result === 'lose' && (
          <>
            <h1>Game Over!</h1>
            <h2>You lose! Better start learning Assembly😂</h2>
          </>
        )}
        {gameOver.result === 'false' && wrongCount > 0 && !lastGuessedIn && (
          <>
            <h1>{getLanguageText()}</h1>
          </>
        )}
      </div>

      <div className="languages-list">{languagesElements}</div>
      <div className="word-container">{wordLetters}</div>
      <div className="keyboard">{letters}</div>

      {gameOver.status && (
        <button className="new-game" onClick={resetGame}>
          New Game
        </button>
      )}
    </main>
  );
}
