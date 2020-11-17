import { Soldier, Scholar, King, Horse, Elephant, Chariot, Cannon } from './unit/index.js'

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

    setSoldier() {
        for (let i = 0; i < 5; i++) {
            const x = i * 2;
            for (let j = 0; j < 2; j++) {
                const y = j === 0 ? 6 : 3;
                const team = j === 0 ? 'cho' : 'han';
                this.data[y][x] = new Soldier(this.data, team, y, x);
                if (team === 'han') {
                    this.hanData[y][x] = new Soldier(this.data, team, y, x);
                } else {
                    this.choData[y][x] = new Soldier(this.data, team, y, x);
                }
            }
        }
    }

    setScholar() {
        for (let i=0; i<2; i++) {
            const x = i === 0 ? 3 : 5;
            for (let j=0; j<2; j++) {
                const y = j === 0 ? 9 : 0;
                const team = j === 0 ? 'cho' : 'han';
                this.data[y][x] = new Scholar(this.data, team, y, x);
                if (team === 'han') {
                    this.hanData[y][x] = new Scholar(this.data, team, y, x);
                } else {
                    this.choData[y][x] = new Scholar(this.data, team, y, x);
                }
            }
        }
    }

    setKing() {
        for (let i=0; i<2; i++) {
            const x = 4;
            for (let j=0; j<2; j++) {
                const y = j === 0 ? 8 : 1;
                const team = j === 0 ? 'cho' : 'han';
                this.data[y][x] = new King(this.data, team, y, x);
                if (team === 'han') {
                    this.hanData[y][x] = new King(this.data, team, y, x);
                } else {
                    this.choData[y][x] = new King(this.data, team, y, x);
                }
            }
        }
    }

    setHorse() {
        for (let i=0; i<2; i++) {
            const x = i === 0 ? 1 : 7;
            for (let j=0; j<2; j++) {
                const y = j === 0 ? 9 : 0;
                const team = j === 0 ? 'cho' : 'han';
                this.data[y][x] = new Horse(team, y, x);
                if (team === 'han') {
                    this.hanData[y][x] = new Horse(team, y, x);
                } else {
                    this.choData[y][x] = new Horse(team, y, x);
                }
            }
        }
    }

    setElephant() {
        for (let i=0; i<2; i++) {
            const x = i === 0 ? 2 : 6;
            for (let j=0; j<2; j++) {
                const y = j === 0 ? 9 : 0;
                const team = j === 0 ? 'cho' : 'han';
                this.data[y][x] = new Elephant(team, y, x);
                if (team === 'han') {
                    this.hanData[y][x] = new Elephant(team, y, x);
                } else {
                    this.choData[y][x] = new Elephant(team, y, x);
                }
            }
        }
    }

    setChariot() {
        for (let i=0; i<2; i++) {
            const x = i === 0 ? 0 : 8;
            for (let j=0; j<2; j++) {
                const y = j === 0 ? 9 : 0;
                const team = j === 0 ? 'cho' : 'han';
                this.data[y][x] = new Chariot(team, y, x);
                if (team === 'han') {
                    this.hanData[y][x] = new Chariot(team, y, x);
                } else {
                    this.choData[y][x] = new Chariot(team, y, x);
                }
            }
        }
    }

    setCannon() {
        for (let i=0; i<2; i++) {
            const x = i === 0 ? 1 : 7;
            for (let j=0; j<2; j++) {
                const y = j === 0 ? 7 : 2;
                const team = j === 0 ? 'cho' : 'han';
                this.data[y][x] = new Cannon(team, y, x);
                if (team === 'han') {
                    this.hanData[y][x] = new Cannon(team, y, x);
                } else {
                    this.choData[y][x] = new Cannon(team, y, x);
                }
            }
        }
    }

    listenUnitChange() {

    }

    changeData(from, to) {
        const fromData = this.data[from.y][Math.abs(from.x)];
        const toData = this.data[to.y][Math.abs(to.x)];
        if (toData !== 0 && fromData.team !== toData.team) {
            toData.remove();
        }
        
        this.data[to.y][to.x] = fromData;
        this.data[from.y][from.x] = 0;
    }
}