/* Final game statistics page component */

import React from "react";
import Button from "./Button";

const StatisticsPage = ({ pointsEarned, totalQuestions, correctAnswers, onPlayAgain }) => {
  
  // Calculate the percentage and round it to two decimal places
  const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);

  return (
    <div className="statistics-page">
      <h2>Game Statistics</h2>
      <p>Points Earned: {pointsEarned}</p>
      <p>Total Questions Asked: {totalQuestions}</p>
      <p>Questions Answered Correctly: {correctAnswers}</p>
      <p>Percentage of questions answered correctly: {percentage}%</p>
      <Button onClick={onPlayAgain}>Play Again</Button>
    </div>
  );
};

export default StatisticsPage;
