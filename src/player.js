import { CANVAS_WIDTH, CANVAS_HEIGHT } from './commons';

const player = {
  x: 200,
  y: 200,
  r: 7,
  a: (90 / 180) * Math.PI,
  rotation: 0,
  speeding: false,
  speed: { x: 0, y: 0 },
  powerup: null,
  FRICTION: 0.1,
  TURNSPEED: 150,
  SPEED: 5,
};

const shoot = () => {
  const shot = {
    direction: player.a,
    x: player.x,
    y: player.y,
    speed: 650,
    timer: 0,
    hit: false,
  };

  return shot;
};

const initPlayer = () => {
  player.x = CANVAS_WIDTH / 2;
  player.y = CANVAS_HEIGHT / 2;
  player.speed = { x: 0, y: 0 };
};

export const drawPlayer = (player, ctx) => {
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
};

export { player };
export default { shoot, initPlayer };
