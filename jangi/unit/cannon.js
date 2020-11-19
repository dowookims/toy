import { isWall } from '../helper/index.js'

import Unit from './unit.js';

export default class Cannon extends Unit{
    constructor({data, team , y, x, name}, radius, copy=false) {
        super({data, team , y, x, name}, radius, copy);

        const id = `cannon${x}${y}`;
        this.id = this.copy ? id.concat('copy') : id;
    }

    draw(parent) {
        super.draw(parent);
    }

    bindEvent() {
        super.bindEvent()
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
        super.remove();
    }
}