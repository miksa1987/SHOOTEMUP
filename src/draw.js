import { RADIUS_MULTIPLIER } from "./commons";

const ctx = document.getElementById("canvas").getContext("2d");

export const draw = (gameState) => {
  drawBackground(ctx);

  gameState.getExplosions().forEach((explode) => {
    drawExplosion(explode, ctx, 20);
  });

  gameState.getThrusterFlames().forEach((flame) => {
    drawExplosion(flame, ctx, 4);
  });

  gameState.getPowerUps().forEach((power) => {
    drawPowerup(power);
  });

  gameState.getAsteroids().forEach((roid) => {
    drawAsteroid(roid, ctx);
  });

  gameState.getEnemies().forEach((nemesis) => {
    drawEnemy(nemesis, ctx);
  });

  drawPlayer(gameState.getPlayer(), ctx);

  gameState.getPlayerShots().forEach((shot) => {
    drawShot(shot, true);
  });
  gameState.getEnemyShots().forEach((shot) => {
    drawShot(shot);
  });

  drawScore(gameState.getScore());
};

const drawPlayer = (player, ctx) => {
  ctx.strokeStyle = "white";
  ctx.fillStyle = "white";
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
};

const drawAsteroid = (asteroid, ctx) => {
  ctx.strokeStyle = "grey";
  ctx.fillStyle = "grey";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(asteroid.x, asteroid.y, asteroid.radius * 7, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
};

const drawEnemy = (enemy, ctx) => {
  ctx.strokeStyle = "red";
  ctx.fillStyle = "red";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(enemy.x, enemy.y, enemy.radius * RADIUS_MULTIPLIER, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
  ctx.strokeStyle = "#ff9900";
  ctx.fillStyle = "#ff9900";
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

const drawExplosion = (explosion, ctx, lineWidth) => {
  ctx.strokeStyle = "yellow";
  if (!lineWidth) {
    ctx.lineWidth = 50;
  } else {
    ctx.lineWidth = lineWidth;
  }
  if (explosion.timer > 5) ctx.strokeStyle = "#ffff00";
  if (explosion.timer > 9) ctx.strokeStyle = "#ffcc00";
  if (explosion.timer > 12) ctx.strokeStyle = "#ff8800";
  if (explosion.timer > 15) ctx.strokeStyle = "#ff5500";
  if (explosion.timer > 18) ctx.strokeStyle = "#cc2200";
  if (explosion.timer > 21) ctx.strokeStyle = "#aa0000";
  if (explosion.timer > 24) ctx.strokeStyle = "#990000";
  if (explosion.timer > 27) ctx.strokeStyle = "#660000";
  if (explosion.timer > 29) ctx.strokeStyle = "#330000";
  ctx.beginPath();
  ctx.arc(explosion.x, explosion.y, explosion.radius * 6.5, 0, 2 * Math.PI);
  ctx.stroke();
};

const drawBackground = (ctx) => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const drawShot = (shot, playershot) => {
  ctx.fillStyle = playershot ? "yellow" : "red";
  ctx.fillRect(shot.x, shot.y, 5, 5);
};

const drawScore = (score) => {
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText(`SCORE ${score}`, 30, 30);
};
