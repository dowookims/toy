import { emitCustomEvent } from "../helper/index.js";

export default class Timer {
    constructor() {
        this.time = 60 * 10;
        this.count = 3;
        this.countTime = 30;
        this.timer = null;
    }

    draw(parent) {
        const content = this.htmlTemplate();
        this.dom = document.createElement('div');
        this.dom.className = 'timer-dom';
        this.dom.innerHTML = content;
        this.timerDom = this.dom.querySelector('.time');
        this.countDom = this.dom.querySelector('.counting-num');
        parent.append(this.dom);
    }

    start() {
        if (this.timer) {
            return;
        }
        this.timer = setInterval(() => {
            if (this.time > 0) {
                this.timerDom.innerText = this.timeToText(--this.time);
            } else {
                if (this.countTime > 0) {
                    this.timerDom.innerText = this.timeToText(this.countTime--);
                } else if (this.count > 0) {
                    this.count--;
                    this.countDom.innerText = this.count;
                    this.countTime = 30;
                    this.timerDom.innerText = this.timeToText(this.countTime--);
                } else {
                    emitCustomEvent('gameover');
                    this.stop();
                }
            }
        }, 1000);
    }

    stop() {
        clearInterval(this.timer);
        this.timer = null;
    }

    timeToText(time) {
        const timeToMinute = (time) => {
            let m = '' + parseInt(time / 60);
            if (m.length === 1) {
                m = 0 + m;
            }
            return m;
        };
        const timeToSec = (time) => {
            let s = '' + time % 60;
            if (s.length === 1) {
                s = 0 + s;
            }
            return s;
        }
        return `${timeToMinute(time)}:${timeToSec(time)}`;
    }

    htmlTemplate() {
        return `
            <div class="time">
                ${this.timeToText(this.time)}
            </div>
            <div class="counting">
                <span class="counting-name">초세기</span>
                <span class="counting-num">${this.count}</span>
            </div>
        `
    }
}