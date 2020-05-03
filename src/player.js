import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./commons";

const player = {
  x: 200,
  y: 200,
  r: 7,
  a: (90 / 180) * Math.PI,
  rotation: 0,
  speeding: false,
  speed: { x: 0, y: 0 },
  powerup: null,
  FRICTION: 0.3,
  TURNSPEED: 120,
  SPEED: 3,
};

export const shoot = () => {
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

export { player };
export default { shoot, initPlayer };
