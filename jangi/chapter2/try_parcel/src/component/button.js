import ButtonModal from "./buttonModal.js";

export default class Button {
    constructor(name, openMessage, clickFn) {
        const dom = document.createElement('button');
        dom.innerText = name;
        this.openMessage = openMessage;
        this.dom = dom;
        this.clickFn = clickFn;
    }

    draw(parent) {
        this.dom.addEventListener('click', () => this.onClick())
        parent.append(this.dom);
    }

    onClick() {
        const modal = new ButtonModal(this.openMessage, this.clickFn);
        modal.render();
    }
}
