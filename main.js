// select all needed elements
const lvlNameEl = document.querySelector("[data-game-level]");
const SecondsLeftOnWord = document.querySelector("[data-seconds-left]");
const levelSelect = document.querySelector("[data-levels-select]");
const startBtn = document.querySelector("[data-btn=startGame]");
const displayedWord = document.querySelector("[data-word-to-type]");
const userTextField = document.querySelector("[data-typing-field]");
const nextWordsContainer = document.querySelector("[data-next-words]");
const TimeLeft = document.querySelector("[data-time-left]");
const currentScore = document.querySelector("[data-current-score]");
const scoreGoal = document.querySelector("[data-score-goal]");
const finishMessage = document.querySelector("[data-finish-message]");

// Setting Levels
const lvls = {
  Easy: 5,
  Normal: 3,
  Hard: 2,
};

// random words that will reassing on each game start
let words;
function AssignWordsArr() {
  words = [
    "Hello",
    "Programming",
    "Code",
    "Javascript",
    "Town",
    "Country",
    "Testing",
    "Youtube",
    "Linkedin",
    "Twitter",
    "Github",
    "Leetcode",
    "Internet",
    "Python",
    "Scala",
    "Destructuring",
    "Paradigm",
    "Styling",
    "Cascade",
    "Documentation",
    "Coding",
    "Funny",
    "Working",
    "Dependencies",
    "Task",
    "Runner",
    "Roles",
    "Test",
    "Rust",
    "Playing",
  ];
}
AssignWordsArr();

function updateTimeAndScore(lvlName, secondsLeft) {
  lvlNameEl.textContent = lvlName;
  SecondsLeftOnWord.textContent = secondsLeft;
  TimeLeft.textContent = secondsLimit;
}

function getNextWords() {
  const nextWords = document.createDocumentFragment();
  for (let i = 0; i < words.length; i++) {
    const word = document.createElement("span");
    word.textContent = words[i];
    nextWords.append(word);
  }
  return nextWords;
}

function showInstructions() {
  displayedWord.textContent = "Words to type will show here";
  nextWordsContainer.innerHTML = "";
  nextWordsContainer.append(getNextWords());
}

function setcountDown(el) {
  return new Promise((resolve, reject) => {
    const count = setInterval(() => {
      el.textContent--;
      if (el.textContent <= 0) {
        clearInterval(count);
        resolve();
      }
    }, 1000);

    userTextField.onkeyup = ({ key }) => {
      if (key === "Enter") {
        clearInterval(count);
        userTextField.onkeyup = null;
        resolve();
      }
    };
  });
}

function generateAndDisplayWords() {
  // generate a random index
  const index = Math.floor(Math.random() * words.length);

  const currentWord = words.splice(index, 1)[0];

  const nextWords = getNextWords();
  // replace the content of next words with the new next words
  nextWordsContainer.innerHTML = "";
  displayedWord.innerHTML = "";

  nextWordsContainer.append(nextWords);
  displayedWord.append(currentWord);
}

function displayWinningMessage() {
  finishMessage.classList.add("good");
  finishMessage.textContent = "Congratulations you won!";
}

function displayLosingMessage() {
  finishMessage.classList.add("bad");
  finishMessage.textContent = "Game over you lost!";
}

async function startGame() {
  // wait before adding the count down so user navigating through key board
  // can press start btn without triggering the input enter event
  await new Promise((resolve) => {
    setTimeout(() => resolve(), 50);
  });

  let firstTime = true; // add 3 seconds to the time if it is the first word

  for (let i = 0, n = words.length; i < n; i++) {
    generateAndDisplayWords();

    if (firstTime) {
      TimeLeft.textContent = secondsLimit + 3;
      firstTime = false;
      await setcountDown(TimeLeft);
    } else {
      await setcountDown(TimeLeft);
    }

    TimeLeft.textContent = secondsLimit;
    const userInput = userTextField.value;
    userTextField.value = "";

    if (
      userInput.trim().toLowerCase() === displayedWord.textContent.toLowerCase()
    ) {
      currentScore.textContent++;
      if (words.length !== 0) {
        continue;
      }
      displayWinningMessage();
      break;
    } else {
      displayLosingMessage();
      break;
    }
  }
  // update the words array and activate the btn and select
  AssignWordsArr();
  showInstructions();
  startBtn.removeAttribute("disabled");
  levelSelect.removeAttribute("disabled");
}

// get the selected level and the timer seconds
let lvl = levelSelect.selectedOptions[0].value;
let secondsLimit = lvls[lvl];
updateTimeAndScore(lvl, secondsLimit);

// set max score and current score
scoreGoal.textContent = words.length;
currentScore.textContent = 0;

showInstructions();

// Disable user from copy pasting the word
userTextField.addEventListener("paste", (e) => e.preventDefault());

// update the header message whenEver user changes the difficulty
levelSelect.addEventListener("input", (e) => {
  lvl = e.target.selectedOptions[0].value;
  secondsLimit = lvls[lvl];

  updateTimeAndScore(lvl, secondsLimit);
});

startBtn.onclick = () => {
  finishMessage.textContent = "";
  finishMessage.classList.remove("good");
  finishMessage.classList.remove("bad");

  currentScore.textContent = 0;
  userTextField.value = "";
  // prevent starting the game again or changing the difficulty
  startBtn.setAttribute("disabled", "");
  levelSelect.setAttribute("disabled", "");
  // focus on the text field so user can type fast
  userTextField.focus();

  startGame();
};
