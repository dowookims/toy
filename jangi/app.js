import { Board } from './board.js';
import { GameData } from './gameData.js';

class App {
    constructor() {
        this.dom = document.getElementById('app');
        this.gameData = new GameData();
        this.board = new Board(this.gameData);
    }
    render() {
        this.board.render(this.dom);
    }
}

new App().render();