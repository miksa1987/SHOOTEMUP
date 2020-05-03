import { createPlayer } from "./player";
import { initEnemy, shoot as enemyShoot } from "./enemy";
import { createHugeExplosion } from "./explosion";
import { initAsteroid } from "./asteroid";

const initialState = {
  asteroids: [],
  enemies: [],
  playerShots: [],
  enemyShots: [],
  explosions: [],
  thrusterFlames: [],
  powerUps: [], // TBD later

  player: createPlayer(),
  score: 0,
  FPS: 50,
};

export const createGameState = () => {
  let state = { ...initialState };

  return {
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

    addScore: (amount) => (state.score = state.score + amount),

    addEnemy: () => {
      // Most definitely not clean, todo better solution
      state.enemies = [
        ...state.enemies,
        initEnemy({ getPlayer: () => state.player }),
      ];
    },
    addAsteroid: (x, y, radius, direction) => {
      state.asteroids = [
        ...state.asteroids,
        initAsteroid(x, y, radius, direction),
      ];
    },
    addPlayerShot: () => {
      state.playerShots = [...state.playerShots, state.player.shoot()];
    },
    addEnemyShot: (enemy) => {
      // Most definitely not clean, todo better solution
      state.enemyShots = [
        ...state.enemyShots,
        enemyShoot(enemy, { getPlayer: () => state.player }),
      ];
    },
    addExplosion: (x, y) => {
      state.explosions = state.explosions.concat(createHugeExplosion(x, y));
    },
    addThrusterFlame: (x, y) => {
      state.explosions = state.explosions.concat(
        createHugeExplosion(x, y, 0.2, 3)
      );
    },

    reset: () => {
      state = { ...initialState };
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
  };
};
