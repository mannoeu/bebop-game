var jet = document.querySelector("#jet");
var board = document.querySelector("#board");
var text = document.querySelector("#phrase");
var score = document.querySelector("#score > span");
var footer = document.querySelector("footer");
var image = document.querySelector("footer > img");
var audio = document.querySelector("audio#soundtrack");
var menu = document.querySelector("section#menu");
var startButton = menu.querySelector("button");

var OBSTACLE_DOWN_VELOCITY = 300;
var OBSTACLE_CREATE_VELOCITY = 1000;
const LOOPING_IMAGE = 1.2 * 60 * 1000;
const LOOPING_TEXT = 0.4 * 60 * 1000;

const getProperty = ({ element, property }) => {
  return parseInt(window.getComputedStyle(element).getPropertyValue(property));
};

const TEXTS = {
  spyke: [
    "i'm a bounty hunter",
    "come on jet let's hunt a bounty",
    "goodnight...julia...",
  ],
  faye: ["ann??", "I keep 80% and you 20%", "let's go boys"],
  jet: ["damn spyke!", "dinner is ready", "really?"],
};

const CONTROLLER = {
  jet: {
    move: (v) => {
      jet.style.left = v;
    },
  },
};

window.addEventListener("load", () => {
  setInterval(async () => {
    await audio.play();
  }, 500);
});

window.addEventListener("keydown", ({ key, keyCode }) => {
  var left = getProperty({
    element: jet,
    property: "left",
  });

  if ((key === "ArrowLeft" || key === "Left") && left > 0) {
    CONTROLLER.jet.move(left - 20 + "px");
  } else if ((key === "ArrowRight" || key === "Right") && left <= 460) {
    CONTROLLER.jet.move(left + 20 + "px");
  } else if (key === "ArrowUp" || key === "Up" || keyCode === 32) {
    let fireshot = document.createElement("div");
    fireshot.classList.add("fireshot");
    fireshot.style.left = left + 10 + "px";
    board.appendChild(fireshot);

    let fireshotPath = setInterval(() => {
      let rocks = document.querySelectorAll(".rocks");

      for (var i = 0; i < rocks.length; i++) {
        let rock = rocks[i];
        let rock_bound = rock.getBoundingClientRect();
        let fireshot_bound = fireshot.getBoundingClientRect();

        if (
          fireshot_bound.left >= rock_bound.left &&
          fireshot_bound.right <= rock_bound.right &&
          fireshot_bound.top <= rock_bound.top &&
          fireshot_bound.bottom <= rock_bound.bottom
        ) {
          rock.parentElement.removeChild(rock);
          fireshot.parentElement.removeChild(fireshot);
          score.innerHTML = parseInt(score.innerHTML) + 1;
        }
      }

      let fireshotBottom = getProperty({
        element: fireshot,
        property: "bottom",
      });

      fireshot.style.bottom = fireshotBottom + 30 + "px";
    }, 30);
  }
});

startButton.addEventListener("click", () => {
  start();
});

function updateCharacter() {
  let key = Array.from(footer.classList)[0];
  let actualTexts = TEXTS[String(key)];

  text.innerHTML = actualTexts[Math.floor(Math.random() * actualTexts.length)];
}

function start() {
  menu.parentElement.removeChild(menu);

  var generateObstacle = setInterval(() => {
    var rock = document.createElement("div");
    rock.classList.add("rocks");

    var rockLeft = getProperty({
      element: rock,
      property: "left",
    });

    rock.style.left = Math.floor(Math.random() * 450) + "px";
    board.appendChild(rock);
  }, OBSTACLE_CREATE_VELOCITY);

  var moveObstacles = setInterval(() => {
    let rocks = document.querySelectorAll(".rocks");
    if (rocks !== undefined) {
      for (var i = 0; i < rocks.length; i++) {
        let rock = rocks[i];

        let rockTop = getProperty({
          element: rock,
          property: "top",
        });

        if (rockTop > 430) {
          alert("Game Over!");
          clearInterval(generateObstacle);
          clearInterval(moveObstacles);
        }

        rock.style.top = rockTop + 20 + "px";
      }
    }
  }, OBSTACLE_DOWN_VELOCITY);

  var changePhrase = setInterval(() => {
    updateCharacter();
  }, LOOPING_TEXT);

  var changeCharacter = setInterval(() => {
    footer.classList = "";

    let position = Math.floor(Math.random() * Object.keys(TEXTS).length);
    let key = Object.keys(TEXTS).find((item, index) => index === position);

    image.src = "./assets/" + key + ".png";
    image.alt = key;
    footer.classList.add(key);

    clearInterval(changePhrase);
    updateCharacter();
    changePhrase = setInterval(() => {
      updateCharacter();
    }, LOOPING_TEXT);
  }, LOOPING_IMAGE);
}
