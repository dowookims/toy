import Controller from './controller/index.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import './index.css';

class App {
	constructor() {
		this.dom = document.getElementById('app');
		this.controller = new Controller();
	}
}

new App()
