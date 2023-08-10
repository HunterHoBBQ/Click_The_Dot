let score = 0;
let time = 60;
let timerInterval;
let appleInterval;
const scores = [];

function displayScoreAndTime() {
  document.getElementById("score-container").innerHTML = "Score: " + score;
  document.getElementById("timer-container").innerHTML = "Time: " + time + " sec";
}

function generateRandomPosition() {
  const gameContainer = document.getElementById("game-container");
  const gameContainerRect = gameContainer.getBoundingClientRect();
  const randomX = Math.floor(Math.random() * (gameContainerRect.width - 50));
  const randomY = Math.floor(Math.random() * (gameContainerRect.height - 50));
  return { x: randomX, y: randomY };
}

function createApple() {
  const apple = document.createElement("div");
  apple.classList.add("apple");
  const randomPosition = generateRandomPosition();
  apple.style.left = randomPosition.x + "px";
  apple.style.top = randomPosition.y + "px";
  document.getElementById("game-container").appendChild(apple);
  setTimeout(() => {
    apple.classList.add("fade-out");
    setTimeout(() => {
      apple.remove();
    }, 500);
  }, 5000);
  apple.addEventListener("click", () => {
    apple.remove();
    updateScore();
    apple.classList.add("collect");
  });
}

function updateScore() {
  score++;
  document.getElementById("score-container").innerHTML = "Score: " + score;
}

function startGame() {
  score = 0;
  time = 60;
  displayScoreAndTime();
  document.getElementById("play-now-button").style.display = "none";
  timerInterval = setInterval(() => {
    time--;
    displayScoreAndTime();
    if (time === 0) {
      stopGame();
    }
  }, 1000);
  appleInterval = setInterval(() => {
    createApple();
  }, 1000);
}

function stopGame() {
  clearInterval(timerInterval);
  clearInterval(appleInterval);
  document.querySelectorAll(".apple").forEach((apple) => {
    apple.remove();
  });

  document.getElementById("play-now-button").style.display = "block";

  const leaderboard = document.createElement("div");
  leaderboard.classList.add("leaderboard");

  const leaderboardTitle = document.createElement("h2");
  leaderboardTitle.innerHTML = "Leaderboard";
  leaderboard.appendChild(leaderboardTitle);

  const leaderboardList = document.createElement("ol");
  let scores = JSON.parse(localStorage.getItem("scores")) || [];

  scores.push(score);
  scores.sort((a, b) => b - a);
  scores.splice(5);

  localStorage.setItem("scores", JSON.stringify(scores));

  for (let i = 0; i < 5; i++) {
    const leaderboardItem = document.createElement("li");
    if (scores[i]) {
      leaderboardItem.innerHTML = "Score #" + (i + 1) + ": " + scores[i];
    } else {
      leaderboardItem.innerHTML = "No score yet";
    }
    leaderboardList.appendChild(leaderboardItem);
  }

  leaderboard.appendChild(leaderboardList);

  const gameContainer = document.getElementById("game-container");
  const existingLeaderboard = gameContainer.querySelector(".leaderboard");

  if (existingLeaderboard) {
    gameContainer.replaceChild(leaderboard, existingLeaderboard);
  } else {
    gameContainer.appendChild(leaderboard);
  }
}

document.getElementById("play-now-button").addEventListener("click", startGame);
