import React, { useState } from "react";
import Button from "./components/Button";
import Title from "./components/title";
import Stat from "./components/Stat";
import WordGuessGame from "./components/WordGuessGame";
import StatisticsPage from "./components/StatisticsPage";
import "./App.css";

function App() {
  //Initalize all the states
  const [gameStarted, setGameStarted] = useState(false);
  const [descriptionVisible, setDescriptionVisible] = useState(true);
  const [statValues, setStatValues] = useState({
    wordLength: 4,
    numberOfProblems: 3,
    timeLimit: 1,
  });
  const [isGameVisible, setIsGameVisible] = useState(false);
  const [gameEnded, setGameEnded] = useState(false); // Track game end
  const [pointsEarned, setPointsEarned] = useState(0); // Track points earned
  const [totalQuestions, setTotalQuestions] = useState(0); // Track total questions
  const [correctAnswers, setCorrectAnswers] = useState(0); // Track correct answers

  //Resets all the game states and moves to next stage
  const handleStartGame = () => {
    fetch("http://localhost:3000/api/resetGame", 
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });
    setDescriptionVisible(false);
    setGameStarted(true);
  };

  const handleSaveAndNext = () => {
    setIsGameVisible(true);
  };

  const handleStatChange = (name, value) => {
    setStatValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  //Handles the end of game to-do list
  const handleGameEnd = (score, totalQuestions, correctAnswers) => {
    setPointsEarned(score);
    setTotalQuestions(totalQuestions);
    setCorrectAnswers(correctAnswers);
    setGameEnded(true);
  };

  //Resets to front page
  const handlePlayAgain = () => {
    setGameEnded(false);
    setGameStarted(false);
    setIsGameVisible(false);
    setDescriptionVisible(true);
  };

  return (
    <div className="text-center">
      <div className="title page-container">
        <Title>Ekreb</Title>
        {descriptionVisible && (
          <div className="ekreb-description-container">
            <p className="ekreb-description">
              Welcome to Ekreb! In this game, you will be prompted with
              multiple scrambled words. For every guess you get right, you
              will get 1 point, if you use a hint, you will only be able to get
              0.5 points for the problem. At the end of the game, you'll be able
              to see your statistics.
            </p>
          </div>
        )}
      </div>

      <div>
        {gameStarted ? (
          !isGameVisible ? (
            <div>
              <p className="ekreb-description">
                Choose the length of the word you want to guess, the number of problems you want to solve, and the time limit you will have per problem.<br></br>When you're ready to go, click the ready button!
              </p>
              <Stat
                message="Length of Word (4-10)"
                value="letters"
                lowerRange={4}
                upperRange={10}
                onChange={(value) =>
                  handleStatChange("wordLength", value)
                }
              />
              <Stat
                message="Number of problems (3-15)"
                value="problems"
                lowerRange={3}
                upperRange={15}
                onChange={(value) =>
                  handleStatChange("numberOfProblems", value)
                }
              />
              <Stat
                message="Time Limit (per problem) (1-3)"
                value="minute(s)"
                lowerRange={1}
                upperRange={3}
                onChange={(value) =>
                  handleStatChange("timeLimit", value)
                }
              />
              <div className="ready-button">
                <Button color="success" onClick={handleSaveAndNext}>
                  Ready
                </Button>
              </div>
            </div>
          ) : gameEnded ? (
            // Display the statistics page when the game ends
            <StatisticsPage
              pointsEarned={pointsEarned}
              totalQuestions={totalQuestions}
              correctAnswers={correctAnswers}
              onPlayAgain={handlePlayAgain}
            />
          ) : (
            // Display the game component while the game is in progress
            <WordGuessGame
              numberOfProblems={statValues.numberOfProblems}
              timeLimit={statValues.timeLimit}
              wordLength={statValues.wordLength}
              onGameEnd={handleGameEnd}
            />
          )
        ) : (
          <Button onClick={handleStartGame}>Start Game</Button>
        )}
      </div>
    </div>
  );
}

export default App;
