import enemy, { initEnemy, drawEnemy } from "./enemy";
import asteroid, { drawAsteroid } from "./asteroid";
import explosion, { createExplosion } from "./explosion";
import powerup, { drawPowerup } from "./powerup";
import { draw } from "./draw";
import {
  playerIsCollidingToPowerup,
  playerIsCollidingToShot,
  enemyIsCollidingToShot,
  enemyIsCollidingToPlayer,
  asteroidIsCollidingToPlayer,
  asteroidIsCollidingToShot,
} from "./collisions";

import { MAX_ASTEROIDS, setCanvasSize, repeatTimes, distance } from "./commons";

import { createGameState } from "./gamestate";

const gameState = createGameState();
console.log(gameState);

const canvas = document.getElementById("canvas");

const player = gameState.getPlayer();
let gameOn = true;

const FPS = 50;

const setWindowSize = () => {
  canvas.width = window.innerWidth - 20;
  canvas.height = window.innerHeight - 20;
  setCanvasSize(window.innerWidth - 20, window.innerHeight - 20);
};

const createAsteroids = () => {
  const asteroidsNumber = 2 + Math.random() * MAX_ASTEROIDS - 2;
  repeatTimes(asteroidsNumber, () => gameState.addAsteroid());
  checkValidAsteroidStartingPositions(gameState.getAsteroids());
};

const checkValidAsteroidStartingPositions = (asteroids) => {
  const playerPosition = player.getPosition();
  asteroids.forEach((roid) => {
    if (distance(roid.x, roid.y, playerPosition.x, playerPosition.y) < 200)
      asteroid.resetStartingPosition(roid);
  });
};

const checkCollisions = () => {
  checkPowerupCollisions();
  checkEnemyShotCollisions();
  checkEnemyCollisions();
  checkAsteroidCollisions();
};

const checkPowerupCollisions = () =>
  gameState.getPowerUps().forEach((powerup) => {
    if (playerIsCollidingToPowerup(powerup)) powerup.collected = true;
  });

const checkEnemyShotCollisions = () =>
  gameState.getEnemyShots().forEach((shot) => {
    if (playerIsCollidingToShot(player, shot)) {
      const playerPosition = player.getPosition();
      gameState.reset();
      gameState.addExplosion(playerPosition.x, playerPosition.y);
    }
  });

const checkEnemyCollisions = () =>
  gameState.getEnemies().forEach((enemy) => {
    checkIsEnemyCollidingToPlayer(enemy, player);
    gameState.getPlayerShots().forEach((shot) => {
      checkIsEnemyCollidingToShot(enemy, shot, true);
    });
    gameState.getEnemyShots().forEach((shot) => {
      checkIsEnemyCollidingToShot(enemy, shot);
    });
  });

const checkAsteroidCollisions = () =>
  gameState.getAsteroids().forEach((roid) => {
    checkIsPlayerCollidingToAsteroid(roid);

    gameState.getPlayerShots().forEach((shot) => {
      checkIsShotCollidingToAsteroid(shot, roid, true);
    });
    gameState.getEnemyShots().forEach((shot) => {
      checkIsShotCollidingToAsteroid(shot, roid);
    });
  });

const checkIsEnemyCollidingToShot = (enemy, shot, playershot) => {
  if (enemyIsCollidingToShot(enemy, shot) && shot.timer > 10) {
    enemy.hit = true;
    shot.hit = true;
    if (playershot) gameState.addScore(1000);

    gameState.addExplosion(enemy.x, enemy.y);
  }
};

const checkIsEnemyCollidingToPlayer = (enemy, player) => {
  if (enemyIsCollidingToPlayer(enemy, player)) {
    gameState.reset();
    gameState.addExplosion(player.x, player.y, 1.5);
  }
};

const checkIsPlayerCollidingToAsteroid = (roid) => {
  if (asteroidIsCollidingToPlayer(roid, player)) {
    gameState.reset();
    gameState.addExplosion(roid.x, roid.y, 1.5);
  }
};

const checkIsShotCollidingToAsteroid = (shot, roid, playershot) => {
  if (asteroidIsCollidingToShot(roid, shot)) {
    destroyAsteroid(roid);
    shot.hit = true;

    if (playershot) gameState.addScore(100);
  }
};

const destroyAsteroid = (roid) => {
  if (roid.radius > 2 && !roid.hit) {
    const numOfNewAsteroids = Math.round(Math.random() * 4);

    repeatTimes(numOfNewAsteroids, () =>
      gameState.addAsteroid(roid.x, roid.y, roid.radius - 1, Math.random() * 70)
    );
  }

  roid.hit = true;
  gameState.addExplosion(roid.x, roid.y);
};

const createHugeExplosion = (x, y, maxRadius) => {
  const numberOfSmallerExplosions = Math.round(Math.random() * 50);
  repeatTimes(numberOfSmallerExplosions, () => {
    const explosionSize = Math.random() * maxRadius;
    explosions.push(createExplosion(x, y, explosionSize));
  });
};

const update = () => {
  if (!gameOn) return;

  checkCollisions();

  gameState.removeHitObjects();

  maybeCreateRandomAsteroid();
  maybeCreateRandomEnemy();

  if (player.isSpeeding()) {
    player.accelerate();

    createThrusterFlames(player);
  }

  player.move();
  player.setAngle();
  moveAsteroids(gameState.getAsteroids());
  setPlayerAngle(player);

  gameState.getEnemies().forEach((nemesis) => {
    moveEnemy(nemesis);
    maybeShootAtPlayer(nemesis);
  });

  gameState.getPlayerShots().forEach((shot) => {
    moveShot(shot);
    increaseTimer(shot);
  });
  gameState.getEnemyShots().forEach((shot) => {
    moveShot(shot);
    increaseTimer(shot);
  });

  gameState.getThrusterFlames().forEach((flame) => {
    explosion.moveExplosion(flame);
    increaseTimer(flame);
  });

  increaseExplosionTimers(gameState.getExplosions());

  draw(gameState);
};

const maybeCreateRandomAsteroid = () => {
  if (Math.random() < 0.01) {
    gameState.addAsteroid();
  }
};

const maybeCreateRandomEnemy = () => {
  if (Math.random() < 0.003) {
    gameState.addEnemy();
  }
};

const moveEnemy = (nemesis) => {
  enemy.trackPlayer(nemesis, gameState);
  enemy.move(nemesis);
};

const maybeShootAtPlayer = (nemesis) => {
  if (Math.random() < 0.05) gameState.addEnemyShot(nemesis);
};

const setPlayerAngle = (player) => (player.a += player.rotation);

const increaseExplosionTimers = (explosions) =>
  explosions.forEach((explosion) => increaseTimer(explosion));

const increaseTimer = (object) => object.timer++;

const moveAsteroids = (asteroids) =>
  asteroids.forEach((roid) => asteroid.moveAsteroid(roid));

const moveShot = (shot) => {
  shot.x += (shot.speed * Math.cos(shot.direction)) / FPS;
  shot.y -= (shot.speed * Math.sin(shot.direction)) / FPS;

  if (shot.x > canvas.width + 5) shot.x = -5;
  if (shot.y > canvas.height + 5) shot.y = -5;
  if (shot.x < -5) shot.x = canvas.width + 5;
  if (shot.y < -5) shot.y = canvas.height + 5;
};

const createThrusterFlames = (object) => {
  const random = Math.random() * 8;
  repeatTimes(random, () => {
    gameState.addThrusterFlame(object.x, object.y);
  });
};

const addResizeListener = () =>
  window.addEventListener("resize", setWindowSize);

const addKeyboardListener = () => {
  window.addEventListener("keydown", (e) => {
    switch (e.keyCode) {
      case 38:
        player.setSpeeding(true);
        break;
      case 37:
        player.turnLeft();
        break;
      case 39:
        player.turnRight();
        break;
      case 32:
        gameState.addPlayerShot();
        break;
      case 8:
        if (!gameOn) {
          gameOn = true;
          score = 0;
          createAsteroids();
          player.init();
        }
        break;
    }
  });
  window.addEventListener("keyup", (e) => {
    switch (e.keyCode) {
      case 38:
        player.setSpeeding(false);
        break;
      case 37:
        player.stopTurning();
        break;
      case 39:
        player.stopTurning();
        break;
    }
  });
};

const main = () => {
  setWindowSize();
  addResizeListener();
  addKeyboardListener();
  createAsteroids();
  player.init();
  setInterval(update, 1000 / gameState.getFPS());
};

main();
