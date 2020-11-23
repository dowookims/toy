export default class A {
    constructor() {
        this.beforeRender();
    }

    beforeRender() {
        this.dom = `
            <div>
                <h1>A</h1>
            </div>
        `
    }

    render(parent) {
        parent.innerHTLM = `${this.dom}`;
    }
}