import playership, { player, drawPlayer } from './player';
import enemy, { initEnemy, drawEnemy } from './enemy';
import asteroid, { drawAsteroid } from './asteroid';
import explosion, { createExplosion } from './explosion';
import powerup, { drawPowerup } from './powerup';
import {
  playerIsCollidingToPowerup,
  playerIsCollidingToShot,
  enemyIsCollidingToShot,
  enemyIsCollidingToPlayer,
  asteroidIsCollidingToPlayer,
  asteroidIsCollidingToShot,
} from './collisions';

import { MAX_ASTEROIDS, setCanvasSize, repeatTimes, distance } from './commons';

import { createGameState } from './gamestate';

const gameState = createGameState();
console.log(gameState);

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let gameOn = true;

const FPS = 50;

let score = 0;

let asteroids = [];
let enemies = [];
let shots = [];
let enemyshots = [];
let explosions = [];
let thrusterFlames = [];
let powerups = [];

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

const checkValidAsteroidStartingPositions = (asteroids) =>
  asteroids.forEach((roid) => {
    if (distance(roid.x, roid.y, player.x, player.y) < 200)
      asteroid.resetStartingPosition(roid);
  });

const resetGame = () => {
  ctx.fontStyle = 'Arial 30px';
  ctx.fillText('GAME OVER', canvas.width / 2 - 60, canvas.height / 2);
  setTimeout(() => {}, 3000);
  asteroids = [];
  shots = [];
  enemies = [];
  enemyshots = [];
  powerups = [];
  player.speed = { x: 0, y: 0 };
  score = 0;
  createAsteroids();
  playership.initPlayer();

  // FOR DEBUGGING
  player.powerup = 'shotgun';
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
      resetGame();
      createHugeExplosion(player.x, player.y, 2);
    }
  });

const checkEnemyCollisions = () =>
  gameState.getEnemies().forEach((enemy) => {
    checkIsEnemyCollidingToPlayer(enemy, player);
    shots.forEach((shot) => {
      checkIsEnemyCollidingToShot(enemy, shot, true);
    });
    enemyshots.forEach((shot) => {
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
  if (enemyIsCollidingToShot(enemy, shot) && shot.timer > 5) {
    enemy.hit = true;
    shot.hit = true;
    if (playershot) score += 1000;

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

    if (playershot) score += 50;
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

  if (player.speeding) {
    increasePlayerSpeed(player);
    createThrusterFlames(player);
  }

  movePlayer(player);
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

  draw();
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

const increasePlayerSpeed = (player) => {
  player.speed.x += (player.SPEED * Math.cos(player.a)) / FPS;
  player.speed.y -= (player.SPEED * Math.sin(player.a)) / FPS;
};

const movePlayer = (player) => {
  player.x += player.speed.x;
  player.y += player.speed.y;

  if (player.x > canvas.width + 20) player.x = -20;
  if (player.y > canvas.height + 20) player.y = -20;
  if (player.x < -20) player.x = canvas.width + 20;
  if (player.y < -20) player.y = canvas.height + 20;
};

const moveEnemy = (nemesis) => {
  enemy.trackPlayer(nemesis);
  enemy.move(nemesis);
};

const maybeShootAtPlayer = (nemesis) => {
  if (Math.random() < 0.05) enemyshots.push(enemy.shoot(nemesis));
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
    thrusterFlames.push(explosion.createExplosion(object.x, object.y, 0.3));
  });
};

const draw = () => {
  drawBackground(ctx);

  gameState.getExplosions().forEach((explode) => {
    explosion.drawExplosion(explode, ctx, 20);
  });

  gameState.getThrusterFlames().forEach((flame) => {
    explosion.drawExplosion(flame, ctx, 4);
  });

  gameState.getPowerUps().forEach((power) => {
    drawPowerup(power);
  });

  if (!gameOn) return;

  gameState.getAsteroids().forEach((roid) => {
    drawAsteroid(roid, ctx);
  });

  gameState.getEnemies().forEach((nemesis) => {
    drawEnemy(nemesis, ctx);
  });

  drawPlayer(player, ctx);

  gameState.getPlayerShots().forEach((shot) => {
    drawShot(shot, true);
  });
  gameState.getEnemyShots().forEach((shot) => {
    drawShot(shot);
  });

  drawScore(score);
};

const drawBackground = (ctx) => {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const drawShot = (shot, playershot) => {
  ctx.fillStyle = playershot ? 'yellow' : 'red';
  ctx.fillRect(shot.x, shot.y, 5, 5);
};

const drawScore = (score) => {
  ctx.fillStyle = 'white';
  ctx.font = '16px Arial';
  ctx.fillText(`SCORE ${score}`, 30, 30);
};

const addResizeListener = () =>
  window.addEventListener('resize', setWindowSize);

const addKeyboardListener = () => {
  window.addEventListener('keydown', (e) => {
    switch (e.keyCode) {
      case 38:
        player.speeding = true;
        break;
      case 37:
        player.rotation += ((player.TURNSPEED / 180) * Math.PI) / FPS;
        break;
      case 39:
        player.rotation += ((-player.TURNSPEED / 180) * Math.PI) / FPS;
        break;
      case 32:
        gameState.addPlayerShot();
        break;
      case 8:
        if (!gameOn) {
          gameOn = true;
          score = 0;
          createAsteroids();
          playership.initPlayer();
        }
        break;
    }
  });
  window.addEventListener('keyup', (e) => {
    switch (e.keyCode) {
      case 38:
        player.speeding = false;
        break;
      case 37:
        player.rotation = 0;
        break;
      case 39:
        player.rotation = 0;
        break;
    }
  });
};

const main = () => {
  setWindowSize();
  addResizeListener();
  addKeyboardListener();
  createAsteroids();
  playership.initPlayer();
  setInterval(update, 1000 / gameState.getFPS());
};

main();
