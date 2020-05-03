import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  RADIUS_MULTIPLIER,
  FPS,
  repeatTimes,
} from "./commons";

export const createExplosion = (x, y, radius, speed, direction) => {
  return {
    x:
      x -
      3 * radius * RADIUS_MULTIPLIER +
      Math.random() * 6 * radius * RADIUS_MULTIPLIER,
    y:
      y -
      3 * radius * RADIUS_MULTIPLIER +
      Math.random() * 6 * radius * RADIUS_MULTIPLIER,
    radius: radius,
    timer: Math.floor(Math.random() * 15),
    speed: speed ? speed : 0,
    direction: direction ? direction : 0,
  };
};

export const createHugeExplosion = (x, y, maxRadius = 2.5, maxNumber = 50) => {
  const explosions = [];
  const numberOfSmallerExplosions = Math.round(Math.random() * maxNumber);
  repeatTimes(numberOfSmallerExplosions, () => {
    const explosionSize = Math.random() * maxRadius;
    explosions.push(createExplosion(x, y, explosionSize));
  });

  return explosions;
};

const moveExplosion = (explosion) => {
  explosion.x -= (explosion.speed * Math.cos(explosion.direction)) / FPS;
  explosion.y -= (explosion.speed * Math.cos(explosion.direction)) / FPS;

  if (explosion.x < -(explosion.radius * RADIUS_MULTIPLIER))
    explosion.x = CANVAS_WIDTH + explosion.radius * RADIUS_MULTIPLIER;
  if (explosion.y < -(explosion.radius * RADIUS_MULTIPLIER))
    explosion.y = CANVAS_HEIGHT + explosion.radius * RADIUS_MULTIPLIER;
  if (explosion.x > CANVAS_WIDTH + explosion.radius * RADIUS_MULTIPLIER)
    explosion.x = -(explosion.radius * RADIUS_MULTIPLIER);
  if (explosion.y > CANVAS_HEIGHT + explosion.radius * RADIUS_MULTIPLIER)
    explosion.y = -(explosion.radius * RADIUS_MULTIPLIER);
};

export default { createExplosion, moveExplosion };
