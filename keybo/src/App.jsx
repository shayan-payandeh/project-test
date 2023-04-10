import { useState } from 'react';
import { calculate } from './utils/calculate';
import { finishGame } from './utils/finishGame';
import { allWords } from './values';

function App() {
  const [start, setStart] = useState(false);
  const [guessButtonDisable, setGuessButtonDisablity] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [robotAnswers, setRobotAnswers] = useState([]);
  const [robotTurn, setRobotTurn] = useState(1);
  const [userGuess, setUserGuess] = useState('');
  const [robotGuess, setRobotGuess] = useState('');

  const allLevel = ['level 1', 'level 2', 'level 3'];
  const [robotWord] = useState(
    allWords[Math.floor(Math.random() * allWords.length)]
  );

  const onChangeHanlder = (e) => {
    e.preventDefault();
    setUserGuess(e.target.value);
  };

  const startPlay = (level) => {
    setStart(true);
    robotAction(level);
  };

  const userAction = () => {
    setGuessButtonDisablity(true);
    const { detailObject, isFinished } = calculate(robotWord, userGuess);
    setUserAnswers([...userAnswers, { key: userGuess, details: detailObject }]);

    if (!isFinished) {
      setTimeout(() => {
        robotAction();
      }, 2500);
    } else finishGame('win', robotGuess);
  };

  const robotAction = (level) => {
    if (robotTurn === 1) {
      //Robot first turn:
      setRobotTurn((prev) => prev + 1);
      let guessWord;

      if (level === 'level 1') {
        //first time for Level 1: The first guess shouldn't be correct - No letter should be guessed
        const char0 = robotWord.split('')[0];
        const char1 = robotWord.split('')[1];
        const char2 = robotWord.split('')[2];
        const char3 = robotWord.split('')[3];
        const char4 = robotWord.split('')[4];
        const possibleWords = allWords.filter(
          (word) =>
            word !== robotWord &&
            !word.includes(char0) &&
            !word.includes(char1) &&
            !word.includes(char2) &&
            !word.includes(char3) &&
            !word.includes(char4)
        );

        guessWord =
          possibleWords[Math.floor(Math.random() * possibleWords.length)];
      } else if (level === 'level 2') {
        //first time for Level 2 - The first guess shouldn't be correct - One letter should be guessed but NOT in the Right Place
        //choose random number between 0 and 4
        const index = Math.floor(Math.random() * 5);
        const char = robotWord.split('')[index];
        const possibleWords = allWords.filter(
          (word) =>
            word !== robotWord &&
            word.includes(char) &&
            word.split('')[index] !== char
        );
        guessWord =
          possibleWords[Math.floor(Math.random() * possibleWords.length)];
      } else if (level === 'level 3') {
        //first time for Level 2 - The first guess could be correct - One letter should be guessed And should be in the Right Place
        const index = Math.floor(Math.random() * 5);
        const char = robotWord.split('')[index];
        const possibleWords = allWords.filter(
          (word) => word.split('')[index] === char
        );
        guessWord =
          possibleWords[Math.floor(Math.random() * possibleWords.length)];
      }

      const { detailObject, isFinished } = calculate(robotWord, guessWord);
      setRobotAnswers([
        ...robotAnswers,
        { key: guessWord, details: detailObject },
      ]);
      setRobotGuess(guessWord);
      if (isFinished) {
        finishGame('lose', robotGuess);
      }
    }

    //Robot Not first turn
    else {
      setRobotTurn((prev) => prev + 1);
      const index = robotTurn - 2;
      const obj = robotAnswers[index].details;
      let filteredWords = allWords;
      for (const key in obj) {
        if (obj[key] === 'red') {
          const char = robotGuess.split('')[key];
          const arrayOfWords = allWords.filter((word) => word.includes(char));

          filteredWords = arrayOfWords.filter((value) =>
            filteredWords.includes(value)
          );
        } else if (obj[key] === 'green') {
          const arrayOfWords = allWords.filter(
            (word) => word.split('')[key] === robotGuess.split('')[key]
          );
          filteredWords = arrayOfWords.filter((value) =>
            filteredWords.includes(value)
          );
        }
      }
      const availableWords = [...new Set(filteredWords)];
      const guessWord =
        availableWords[Math.floor(Math.random() * availableWords.length)];

      const { detailObject, isFinished } = calculate(robotWord, guessWord);
      setRobotAnswers([
        ...robotAnswers,
        { key: guessWord, details: detailObject },
      ]);
      setRobotGuess(guessWord);
      if (isFinished) {
        finishGame('lose', robotGuess);
      }
    }

    setGuessButtonDisablity(false);
  };

  return (
    <>
      {!start && (
        <>
          {allLevel.map((level) => (
            <button
              key={level}
              style={{
                backgroundColor: '#66bfbf',
                padding: '20px 40px',
                margin: '100px auto',
                display: 'flex',
                border: 'none',
                justifyContent: 'center',
                color: 'white',
                letterSpacing: '2px',
                fontWeight: 'bolder',
                cursor: 'pointer',
                textTransform: 'uppercase',
              }}
              onClick={() => startPlay(level)}
            >
              {level}
            </button>
          ))}
        </>
      )}

      {start && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            backgroundColor: 'silver',
            padding: '10px',
            width: '50%',
            maxWidth: '400px',
            margin: '70px auto',
          }}
        >
          <input
            type="text"
            style={{
              padding: '10px',
              borderRadius: '5px',
              fontSize: '19px',
              backgroundColor: 'whitesmoke',
              border: 'none',
            }}
            maxLength={5}
            onChange={(e) => onChangeHanlder(e)}
          />
          <button
            disabled={guessButtonDisable}
            style={{
              borderRadius: '5px',
              border: 'none',
              padding: '5px 20px',
              fontSize: '15px',
              backgroundColor: 'whitesmoke',
              color: 'black',
              letterSpacing: '2px',
              cursor: 'pointer',
            }}
            onClick={userAction}
          >
            Guess
          </button>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        {userAnswers.length > 0 && (
          <div>
            <h2>Your Guess</h2>
            {userAnswers.map((answer, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  backgroundColor: '#9fd3c7',
                  padding: '10px',
                  width: '100%',
                  margin: '10px auto',
                  textTransform: 'capitalize',
                }}
              >
                {[0, 1, 2, 3, 4].map((item) => (
                  <input
                    key={item}
                    defaultValue={answer.key.split('')[item]}
                    type="text"
                    style={{
                      color: answer.details[item]
                        ? answer.details[item]
                        : 'gray',
                      padding: '15px',
                      borderRadius: '10px',
                      fontSize: '17px',
                      textAlign: 'center',
                      width: '29px',
                      backgroundColor: '#E0E0E0',
                      fontWeight: 'bold',
                      textTransform: 'capitalize',
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        )}

        {robotAnswers.length > 0 && (
          <div>
            <h2>Monster Guess</h2>
            {robotAnswers.map((answer, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  backgroundColor: '#385170',
                  padding: '10px',
                  width: '100%',
                  margin: '10px auto',
                }}
              >
                {[0, 1, 2, 3, 4].map((item) => (
                  <input
                    key={item}
                    defaultValue={answer.key.split('')[item]}
                    type="text"
                    style={{
                      color: answer.details[item]
                        ? answer.details[item]
                        : 'gray',
                      padding: '15px',
                      borderRadius: '10px',
                      fontSize: '17px',
                      textAlign: 'center',
                      width: '29px',
                      backgroundColor: '#E0E0E0',
                      fontWeight: 'bold',
                      textTransform: 'capitalize',
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
