let CANVAS_WIDTH = 0
let CANVAS_HEIGHT = 0

const RADIUS_MULTIPLIER = 6.5

const initAsteroid = (cwidth, cheight, x, y, radius, direction) => {
  CANVAS_WIDTH = cwidth
  CANVAS_HEIGHT = cheight

  const asteroid = {
    radius: radius ? radius : 5,
    x: x ? x : Math.random() * cwidth,
    y: y ? y : Math.random() * cheight,
    direction: direction ? direction : Math.random() * 360,
    speed: -2.5 + Math.random() * 5,
    hit: false,
    spawnTimer: 10
  }
  console.log(asteroid.speed)

  return asteroid
}

const resetStartingPosition = (asteroid) => {
  asteroid.x = Math.random() * CANVAS_WIDTH
  asteroid.y = Math.random() * CANVAS_HEIGHT
}

const moveAsteroid = (asteroid) => {
  asteroid.x += Math.cos((Math.PI / 180) * asteroid.direction) * asteroid.speed
  asteroid.y += Math.sin((Math.PI / 180) * asteroid.direction) * asteroid.speed

  if(asteroid.x < -(asteroid.radius * RADIUS_MULTIPLIER)) asteroid.x = CANVAS_WIDTH + (asteroid.radius * RADIUS_MULTIPLIER)
  if(asteroid.y < -(asteroid.radius * RADIUS_MULTIPLIER)) asteroid.y = CANVAS_HEIGHT + (asteroid.radius * RADIUS_MULTIPLIER)
  if(asteroid.x > CANVAS_WIDTH + (asteroid.radius * RADIUS_MULTIPLIER)) asteroid.x = -(asteroid.radius * RADIUS_MULTIPLIER)
  if(asteroid.y > CANVAS_HEIGHT + (asteroid.radius * RADIUS_MULTIPLIER)) asteroid.y = -(asteroid.radius * RADIUS_MULTIPLIER)
}

export { initAsteroid, resetStartingPosition, moveAsteroid, RADIUS_MULTIPLIER }
