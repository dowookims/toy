import { InputUser } from '../pages/index.js'
import Header from '../component/header.js';
import { Daily } from '../pages/daily.js';

export default class View {
    constructor(username) {
        this.username = username;
        this.preRender();
    }
    preRender() {
        this.$dom = document.createElement('main');
        this.header = new Header();
        this.page = this.page();
    }
    render($parent) {
        this.$parent = $parent;
        this.header.render($parent);
        this.page.render(this.$dom);
        $parent.append(this.$dom);
    }
    
    page() {
        return this.username ? new Daily() : new InputUser();
    }

    change() {
        this.page = new Daily();
        this.render(this.$parent);
    }
}