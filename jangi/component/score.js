export default class Score {
    constructor(cho, han) {
        this.dom = document.createElement('div');
        this.cho = { score: cho};
        this.han = { score: han};
    }

    draw(parent) {
        this.dom.className = 'score-board';
        this.dom.innerHTML = this.htmlDomString();
        this.cho.dom = this.dom.querySelector('.score-board-cho');
        this.han.dom = this.dom.querySelector('.score-board-han');
        this.cho.scoreDom = this.dom.querySelector('.cho-score');
        this.han.scoreDom = this.dom.querySelector('.han-score');
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
        `;
        return dom;
    }
}