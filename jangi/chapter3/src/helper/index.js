import { Soldier, Scholar, King, Chariot, Elephant, Horse, Cannon } from '../view/unit/index.js';

export const isWall = (x, y) => x >= 0 && y >= 0 && x <= 8 && y <= 9;

export const createSvg = name => document.createElementNS('http://www.w3.org/2000/svg', name);

export const emitCustomEvent = (name, detail) => {
	const event = new CustomEvent(name, { detail });
	document.querySelector('.board-inner').dispatchEvent(event);
};

export const jang = () => {
	const event = new CustomEvent('unitmove');
	document.getElementById('board').dispatchEvent(event);
};

export const getInstance = data => {
	const SMALL_SIZE_RADIUS = 0.25;
	const MIDDLE_SIZE_RADIUS = 0.35;
	const BIG_SIZE_RADIUS = 0.48;
	const SOLDIER = '쫄';
	const SCHOLAR = '사';
	const KING = '왕';
	const CHARIOT = '차';
	const ELEPHANT = '상';
	const HORSE = '마';
	const CANNON = '포';

	const { korName } = data;
	let unit;

	switch (korName) {
		case SOLDIER:
			unit = new Soldier(data, SMALL_SIZE_RADIUS);
			break;
		case SCHOLAR:
			unit = new Scholar(data, SMALL_SIZE_RADIUS);
			break;
		case CHARIOT:
			unit = new Chariot(data, MIDDLE_SIZE_RADIUS);
			break;
		case ELEPHANT:
			unit = new Elephant(data, MIDDLE_SIZE_RADIUS);
			break;
		case HORSE:
			unit = new Horse(data, MIDDLE_SIZE_RADIUS);
			break;
		case CANNON:
			unit = new Cannon(data, MIDDLE_SIZE_RADIUS);
			break;
		case KING:
			unit = new King(data, BIG_SIZE_RADIUS);
			break;
		default:
			break;
	}
	return unit;
};

export const makePolygonPath = (x, y, r) => {
	let path = '';
	const angle = 22.5;
	const coords = [
		[0, 0],
		[0, 0],
	];

	for (let i = 0; i < 2; i++) {
		const currentAngle = angle + 45 * i;
		const dx = Math.sin((currentAngle * Math.PI) / 180) * r;
		const dy = Math.cos((currentAngle * Math.PI) / 180) * r;
		coords[i] = { x: dx, y: dy };
	}

	const directions = [
		[-1 * coords[1].x, -1 * coords[1].y],
		[-1 * coords[0].x, -1 * coords[0].y],
		[coords[0].x, -1 * coords[0].y],
		[coords[1].x, -1 * coords[1].y],
		[coords[1].x, coords[1].y],
		[coords[0].x, coords[0].y],
		[coords[0].x * -1, coords[0].y],
		[-1 * coords[1].x, coords[1].y],
	];

	directions.forEach(direction => {
		const [mx, my] = direction;
		const dx = x + mx;
		const dy = y + my;
		path += `${dx}, ${dy} `;
	});

	return path;
};

export const createText = (x, y, name, team) => {
	const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	const textNode = document.createTextNode(name);
	const em = parseInt(getComputedStyle(document.body).getPropertyValue('font-size').slice(0, 2), 10);

	const color = team === 'cho' ? 'green' : 'red';

	text.append(textNode);
	text.setAttributeNS(null, 'x', x - em / 2);
	text.setAttributeNS(null, 'y', y + em / 2);
	text.setAttributeNS(null, 'fill', color);
	return text;
};
