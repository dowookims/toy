export default class Toast {
	constructor(message, parent) {
		this.message = message;
		this.parent = parent;
		this.render();
	}

	render() {
		const dom = document.createElement('div');
		dom.innerHTML = this.htmlTemplate();

		this.parent.append(dom);

		setTimeout(() => {
			dom.remove();
		}, 1000);
	}

	htmlTemplate() {
		return `
            <div class="toast">
                ${this.message}
            </div>
        `;
	}

	setMessage(message) {
		this.message = message;
	}
}
