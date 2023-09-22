/* The guessing game component */

import React, { useState, useEffect } from "react";
import Button from "./Button";

const WordGuessGame = ({
  numberOfProblems,
  timeLimit,
  wordLength,
  onGameEnd,
}) => {
  const [currentWord, setCurrentWord] = useState("");
  const [scrambledWord, setScrambledWord] = useState("");
  const [answeredCorrectly, setAnsweredCorrectly] = useState(0);
  const [userGuess, setUserGuess] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [questionsLeft, setQuestionsLeft] = useState(numberOfProblems);
  const [timer, setTimer] = useState(timeLimit * 60); // Convert time limit to seconds
  const [hintUsed, setHintUsed] = useState(false);
  const [hint, setHint] = useState("");
  const [gameEnded, setGameEnded] = useState(false); // Track game end

  useEffect(() => {
    // Load a random word from the API
    getRandomWord();
  }, [numberOfProblems, timeLimit, wordLength]);

  const getRandomWord = () => {
    // Reset hint usage and hint text
    setHintUsed(false);

    //API call to get random word
    fetch(
      'http://localhost:3000/api/getRandomWord/' + wordLength
    )
      .then((response) => response.json())
      .then((data) => {
        setHint(data.hint);
        setScrambledWord(data.scrambledWord);
        setUserGuess("");
        setFeedback("");
      })
      .catch((error) => {
        console.error("Error fetching random word:", error);
      });
  };

  useEffect(() => {
    // Countdown timer
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    // End the game when the timer reaches 0
    if (timer <= 0) {
      handleGuess(); // Automatically check the guess when timer ends
      clearInterval(interval);
    }

    return () => clearInterval(interval); // Cleanup on unmount
  }, [timer]);

  const scrambleWord = (word) => {
    // Shuffles the letters of the random word
    return word.split("").sort(() => Math.random() - 0.5).join("");
  };

  //Handles each guess the user makes
  const handleGuess = () => {
    // Decrease the number of questions left
    setQuestionsLeft(questionsLeft - 1);
    fetch('http://localhost:3000/api/validateAnswer', {
      method: 'POST',
      body: JSON.stringify({
        userGuess: userGuess,
        hintUsed: hintUsed
      }),
      headers: {
        'Content-type': 'application/json'
      }
    })
    .then((response) => response.json())
    .then((data) => {
      getScore();
      setAnsweredCorrectly(data.answeredCorrectly);
    })

    // Reset the timer
    setTimer(timeLimit * 60);

    // Check if there are more questions to show or if the game has ended
    if (questionsLeft === 0) {
      // Fetch another random word
      setFeedback(`Game Over. Your final score: ${score}`);
      setGameEnded(true); // Set game as ended
      getScore();
      onGameEnd(score, numberOfProblems, answeredCorrectly);
    } else {
      getRandomWord();
      // End the game when there are no more questions
    }
  };

  const getScore = () => {
    fetch("http://localhost:3000/api/getScore")
    .then((response) => response.json())
    .then((data) => {
      setScore(data.score);
      setAnsweredCorrectly(data.answeredCorrectly);
    })
  }

  const handleHint = () => {
    if (!hintUsed) {
      // Use hint and reduce points for the current question
      setHintUsed(true);
    }
  };

  return (
    <div>
      {gameEnded && <Button onClick={handleGuess} color="warning">See Statistics</Button>}
    {!gameEnded &&  <div>
        <p>Unscramble the word:</p>
        <p>{scrambledWord}</p>
        <input
          type="text"
          placeholder="Your guess"
          value={userGuess}
          onChange={(e) => setUserGuess(e.target.value)}
        />
        <Button onClick={handleGuess} color="info">Guess</Button>

        {/* Render the hint button only if the hint hasn't been used */}
        {!hintUsed && <Button onClick={handleHint} color="light">Hint</Button>}

        {/* Display the hint if available */}
        {hintUsed && <p>First Letter: {hint}</p>}

        <p>Questions left: {questionsLeft}</p>
        <p>Time left: {Math.floor(timer / 60)}:{timer % 60}</p>
        <p>Your score: {score}</p>
      </div>}
    </div>
  );
};
export default WordGuessGame;
