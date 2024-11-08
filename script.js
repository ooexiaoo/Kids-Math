// Game variables
let level = 1;
let score = 0;
let lives = 3;
let correctAnswer;

// Sound effects
const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");

// DOM elements
const levelElement = document.getElementById("level");
const scoreElement = document.getElementById("score");
const livesElement = document.querySelector(".lives");
const questionElement = document.getElementById("question");
const optionsContainer = document.getElementById("options-container");
const gameOverElement = document.getElementById("game-over");

// Function to generate a random question with increasing difficulty
function generateQuestion() {
  if (lives <= 0) return;

  const numRange = level * 10; // Increase number range with level
  const num1 = Math.floor(Math.random() * numRange) + 1;
  const num2 = Math.floor(Math.random() * numRange) + 1;

  let operator;
  let num3;

  // Change operators and complexity based on level
  if (level < 3) {
    // Levels 1-2: Basic addition and subtraction
    operator = ["+", "-"][Math.floor(Math.random() * 2)];
    correctAnswer = eval(`${num1} ${operator} ${num2}`);
    questionElement.textContent = `What is ${num1} ${operator} ${num2}?`;
  } else if (level < 6) {
    // Levels 3-5: Addition, subtraction, multiplication
    operator = ["+", "-", "*"][Math.floor(Math.random() * 3)];
    correctAnswer = eval(`${num1} ${operator} ${num2}`);
    questionElement.textContent = `What is ${num1} ${operator} ${num2}?`;
  } else {
    // Levels 6+: Addition, subtraction, multiplication, division, and 3 terms
    operator = ["+", "-", "*", "/"][Math.floor(Math.random() * 4)];
    num3 = Math.floor(Math.random() * numRange) + 1;
    correctAnswer = eval(`${num1} ${operator} ${num2} ${operator === '/' ? '+' : operator} ${num3}`);
    questionElement.textContent = `What is ${num1} ${operator} ${num2} ${operator === '/' ? '+' : operator} ${num3}?`;

    // Adjust for integer answer when using division
    if (operator === "/") {
      correctAnswer = Math.floor(correctAnswer);
    }
  }

  generateOptions();
}

// Function to generate multiple-choice options without duplicates
function generateOptions() {
    optionsContainer.innerHTML = "";
    const options = new Set();
    
    // Add the correct answer first
    options.add(correctAnswer);
    
    // Generate unique, reasonably close incorrect answers
    while (options.size < 4) {
      const variation = Math.floor(Math.random() * 10) - 5; // Range of -5 to +5
      const optionValue = correctAnswer + variation;
      
      // Avoid adding the correct answer as a variation and prevent negative options
      if (optionValue !== correctAnswer && optionValue > 0) {
        options.add(optionValue);
      }
    }
  
    // Convert the Set to an array and shuffle it
    const optionArray = Array.from(options);
    optionArray.sort(() => Math.random() - 0.5); // Simple shuffle
  
    // Render options as buttons
    optionArray.forEach(optionValue => {
      const option = document.createElement("button");
      option.textContent = optionValue;
      option.addEventListener("click", () => checkAnswer(parseInt(option.textContent)));
      optionsContainer.appendChild(option);
    });
  }
  

// Function to check if the selected answer is correct
function checkAnswer(selectedAnswer) {
  if (selectedAnswer === correctAnswer) {
    score += 10;
    correctSound.play();
    if (score % 50 === 0) {
      level++;
    }
  } else {
    lives--;
    updateLives();
    wrongSound.play();

    if (lives <= 0) {
      gameOver();
      return;
    }
  }
  updateScore();
  generateQuestion();
}

// Function to update score, level, and lives in the UI
function updateScore() {
  scoreElement.textContent = score;
  levelElement.textContent = level;
}

// Function to update lives as hearts in the UI
function updateLives() {
  livesElement.innerHTML = "❤️".repeat(lives);
}

// Function to handle game over
function gameOver() {
  questionElement.textContent = "Game Over!";
  optionsContainer.innerHTML = "";
  gameOverElement.classList.remove("hidden");
}

// Function to restart the game
function restartGame() {
  level = 1;
  score = 0;
  lives = 3;
  updateScore();
  updateLives();
  gameOverElement.classList.add("hidden");
  generateQuestion();
}

// Initialize the game
generateQuestion();
updateScore();
updateLives();
