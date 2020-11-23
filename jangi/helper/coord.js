export default class Coord {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vh = document.body.offsetHeight / 100;
        this.board = document.getElementById('board');

        this.paddingedWidth = this.board.width.animVal.value - 3.6 * 2 * this.vh;
        this.paddingedHeight = this.board.height.animVal.value - 4.8 * 2 * this.vh;
        this.xRatio = this.paddingedWidth / 8;
        this.yRatio = this.paddingedHeight / 9;
    }

    isSameCoord(x, y) {
        return this.x === x && this.y === y;
    }

    setCoord(x, y) {
        this.x = x;
        this.y = y;
    }

    coordToText() {
        return `${this.x}${this.y}`
    }

    getClientCoord(x, y) {
        const coordX = x * this.xRatio + 3.6 * this.vh;
        const coordY = y * this.yRatio + 4.8 * this.vh;
        return [coordX, coordY];
    }

    getRadius() {
        return this.yRatio;
    }

    getArrayCoord(x,y)  {
        const dx = Math.abs((x -3.6 * this.vh) * 8 / this.paddingedWidth);
        const dy = Math.abs((y -4.8 * this.vh) * 9 / this.paddingedHeight);

        if (this.isRightCoord(dx, dy)) {
            return [Math.round(dx), Math.round(dy)];
        } else {
            return [this.x, this.y];
        }
    }

    isRightCoord(x,y) {
        if (x > 8 || y > 9) {
            return false
        }
        x = Math.abs(x);
        y = Math.abs(y);
        const xLeft = x * 10;
        const yLeft = y * 10;
    
        return ((xLeft < 2 || xLeft > 8) && (yLeft < 2 || yLeft > 8));
    }
}