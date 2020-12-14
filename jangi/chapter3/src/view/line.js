export default class Line {
	constructor(coord, className = '') {
		this.coord = coord;
		this.dom = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		this.dom.classList.add(className);
	}

	draw(parent) {
		for (const key in this.coord) {
			this.dom.setAttributeNS(null, key, this.coord[key]);
		}
		parent.append(this.dom);
	}
}
