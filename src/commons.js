
const distance = (x0, y0, x1, y1) => {
  return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2))
}

const MAX_ASTEROIDS = 10
const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 600
const RADIUS_MULTIPLIER = 6.5
export { MAX_ASTEROIDS, CANVAS_WIDTH, CANVAS_HEIGHT, RADIUS_MULTIPLIER, distance }
