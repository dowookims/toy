import { isWall } from '../helper/index.js';

import Unit from './unit.js';

export default class Soldier extends Unit {
  constructor({ data, team, y, x, name }, radius, copy = false) {
    super({ data, team, y, x, name }, radius, copy);
    const id = `soldier${x}${y}`;
    this.id = this.copy ? id.concat('copy') : id;
    this.size = 'small';
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
      const movedX = this.coord.x + dx[i];
      const movedY = this.coord.y + dy[i];

      if (isWall(movedX, movedY)) {
        if (this.data[movedY][movedX] === 0 || this.data[movedY][movedX].team !== this.team) {
          routeArray.push(`${movedX},${movedY}`);
        }
      }
    }
    return routeArray;
  }

  moveableDirection() {
    const xDirections = [-1, 0, 1];
    let yDirections = [0, 1, 0];

    if (this.team === 'han' && this.x === 3 && this.y === 7) {
      xDirections.push(1);
      yDirections.push(-1);
    } else if (this.team === 'han' && this.x === 5 && this.y === 7) {
      xDirections.push(-1);
      yDirections.push(-1);
    } else if (this.team === 'han' && this.x === 4 && this.y === 8) {
      xDirections.push(-1);
      xDirections.push(1);
      yDirections.push(-1);
      yDirections.push(-1);
    }

    if (this.team === 'cho') {
      yDirections = [0, -1, 0];
      if (this.x === 3 && this.y === 2) {
        xDirections.push(1);
        yDirections.push(-1);
      } else if (this.x === 5 && this.y === 2) {
        xDirections.push(-1);
        yDirections.push(-1);
      } else if (this.x === 4 && this.y === 1) {
        xDirections.push(-1);
        xDirections.push(1);
        yDirections.push(-1);
        yDirections.push(-1);
      }
    }

    return [xDirections, yDirections];
  }

  remove() {
    super.remove();
  }
}
