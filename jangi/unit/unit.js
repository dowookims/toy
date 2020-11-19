import {
    createSvg,
    emitChange
} from '../helper/index.js'

import Coord from '../helper/coord.js'
import Drawer from '../helper/drawer.js';

export default class Unit {
    constructor({data, team , y, x, name}, radius, copy=false) {
        this.data = data
        this.team = team;
        this.name = name;
        this.radius = radius;
        this.copy = copy;
        this.coord = new Coord(x, y);
        this.drawer = new Drawer(team, this.name);
    }

    draw(parent) {
        this.parent = parent;
        const [coordX, coordY] = this.coord.getClientCoord(this.coord.x, this.coord.y);
        const r = this.coord.getRadius() * this.radius;
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

                possibleRouteDom = possibleRoute
                .filter(coord => {
                    const [x, y] = getIntCoord(coord);
                    return !this.coord.isSameCoord(x, y);
                }).map(coord => {
                    const [x, y] = getIntCoord(coord);

                    const data = {
                        data: [],
                        team: this.team,
                        y, 
                        x,
                        name: this.name
                    }

                    const unit = new Unit(data, this.radius, true);
                    unit.draw(this.parent);
                    return unit
                });

                this.g.addEventListener('mousemove', handleMouseMove);
                canMove = true;
            } else {
                handleEndClick(e);
            }
        };

        this.g.addEventListener('click', startClick);
    }

    possibleRoute() {}

    remove() {
        this.g.remove();
        if (this.moveUnit) {
            this.moveUnit.remove();
        }
    }
}