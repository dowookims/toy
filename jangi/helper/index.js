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
    const SOLDIER = "쫄";
    const SCHOLAR = "사";
    const KING = "왕";
    const CHARIOT = "차";
    const ELEPHANT = '상';
    const HORSE = '마';
    const CANNON = '포';

    const { team, y, x, name } = data;
    let unit;
    switch (name) {
        case SOLDIER:
            unit = new Soldier(data.data, team, y, x);
            break;
        case SCHOLAR:
            unit = new Scholar(data.data, team, y, x);
            break;
        case KING:
            unit = new King(data.data, team, y, x);
            break;
        case CHARIOT:
            unit = new Chariot(data.data, team, y, x);
            break;
        case ELEPHANT:
            unit = new Elephant(data.data, team, y, x);
            break;
        case HORSE:
            unit = new Horse(data.data, team, y, x);
            break;
        case CANNON:
            unit = new Cannon(data.data, team, y, x);
            break;
    }
    return unit;
}