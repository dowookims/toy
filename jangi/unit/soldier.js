import {
    makePolygonPath,
    createText,
    getClientCoord,
    getArrayCoord,
    isRightCoord,
    setUnitLocation,
    isWall
} from '../helper/index.js'

export default class Soldier {
    constructor(data = [], team = '', y, x) {
        this.data = data
        this.y = y;
        this.x = x;
        this.team = team;
    }

    draw(parent) {
        this.parent = parent;
        const [coordX, coordY, ratio] = getClientCoord(parent, this.x, this.y);

        const r = ratio * 0.25;
        this.r = r;

        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        const text = createText(coordX, coordY, this.team, '쫄');
        const path = makePolygonPath(coordX, coordY, r);

        poly.setAttributeNS(null, 'points', path);
        g.append(poly);
        g.append(text);
        this.id = `sol${this.x}${this.y}`;
        g.setAttribute('id', this.id)

        this.g = g;
        this.poly = poly;
        this.text = text;
        if (this.data.length > 0) {
            this.moveEvent(g);
        }
        
        poly.classList.add('unit');
        parent.append(g);
    }

    moveEvent(dom) {
        let canMove = false;
        let possibleRoute;
        let moveUnit;
        let possibleRouteDom;
        const mover = (e) => {
            if (!moveUnit) {
                moveUnit = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                this.moveUnit = moveUnit;
                moveUnit.setAttribute('href', '#' + this.id);
                this.parent.append(moveUnit);
            }
            if (canMove) {
                return;
            }
            setUnitLocation(this.poly, this.text, e.offsetX, e.offsetY, this.r);
        };

        const remover = (e) => {
            const [x, y] = this.changeArrayCoord(e.offsetX, e.offsetY);
            let cx, cy;

            if (possibleRoute.includes(`${x},${y}`)) {
                [cx, cy] = getClientCoord(this.parent, x, y);
                const event = new CustomEvent('unitmove', {
                    detail: {
                        from: {
                            x: this.x,
                            y: this.y
                        },
                        to: { x, y }
                    }
                });

                this.parent.dispatchEvent(event);
                this.setCoord(x, y);
            } else {
                [cx, cy] = getClientCoord(this.parent, this.x, this.y);
            }

            setUnitLocation(this.poly, this.text, cx, cy, this.r);

            canMove = true;
            // Todo Remove possibleRoute svg group
            possibleRouteDom.forEach(s => {s.g.remove()});
            possibleRouteDom = null;
            possibleRoute = null;

            dom.removeEventListener('mousemove', mover);
            dom.removeEventListener('click', remover);
        };

        const startClick = (e) => {
            canMove = false;

            possibleRoute = this.possibleRoute();
            possibleRouteDom = possibleRoute
            .filter(coord => {
                const [x, y] = coord.split(',').map(v => parseInt(v));
                return !(x === this.x && y === this.y)
            }).map(coord => {
                const [x, y] = coord.split(',').map(v => parseInt(v))
                const s = new Soldier([], this.team, y, x);
                s.draw(this.parent);
                return s;
            });

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
        let dx = [-1, 0, 1];
        let dy = [0, 1, 0];

        if (this.team === 'han' && this.x === 3 && this.y === 7) {
            dx.push(1);
            dy.push(-1);
        } else if (this.team === 'han' && this.x === 5 && this.y === 7) {
            dx.push(-1);
            dy.push(-1);
        } else if (this.team === 'han' && this.x === 4 && this.y === 8) {
            dx.push(-1);
            dx.push(1);
            dy.push(-1)
            dy.push(-1)
        }

        const arr = [`${this.x},${this.y}`];
        if (this.team === 'cho') {
            dy = [0, -1, 0];
            if (this.x === 3 && this.y === 2) {
                dx.push(1);
                dy.push(-1);
            } else if (this.x === 5 && this.y === 2) {
                dx.push(-1);
                dy.push(-1);
            } else if (this.x === 4 && this.y === 1) {
                dx.push(-1);
                dx.push(1);
                dy.push(-1)
                dy.push(-1)
            }
        };

        for (let i=0; i<dx.length; i++) {
            const cx = this.x + dx[i];
            const cy = this.y + dy[i];
            if (isWall(cx,cy)) {
                if (this.data[cy][cx] === 0 || this.data[cy][cx].team !== this.team) {
                    arr.push(`${cx},${cy}`);
                }
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
        if (this.moveUnit) {
            this.moveUnit.remove();
        }
    }
}