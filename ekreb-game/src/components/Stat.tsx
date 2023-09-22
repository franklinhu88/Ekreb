/* Stat component that is used to retreive game settings from the user */

import React, { useState } from "react";
import Button from "./Button";
import "./Stat.css";

interface Props {
  message: string;
  value: string;
  lowerRange: number;
  upperRange: number;
  onChange: (newValue: number) => void;
}

const Stat = ({ message, value, lowerRange, upperRange, onChange }: Props) => {
  const [number, setNumber] = useState(lowerRange);

  //Logic to subtract the number in the component
  const handleSubtract = () => {
    setNumber((prevNumber) => {
      let newNumber = prevNumber - 1;

      if (newNumber < lowerRange) {
        newNumber = upperRange;
      }

      onChange(newNumber);

      return newNumber;
    });
  };

  //Logic to add the number in the component
  const handleAdd = () => {
    setNumber((prevNumber) => {
      let newNumber = prevNumber + 1;

      if (newNumber > upperRange) {
        newNumber = lowerRange;
      }

      onChange(newNumber);

      return newNumber;
    });
  };

  return (
    <div className="stat-container">
      <p>{message}</p>
      <div className="incrementer-container">
        <Button onClick={handleSubtract} color="secondary">-</Button>
        <span>{number + " " + value}</span>
        <Button onClick={handleAdd} color="secondary">+</Button>
      </div>
    </div>
  );
};

export default Stat;
