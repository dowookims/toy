import { ADD_USERNAME, NAME } from '../constant.js';
import View from '../view/view.js';

export default class Controller {
    constructor($app, model) {
        this.$app = $app;
        this.model = model
        this.view = new View(this.model.getName());
        this.render();
    }

    render() {
        this.view.render(this.$app);
        this.bindEvent();
    }

    bindEvent() {
        this.$app.addEventListener(ADD_USERNAME, e => this._saveUserData(e));
    }

    _saveUserData(e) {
        this.model.saveData(NAME, e.detail.username);
        this.view.change()
    }
}