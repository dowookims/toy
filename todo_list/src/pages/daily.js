export class Daily {
    constructor() {
        this.preRender();
    }
    preRender() {
        this.$dom = document.createElement('div');
        this.$dom.className = 'todo-today';
        this.$dom.innerHTML = this.html();
    }
    render($parent) {
        $parent.innerHTML = this.$dom.outerHTML;
    }
    html() {
        return `
            <div class="todo-today-title-div">
                <h2>Todays Tasks</h2>
            </div>
        `;
    }
}