import {
    isWall,
    createSvg,
    emitChange
} from '../helper/index.js'

import Coord from '../helper/coord.js'
import Drawer from '../helper/drawer.js';

export default class Cannon {
    constructor(data = [], team = '', y, x, copy=false) {
        const id = `cannon${x}${y}`;
        this.name = '포';
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

        const r = this.coord.getRadius() * 0.35;
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
                possibleRouteDom = possibleRoute
                .filter(coord => {
                    const [x, y] = getIntCoord(coord);
                    return !this.coord.isSameCoord(x, y);
                }).map(coord => {
                    const [x, y] = getIntCoord(coord);
                    const cannon = new Cannon([], this.team, y, x, true);
                    cannon.draw(this.parent);
                    return cannon
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
            let movedX = this.coord.x + dx[i];
            let movedY = this.coord.y + dy[i];

            while(isWall(movedX, movedY)) {
                let movedCoordData = this.data[movedY][movedX];
                if (movedCoordData !== 0) {
                    if (movedCoordData.name === '포') {
                        break;
                    } else {
                        movedX += dx[i];
                        movedY += dy[i];
                        while(isWall(movedX, movedY)) {
                            movedCoordData = this.data[movedY][movedX];
                            if (movedCoordData !== 0) {
                                if (movedCoordData.name === '포' || movedCoordData.team === this.team) {
                                    break;
                                } else if (movedCoordData.team !== this.team) {
                                    routeArray.push(`${movedX},${movedY}`);
                                    movedX += dx[i];
                                    movedY += dy[i];
                                    break;
                                }
                            }
                            routeArray.push(`${movedX},${movedY}`);
                            movedX += dx[i];
                            movedY += dy[i];
                        }
                    }
                }

                movedX += dx[i];
                movedY += dy[i];
            }

            if (this.coord.x === 3) {
                if (this.coord.y === 2 || this.coord.y === 9) {
                    for (let trial = 1; trial < 3; trial ++) {
                        const movedX = this.coord.x + trial;
                        const movedY = this.coord.y - trial;
                        const movedCoordData = this.data[movedY][movedX];

                        if (trial === 1 && movedCoordData.name === '포') {
                            break;
                        }
                        if (trial === 2) {
                            if (movedCoordData.name === '포') {
                                break;
                            }
                            
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
                } else if (this.coord.y === 0 || this.coord.y === 7) {
                    for (let trial = 1; trial < 3; trial ++) {
                        const movedX = this.coord.x + trial;
                        const movedY = this.coord.y + trial;
                        const movedCoordData = this.data[movedY][movedX];
    
                        if (trial === 1 && movedCoordData.name === '포') {
                            break;
                        }
                        if (trial === 2) {
                            if (movedCoordData.name === '포') {
                                break;
                            }
                            
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
                }
            } else if (this.coord.x === 5) {
                if (this.coord.y === 2 || this.coord.y === 9) {
                    for (let trial = 1; trial < 3; trial ++) {
                        const movedX = this.coord.x - trial;
                        const movedY = this.coord.y - trial;
                        const movedCoordData = this.data[movedY][movedX];
    
                        if (trial === 1 && movedCoordData.name === '포') {
                            break;
                        }
                        if (trial === 2) {
                            if (movedCoordData.name === '포') {
                                break;
                            }
                            
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
                } else if (this.coord.y === 0 || this.coord.y === 7) {
                    for (let trial = 1; trial < 3; trial ++) {
                        const movedX = this.coord.x - trial;
                        const movedY = this.coord.y + trial;
                        const movedCoordData = this.data[movedY][movedX];
    
                        if (trial === 1 && movedCoordData.name === '포') {
                            break;
                        }
                        if (trial === 2) {
                            if (movedCoordData.name === '포') {
                                break;
                            }
                            
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
                }
            }
        }
        return routeArray
    }

    moveableDirection() {
        const dx = [-1, 0, 1, 0];
        const dy = [0, -1, 0, 1];

        return [dx, dy];
    }

    remove() {
        this.g.remove();
        if (this.moveUnit) {
            this.moveUnit.remove();
        }
    }
}