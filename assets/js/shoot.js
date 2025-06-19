const space = document.querySelector(".space");
let shooter = document.querySelector(".shooter");

let info = document.querySelector(".info");
let again = document.querySelector(".again");

let moveBy = 6;
let bulletMover = 5;
const gunshot = new Audio("./assets/audio/gunshot.mp3");
const rockbreak = new Audio("./assets/audio/rockbreak.wav");
let lastShootTime = 0;

const keys = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  a: false,
  d: false,
  w: false,
  Enter: false,
};

window.addEventListener("load", () => {
  // Update initial positioning
  shooter.style.position = "absolute";
  shooter.style.bottom = "2vh";
  shooter.style.left = "1vw";
});

window.addEventListener("keydown", (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = true;
  }

  switch (e.key) {
    case "ArrowUp":
    case "w":
    case "Enter":
      const currentTime = Date.now();
      if (currentTime - lastShootTime < bulletCooldown) return; // use variable

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

      let moveBullet = setInterval(() => {
        let rocks = document.querySelectorAll(".rocks");

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
      break;
    default:
  }
});

window.addEventListener("keyup", (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = false;
  }
});

// Add a movement loop
function gameLoop() {
  let left = parseInt(
    window.getComputedStyle(shooter).getPropertyValue("left")
  );
  let maxWidth = window.innerWidth * 0.75;

  if ((keys.ArrowLeft || keys.a) && left > 2) {
    shooter.style.left = left - moveBy + "px";
  }
  if ((keys.ArrowRight || keys.d) && left < maxWidth - 80) {
    shooter.style.left = left + moveBy + "px";
  }

  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();

let makeRocks = setInterval(() => {
  // Adjust rock spawn positions
  let rock = document.createElement("div");
  rock.classList.add("rocks");
  let maxWidth = window.innerWidth * 0.75;
  rock.style.left = Math.floor(Math.random() * (maxWidth - 100)) + "px";
  space.appendChild(rock);
}, 1500);

let moveRocks = setInterval(() => {
  let rocks = document.querySelectorAll(".rocks");
  let gameOverPosition = window.innerHeight - 100;

  if (rocks != undefined) {
    for (let i = 0; i < rocks.length; i++) {
      let rock = rocks[i];
      let rockTop = parseInt(
        window.getComputedStyle(rock).getPropertyValue("top")
      );
      rock.style.top = rockTop + rockFallSpeed + "px"; // use variable

      if (rockTop >= gameOverPosition) {
        clearInterval(makeRocks);
        clearInterval(moveRocks);
        clearInterval(gameTimer);
        isGameOver = true;

        rocks.forEach((rock) => {
          rock.style.display = "none";
        });

        info.innerHTML = "GAME OVER";
        const againDiv = document.querySelector(".again");
        againDiv.innerHTML = "PLAY AGAIN";
      }
    }
  }
}, 300);

// Add these variables at the top with other constants
let rockFallSpeed = 20; // initial fall speed
let bulletCooldown = 500; // initial cooldown in ms
let gameStartTime = Date.now();
let gameTimer;
let isGameOver = false;

// Add this function to update timer
function updateTimer() {
  if (!isGameOver) {
    const timerElement = document.querySelector(".timer");
    const currentTime = Math.floor((Date.now() - gameStartTime) / 1000);
    timerElement.textContent = `Time: ${currentTime}s`;

    // Increase difficulty at 20s and 40s
    if (currentTime === 20) {
      rockFallSpeed = 30; // rocks fall faster
      bulletCooldown = 350; // can shoot faster
    } else if (currentTime === 40) {
      rockFallSpeed = 50; // rocks fall even faster
      bulletCooldown = 200; // can shoot even faster
    }
  }
}

// Start the timer
gameTimer = setInterval(updateTimer, 1000);

// Update the click handler
again.addEventListener("click", (e) => {
  if (isGameOver) {
    window.location.reload();
  }
});
