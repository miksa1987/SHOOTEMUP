import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  RADIUS_MULTIPLIER,
  ENEMY_ACCURACY,
  distance,
} from './commons';
import { player } from './player';

const init = () => {
  const enemy = {
    x: Math.random() * CANVAS_WIDTH,
    y: Math.random() * CANVAS_HEIGHT,
    r: 7,
    a: (90 / 180) * Math.PI,
    rotation: 0,
    speeding: false,
    speed: { x: 0, y: 0 },
    radius: 3,
    hit: false,
    FRICTION: 0.1,
    TURNSPEED: 150,
    SPEED: 10,
  };

  if (distance(player.x, player.y, enemy.x, enemy.y) < 250) {
    while (distance(player.x, player.y, enemy.x, enemy.y) < 250) {
      enemy.x = Math.random() * CANVAS_WIDTH;
      enemy.y = Math.random() * CANVAS_HEIGHT;
    }
  }

  return enemy;
};

export const drawEnemy = (enemy, ctx) => {
  ctx.strokeStyle = 'red';
  ctx.fillStyle = 'red';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(enemy.x, enemy.y, enemy.radius * RADIUS_MULTIPLIER, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
  ctx.strokeStyle = '#ff9900';
  ctx.fillStyle = '#ff9900';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(
    enemy.x,
    enemy.y,
    (enemy.radius / 2) * RADIUS_MULTIPLIER,
    0,
    2 * Math.PI
  );
  ctx.stroke();
  ctx.fill();
};

const shoot = (enemy) => {
  const enemyAccuracy =
    Math.random() * ENEMY_ACCURACY - (Math.random() * ENEMY_ACCURACY) / 2;
  const direction =
    Math.atan2(enemy.y - player.y, player.x - enemy.x) + enemyAccuracy;
  const enemyshot = {
    direction,
    x: enemy.x,
    y: enemy.y,
    speed: 250,
    timer: 0,
    hit: false,
  };
  return enemyshot;
};

const move = (enemy) => {
  enemy.x += enemy.speed.x;
  enemy.y += enemy.speed.y;
  if (enemy.x < -(enemy.radius * RADIUS_MULTIPLIER))
    enemy.x = CANVAS_WIDTH + enemy.radius * RADIUS_MULTIPLIER;
  if (enemy.y < -(enemy.radius * RADIUS_MULTIPLIER))
    enemy.y = CANVAS_HEIGHT + enemy.radius * RADIUS_MULTIPLIER;
  if (enemy.x > CANVAS_WIDTH + enemy.radius * RADIUS_MULTIPLIER)
    enemy.x = -(enemy.radius * RADIUS_MULTIPLIER);
  if (enemy.y > CANVAS_HEIGHT + enemy.radius * RADIUS_MULTIPLIER)
    enemy.y = -(enemy.radius * RADIUS_MULTIPLIER);
};

const trackPlayer = (enemy) => {
  console.log(`${player.x} ${player.y}`);
  if (distance(player.x, player.y, enemy.x, enemy.y) < 200) {
    if (player.x < enemy.x) enemy.speed.x -= 0.07;
    if (player.x > enemy.x) enemy.speed.x += 0.07;
    if (player.y < enemy.y) enemy.speed.y -= 0.07;
    if (player.y > enemy.y) enemy.speed.y += 0.07;
  } else {
    if (player.x < enemy.x) enemy.speed.x -= 0.3;
    if (player.x > enemy.x) enemy.speed.x += 0.3;
    if (player.y < enemy.y) enemy.speed.y -= 0.3;
    if (player.y > enemy.y) enemy.speed.y += 0.3;
  }

  if (enemy.speed.x < -3) enemy.speed.x = -3;
  if (enemy.speed.x > 3) enemy.speed.x = 3;
  if (enemy.speed.y < -3) enemy.speed.y = -3;
  if (enemy.speed.y > 3) enemy.speed.y = 3;
};

export default { shoot, init, trackPlayer, move };
