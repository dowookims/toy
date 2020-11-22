import { makePolygonPath, createText } from '../helper/index.js';

export default class Modal {
    constructor(params) {
        
    }

    render(parent) {
        this.dom = this.htmlTemplate();
        parent.innerHTML += this.dom;
        const positions = [
            ['마', '상', '상', '마'],
            ['마', '상', '마', '상'],
            ['상', '마', '상', '마'],
            ['상', '마', '마', '상']
        ]

        positions.forEach(position => {
            const svgWrapper = document.createElement('div');
            svgWrapper.className = 'svg-wrapper';
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            position.forEach((name, idx) => {
                const i = idx * 2 + 1;
                const p = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                const team = 'han';
                const t = createText(20 * i, 25, name, team);

                const path = makePolygonPath(20 * i, 25, 20);
                p.setAttributeNS(null, 'points', path);
                p.setAttributeNS(null, 'class', 'unit');
                svg.append(p);
                svg.append(t);
            })
            svg.setAttributeNS(null, 'width',  160);
            svg.setAttributeNS(null, 'height',  50);
            svg.setAttributeNS(null, 'class', 'position-item');
            svgWrapper.append(svg);
            parent.querySelector('.modal-position').append(svgWrapper);
        })
    }

    htmlTemplate() {
        return `
            <div class="modal">
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
                            <button class="position-submit">확인</button>
                        </div>
                    </div>
                </div>
            </div>
        `
    }
}