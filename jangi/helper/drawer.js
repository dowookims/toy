export default class Drawer {
    constructor(team, name) {
        this.team = team;
        this.name = name;
        this.em = window.getComputedStyle(document.body).getPropertyValue('font-size').slice(0, 2);;
    }

    makePolygonPath(x, y, r) {
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

    createText(x, y) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        const textNode = document.createTextNode(this.name);
        const color = this.team === 'cho' ? 'green' : 'red';
    
        text.append(textNode);
        text.setAttributeNS(null, 'x', x - this.em / 2);
        text.setAttributeNS(null, 'y', y + this.em / 2);
        text.setAttributeNS(null, 'fill', color);
        return text
    }

    setUnitLocation = (poly, text, x, y, r) => {
        const path = this.makePolygonPath(x, y, r);
        text.setAttributeNS(null, 'x', x - this.em / 2);
        text.setAttributeNS(null, 'y', y + this.em / 2);
        poly.setAttributeNS(null, 'points', path);
    }
}