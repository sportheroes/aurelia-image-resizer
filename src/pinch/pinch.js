import {inject} from 'aurelia-framework';

@inject(Element)
export class PinchCustomAttribute {
  constructor(element) {
    this.element = element;
  }

  attached() {
    let previousDistance;
    this.element.addEventListener('touchstart', e => {
      if (e.changedTouches.length > 1) {
        const previous = this._readTouches(e.changedTouches);
        previousDistance = this._distance({ ax: previous[1].x, ay: previous[1].y }, { bx: previous[0].x, by: previous[0].y });
      }
    }, false);
    this.element.addEventListener('touchmove', e => {
      if (e.changedTouches.length > 1 && previousDistance) {
        e.preventDefault();
        const end = this._readTouches(e.changedTouches);
        const endDistance = this._distance({ ax: end[1].x, ay: end[1].y }, { bx: end[0].x, by: end[0].y });

        if (endDistance > previousDistance) {
          this.value({ pinch: 1 });
        } else {
          this.value({ pinch: -1 });
        }
        previousDistance = endDistance;
      }
    }, false);
  }

  _distance({ ax, ay }, { bx, by }) {
    return Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2));
  }

  _readTouches(touches) {
    const touchesPositions = [];
    for (const k in Array.from(touches)) {
      touchesPositions.push({
        x: touches[k].screenX,
        y: touches[k].screenY
      });
    }
    return touchesPositions;
  }
}
