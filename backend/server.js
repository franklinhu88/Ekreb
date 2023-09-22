const express = require("express");
const cors = require("cors");
const fs = require("fs");
const http = require('http')
const { response } = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser")

app.use(cors());
app.use(bodyParser.json());

// Generate a random scrambled word
function scrambleWord(word) {
  let scrambledWord = word.split("").sort(() => Math.random() - 0.5).join("");
  while (scrambledWord === word){
    scrambledWord = word.split("").sort(() => Math.random() - 0.5).join("");
  }
  return scrambledWord;
}

let score = 0;
let answeredCorrectly = 0;
let originalWord = '';

// Generates a random word and sends it to the front end
app.get('/api/getRandomWord/:wordLength', (req, res) => {
  try {
    const wordLength = req.params.wordLength;
    const apiUrl = `http://random-word-api.herokuapp.com/word?length=${wordLength}`;

    const request = http.get(apiUrl, (response) => {
      let data = '';
      let currOriginalWord = '';
      let scrambledWord = '';
      
      response.on('data', (chunk) => {
        data += chunk;
        currOriginalWord = data.substring(2, data.length - 2);
        scrambledWord = scrambleWord(currOriginalWord);
        originalWord = currOriginalWord;
        const hint = originalWord[0]; // Gets first letter of the original word as a hint
        res.json({ scrambledWord: scrambledWord, hint: hint });
      });
    });

    request.on('error', (error) => {
      console.error('Error while fetching random word:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to validate the user's answer
app.post('/api/validateAnswer', (req, res) => {
  try {
    const userGuess = req.body.userGuess;
    const hintUsed = req.body.hintUsed;
    if (userGuess.toLowerCase() === originalWord.toLowerCase()) {
      // User's guess is correct
      answeredCorrectly += 1;
      if (hintUsed) {
        score += 0.5;
      } else {
        score += 1;
      }
      res.json({ result: "You're correct!" });
    } else {
      // User's guess is incorrect
      res.json({ result: 'You suck!' });
    }
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Gets the score and how many questions the user has answered correctly
app.get('/api/getScore', (req, res) => {
  try {
    res.json({ score: score, answeredCorrectly: answeredCorrectly });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Resets the game state
app.put('/api/resetGame', (req, res) => {
  try {
    score = 0;
    answeredCorrectly = 0;
    originalWord = '';
    res.sendStatus(200);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
