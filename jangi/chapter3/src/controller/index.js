import Board from '../view/board.js';
import GameData from '../model/gameData.js';

export default class Controller {
    constructor() {
        this.board = new Board();
        this.gameData = new GameData();
    }

    listenEmitEvent() {
		this.innerDom.addEventListener('setposition', e => {
			const { team, position } = e.detail;
			this.dataInstance.setPosition(team, position);
			this.positionModal.changeText();
		});

		this.innerDom.addEventListener('jangistart', () => {
			this.positionModal.remove();
			this.drawGameData();
			this.score.cho.timer.start();
		});

		this.innerDom.addEventListener('jang', e => {
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

		this.innerDom.addEventListener('mung', e => {
			const depencedTeam = e.detail.team;
			this.data.data[depencedTeam].jang = false;

			this.toast.setMessage('멍군');
			this.toast.render();
		});

		this.innerDom.addEventListener('unitmove', e => {
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
		});

		this.innerDom.addEventListener('gameover', e => {
			let winner = this.data.turn === 'cho' ? 'han' : 'cho';

			if (e.detail) {
				winner = e.detail.winner;
			}
			const end = new GameEnd(winner, this.data.count);
			end.render(this.innerDom);
		});

		this.innerDom.addEventListener('replay', () => {
			this.score.dom.remove();
			this.dataInstance.reset();
			this.svg.remove();
			this.draw();
			this.drawLine();
			this.setScoreBoard(this.parent);
			this.drawGameData();
			this.setPositionModal();
		});
	}
}