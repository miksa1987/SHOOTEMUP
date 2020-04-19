import { distance, RADIUS_MULTIPLIER } from './commons';

export const playerIsCollidingToPowerup = (player, powerup) => {
  if (distance(player.x, player.y, powerup.x, powerup.y) < 30) {
    return true;
  }
  return false;
};

export const playerIsCollidingToShot = (player, shot) => {
  if (distance(player.x, player.y, shot.x, shot.y) < 10) {
    return true;
  }
  return false;
};

export const enemyIsCollidingToShot = (enemy, shot) => {
  if (
    distance(shot.x, shot.y, enemy.x, enemy.y) <
    enemy.radius * RADIUS_MULTIPLIER
  ) {
    return true;
  }
  return false;
};

export const enemyIsCollidingToPlayer = (enemy, player) => {
  if (
    distance(player.x, player.y, enemy.x, enemy.y) <
    enemy.radius * RADIUS_MULTIPLIER
  ) {
    return true;
  }
  return false;
};

export const asteroidIsCollidingToAsteroid = (asteroid0, asteroid1) => {
  if (
    distance(asteroid0.x, asteroid0.y, asteroid1.x, asteroid1.y) <
    asteroid0.radius * 10
  ) {
    return true;
  }
  return false;
};

export const asteroidIsCollidingToShot = (asteroid, shot) => {
  if (distance(shot.x, shot.y, asteroid.x, asteroid.y) < asteroid.radius * 10) {
    return true;
  }
  return false;
};

export const asteroidIsCollidingToPlayer = (asteroid, player) => {
  if (
    distance(asteroid.x, asteroid.y, player.x, player.y) <
    asteroid.radius * 10
  ) {
    return true;
  }
  return false;
};
