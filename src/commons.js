const MAX_ASTEROIDS = 3; // Max asteroids at start

let CANVAS_WIDTH = 600;
let CANVAS_HEIGHT = 600;

const FPS = 30;
const RADIUS_MULTIPLIER = 6.5;
const ENEMY_ACCURACY = 0.4;

const distance = (x0, y0, x1, y1) => {
  return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
};

const setCanvasSize = (w, h) => {
  CANVAS_WIDTH = w;
  CANVAS_HEIGHT = h;
};

const repeatTimes = (numberOfTimes, func) => {
  for (let i = 0; i < numberOfTimes; i++) {
    func();
  }
};

export {
  MAX_ASTEROIDS,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  RADIUS_MULTIPLIER,
  FPS,
  ENEMY_ACCURACY,
  distance,
  setCanvasSize,
  repeatTimes,
};
