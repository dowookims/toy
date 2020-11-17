import { makePolygonPath, createText, getClientCoord, getArrayCoord, isRightCoord, setUnitLocation, isWall } from '../helper/index.js'

export default class Soldier {
    constructor(data, team, y, x) {
        this.data = data;
        this.y = y;
        this.x = x;
        this.team = team;
    }

    draw(parent) {
        this.parent = parent;
        const [coordX, coordY, ratio] = getClientCoord(parent, this.x, this.y);

        const r = ratio * 0.5;
        this.r = r;

        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        const text = createText(coordX, coordY, this.team, '왕');
        const path = makePolygonPath(coordX, coordY, r);

        poly.setAttributeNS(null, 'points', path);
        g.append(poly);
        g.append(text);

        this.g = g;
        this.poly = poly;
        this.text = text;
        this.moveEvent(g);
        
        poly.classList.add('unit');
        parent.append(g);
    }

    moveEvent(dom) {
        let canMove = false;
        let possibleRoute;

        const mover = (e) => {
            if (canMove) {
                return;
            }
            setUnitLocation(this.poly, this.text, e.offsetX, e.offsetY, this.r);
        };

        const remover = (e) => {
            const [x, y] = this.changeArrayCoord(e.offsetX, e.offsetY);
            let cx, cy;

            if (possibleRoute.includes(`${x},${y}`)) {
                this.setCoord(x, y);
                [cx, cy] = getClientCoord(this.parent, x, y);
            } else {
                [cx, cy] = getClientCoord(this.parent, this.x, this.y);
            }

            setUnitLocation(this.poly, this.text, cx, cy, this.r);

            canMove = true;
            possibleRoute = null;
            dom.removeEventListener('mousemove', mover);
            dom.removeEventListener('click', remover);
        };

        const startClick = (e) => {
            canMove = false;

            possibleRoute = this.possibleRoute();

            dom.addEventListener('mousemove', mover);
            dom.addEventListener('click', remover);
        };

        dom.addEventListener('click', startClick);
    }

    changeArrayCoord(x, y) {
        let [dx, dy] = getArrayCoord(this.parent, x, y);
        
        if (isRightCoord(dx, dy)) {
            dx = Math.round(dx);
            dy = Math.round(dy);
            return [dx, dy]
        } else {
            return [this.x, this.y]
        }
    }

    possibleRoute() {
        let dx = [];
        let dy = [];

        if (this.x === 3) {
            if ((this.y === 0 || this.y === 7)) {
                dx = [0, 1, 1];
                dy = [1, 1, 0]
            } else if ((this.y === 1 || this.y === 8)) {
                dx = [0, 0, 1];
                dy = [-1, 1, 0];
            } else if ((this.y === 2 || this.y === 9)) {
                dx = [0, 1, 1];
                dy = [-1, -1, 0];
            };
        } else if (this.x === 4) {
            if ((this.y === 0 || this.y === 7)) {
                dx = [-1, 0, 1];
                dy = [0, 1, 0]
            } else if ((this.y === 1 || this.y === 8)) {
                dx = [-1, 0, 1, -1, 1, -1, 0, 1];
                dy = [-1, -1, -1, 0, 0, 1, 1, 1];
            } else if ((this.y === 2 || this.y === 9)) {
                dx = [-1, 0, 1];
                dy = [0, -1, 0];
            };
        } else if (this.x === 5) {
            if ((this.y === 0 || this.y === 7)) {
                dx = [-1, -1, 0];
                dy = [0, 1, 1]
            } else if ((this.y === 1 || this.y === 8)) {
                dx = [0, -1, 0];
                dy = [-1, 0, 1];
            } else if ((this.y === 2 || this.y === 9)) {
                dx = [-1, -1, 0];
                dy = [0, -1, -1];
            };
        }

        const arr = [`${this.x},${this.y}`];

        for (let i=0; i<dx.length; i++) {
            const cx = this.x + dx[i];
            const cy = this.y + dy[i];
            if (isWall(cx,cy)) {
                arr.push(`${cx},${cy}`);
                // if (this.data[cy][cx] === 0 || this.data[cy][cx].team !== this.team) {
                //     arr.push(`${cx},${cy}`);
                // }
            }
        }
        return arr
    }

    setCoord(x, y) {
        this.x = x;
        this.y = y;
    }

    remove() {
        this.g.remove();
    }
}