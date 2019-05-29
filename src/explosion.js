import {CANVAS_WIDTH, CANVAS_HEIGHT, RADIUS_MULTIPLIER} from './commons'

const createExplosion = (x, y, radius) => {
  return { x: x - 3 * radius * RADIUS_MULTIPLIER + Math.random() * 6 * radius * RADIUS_MULTIPLIER,
    y: y - 3 * radius * RADIUS_MULTIPLIER + Math.random() * 6 * radius * RADIUS_MULTIPLIER,
    radius: radius,
    timer: Math.floor(Math.random() * 12)
  }
}

export { createExplosion }
