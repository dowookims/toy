import {
    createSvg,
    emitChange,
    createText,
    makePolygonPath
} from '../helper/index.js'

import Coord from '../helper/coord.js'
import Drawer from '../helper/drawer.js';

export default class Unit {
    constructor({data, team , y, x, name, score}, radius, copy=false) {
        this.data = data
        this.team = team;
        this.name = name;
        this.radius = radius;
        this.copy = copy;
        this.score = score;
        this.coord = new Coord(x, y);
        this.drawer = new Drawer(team, this.name);
    }

    draw(parent) {
        this.parent = parent;
        const [coordX, coordY] = this.coord.getClientCoord(this.coord.x, this.coord.y);
        const r = this.coord.getRadius() * this.radius;
        const g = createSvg('g');
        const poly = createSvg('polygon');
        const text = createText(coordX, coordY, this.name, this.team);
        const points = makePolygonPath(coordX, coordY, r);

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
            this.bindEvent();
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

            possibleRouteDom.forEach(routeDom => {
                routeDom.remove();
            })
        
            canMove = false;
            possibleRouteDom = null;
            possibleRoute = null;
            if (moveUnit) {
                moveUnit.remove();
            }
            moveUnit = null;

            this.possibleRoute().forEach(coord => {
                const [x,y] = coord.split(',').map(v => parseInt(v));
                if(this.data[y][x] !== 0 && this.team !== this.data[y][x].team && this.data[y][x].name === "왕") {
                    const event = new CustomEvent('jang');
                    document.querySelector('.board-inner').dispatchEvent(event);
                }
            })

            this.drawer.setUnitLocation(this.poly, this.text, clientX, clientY, this.r);

            window.removeEventListener('mousemove', handleMouseMove);
        };

        const startClick = (e) => {
            if (this.data.turn !== this.team) {
                return;
            }
            if (!canMove) {
                const getIntCoord = coord => coord.split(',').map(v => parseInt(v));

                possibleRoute = this.possibleRoute();
                possibleRouteDom = possibleRoute
                .filter(coord => {
                    const [x, y] = getIntCoord(coord);
                    return !this.coord.isSameCoord(x, y);
                }).map(coord => {
                    const [x, y] = getIntCoord(coord);

                    const data = this.getData(x, y);

                    const unit = new Unit(data, this.radius, true);
                    unit.draw(this.parent);
                    return unit;
                });

                window.addEventListener('mousemove', handleMouseMove);
                canMove = true;
            } else {
                handleEndClick(e);
            }
        };
        this.g.addEventListener('click', startClick);
    }

    possibleRoute() {}

    getData(x, y) {
        return {
            data: [],
            team: this.team,
            y, 
            x,
            name: this.name,
            score: this.score
        }
    }

    remove() {
        this.g.remove();
        if (this.moveUnit) {
            this.moveUnit.remove();
        }
    }
}