import { createSvg, createText, makePolygonPath, emitCustomEvent } from '../helper/index.js';

import Coord from '../helper/coord.js';
import Drawer from '../helper/drawer.js';

export default class Unit {
	constructor({ data, team, y, x, name, korName, score }, radius, copy = false) {
		this.totalData = data;
		this.data = data.mapData;
		this.team = team;
		this.name = name;
		this.korName = korName;
		this.radius = radius;
		this.copy = copy;
		this.score = score;
		this.coord = new Coord(x, y);
		this.drawer = new Drawer(team);
	}

	preDraw() {
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

		this.g = g;
		this.poly = poly;
		this.text = text;
		this.r = r;
	}

	draw(parent) {
		this.preDraw();
		this.parent = parent;
		this.copy ? this.g.setAttributeNS(null, 'class', 'copy') : this.bindEvent();
		parent.append(this.g);
	}

	bindEvent() {
		let canMove = false;
		let moveUnit;
		let possibleRoute;
		let possibleRouteDom;

		const handleMouseMove = e => {
			if (!canMove) {
				return;
			}

			if (!moveUnit) {
				moveUnit = createSvg('use');
				moveUnit.setAttributeNS(null, 'href', `#${this.id}`);

				this.moveUnit = moveUnit;
				this.parent.append(moveUnit);
			}

			this.drawer.setUnitLocation(this.poly, this.text, e.offsetX, e.offsetY, this.r);
		};

		const handleEndClick = e => {
			const [movedX, movedY] = this.coord.getArrayCoord(e.offsetX, e.offsetY);

			let clientX;
			let clientY;

			if (possibleRoute.includes(`${movedX},${movedY}`) && !this.coord.isSameCoord(movedX, movedY)) {
				[clientX, clientY] = this.coord.getClientCoord(movedX, movedY);

				const from = {
					x: this.coord.x,
					y: this.coord.y,
				};

				const to = {
					x: movedX,
					y: movedY,
				};

				const detailObj = { from, to };

				emitCustomEvent('unitmove', detailObj);

				this.coord.setCoord(movedX, movedY);
			} else {
				[clientX, clientY] = this.coord.getClientCoord(this.coord.x, this.coord.y);
			}

			possibleRouteDom.forEach(routeDom => routeDom.remove());

			if (moveUnit) {
				moveUnit.remove();
			}

			canMove = false;
			possibleRouteDom = null;
			possibleRoute = null;
			moveUnit = null;

			this.possibleRoute().forEach(coord => {
				const [possibleX, possibleY] = this.getIntCoord(coord);
				const movedData = this.data[possibleY][possibleX];
				const enemyTeam = this.data[possibleY][possibleX].team;

				if (movedData !== 0 && this.team !== enemyTeam && movedData.korName === '왕') {
					const detailObj = { team: enemyTeam };
					emitCustomEvent('jang', detailObj);
				}
			});

			this.drawer.setUnitLocation(this.poly, this.text, clientX, clientY, this.r);

			window.removeEventListener('mousemove', handleMouseMove);
		};

		const startClick = e => {
			if (this.totalData.turn !== this.team) {
				return;
			}
			if (!canMove) {
				possibleRoute = this.possibleRoute();
				possibleRouteDom = this.makePossibleRouteDomArray(possibleRoute);
				possibleRouteDom.forEach(dom => dom.draw(this.parent));

				window.addEventListener('mousemove', handleMouseMove);
				canMove = true;
			} else {
				handleEndClick(e);
			}
		};
		this.g.addEventListener('click', startClick);
	}

	possibleRoute() {}

	getIntCoord(coord) {
		return coord.split(',').map(v => parseInt(v));
	}

	makePossibleRouteDomArray(possibleRoute) {
		return possibleRoute
			.filter(coord => {
				const [x, y] = this.getIntCoord(coord);

				return !this.coord.isSameCoord(x, y);
			})
			.map(coord => {
				const [x, y] = this.getIntCoord(coord);
				const data = this.getData(x, y);
				const unit = new Unit(data, this.radius, true);

				return unit;
			});
	}

	getData(x, y) {
		return {
			data: [],
			team: this.team,
			y,
			x,
			name: this.name,
			korName: this.korName,
			score: this.score,
		};
	}

	remove() {
		this.g.remove();
		if (this.moveUnit) {
			this.moveUnit.remove();
		}
	}
}
