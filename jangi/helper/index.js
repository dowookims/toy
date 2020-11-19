import { Soldier, Scholar, King, Chariot, Elephant, Horse, Cannon } from '../unit/index.js';

export const isWall = (x,y) => x >= 0 && y >= 0 && x <= 8 && y <= 9;

export const createSvg = (name) => document.createElementNS('http://www.w3.org/2000/svg', name);

export const emitChange = (from, to) => {
    const event = new CustomEvent('unitmove', {
        detail: {
            from,
            to
        }
    });
    document.getElementById('board').dispatchEvent(event);
}

export const getInstance = (data) => {
    const SMALL_SIZE_RADIUS = 0.25
    const MIDDLE_SIZE_RADIUS = 0.35;
    const BIG_SIZE_RADIUS = 0.48;
    const SOLDIER = "쫄";
    const SCHOLAR = "사";
    const KING = "왕";
    const CHARIOT = "차";
    const ELEPHANT = '상';
    const HORSE = '마';
    const CANNON = '포';

    const { name } = data;
    let unit;

    switch (name) {
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
    }
    return unit;
}