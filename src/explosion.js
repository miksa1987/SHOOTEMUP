import {CANVAS_WIDTH, CANVAS_HEIGHT, RADIUS_MULTIPLIER} from './commons'

const createExplosion = (x, y, radius) => {
  return { x: x - radius * RADIUS_MULTIPLIER + Math.random() * 2 * radius * RADIUS_MULTIPLIER,
    y: y - radius * RADIUS_MULTIPLIER + Math.random() * 2 * radius * RADIUS_MULTIPLIER,
    radius: radius,
    timer: 0
  }
}

export { createExplosion }
