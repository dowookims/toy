import { makePolygonPath, createText } from '../helper/index.js';

export default class Modal {
    constructor() {
        this.trial = 1;
        this.team = 'han';
        this.selected = false;
        this.svgWrapperArr = [];
        this.textDomArr = [];
        this.positions = [
            ['마', '상', '상', '마'],
            ['마', '상', '마', '상'],
            ['상', '마', '상', '마'],
            ['상', '마', '마', '상']
        ];
        this.preRender();
    }

    preRender() {
        const container = this.htmlTemplate();
        this.dom = document.createElement('div');
        this.dom.className = 'modal';
        this.dom.innerHTML = container;
        this.positionDom = this.dom.querySelector('.modal-position');
    }

    render(parent) {
        parent.append(this.dom);

        this.positions.forEach((position, pid) => {
            const svg = this.makePositionSVG(pid);
            const svgWrapper = this.makeSVGWrapper(pid);

            position.forEach((name, idx) => {
                const index = idx * 2 + 1;
                const text = createText(20 * index, 25, name, this.team);
                const polygon = this.createPolygon(index);
                
                svg.append(polygon);
                svg.append(text);

                this.textDomArr.push(text);
            })

            svgWrapper.append(svg);
            this.positionDom.append(svgWrapper);
            this.svgWrapperArr.push(svgWrapper);
        });
        this.bindEvent();
    }

    bindEvent() {
        const btn = document.querySelector('.position-submit');

        this.svgWrapperArr.forEach(dom => {
            dom.addEventListener('click', (e) => {
                let target = e.target;

                while (!target.dataset.id) {
                    target = e.target.parentNode;
                }

                if (this.selectPosition) {
                    this.svgWrapperArr[this.selectPosition].classList.remove('selected')
                }
                this.selected = true;
                this.svgWrapperArr[target.dataset.id].classList.add('selected');
                this.selectPosition = target.dataset.id;
                btn.removeAttribute('disabled');
            })
        })

        btn.addEventListener('click', () => {
            if (!this.selected) {
                return;
            }
            const detail = {
                team: this.team,
                position: this.selectPosition,
            }
            this.emitEvent('setposition', detail);
            this.svgWrapperArr[this.selectPosition].classList.remove('selected');

            if (this.trial === 1) {
                this.team = 'cho';
                this.selectPosition = null;
                btn.setAttribute('disabled', 'true');
                this.trial++;
            } else {
                this.emitEvent('jangistart');
            }
        })
    }

    htmlTemplate() {
        return `
            <div class="container">
                <div class="modal-content">
                    <div class="modal-header">
                        <p class="modal-header-title">포진 선택</p>
                        <p class="modal-header-description">대국 시작시 상 / 마의 위치를 선택합니다.</p>
                    </div>
                    <div class="modal-body">
                        <div class="modal-position">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="position-submit" disabled>확인</button>
                    </div>
                </div>
            </div>
        `
    }

    changeText() {
        this.textDomArr.forEach(dom => {
            dom.setAttributeNS(null, 'fill', 'green');
        })
    }

    makeSVGWrapper(id) {
        const svgWrapper = document.createElement('div');
        svgWrapper.className = 'svg-wrapper';
        svgWrapper.dataset.id = id;
        return svgWrapper;
    }

    makePositionSVG(id) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.dataset.id = id;
        svg.setAttributeNS(null, 'width',  160);
        svg.setAttributeNS(null, 'height',  50);
        svg.setAttributeNS(null, 'class', 'position-item');
        return svg;
    }

    createPolygon(index) {
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        const path = makePolygonPath(20 * index, 25, 20);
        polygon.setAttributeNS(null, 'points', path);
        polygon.setAttributeNS(null, 'class', 'unit');
        return polygon;
    }

    remove() {
        this.trial = 1;
        this.team = 'han';
        this.selected = false;
        this.wrapperArray = [];
        this.textDomArray = [];
        document.querySelector('.modal').remove();
    }

    emitEvent(name, detail= {}) {
        const event = new CustomEvent(name, {detail});
        document.querySelector('.board-inner').dispatchEvent(event);
    }
}