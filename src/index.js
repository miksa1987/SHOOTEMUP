import player, { shoot, initPlayer } from './player'
import {moveAsteroid, initAsteroid, resetStartingPosition} from './asteroid'
import {createExplosion} from './explosion'
import {MAX_ASTEROIDS, RADIUS_MULTIPLIER} from './commons'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let gameOn = true

const FPS = 30

let asteroids = []
let shots = []
let explosions = []

const distance = (x0, y0, x1, y1) => {
  return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2))
}

const createAsteroids = () => {
  const asteroidsNumber =
    MAX_ASTEROIDS / 2 + Math.random() * MAX_ASTEROIDS / 2
  console.log(asteroidsNumber)

  for(let i = 0; i < asteroidsNumber; i++) {
    asteroids.push(initAsteroid(600, 600))
  }

  asteroids.forEach(asteroid => {
    if(distance(asteroid.x, asteroid.y, player.x, player.y) < 150) resetStartingPosition(asteroid)
  })
}

const checkCollisions = () => {
  asteroids.forEach(asteroid => {
    if(distance(asteroid.x, asteroid.y, player.x, player.y) < asteroid.radius * 10) {
      asteroids = []
      shots = []
      player.speed = { x: 0, y: 0 }
      gameOn = false
    }

    shots.forEach(shot => {
      if(distance(shot.x, shot.y, asteroid.x, asteroid.y) < asteroid.radius * 10) {
        if(asteroid.radius > 2 && !asteroid.hit) {
          asteroids.push(initAsteroid(canvas.width, canvas.height, asteroid.x, asteroid.y,
            asteroid.radius - 1, Math.random() * 70))
          asteroids.push(initAsteroid(canvas.width, canvas.height, asteroid.x, asteroid.y,
            asteroid.radius - 1, 120 + Math.random() * 70))
        }
        asteroid.hit = true
        shot.hit = true
        for(let i = 0; i < 10; i++) explosions.push(createExplosion(asteroid.x, asteroid.y, 4))
      }
    })
  })
}

const removeHitObjects = () => {
  const filteredasteroids = asteroids.filter(asteroid => !asteroid.hit)
  const filteredshots = shots.filter(shot => !shot.hit)
  const filteredexplosions = explosions.filter(explosion => explosion.timer < 27)
  asteroids = filteredasteroids
  shots = filteredshots
  explosions = filteredexplosions
}

const update = () => {
  if(!gameOn) return

  checkCollisions()
  removeHitObjects()

  if(player.speeding) {
    player.speed.x += player.SPEED * Math.cos(player.a) / FPS
    player.speed.y -= player.SPEED * Math.sin(player.a) / FPS
  }

  player.x += player.speed.x
  player.y += player.speed.y

  if(player.x > canvas.width + 20) player.x = -20
  if(player.y > canvas.height + 20) player.y = -20
  if(player.x < -20) player.x = canvas.width + 20
  if(player.y < -20) player.y = canvas.height + 20

  player.a += player.rotation

  explosions.forEach(explosion => explosion.timer++)
  asteroids.forEach(asteroid => moveAsteroid(asteroid))

  shots.forEach(shot => {
    shot.x += shot.speed * Math.cos(shot.direction) / FPS
    shot.y -= shot.speed * Math.sin(shot.direction) / FPS

    if(shot.x > canvas.width + 5) shot.x = -5
    if(shot.y > canvas.height + 5) shot.y = -5
    if(shot.x < -5) shot.x = canvas.width + 5
    if(shot.y < -5) shot.y = canvas.height + 5

    shot.timer++
    if(shot.timer > 150) shots.splice(shot)
  })

  draw()
}

const draw = () => {
  // background
  ctx.fillStyle = 'rgb(15,30,50)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.strokeStyle = 'yellow'
  ctx.lineWidth = 5
  explosions.forEach(explosion => {
    if(explosion.timer > 5) ctx.strokeStyle = '#ffcc00'
    if(explosion.timer > 9) ctx.strokeStyle = '#ffaa00'
    if(explosion.timer > 13) ctx.strokeStyle = '#ff8800'
    if(explosion.timer > 17) ctx.strokeStyle = '#ff5500'
    if(explosion.timer > 21) ctx.strokeStyle = '#cc2200'
    if(explosion.timer > 25) ctx.strokeStyle = '#990000'
    ctx.beginPath()
    ctx.arc(explosion.x, explosion.y, explosion.radius * 6.5, 0, 2 * Math.PI)
    ctx.stroke()
  })

  if(!gameOn) return

  //player
  ctx.strokeStyle = 'white'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo( // nose of the player
    player.x + 7 / 3 * player.r * Math.cos(player.a),
    player.y - 7 / 3 * player.r * Math.sin(player.a))
  ctx.lineTo( // rear left
    player.x - player.r * (2 / 3 * Math.cos(player.a) + Math.sin(player.a)),
    player.y + player.r * (2 / 3 * Math.sin(player.a) - Math.cos(player.a)))
  ctx.lineTo( // rear right
    player.x - player.r * (2 / 3 * Math.cos(player.a) - Math.sin(player.a)),
    player.y + player.r * (2 / 3 * Math.sin(player.a) + Math.cos(player.a)))
  ctx.closePath()
  ctx.stroke()

  ctx.strokeStyle = 'red'
  ctx.lineWidth = 3
  asteroids.forEach(asteroid => {
    ctx.beginPath()
    ctx.arc(asteroid.x, asteroid.y, asteroid.radius * 7, 0, 2 * Math.PI)
    ctx.stroke()
  })

  shots.forEach(shot => {
    ctx.fillStyle = 'yellow'
    ctx.fillRect(shot.x, shot.y, 5, 5)
  })

}

window.addEventListener('keydown', e => {
  switch(e.keyCode) {
    case 38:
      player.speeding = true
      break
    case 37:
      player.rotation += player.TURNSPEED / 180 * Math.PI / FPS
      break
    case 39:
      player.rotation += -player.TURNSPEED / 180 * Math.PI / FPS
      break
    case 32:
      shots.push(shoot())
      break
    case 8:
      if(!gameOn) {
        gameOn = true
        createAsteroids()
        initPlayer()
      }
      break
  }
})
window.addEventListener('keyup', e => {
  switch(e.keyCode) {
    case 38:
      player.speeding = false
      break
    case 37:
      player.rotation = 0
      break
    case 39:
      player.rotation = 0
      break
  }
})

createAsteroids()
initPlayer()
setInterval(update, 1000 / FPS)
