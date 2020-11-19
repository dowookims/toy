import { isWall } from '../helper/index.js'
import Unit from './unit.js';
export default class Elephant extends Unit{
    constructor({data, team , y, x, name}, radius, copy=false) {
        super({data, team , y, x, name}, radius, copy);

        const id = `elephant${x}${y}`;
        this.id = this.copy ? id.concat('copy') : id;
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

        for (let i=0; i<dx.length; i++) {
            let movedX = this.coord.x;
            let movedY = this.coord.y;
            for (let j=0; j<dx[i].length; j++) {
                movedX += dx[i][j];
                movedY += dy[i][j];
                if (j === dx[i].length - 1) {
                    if (isWall(movedX, movedY)) {
                        if (this.data[movedY][movedX] !== 0 && this.data[movedY][movedX].team === this.team) {
                            break
                        }
                        routeArray.push(`${movedX},${movedY}`);
                    }
                } else {
                    if (!(isWall(movedX, movedY) && this.data[movedY][movedX] === 0)) {
                        break
                    }
                }
            }
        }
        
        return routeArray
    }

    moveableDirection() {
        const dx = [
            [-1, -1, -1],
            [-1, -1, -1],
            [0, -1, -1],
            [0, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
            [0, -1, -1],
            [0, 1, 1]
        ];
        const dy = [
            [0, -1, -1],
            [0, 1, 1],
            [-1, -1, -1],
            [-1, -1, -1],
            [0, 1, 1],
            [0, -1, -1],
            [1, 1, 1],
            [1, 1, 1]
        ];

        return [dx, dy];
    }

    remove() {
        super.remove();
    }
}