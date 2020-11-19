// import { Soldier, Scholar, King, Horse, Elephant, Chariot, Cannon } from './unit/index.js'

export class GameData {
    constructor() {
        this.data = Array.from(Array(10), () => { return Array(9).fill(0) });
        this.hanData = this.data = Array.from(Array(10), () => { return Array(9).fill(0) });
        this.choData = this.data = Array.from(Array(10), () => { return Array(9).fill(0) });

        this.setData();
    }

    setData() {
        this.setSoldier();
        this.setScholar();
        this.setKing();
        this.setHorse();
        this.setElephant();
        this.setChariot();
        this.setCannon();
    }

    iterateFirstLine(x1, x2, name) {
        for (let i=0; i<2; i++) {
            const x = i === 0 ? x1 : x2;
            for (let j=0; j<2; j++) {
                const y = j === 0 ? 9 : 0;
                const team = j === 0 ? 'cho' : 'han';
                this.data[y][x] = {
                    data: this.data,
                    team,
                    y,
                    x,
                    name
                };
            }
        }
    }

    setChariot() {
        this.iterateFirstLine(0, 8, '차');
    }

    setHorse() {
        this.iterateFirstLine(1, 7, '마');
    }

    setElephant() {
        this.iterateFirstLine(2, 6, '상');
    }

    setScholar() {
        this.iterateFirstLine(3, 5, '사');
    }

    setSoldier() {
        for (let i = 0; i < 5; i++) {
            const x = i * 2;
            for (let j = 0; j < 2; j++) {
                const y = j === 0 ? 6 : 3;
                const team = j === 0 ? 'cho' : 'han';
                this.data[y][x] = {
                    data: this.data,
                    team,
                    y,
                    x,
                    name: '쫄'
                };
            }
        }
    }

    setKing() {
        for (let i=0; i<2; i++) {
            const x = 4;
            for (let j=0; j<2; j++) {
                const y = j === 0 ? 8 : 1;
                const team = j === 0 ? 'cho' : 'han';
                this.data[y][x] = {
                    data: this.data,
                    team,
                    y,
                    x,
                    name: '왕'
                };
            }
        }
    }

    setCannon() {
        for (let i=0; i<2; i++) {
            const x = i === 0 ? 1 : 7;
            for (let j=0; j<2; j++) {
                const y = j === 0 ? 7 : 2;
                const team = j === 0 ? 'cho' : 'han';
                this.data[y][x] = {
                    data: this.data,
                    team,
                    y,
                    x,
                    name: '포'
                };
            }
        }
    }

    changeData(from, to) {
        const fromData = this.data[from.y][Math.abs(from.x)];
        const toData = this.data[to.y][Math.abs(to.x)];
        if (toData !== 0 && fromData.team !== toData.team) {
            toData.instance.remove();
        }
        
        this.data[to.y][to.x] = fromData;
        this.data[from.y][from.x] = 0;
    }

    gameover(winner) {
        this.winner = winner;
    }
}