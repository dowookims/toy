import { TODO, NAME } from '../constant.js';

export default class Model {
    
    constructor() {
        this.todoData = this.loadData(TODO);
        this.nameData = this.loadData(NAME);
    }

    loadData(key) {
        const data = localStorage.getItem(key);
        if (data && data[0] === '{') {
            return JSON.parse(data)    
        }
        return data || null;
    }

    getName() {
        return this.nameData;
    }

    setName(name) {
        this.nameData = name;
        this.saveData(NAME, name)
    }

    saveData(key, value) {
        localStorage.setItem(key, value);
    }
}