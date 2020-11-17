import { makePolygonPath, createText, getClientCoord } from '../helper/index.js'

export default class Cannon {
    constructor(team, y, x) {
        this.y = y;
        this.x = x;
        this.team = team;
    }

    draw(parent) {
        const [coordX, coordY, ratio] = getClientCoord(parent, this.x, this.y);

        const r = ratio * 0.33;

        const dom = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        const text = createText(coordX, coordY, this.team, '포');
        const path = makePolygonPath(coordX, coordY, r);

        dom.setAttributeNS(null, 'points', path)
        
        dom.classList.add('unit');
        parent.append(dom);
        parent.append(text);
    }
}