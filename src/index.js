import playership, { player } from './player';
import enemy from './enemy';
import asteroid from './asteroid';
import explosion from './explosion';
import powerup from './powerup';

import {
  MAX_ASTEROIDS,
  RADIUS_MULTIPLIER,
  setCanvasSize,
  repeatTimes,
  distance,
} from './commons';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let gameOn = true;

const FPS = 40;

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

  repeatTimes(asteroidsNumber, () => asteroids.push(asteroid.initAsteroid()));

  checkValidAsteroidStartingPositions(asteroids);
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
// NOTE TO SELF: refactor this!
const checkCollisions = () => {
  checkPowerupCollisions();
  checkEnemyShotCollisions();
  checkEnemyCollisions();
  checkAsteroidCollisions();
};

const checkPowerupCollisions = () =>
  powerups.forEach((power) => {
    if (distance(player.x, player.y, power.x, power.y) < 30)
      powerup.collected = true;
  });

const checkEnemyShotCollisions = () =>
  enemyshots.forEach((shot) => {
    if (distance(player.x, player.y, shot.x, shot.y) < 10) {
      resetGame();
      createHugeExplosion(player.x, player.y, 2);
    }
  });

const checkEnemyCollisions = () =>
  enemies.forEach((enemy) => {
    if (enemyIsCollidingToPlayer(enemy, player)) {
      resetGame();
      createHugeExplosion(roid.x, roid.y, 1.5);
      //gameOn = false
    }
    shots.forEach((shot) => {
      if (enemyIsCollidingToShot(enemy, shot) && shot.timer > 5) {
        enemy.hit = true;
        shot.hit = true;
        score += 1000;

        createHugeExplosion(enemy.x, enemy.y, 2);
      }
    });
    enemyshots.forEach((shot) => {
      if (enemyIsCollidingToShot(enemy, shot) && shot.timer > 5) {
        enemy.hit = true;
        shot.hit = true;
        createHugeExplosion(enemy.x, enemy.y, 1.5);
      }
    });
  });

const checkAsteroidCollisions = () =>
  asteroids.forEach((roid) => {
    if (asteroidIsCollidingToPlayer(roid, player)) {
      resetGame();
      createHugeExplosion(roid.x, roid.y, 1.5);
      //gameOn = false
    }

    shots.forEach((shot) => {
      if (asteroidIsCollidingToShot(roid, shot)) {
        if (roid.radius > 2 && !roid.hit) {
          asteroids.push(
            asteroid.initAsteroid(
              roid.x,
              roid.y,
              roid.radius - 1,
              Math.random() * 70
            )
          );
          asteroids.push(
            asteroid.initAsteroid(
              roid.x,
              roid.y,
              roid.radius - 1,
              120 + Math.random() * 70
            )
          );
        }
        roid.hit = true;
        shot.hit = true;

        score += 50;
        createHugeExplosion(roid.x, roid.y, 2);
      }
    });
    enemyshots.forEach((shot) => {
      if (asteroidIsCollidingToShot(roid, shot)) {
        if (roid.radius > 2 && !roid.hit) {
          asteroids.push(
            asteroid.initAsteroid(
              roid.x,
              roid.y,
              roid.radius - 1,
              Math.random() * 70
            )
          );
          asteroids.push(
            asteroid.initAsteroid(
              roid.x,
              roid.y,
              roid.radius - 1,
              120 + Math.random() * 70
            )
          );
        }
        roid.hit = true;
        shot.hit = true;

        createHugeExplosion(roid.x, roid.y, 2);
      }
    });
  });

const enemyIsCollidingToShot = (enemy, shot) => {
  if (
    distance(shot.x, shot.y, enemy.x, enemy.y) <
    enemy.radius * RADIUS_MULTIPLIER
  ) {
    return true;
  }
  return false;
};

const enemyIsCollidingToPlayer = (enemy, player) => {
  if (
    distance(player.x, player.y, enemy.x, enemy.y) <
    enemy.radius * RADIUS_MULTIPLIER
  ) {
    return true;
  }
  return false;
};

const asteroidIsCollidingToAsteroid = (asteroid0, asteroid1) => {
  if (
    distance(asteroid0.x, asteroid0.y, asteroid1.x, asteroid1.y) <
    asteroid0.radius * 10
  ) {
    return true;
  }
  return false;
};

const asteroidIsCollidingToShot = (asteroid, shot) => {
  if (distance(shot.x, shot.y, asteroid.x, asteroid.y) < asteroid.radius * 10) {
    return true;
  }
  return false;
};

const asteroidIsCollidingToPlayer = (asteroid, player) => {
  if (
    distance(asteroid.x, asteroid.y, player.x, player.y) <
    asteroid.radius * 10
  ) {
    return true;
  }
  return false;
};

const createHugeExplosion = (x, y, maxRadius) => {
  const numberOfSmallerExplosions = Math.round(Math.random() * 50);
  repeatTimes(numberOfSmallerExplosions, () => {
    const explosionSize = Math.random() * maxRadius;
    explosions.push(explosion.createExplosion(x, y, explosionSize));
  });
};

const removeHitObjects = () => {
  const filteredasteroids = asteroids.filter((asteroid) => !asteroid.hit);
  const filteredshots = shots
    .filter((shot) => !shot.hit)
    .filter((shot) => shot.timer < 70);
  const filteredexplosions = explosions.filter(
    (explosion) => explosion.timer < 30
  );
  const filteredFlames = thrusterFlames.filter((flame) => flame.timer < 30);
  const filteredEnemies = enemies.filter((enemy) => !enemy.hit);
  const filteredEnemyShots = enemyshots
    .filter((shot) => !shot.hit)
    .filter((shot) => shot.timer < 50);
  const filteredPowers = powerups.filter((power) => power.collected);

  powerups = filteredPowers;
  asteroids = filteredasteroids;
  shots = filteredshots;
  enemies = filteredEnemies;
  enemyshots = filteredEnemyShots;
  explosions = filteredexplosions;
  thrusterFlames = filteredFlames;
};

// NOTE TO SELF: refactor this!
const update = () => {
  if (!gameOn) return;

  checkCollisions();
  removeHitObjects();

  if (Math.random() < 0.01) {
    const newAsteroid = asteroid.initAsteroid();
    if (distance(newAsteroid.x, newAsteroid.y, player.x, player.y) < 150)
      asteroid.resetStartingPosition(newAsteroid);

    asteroids.push(newAsteroid);
  }

  if (Math.random() < 0.003) {
    enemies.push(enemy.init());
  }

  if (player.speeding) {
    player.speed.x += (player.SPEED * Math.cos(player.a)) / FPS;
    player.speed.y -= (player.SPEED * Math.sin(player.a)) / FPS;
    const random = Math.random() * 8;

    for (let i = 0; i < random; i++) {
      thrusterFlames.push(explosion.createExplosion(player.x, player.y, 0.3));
    }
  }

  player.x += player.speed.x;
  player.y += player.speed.y;

  if (player.x > canvas.width + 20) player.x = -20;
  if (player.y > canvas.height + 20) player.y = -20;
  if (player.x < -20) player.x = canvas.width + 20;
  if (player.y < -20) player.y = canvas.height + 20;

  player.a += player.rotation;

  explosions.forEach((explosion) => explosion.timer++);
  asteroids.forEach((roid) => asteroid.moveAsteroid(roid));

  enemies.forEach((nemesis) => {
    enemy.trackPlayer(nemesis);
    enemy.move(nemesis);
    if (Math.random() < 0.05) enemyshots.push(enemy.shoot(nemesis));
  });

  shots.forEach((shot) => {
    shot.x += (shot.speed * Math.cos(shot.direction)) / FPS;
    shot.y -= (shot.speed * Math.sin(shot.direction)) / FPS;

    if (shot.x > canvas.width + 5) shot.x = -5;
    if (shot.y > canvas.height + 5) shot.y = -5;
    if (shot.x < -5) shot.x = canvas.width + 5;
    if (shot.y < -5) shot.y = canvas.height + 5;

    shot.timer++;
  });
  enemyshots.forEach((shot) => {
    shot.x += (shot.speed * Math.cos(shot.direction)) / FPS;
    shot.y -= (shot.speed * Math.sin(shot.direction)) / FPS;

    if (shot.x > canvas.width + 5) shot.x = -5;
    if (shot.y > canvas.height + 5) shot.y = -5;
    if (shot.x < -5) shot.x = canvas.width + 5;
    if (shot.y < -5) shot.y = canvas.height + 5;

    shot.timer++;
  });

  thrusterFlames.forEach((flame) => {
    explosion.moveExplosion(flame);
    flame.timer++;
  });

  draw();
};

// NOTE TO SELF: refactor this!
const draw = () => {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  explosions.forEach((explode) => {
    explosion.drawExplosion(explode, ctx, 20);
  });

  thrusterFlames.forEach((flame) => {
    explosion.drawExplosion(flame, ctx, 4);
  });

  powerups.forEach((power) => {
    ctx.strokeStyle = '#0000ff';
    ctx.fillStyle = '#0000ff';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(power.x, power.y, 40, 0, 2 * Math.PI);
    ctx.stroke();
  });

  if (!gameOn) return;

  asteroids.forEach((roid) => {
    asteroid.drawAsteroid(roid, ctx);
  });
  enemies.forEach((nemesis) => {
    enemy.draw(nemesis, ctx);
  });

  //player
  ctx.strokeStyle = 'white';
  ctx.fillStyle = 'white';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(
    // nose of the player
    player.x + (7 / 3) * player.r * Math.cos(player.a),
    player.y - (7 / 3) * player.r * Math.sin(player.a)
  );
  ctx.lineTo(
    // rear left
    player.x - player.r * ((2 / 3) * Math.cos(player.a) + Math.sin(player.a)),
    player.y + player.r * ((2 / 3) * Math.sin(player.a) - Math.cos(player.a))
  );
  ctx.lineTo(
    // rear right
    player.x - player.r * ((2 / 3) * Math.cos(player.a) - Math.sin(player.a)),
    player.y + player.r * ((2 / 3) * Math.sin(player.a) + Math.cos(player.a))
  );
  ctx.closePath();
  ctx.stroke();
  ctx.fill();

  shots.forEach((shot) => {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(shot.x, shot.y, 5, 5);
  });
  enemyshots.forEach((shot) => {
    ctx.fillStyle = 'red';
    ctx.fillRect(shot.x, shot.y, 5, 5);
  });

  ctx.fillStyle = 'white';
  ctx.font = '16px Arial';
  ctx.fillText(`SCORE ${score}`, 30, 30);
};

window.addEventListener('resize', setWindowSize);

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
      if (player.powerup === 'shotgun') {
        for (let i = 0; i < 5; i++) {
          const shot = playership.shoot();
          shot.timer = 40;
          shot.direction += Math.random() * 0.15 - Math.random() * 0.3;
          shot.x += Math.random() * 5 - Math.random() * 10;
          shot.y += Math.random() * 5 - Math.random() * 10;
          shots.push(shot);
        }
      } else {
        shots.push(playership.shoot());
      }
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

setWindowSize();
createAsteroids();
playership.initPlayer();
setInterval(update, 1000 / FPS);
