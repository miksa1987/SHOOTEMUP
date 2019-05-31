import {CANVAS_WIDTH, CANVAS_HEIGHT, RADIUS_MULTIPLIER, FPS} from './commons'

const createExplosion = (x, y, radius, speed, direction) => {
  return { x: x - 3 * radius * RADIUS_MULTIPLIER + Math.random() * 6 * radius * RADIUS_MULTIPLIER,
    y: y - 3 * radius * RADIUS_MULTIPLIER + Math.random() * 6 * radius * RADIUS_MULTIPLIER,
    radius: radius,
    timer: Math.floor(Math.random() * 12),
    speed: speed ? speed : 0,
    direction: direction ? direction : 0
  }
}

const moveExplosion = (explosion) => {
  explosion.x -= explosion.speed * Math.cos(explosion.direction) / FPS
  explosion.y -= explosion.speed * Math.cos(explosion.direction) / FPS

  if(explosion.x < -(explosion.radius * RADIUS_MULTIPLIER)) explosion.x = CANVAS_WIDTH + (explosion.radius * RADIUS_MULTIPLIER)
  if(explosion.y < -(explosion.radius * RADIUS_MULTIPLIER)) explosion.y = CANVAS_HEIGHT + (explosion.radius * RADIUS_MULTIPLIER)
  if(explosion.x > CANVAS_WIDTH + (explosion.radius * RADIUS_MULTIPLIER)) explosion.x = -(explosion.radius * RADIUS_MULTIPLIER)
  if(explosion.y > CANVAS_HEIGHT + (explosion.radius * RADIUS_MULTIPLIER)) explosion.y = -(explosion.radius * RADIUS_MULTIPLIER)
}

const drawExplosion = (explosion, ctx, lineWidth) => {
  ctx.strokeStyle = 'yellow'
  if(!lineWidth) {
    ctx.lineWidth = 20
  } else {
    ctx.lineWidth = lineWidth
  }
  if(explosion.timer > 5) ctx.strokeStyle = '#ffcc00'
  if(explosion.timer > 9) ctx.strokeStyle = '#ffaa00'
  if(explosion.timer > 13) ctx.strokeStyle = '#ff8800'
  if(explosion.timer > 17) ctx.strokeStyle = '#ff5500'
  if(explosion.timer > 21) ctx.strokeStyle = '#cc2200'
  if(explosion.timer > 25) ctx.strokeStyle = '#990000'
  if(explosion.timer > 28) ctx.strokeStyle = '#550000'
  ctx.beginPath()
  ctx.arc(explosion.x, explosion.y, explosion.radius * 6.5, 0, 2 * Math.PI)
  ctx.stroke()
}

export default { createExplosion, moveExplosion, drawExplosion }
