export default class ButtonModal {
	constructor(openMessage, clickFn) {
		this.openMessage = openMessage;
		this.clickFn = clickFn;
		this.preRender();
	}

	preRender() {
		const content = this.htmlTemplate();
		this.dom = document.createElement('div');
		this.dom.className = 'button-modal-shell';
		this.dom.innerHTML = content;
		this.messageDom = this.dom.querySelector('.button-modal-content');
		this.messageDom.innerText = this.openMessage;
		this.yesBtn = this.dom.querySelector('.button-modal-yes');
		this.noBtn = this.dom.querySelector('.button-modal-no');
	}

	render() {
		this.bindEvent();
		document.body.append(this.dom);
	}

	bindEvent() {
		this.noBtn.addEventListener('click', () => {
			this.dom.remove();
		});
		this.yesBtn.addEventListener('click', () => {
			this.clickFn();
			this.dom.remove();
		});
	}

	htmlTemplate() {
		return `
            <div class="button-modal-container">
                <div class="button-modal">
                    <div class="button-modal-content">
                    </div>
                    <div class="button-modal-buttons">
                        <button class="button-modal-yes">
                            예
                        </button>
                        <button class="button-modal-no">
                            아니오
                        </button>
                    </div>
                </div>
            </div>
        `;
	}
}
