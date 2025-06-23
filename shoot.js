const space = document.querySelector(".space");
let shooter = document.querySelector(".shooter");

let info = document.querySelector(".info");
let again = document.querySelector(".again");

let moveBy = 6;
let bulletMover = 10;
const gunshot = new Audio("./assets/audio/gunshot.mp3");
gunshot.volume = 0.6;

const rockbreak = new Audio("./assets/audio/rockbreak.wav");
rockbreak.volume = 1.0;

const bgMusic = new Audio("./assets/audio/background.wav");
bgMusic.loop = true;
bgMusic.volume = 0.9;
let lastShootTime = 0;

let rockFallSpeed = 40;
let rockSpawnInterval = 1000;
let bulletCooldown = 500;
let gameStartTime = Date.now();
let gameTimer;
let isGameOver = false;
let scoreSaved = false;

const keys = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  a: false,
  d: false,
  w: false,
  Enter: false,
};

let bgStarted = false;

function isDesktopScreen() {
  return window.innerWidth > 1024 && window.innerHeight > 700;
}

function startBgMusicOnce() {
  if (!bgStarted && isDesktopScreen()) {
    bgStarted = true;
    bgMusic.play();
  }
}

window.addEventListener("resize", () => {
  if (!isDesktopScreen() && !bgMusic.paused) {
    bgMusic.pause();
    bgMusic.currentTime = 0;
    bgStarted = false;
  }
});

window.addEventListener("keydown", startBgMusicOnce, { once: true });
window.addEventListener("click", startBgMusicOnce, { once: true });
window.addEventListener("touchstart", startBgMusicOnce, { once: true });

window.addEventListener("DOMContentLoaded", () => {
  shooter.style.position = "absolute";
  shooter.style.bottom = "2vh";
  shooter.style.left = "1vw";

  updateInfoCursor();
});

function shootBullet() {
  const currentTime = Date.now();
  if (currentTime - lastShootTime < bulletCooldown) return;

  lastShootTime = currentTime;
  gunshot.currentTime = 0;
  gunshot.play();

  let bullet = document.createElement("img");
  bullet.src = "./assets/pics/bullet.png";
  bullet.classList.add("bullets");
  bullet.style.left =
    parseInt(shooter.style.left) + shooter.offsetWidth / 2 - 10 + "px";
  bullet.style.bottom = "100px";
  space.appendChild(bullet);

  let rocks = document.querySelectorAll(".rocks");

  let moveBullet = setInterval(() => {
    for (let i = 0; i < rocks.length; i++) {
      let rock = rocks[i];
      if (!rock.getBoundingClientRect) continue;

      let rockbound = rock.getBoundingClientRect();
      let bulletbound = bullet.getBoundingClientRect();

      if (
        bulletbound.left < rockbound.right &&
        bulletbound.right > rockbound.left &&
        bulletbound.top < rockbound.bottom &&
        bulletbound.bottom > rockbound.top
      ) {
        bullet.parentElement.removeChild(bullet);
        clearInterval(moveBullet);

        rockbreak.currentTime = 0;
        rockbreak.play();

        rock.classList.add("hit");
        setTimeout(() => {
          if (rock.parentElement) {
            rock.parentElement.removeChild(rock);
          }
        }, 300);

        let count = document.querySelector(".count");
        count.innerHTML = parseInt(count.innerHTML) + 1;
      }
    }

    let bulletbottom = parseInt(
      window.getComputedStyle(bullet).getPropertyValue("bottom")
    );

    if (bulletbottom >= window.innerHeight) {
      clearInterval(moveBullet);
      bullet.parentElement.removeChild(bullet);
    }

    bullet.style.bottom = bulletbottom + bulletMover + "px";
  }, 10);
}

window.addEventListener("keydown", (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = true;
  }

  switch (e.key) {
    case "ArrowUp":
    case "w":
    case "Enter":
      if (!isGameOver) shootBullet();
      break;
    default:
  }
});

// mouse click shooting
space.addEventListener("click", () => {
  if (!isGameOver) shootBullet();
});

window.addEventListener("keyup", (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = false;
  }
});

function gameLoop() {
  let left = parseInt(
    window.getComputedStyle(shooter).getPropertyValue("left")
  );
  let maxWidth = window.innerWidth * 0.75;

  if ((keys.ArrowLeft || keys.a) && left > 2 && !isGameOver) {
    shooter.style.left = left - moveBy + "px";
  }
  if ((keys.ArrowRight || keys.d) && left < maxWidth - 80 && !isGameOver) {
    shooter.style.left = left + moveBy + "px";
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();

let makeRocks = setInterval(() => {
  let rock = document.createElement("div");
  rock.classList.add("rocks");
  let maxWidth = window.innerWidth * 0.75;
  rock.style.left = Math.floor(Math.random() * (maxWidth - 100)) + "px";
  space.appendChild(rock);
}, rockSpawnInterval);

let moveRocks = setInterval(() => {
  let rocks = document.querySelectorAll(".rocks");
  let gameOverPosition = window.innerHeight - 100;

  if (rocks != undefined) {
    for (let i = 0; i < rocks.length; i++) {
      let rock = rocks[i];
      let rockTop = parseInt(
        window.getComputedStyle(rock).getPropertyValue("top")
      );
      rock.style.top = rockTop + rockFallSpeed + "px";

      if (rockTop >= gameOverPosition) {
        clearInterval(makeRocks);
        clearInterval(moveRocks);
        clearInterval(gameTimer);
        isGameOver = true;

        rocks.forEach((rock) => {
          rock.style.display = "none";
        });

        if (!scoreSaved) {
          const score = parseInt(document.querySelector(".count").innerHTML);
          const elapsed = Date.now() - gameStartTime;
          saveHighScore(score, elapsed);
          scoreSaved = true;
        }

        info.innerHTML = "GAME OVER";
        updateInfoCursor();
        const againDiv = document.querySelector(".again");
        againDiv.innerHTML = "PLAY AGAIN";
      }
    }
  }
}, 300);

function updateTimer() {
  if (!isGameOver) {
    const timerElement = document.querySelector(".timer");
    const elapsed = Date.now() - gameStartTime;
    const seconds = Math.floor(elapsed / 1000);
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    timerElement.textContent = `Time: ${min}:${sec
      .toString()
      .padStart(2, "0")}`;

    // Increasing difficulty at 20s, 40s, 1 min 30s, 2 mins and 3 mins
    if (seconds === 20) {
      rockFallSpeed = 60;
      rockSpawnInterval = 800;
      bulletCooldown = 450;
    } else if (seconds === 40) {
      rockFallSpeed = 80;
      rockSpawnInterval = 400;
      bulletCooldown = 350;
    } else if (seconds === 90) {
      rockFallSpeed = 100;
      rockSpawnInterval = 200;
      bulletCooldown = 300;
    } else if (seconds === 120) {
      rockFallSpeed = 140;
      rockSpawnInterval = 50;
      bulletCooldown = 250;
    } else if (seconds === 210) {
      rockFallSpeed = 145;
      rockSpawnInterval = 5;
    }
  }
}

gameTimer = setInterval(updateTimer, 1000);

again.addEventListener("click", (e) => {
  if (isGameOver && again.innerHTML.trim().toUpperCase() === "PLAY AGAIN") {
    window.location.reload();
  }
});

info.addEventListener("click", (e) => {
  if (!isGameOver && info.innerHTML.trim().toUpperCase() === "RESTART") {
    window.location.reload();
  }
});

function updateInfoCursor() {
  if (!isGameOver && info.innerHTML.trim().toUpperCase() === "RESTART") {
    info.style.cursor = "pointer";
  } else {
    info.style.cursor = "default";
    info.style.userSelect = "none";
  }
}

function saveHighScore(score, time) {
  let scores = JSON.parse(
    localStorage.getItem("spaceShooterHighScores") || "[]"
  );

  if (!scores.some((entry) => entry.score === score && entry.time === time)) {
    scores.push({ score, time });
  }
  // Sorting by score descending, and by time ascending (shorter time is better if scores are equal)
  scores.sort((a, b) => b.score - a.score || a.time - b.time);
  scores = scores.slice(0, 10); // Keeping only top 10
  localStorage.setItem("spaceShooterHighScores", JSON.stringify(scores));
}


const highscoresBtn = document.querySelector(".highscores-btn");
const highscoresPopup = document.querySelector(".highscores-popup");
const highscoresList = document.querySelector(".highscores-list");
const highscoresClose = document.querySelector(".highscores-content .close");

function showHighScores() {
  let scores = JSON.parse(
    localStorage.getItem("spaceShooterHighScores") || "[]"
  );
  highscoresList.innerHTML = "";
  if (scores.length === 0) {
    highscoresList.innerHTML =
      "<p style='text-align: center;'>No scores yet!</p>";
  } else {
    scores.forEach((entry, idx) => {
      // Showing time as m:ss
      const totalSeconds = Math.floor(entry.time / 1000);
      const min = Math.floor(totalSeconds / 60);
      const sec = (totalSeconds % 60).toString().padStart(2, "0");

      // Unique styling for 1st, 2nd and 3rd
      let medal = "";
      let cls = "";
      if (idx === 0) {
        medal = "🥇";
        cls = "first-place";
      } else if (idx === 1) {
        medal = "🥈";
        cls = "second-place";
      } else if (idx === 2) {
        medal = "🥉";
        cls = "third-place";
      }

      highscoresList.innerHTML += `<li class="${cls}">
        <span class="medal">${medal}</span>
        <strong>${entry.score}</strong> &mdash; ${min}:${sec}
      </li>`;
    });
  }
  highscoresPopup.style.display = "flex";
}
highscoresBtn.addEventListener("click", showHighScores);
highscoresClose.addEventListener("click", () => {
  highscoresPopup.style.display = "none";
});
highscoresPopup.addEventListener("click", (e) => {
  if (e.target === highscoresPopup) highscoresPopup.style.display = "none";
});
