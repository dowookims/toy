export default class B {
    constructor() {
        this.beforeRender();
    }

    beforeRender() {
        this.dom = `
            <div>
                <h1>B</h1>
            </div>
        `
    }

    render(parent) {
        parent.innerHTLM = `${this.dom}`;
    }
}