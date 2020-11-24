import { getInstance } from '../helper/index.js';
import { Line, Score } from '../component/index.js';
import Modal from '../component/modal.js';
import Toast from '../component/toast.js';
import GameEnd from '../component/gameend.js';

export class Board {
    constructor() {
        this.x = 9;
        this.y = 10;
        this.toast = null;
        this.preRender();
    }

    setData(data) {
        this.dataInstance = data;
        this.data = data.data;
    }

    preRender() {
        this.dom = document.createElement('div');
        this.innerDom = document.createElement('div');
        this.dom.classList.add('board');
        this.innerDom.classList.add('board-inner');
    }

    render(parent) {
        this.dom.append(this.innerDom);
        parent.appendChild(this.dom);

        this.setSize();
        this.draw();
        this.setScoreBoard(parent);
        this.listenEmitEvent();
        this.drawLine();
        this.setPositionModal();
    }

    setSize() {
        this.width = this.innerDom.clientWidth;
        this.height = this.innerDom.clientHeight;
    }

    draw() {
        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        this.svg.setAttributeNS(null, 'id', 'board');
        this.svg.setAttributeNS(null, 'width', this.width);
        this.svg.setAttributeNS(null, 'height', this.height);

        this.innerDom.append(this.svg);
    }

    setPositionModal() {
        this.positionModal = new Modal();
        this.positionModal.render(this.innerDom);
    }

    drawGameData() {
        for (let y = 0; y < this.y; y++) {
            for (let x = 0; x < this.x; x++) {
                if (this.data.mapData[y][x] !== 0) {
                    const data = this.data.mapData[y][x];
                    const unit = getInstance(data);
                    data.instance = unit;
                    unit.draw(this.svg);
                    this.dataInstance.addTeamData(data.team, unit);
                }
            }
        }
        console.log(this.data);
    }

    setScoreBoard(parent) {
        this.score = new Score(this.data.cho.score, this.data.han.score);
        this.score.draw(parent);
    }

    listenEmitEvent() {
        this.innerDom.addEventListener('setposition', (e) => {
            const {team, position} = e.detail;
            this.dataInstance.setPosition(team, position);
            this.positionModal.changeText();
        });

        this.innerDom.addEventListener('jangistart', () => {
            this.positionModal.remove();
            this.drawGameData();
        });

        this.innerDom.addEventListener('jang', (e) => {
            console.log(e);
            const attackedTeam = e.detail.team;
            this.data[attackedTeam].jang = true;
            if (!this.toast) {
                this.toast = new Toast('장군', this.innerDom);
            } else {
                this.toast.setMessage('장군');
                this.toast.render();
            }
        });

        this.innerDom.addEventListener('mung', (e) => {
            const depencedTeam = e.detail.team;
            this.data.data[depencedTeam].jang = false;

            this.toast.setMessage('멍군');
            this.toast.render();
        });

        this.innerDom.addEventListener('unitmove', (e) => {
            const { from, to } = e.detail;
            const result = this.dataInstance.changeData(from, to);
            if (result.length === 2) {
                const [team, score] = result;
                this.score.calculateScore(team, score);
                this.score.changeTurn(team);
            } else if (result.length === 1) {
                const [team] = result;
                this.score.changeTurn(team);
            }
        });

        this.svg.addEventListener('gameover', (e) => {
            const { winner } = e.detail;
            const end = new GameEnd(winner, this.data.count);
            end.render(this.innerDom);
        })
    }

    createLine(coord, className) {
        const line = new Line(coord, className);
        line.draw(this.svg)
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
}