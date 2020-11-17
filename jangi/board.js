import { Line } from './line.js';

export class Board {
    constructor(data) {
        this.totalData = data;
        this.data = data.data
        this.dom = document.createElement('div');
        this.innerDom = document.createElement('div');
        this.dom.classList.add('board');
        this.innerDom.classList.add('board-inner');
        this.x = 9;
        this.y = 10;
    }

    render(parent) {
        this.dom.append(this.innerDom);
        parent.appendChild(this.dom);
        this.draw();
        this.listenUnitChange();
    }

    draw() {
        const WIDTH = this.innerDom.clientWidth;
        const HEIGHT = this.innerDom.clientHeight;

        const VH = document.body.offsetHeight / 100;

        const X_PADDING = 3.6 * VH;
        const Y_PADDING = 4.8 * VH;

        const INNER_WIDTH = WIDTH - 2 * X_PADDING;
        const INNER_HEIGHT = HEIGHT - 2 * Y_PADDING;

        const X_WIDTH = INNER_WIDTH / (this.x -1);
        const Y_HEIGHT = INNER_HEIGHT / (this.y -1);

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svg = svg;

        const addPadding = (coord) => {
            for (let d in coord) {
                if (d.includes('x')) {
                    coord[d] += X_PADDING
                } else {
                    coord[d] += Y_PADDING
                }
            }
            return coord;
        }
        this.svg = svg;

        svg.setAttributeNS(null, 'width', WIDTH);
        svg.setAttributeNS(null, 'height', HEIGHT);

        for (let i=0; i<this.x; i++) {
            const lineCoord = addPadding({
                x1: X_WIDTH * i,
                y1: 0,
                x2: X_WIDTH * i,
                y2: INNER_HEIGHT 
            });

            this.drawLine(lineCoord, 'y');

            if (i === 3) {
                const crossLineCoord = addPadding({
                    x1: X_WIDTH * i,
                    y1: 0,
                    x2: X_WIDTH * (i+2),
                    y2: 2 * Y_HEIGHT
                });

                const crossLineCoord2 = addPadding({
                    x1: X_WIDTH * i,
                    y1: 7 * Y_HEIGHT,
                    x2: X_WIDTH * (i+2),
                    y2: INNER_HEIGHT
                });

                this.drawLine(crossLineCoord, 'y');
                this.drawLine(crossLineCoord2, 'y');

            } else if (i === 5) {
                const crossLineCoord = addPadding({
                    x1: X_WIDTH * i,
                    y1: 0,
                    x2: X_WIDTH * (i-2),
                    y2: 2* Y_HEIGHT
                });

                const crossLineCoord2 = addPadding({
                    x1: X_WIDTH * i,
                    y1: 7 * Y_HEIGHT,
                    x2: X_WIDTH * (i-2),
                    y2: INNER_HEIGHT
                });

                this.drawLine(crossLineCoord, 'y');
                this.drawLine(crossLineCoord2, 'y');
            }
        }

        for (let j=0; j<this.y; j++) {
            const lineCoord = addPadding({
                x1: 0,
                y1: Y_HEIGHT * j,
                x2: INNER_WIDTH,
                y2: Y_HEIGHT * j
            });

            this.drawLine(lineCoord, 'x');
        }

        this.drawGameData();
        this.innerDom.append(svg);
    }

    drawLine(coord, className) {
        const line = new Line(coord, className);
        line.draw(this.svg)
    }

    drawGameData() {
        for (let y=0; y<this.y; y++) {
            for (let x =0; x<this.x; x++) {
                if (this.data[y][x] !== 0) {
                    this.data[y][x].draw(this.svg);
                }
            }
        }
    }

    listenUnitChange() {
        this.svg.addEventListener('unitmove', (e) => {
            const { from, to } = e.detail;
            this.totalData.changeData(from, to);
        })
    }
}