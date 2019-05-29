import {CANVAS_WIDTH, CANVAS_HEIGHT} from './commons'
import player from './player'

const initEnemy = () => {
const enemy = {
    x: 200,
    y: 200,
    r: 7,
    a: 90 / 180 * Math.PI,
    rotation: 0,
    speeding: false,
    speed: { x: 0, y: 0 },
    FRICTION: 0.1,
    TURNSPEED: 150,
    SPEED: 10
  }
}

const shoot = () => {
  const enemyshot = {
    direction: enemy.a,
    x: enemy.x,
    y: enemy.y,
    speed: 250,
    timer: 0,
    hit: false
  }
  return shot
}

const move = () => {

}

export default initEnemy
export { shoot, initEnemy }
