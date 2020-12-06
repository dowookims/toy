import { makePolygonPath } from './index.js';
export default class Drawer {
  constructor(team) {
    this.team = team;
    this.em = window.getComputedStyle(document.body).getPropertyValue('font-size').slice(0, 2);
  }

  setUnitLocation = (poly, text, x, y, r) => {
    const path = makePolygonPath(x, y, r);
    text.setAttributeNS(null, 'x', x - this.em / 2);
    text.setAttributeNS(null, 'y', y + this.em / 2);
    poly.setAttributeNS(null, 'points', path);
  };
}
