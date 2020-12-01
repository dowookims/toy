import { emitCustomEvent } from "../helper/index.js";

export default class GameEnd {
    constructor(winner = '무승부', count = 0) {
        const team = winner === 'cho' ? '초' : '한';
        this.draw = winner === '무승부';
        this.team = team;
        this.winner = winner;
        this.count = count;
        this.preRender();
    }

    preRender() {
        const container = this.htmlTemplate();
        this.dom = document.createElement('div');
        this.dom.className = 'modal';
        this.dom.innerHTML = container;
        this.replayButton = this.dom.querySelector('.replay');
    }

    render(parent) {
        parent.append(this.dom);

        this.bindEvent();
    }

    bindEvent() {
        this.replayButton.addEventListener('click', () => {
            emitCustomEvent('replay');
            this.dom.remove();
        });
    }

    htmlTemplate() {
        const drawMessage = `
            <p class="modal-header-description">무승부</p>
        `
        const giveUpMessage = `
            <p class="modal-header-title win-${this.winner}">${this.team}승리</p>
            <p class="modal-header-description">${this.count}수 승리</p>
        `

        return `
            <div class="container">
                <div class="modal-content">
                    <div class="modal-header">
                        ${this.draw ? drawMessage : giveUpMessage}
                    </div>
                    <div class="modal-body">
                        <button class="replay">다시하기</button>
                    </div>
                </div>
            </div>
        `
    }
}