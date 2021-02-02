export default class Header {
    constructor() {
        this.preRender();
    }

    preRender() {
        this.$dom = document.createElement('header');
        this.$dom.className = 'todo-header';
        this.$dom.innerHTML = this.html();
    }

    render($parent) {
        $parent.append(this.$dom);
    }

    html() {
        return `
            <p>만나서 반갑 투둡니다</p>
        `
    }
}