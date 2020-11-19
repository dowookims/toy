import { getInstance } from './helper/index.js';
import { Line } from './line.js';

export class Board {
    constructor() {
        this.dom = document.createElement('div');
        this.innerDom = document.createElement('div');
        this.dom.classList.add('board');
        this.innerDom.classList.add('board-inner');
        this.x = 9;
        this.y = 10;
    }

    setData(data) {
        this.totalData = data;
        this.data = data.data
    }

    render(parent) {
        this.dom.append(this.innerDom);
        parent.appendChild(this.dom);
        this.width = this.innerDom.clientWidth;
        this.height = this.innerDom.clientHeight;
        this.draw();
        this.listenEmitEvent();
    }

    draw() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        svg.setAttributeNS(null, 'id', 'board');
        svg.setAttributeNS(null, 'width', this.width);
        svg.setAttributeNS(null, 'height', this.height);
        this.svg = svg;
        this.innerDom.append(svg);

        this.drawLine();
        this.drawGameData();
    }

    drawLine() {
        const VH = document.body.offsetHeight / 100;

        const X_PADDING = 3.6 * VH;
        const Y_PADDING = 4.8 * VH;

        const INNER_WIDTH = this.width - 2 * X_PADDING;
        const INNER_HEIGHT = this.height - 2 * Y_PADDING;

        const X_WIDTH = INNER_WIDTH / (this.x -1);
        const Y_HEIGHT = INNER_HEIGHT / (this.y -1);

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
        
        for (let i=0; i<this.x; i++) {
            const lineCoord = addPadding({
                x1: X_WIDTH * i,
                y1: 0,
                x2: X_WIDTH * i,
                y2: INNER_HEIGHT 
            });

            this.createLine(lineCoord, 'y');

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

                this.createLine(crossLineCoord, 'y');
                this.createLine(crossLineCoord2, 'y');

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

                this.createLine(crossLineCoord, 'y');
                this.createLine(crossLineCoord2, 'y');
            }
        }

        for (let j=0; j<this.y; j++) {
            const lineCoord = addPadding({
                x1: 0,
                y1: Y_HEIGHT * j,
                x2: INNER_WIDTH,
                y2: Y_HEIGHT * j
            });

            this.createLine(lineCoord, 'x');
        }
    }

    createLine(coord, className) {
        const line = new Line(coord, className);
        line.draw(this.svg)
    }

    drawGameData() {
        for (let y=0; y<this.y; y++) {
            for (let x =0; x<this.x; x++) {
                if (this.data[y][x] !== 0) {
                    const data = this.data[y][x];
                    const s = getInstance(data);
                    data.instance = s;
                    s.draw(this.svg);
                }
            }
        }
    }

    listenEmitEvent() {
        this.svg.addEventListener('unitmove', (e) => {
            const { from, to } = e.detail;
            this.totalData.changeData(from, to);
        });
        this.svg.addEventListener('gameover', (e) => {
            const { winner } = e.detail;
            this.totalData.gameover(winner);
        })
    }
}