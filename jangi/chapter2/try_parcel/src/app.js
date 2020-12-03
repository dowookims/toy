import { Board } from './board.js';
import { GameData } from './gameData.js';

import "./index.css";
class App {
    constructor() {
        this.dom = document.getElementById('app');
        this.board = new Board();
    }
    render() {
        this.gameData = new GameData();
        this.board.setData(this.gameData);
        this.board.render(this.dom);
    }
}

new App().render();