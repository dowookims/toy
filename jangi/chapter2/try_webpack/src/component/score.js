import { emitCustomEvent } from '../helper/index.js';
import Button from './button.js';
import Timer from './timer.js';

export default class Score {
	constructor(cho, han) {
		this.dom = document.createElement('div');
		this.cho = { score: cho };
		this.han = { score: han };
	}

	draw(parent) {
		this.dom.className = 'score-board';
		this.dom.innerHTML = this.htmlDomString();
		this.cho.dom = this.dom.querySelector('.score-board-cho');
		this.han.dom = this.dom.querySelector('.score-board-han');
		this.cho.scoreDom = this.dom.querySelector('.cho-score');
		this.han.scoreDom = this.dom.querySelector('.han-score');
		this.buttonBox = this.dom.querySelector('.score-button-box');
		this.timerDom = this.dom.querySelector('.score-board-timer');
		this.cho.timer = new Timer();
		this.cho.timer.draw(this.timerDom);
		this.han.timer = new Timer();
		this.han.timer.draw(this.timerDom);
		this.drawButtons();
		parent.append(this.dom);
	}

	calculateScore(team, score) {
		this[team].score -= score;
		this[team].scoreDom.innerText = this[team].score;
	}

	changeTurn(team) {
		const currentTeam = team === 'cho' ? 'han' : 'cho';
		this[team].dom.classList.remove('turn');
		this[currentTeam].dom.classList.add('turn');
	}

	drawButtons() {
		this.renderUndoButton();
		this.renderDrawButton();
		this.renderGiveupButton();
	}

	renderDrawButton() {
		const clickEvent = () => emitCustomEvent('drawgame');
		const undoBtn = new Button('무승부', '무승부 하시겠습니까?', clickEvent);
		undoBtn.draw(this.buttonBox);
	}

	renderUndoButton() {
		const clickEvent = () => emitCustomEvent('undo');
		const undoBtn = new Button('무르기', '한 수 무르시겠습니까?', clickEvent);
		undoBtn.draw(this.buttonBox);
	}

	renderGiveupButton() {
		const clickEvent = () => emitCustomEvent('gameover');
		const giveupBtn = new Button('기권', '기권 하시겠습니까?', clickEvent);
		giveupBtn.draw(this.buttonBox);
	}

	htmlDomString() {
		const dom = `
            <div class="score-board-header">
                <p>장기 스코어 보드</p>
            </div>
            <div class="score-board-body">
                <div class="score-board-cho turn">
                    <p class="score-board-team">
                        초
                    </p>
                    <span class="cho-score">${this.cho.score}</span>
                </div>
                <div class="score-board-han">
                    <p class="score-board-team">
                        한
                    </p>
                    <span class="han-score">${this.han.score}</span>
                </div>
            </div>
            <div class="score-board-timer">
            </div>
            <div class="score-board-tool-box">
                <div class="score-button-box">
                </div>
            </div>
        `;
		return dom;
	}
}
