import A from './a.js';
import B from './b.js';

import Router from './router.js';

export default class App {
    constructor() {
        this.router = new Router();
        this.dom = document.getElementById('app');
    }
    render() {
        const route = [
            {
                path:'/',
                component: new A()
            },
            {
                path: '/a',
                component: new A()
            },
            {
                path: '/b',
                component: new B()
            }
        ]
        this.router.add(route);
        this.router.ready();
    }
}

new App().render();