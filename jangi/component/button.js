export default class Button {
    constructor(message, openMessage, openFn) {
        const dom = document.createElement('button');
        dom.innerText = message;
    }
}
