import { player, shoot as playerShoot } from './player';
import { initEnemy, shoot as enemyShoot } from './enemy';
import { createHugeExplosion } from './explosion';
import { initAsteroid } from './asteroid';

const initialState = {
  asteroids: [],
  enemies: [],
  playerShots: [],
  enemyShots: [],
  explosions: [],
  thrusterFlames: [],
  powerUps: [], // TBD later

  player,
  score: 0,
  FPS: 50,
};

export const createGameState = () => {
  let state = initialState;

  return Object.assign(
    {},
    {
      getPlayer: () => state.player,
      getAsteroids: () => state.asteroids,
      getEnemies: () => state.enemies,
      getPlayerShots: () => state.playerShots,
      getEnemyShots: () => state.enemyShots,
      getThrusterFlames: () => state.thrusterFlames,
      getExplosions: () => state.explosions,
      getPowerUps: () => state.powerUps,
      getScore: () => state.score,
      getFPS: () => state.FPS,

      addEnemy: () => {
        state.enemies = [...state.enemies, initEnemy()];
      },
      addAsteroid: (x, y, radius, direction) => {
        state.asteroids = [
          ...state.asteroids,
          initAsteroid(x, y, radius, direction),
        ];
      },
      addPlayerShot: () => {
        state.playerShots = [...state.playerShots, playerShoot()];
      },
      addEnemyShot: (enemy) => {
        state.enemyShots = [...state.enemyShots, enemyShoot(enemy)];
      },
      addExplosion: (x, y) => {
        state.explosions = [...state.explosions, createHugeExplosion(x, y)];
      },

      reset: () => {
        state = initialState;
      },

      removeHitObjects: () => {
        state.asteroids = state.asteroids.filter((asteroid) => !asteroid.hit);
        state.playerShots = state.playerShots
          .filter((shot) => !shot.hit)
          .filter((shot) => shot.timer < 70);
        state.explosions = state.explosions.filter(
          (explosion) => explosion.timer < 30
        );
        state.thrusterFlames = state.thrusterFlames.filter(
          (flame) => flame.timer < 30
        );
        state.enemies = state.enemies.filter((enemy) => !enemy.hit);
        state.enemyShots = state.enemyShots
          .filter((shot) => !shot.hit)
          .filter((shot) => shot.timer < 50);
        state.powerUps = state.powerUps.filter((power) => power.collected);
      },
    }
  );
};
