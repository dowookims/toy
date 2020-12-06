import { isWall } from '../helper/index.js';

import Unit from './unit.js';

export default class Chariot extends Unit {
  constructor({ data, team, y, x, name }, radius, copy = false) {
    super({ data, team, y, x, name }, radius, copy);

    const id = `chariot${x}${y}`;
    this.id = this.copy ? id.concat('copy') : id;
    this.size = 'medium';
  }

  draw(parent) {
    super.draw(parent);
  }

  bindEvent() {
    super.bindEvent();
  }

  possibleRoute() {
    const routeArray = [`${this.coord.x},${this.coord.y}`];
    const [dx, dy] = this.moveableDirection();

    for (let i = 0; i < dx.length; i++) {
      let movedX = this.coord.x + dx[i];
      let movedY = this.coord.y + dy[i];

      while (isWall(movedX, movedY)) {
        const movedCoordData = this.data[movedY][movedX];
        if (movedCoordData !== 0 && movedCoordData.team === this.team) {
          break;
        }

        routeArray.push(`${movedX},${movedY}`);
        if (movedCoordData !== 0 && movedCoordData.team !== this.team) {
          break;
        }

        movedX += dx[i];
        movedY += dy[i];
      }
    }

    if (this.coord.x === 3) {
      if (this.coord.y === 2 || this.coord.y === 9) {
        for (let trial = 1; trial < 3; trial++) {
          const movedX = this.coord.x + trial;
          const movedY = this.coord.y - trial;
          const movedCoordData = this.data[movedY][movedX];

          if (this.data[movedY][movedX] !== 0) {
            if (movedCoordData.team !== this.team) {
              routeArray.push(`${movedX},${movedY}`);
            }
            break;
          } else {
            routeArray.push(`${movedX},${movedY}`);
          }
        }
      } else if (this.coord.y === 0 || this.coord.y === 7) {
        for (let trial = 1; trial < 3; trial++) {
          const movedX = this.coord.x + trial;
          const movedY = this.coord.y + trial;
          const movedCoordData = this.data[movedY][movedX];

          if (this.data[movedY][movedX] !== 0) {
            if (movedCoordData.team !== this.team) {
              routeArray.push(`${movedX},${movedY}`);
            }
            break;
          } else {
            routeArray.push(`${movedX},${movedY}`);
          }
        }
      }
    } else if (this.coord.x === 5) {
      if (this.coord.y === 2 || this.coord.y === 9) {
        for (let trial = 1; trial < 3; trial++) {
          const movedX = this.coord.x - trial;
          const movedY = this.coord.y - trial;
          const movedCoordData = this.data[movedY][movedX];

          if (this.data[movedY][movedX] !== 0) {
            if (movedCoordData.team !== this.team) {
              routeArray.push(`${movedX},${movedY}`);
            }
            break;
          } else {
            routeArray.push(`${movedX},${movedY}`);
          }
        }
      } else if (this.coord.y === 0 || this.coord.y === 7) {
        for (let trial = 1; trial < 3; trial++) {
          const movedX = this.coord.x - trial;
          const movedY = this.coord.y + trial;
          const movedCoordData = this.data[movedY][movedX];

          if (this.data[movedY][movedX] !== 0) {
            if (movedCoordData.team !== this.team) {
              routeArray.push(`${movedX},${movedY}`);
            }
            break;
          } else {
            routeArray.push(`${movedX},${movedY}`);
          }
        }
      }
    } else if (this.coord.x === 4 && this.coord.y === 1) {
      const crossX = [-1, -1, 1, 1];
      const crossY = [-1, 1, -1, 1];
      crossX.forEach((v, idx) => {
        const movedX = this.coord.x + crossX[idx];
        const movedY = this.coord.y + crossY[idx];
        routeArray.push(`${movedX},${movedY}`);
      });
    }
    return routeArray;
  }

  moveableDirection() {
    const dx = [-1, 0, 1, 0];
    const dy = [0, -1, 0, 1];

    return [dx, dy];
  }

  remove() {
    super.remove();
  }
}
