
export class GameData {
    constructor() {
        this.data = {
            mapData: Array.from(Array(10), () => { return Array(9).fill(0) }),
            han: {
                data: [],
                score: 73.5,
                jang: false,
                king: null
            },
            cho: {
                data: [],
                score: 72,
                jang: false,
                king: null
            },
            turn: 'cho'
        };
        this.count = 0;

        this.setData();
    }

    setData() {
        this.setSoldier();
        this.setScholar();
        this.setKing();
        this.setChariot();
        this.setCannon();
    }

    changeData(from, to) {
        const fromData = this.data.mapData[from.y][Math.abs(from.x)];
        const toData = this.data.mapData[to.y][Math.abs(to.x)];
        let result = [];

        if (toData !== 0 && fromData.team !== toData.team) {
            toData.instance.remove();
            this.removeTeamData(toData.team, toData.id);
            this.changeTurn();
            result = [toData.team, toData.score];
        } else if (toData === 0) {
            this.changeTurn();
            result = [fromData.team];
        }
        
        this.data.mapData[to.y][to.x] = fromData;
        this.data.mapData[from.y][from.x] = 0;
        
        return result;
    }

    gameover(winner) {
        this.data.turn = '';
        this.winner = winner;
    }

    changeTurn() {
        this.data.turn = this.data.turn === 'cho' ? 'han' : 'cho';
        this.count++;
    }

    addTeamData(team, unit) {
        this.data[team].data.push(unit);
    }

    removeTeamData(team, id) {
        const idx = this.data[team].data.findIndex(v => v.id === id);
        this.data[team].data.splice(idx, 1);
    }

    setPosition(team, index) {
        const positions = [
            [[1, '馬'], [2, '象'], [6, '象'], [7, '馬']],
            [[1, '馬'], [2, '象'], [6, '馬'], [7, '象']],
            [[1, '象'], [2, '馬'], [6, '象'], [7, '馬']],
            [[1, '象'], [2, '馬'], [6, '馬'], [7, '象']]
        ];

        const row = team === 'cho' ? 9 : 0;

        positions[index].forEach(position => {
            const [col, name] = position;
            const score = name === '馬' ? 5 : 3;
            const korName = name === '馬' ? '마' : '상';
            this.data.mapData[row][col] = {
                data: this.data,
                team,
                y: row,
                x: col,
                name,
                korName,
                score
            }
        })
    }

    iterateFirstLine(x1, x2, name, korName, score) {
        for (let i=0; i<2; i++) {
            const x = i === 0 ? x1 : x2;
            for (let j=0; j<2; j++) {
                const y = j === 0 ? 9 : 0;
                const team = j === 0 ? 'cho' : 'han';
                this.data.mapData[y][x] = {
                    data: this.data,
                    team,
                    y,
                    x,
                    name,
                    korName,
                    score
                };
            }
        }
    }

    setChariot() {
        this.iterateFirstLine(0, 8, '車', '차', 13);
    }

    setScholar() {
        this.iterateFirstLine(3, 5, '士', '사', 3);
    }

    setSoldier() {
        for (let i = 0; i < 5; i++) {
            const x = i * 2;
            for (let j = 0; j < 2; j++) {
                const y = j === 0 ? 6 : 3;
                const team = j === 0 ? 'cho' : 'han';
                const name = team === 'cho' ? '卒' : '兵'
                this.data.mapData[y][x] = {
                    data: this.data,
                    team,
                    y,
                    x,
                    name,
                    korName: '쫄',
                    score: 2
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
                const name = team === 'cho' ? '楚' :  '漢';
                this.data.mapData[y][x] = {
                    data: this.data,
                    team,
                    y,
                    x,
                    name,
                    korName: '왕',
                    score: 0
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
                this.data.mapData[y][x] = {
                    data: this.data,
                    team,
                    y,
                    x,
                    name: '包',
                    korName: '포',
                    score: 7
                };
            }
        }
    }

    reset() {
        this.data = {
            mapData: Array.from(Array(10), () => { return Array(9).fill(0) }),
            han: {
                data: [],
                score: 73.5,
                jang: false
            },
            cho: {
                data: [],
                score: 72,
                jang: false
            },
            turn: 'cho'
        };
        this.count = 0;

        this.setData();
    }
}