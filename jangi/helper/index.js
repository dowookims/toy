export const makePolygonPath = (x, y, r) => {
    let path = '';
    const angle = 22.5;

    const coords = [
        [0, 0],
        [0, 0]
    ];

    for (let i=0; i<2; i++) {
        const currentAngle = angle + 45 * i;
        const dx =  Math.sin(currentAngle * Math.PI / 180) * r;
        const dy =  Math.cos(currentAngle * Math.PI / 180) * r;
        coords[i] = {x: dx, y: dy};
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
        path += `${dx}, ${dy} `
    })
    
    return path;
}

export const createText = (coordX, coordY, team, name) => {
    const compStyle = window.getComputedStyle(document.body);
    const em = compStyle.getPropertyValue('font-size').slice(0, 2);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    const textNode = document.createTextNode(name);
    const color = team === 'cho' ? 'green' : 'red';

    text.append(textNode);

    text.setAttributeNS(null, 'x', coordX - em / 2);
    text.setAttributeNS(null, 'y', coordY + em / 2);
    text.setAttributeNS(null, 'fill', color);
    return text
}

export const getClientCoord = (parent, x, y) => {
    const vh = document.body.offsetHeight / 100;
    const xRatio = (parent.width.animVal.value - 3.6 * 2 * vh) / 8;
    const yRatio = (parent.height.animVal.value - 4.8 * 2 * vh) / 9;

    const coordX = x * xRatio + 3.6 * vh;
    const coordY = y * yRatio + 4.8 * vh;
    return [coordX, coordY, yRatio];
}

export const getArrayCoord = (parent, x,y) => {
    const vh = document.body.offsetHeight / 100;
    let dx = (x -3.6 * vh) * 8 / (parent.width.animVal.value - 3.6 * 2 * vh);
    let dy = (y -4.8 * vh) * 9 / (parent.height.animVal.value - 4.8 * 2 * vh);
    return [dx, dy];
}

export const isRightCoord = (x,y) => {
    if (x > 8 || y > 9) {
        return false
    }
    x = Math.abs(x);
    y = Math.abs(y);
    const xLeft = (x * 10) % 10;
    const yLeft = (y * 10) % 10;

    
    return ((xLeft < 4 || xLeft > 6) && (yLeft <4 || yLeft > 6));
}

export const setUnitLocation = (poly, text, x, y, r) => {
    const em = window.getComputedStyle(document.body).getPropertyValue('font-size').slice(0,2);
    const path = makePolygonPath(x, y, r);
    text.setAttributeNS(null, 'x', x - em / 2);
    text.setAttributeNS(null, 'y', y + em / 2);
    poly.setAttributeNS(null, 'points', path);
}

export const isWall = (x,y) => x >= 0 && y >= 0 && x <= 8 && y <= 9;