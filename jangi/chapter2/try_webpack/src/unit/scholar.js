import { isWall } from '../helper/index.js';

import Unit from './unit.js';

export default class Scholar extends Unit {
  constructor({ data, team, y, x, name }, radius, copy = false) {
    super({ data, team, y, x, name }, radius, copy);

    const id = `scholar${x}${y}`;
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
    let dx = [];
    let dy = [];

    if (this.coord.x === 3) {
      if (this.coord.y === 0 || this.coord.y === 7) {
        dx = [0, 1, 1];
        dy = [1, 1, 0];
      } else if (this.coord.y === 1 || this.coord.y === 8) {
        dx = [0, 0, 1];
        dy = [-1, 1, 0];
      } else if (this.coord.y === 2 || this.coord.y === 9) {
        dx = [0, 1, 1];
        dy = [-1, -1, 0];
      }
    } else if (this.coord.x === 4) {
      if (this.coord.y === 0 || this.coord.y === 7) {
        dx = [-1, 0, 1];
        dy = [0, 1, 0];
      } else if (this.coord.y === 1 || this.coord.y === 8) {
        dx = [-1, 0, 1, -1, 1, -1, 0, 1];
        dy = [-1, -1, -1, 0, 0, 1, 1, 1];
      } else if (this.coord.y === 2 || this.coord.y === 9) {
        dx = [-1, 0, 1];
        dy = [0, -1, 0];
      }
    } else if (this.coord.x === 5) {
      if (this.coord.y === 0 || this.coord.y === 7) {
        dx = [-1, -1, 0];
        dy = [0, 1, 1];
      } else if (this.coord.y === 1 || this.coord.y === 8) {
        dx = [0, -1, 0];
        dy = [-1, 0, 1];
      } else if (this.coord.y === 2 || this.coord.y === 9) {
        dx = [-1, -1, 0];
        dy = [0, -1, -1];
      }
    }

    return [dx, dy];
  }

  remove() {
    super.remove();
  }
}
