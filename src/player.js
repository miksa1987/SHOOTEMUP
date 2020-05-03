import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./commons";

const canvas = document.getElementById("canvas");

const FPS = 50;

const initialPlayer = {
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

export const createPlayer = () => {
  let player = { ...initialPlayer };

  return {
    getPosition: () => ({ x: player.x, y: player.y }),
    getAngle: () => player.a,
    getRadius: () => player.r,
    init: () => {
      player.x = CANVAS_WIDTH / 2;
      player.y = CANVAS_HEIGHT / 2;
      player.speed = { x: 0, y: 0 };
    },
    shoot: () => {
      const shot = {
        direction: player.a,
        x: player.x,
        y: player.y,
        speed: 650,
        timer: 0,
        hit: false,
      };

      return shot;
    },
    move: () => {
      player.x += player.speed.x;
      player.y += player.speed.y;

      if (player.x > canvas.width + 20) player.x = -20;
      if (player.y > canvas.height + 20) player.y = -20;
      if (player.x < -20) player.x = canvas.width + 20;
      if (player.y < -20) player.y = canvas.height + 20;
    },
    setSpeeding: (isSpeeding) => (player.speeding = isSpeeding),
    isSpeeding: () => player.speeding,
    accelerate: () => {
      player.speed.x += (player.SPEED * Math.cos(player.a)) / FPS;
      player.speed.y -= (player.SPEED * Math.sin(player.a)) / FPS;
    },
    turnLeft: () => {
      player.rotation += ((player.TURNSPEED / 180) * Math.PI) / FPS;
    },
    turnRight: () => {
      player.rotation += ((-player.TURNSPEED / 180) * Math.PI) / FPS;
    },
    stopTurning: () => (player.rotation = 0),
    setAngle: () => (player.a += player.rotation),
  };
};
