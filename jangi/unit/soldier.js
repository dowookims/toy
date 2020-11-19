import {
    isWall,
    createSvg,
    emitChange
} from '../helper/index.js'

import Coord from '../helper/coord.js'
import Drawer from '../helper/drawer.js';

export default class Soldier {
    constructor(data = [], team = '', y, x, copy=false) {
        const id = `soldier${x}${y}`;
        this.name = '쫄';
        this.data = data
        this.copy = copy;
        this.team = team;
        this.id = this.copy ? id.concat('copy') : id;
        this.coord = new Coord(x, y);
        this.drawer = new Drawer(team, this.name);
    }

    draw(parent) {
        this.parent = parent;
        const [coordX, coordY] = this.coord.getClientCoord(this.coord.x, this.coord.y);

        const r = this.coord.getRadius() * 0.25;
        const g = createSvg('g');
        const poly = createSvg('polygon');
        const text = this.drawer.createText(coordX, coordY, this.team, this.name);
        const points = this.drawer.makePolygonPath(coordX, coordY, r);

        poly.setAttributeNS(null, 'points', points);
        poly.setAttributeNS(null, 'class', 'unit');
        g.append(poly, text);
        g.setAttributeNS(null, 'id', this.id);

        if (this.copy) {
            g.setAttributeNS(null, 'class', 'copy');
        }

        this.g = g;
        this.poly = poly;
        this.text = text;
        this.r = r;

        if (!this.copy) {
            this.bindEvent(g);
        }

        parent.append(g);
    }

    bindEvent() {
        let canMove = false;
        let possibleRoute;
        let moveUnit;
        let possibleRouteDom;

        const handleMouseMove = (e) => {
            if (!canMove) {
                return;
            }

            if (!moveUnit) {
                moveUnit = createSvg('use');
                moveUnit.setAttributeNS(null, 'href', '#' + this.id);

                this.moveUnit = moveUnit;
                this.parent.append(moveUnit);
            }

            this.drawer.setUnitLocation(this.poly, this.text, e.offsetX, e.offsetY, this.r);
        };

        const handleEndClick = (e) => {
            const [movedX, movedY] = this.coord.getArrayCoord(e.offsetX, e.offsetY);

            let clientX, clientY;
            if (possibleRoute.includes(`${movedX},${movedY}`) && !this.coord.isSameCoord(movedX, movedY)) {
                [clientX, clientY] = this.coord.getClientCoord(movedX, movedY);
                const from = {
                    x: this.coord.x,
                    y: this.coord.y
                };

                const to = {
                    x: movedX,
                    y: movedY
                };
                emitChange(from, to);
                this.coord.setCoord(movedX, movedY);
            } else {
                [clientX, clientY] = this.coord.getClientCoord(this.coord.x, this.coord.y);
            }

            possibleRouteDom.forEach(solider => {
                solider.remove();
            })
        
            canMove = false;
            possibleRouteDom = null;
            possibleRoute = null;
            moveUnit.remove();
            moveUnit = null;

            this.drawer.setUnitLocation(this.poly, this.text, clientX, clientY, this.r);

            this.g.removeEventListener('mousemove', handleMouseMove);
        };

        const startClick = (e) => {
            if (!canMove) {
                const getIntCoord = coord => coord.split(',').map(v => parseInt(v));

                possibleRoute = this.possibleRoute();
                console.log(this.data, possibleRoute);
                possibleRouteDom = possibleRoute
                .filter(coord => {
                    const [x, y] = getIntCoord(coord);
                    return !this.coord.isSameCoord(x, y);
                }).map(coord => {
                    const [x, y] = getIntCoord(coord);
                    const soldier = new Soldier([], this.team, y, x, true);
                    soldier.draw(this.parent);
                    return soldier
                });

                this.g.addEventListener('mousemove', handleMouseMove);
                canMove = true;
            } else {
                handleEndClick(e);
            }
        };

        this.g.addEventListener('click', startClick);
    }

    possibleRoute() {
        const routeArray = [`${this.coord.x},${this.coord.y}`];
        const [dx, dy] = this.moveableDirection();

        for (let i=0; i<dx.length; i++) {
            const movedX = this.coord.x + dx[i];
            const movedY = this.coord.y + dy[i];
            
            if (isWall(movedX, movedY)) {
                console.log(this.data[movedY][movedX]);
                if (this.data[movedY][movedX] === 0 || this.data[movedY][movedX].team !== this.team) {
                    routeArray.push(`${movedX},${movedY}`);
                }
            }
        }
        return routeArray
    }

    moveableDirection() {
        let xDirections = [-1, 0, 1];
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
            yDirections.push(-1)
            yDirections.push(-1)
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
                yDirections.push(-1)
                yDirections.push(-1)
            }
        };

        return [xDirections, yDirections];
    }

    remove() {
        this.g.remove();
        if (this.moveUnit) {
            this.moveUnit.remove();
        }
    }
}