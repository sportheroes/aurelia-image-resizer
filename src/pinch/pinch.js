export class PinchCustomAttribute {
  attached() {
    let previousDistance;
    document.body.addEventListener('touchstart', this._touchstart = e => {
      previousDistance = 0;
    }, false);
    document.body.addEventListener('touchmove', this._touchmove = e => {
      if (e.targetTouches.length > 1) {
        e.preventDefault();
        const end = this._readTouches(e.targetTouches);
        const endDistance = this._distance({ ax: end[1].x, ay: end[1].y }, { bx: end[0].x, by: end[0].y });
        if (previousDistance) {
          if (endDistance > previousDistance) {
            this.value({ pinch: 1 });
          } else {
            this.value({ pinch: -1 });
          }
        }
        previousDistance = endDistance;
      }
    }, false);
  }
  detached() {
    document.body.removeEventListener('touchmove', this._touchmove);
    document.body.removeEventListener('touchstart', this._touchstart);
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
