const powerup = {
  x: 0,
  y: 0,
  type: null,
};

export const drawPowerup = (power, ctx) => {
  ctx.strokeStyle = '#0000ff';
  ctx.fillStyle = '#0000ff';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(power.x, power.y, 40, 0, 2 * Math.PI);
  ctx.stroke();
};

export default powerup;
