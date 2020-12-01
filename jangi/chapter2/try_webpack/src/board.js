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
        this.moveAudio = new Audio('../assets/move1.wav');
        this.jangAudio = new Audio('../assets/janggun_m.wav');
    }

    render(parent) {
        this.parent = parent;
        this.dom.append(this.innerDom);
        parent.appendChild(this.dom);

        this.setSize();
        this.draw();
        this.setScoreBoard(parent);
        this.setPositionModal();
        this.listenEmitEvent();
        this.drawLine();
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
                    if (unit.size === 'big') {
                        this.data[unit.team].king = unit;
                    }
                    unit.draw(this.svg);
                    this.dataInstance.addTeamData(data.team, unit);
                }
            }
        }
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
            this.score.cho.timer.start();
        });

        this.innerDom.addEventListener('jang', (e) => {
            const attackedTeam = e.detail.team;
            console.log(this.data, 'board data');
            this.data[attackedTeam].jang = true;
            if (!this.toast) {
                this.toast = new Toast('장군', this.innerDom);
            } else {
                this.toast.setMessage('장군');
                this.toast.render();
            }
            this.jangAudio.play();
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
            const currentTeam = this.data.turn === 'cho' ? 'han' : 'cho';
            const nextTeam = this.data.turn;
            if (result.length === 2) {
                const [team, score] = result;
                this.score.changeTurn(team);
                this.score.calculateScore(team, score);
            } else {
                const [team] = result;
                this.score.changeTurn(team);
            }
            
            this.moveAudio.play();
            this.score[currentTeam].timer.stop();
            this.score[nextTeam].timer.start();
        });

        this.innerDom.addEventListener('drawgame', () => {
            const end = new GameEnd();
            end.render(this.innerDom);
        })

        this.innerDom.addEventListener('gameover', (e) => {
            let winner = this.data.turn === 'cho' ? 'han' : 'cho';

            if (e.detail) {
                winner = e.detail.winner;
            }
            const end = new GameEnd(winner, this.data.count);
            end.render(this.innerDom);
        })

        this.innerDom.addEventListener('replay', () => {
            this.score.dom.remove();
            this.dataInstance.reset();
            this.svg.remove();
            this.draw();
            this.drawLine();
            this.setScoreBoard(this.parent);
            this.drawGameData();
            this.setPositionModal();
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