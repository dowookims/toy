export default class GameEnd {
    constructor(winner, count) {
        const team = winner === 'cho' ? '초' : '한';
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
    }

    render(parent) {
        parent.append(this.dom);

        this.bindEvent();
    }

    bindEvent() {

    }

    htmlTemplate() {
        return `
            <div class="container">
                <div class="modal-content">
                    <div class="modal-header">
                        <p class="modal-header-title win-${this.winner}">${this.team}승리</p>
                        <p class="modal-header-description">${this.count}수 승리</p>
                    </div>
                </div>
            </div>
        `
    }
}