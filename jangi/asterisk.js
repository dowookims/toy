export class Asterisk {
    constructor(coords) {
        this.coords = coords;
        this.dom = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    }
}