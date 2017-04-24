'use strict';

System.register([], function (_export, _context) {
  "use strict";

  var PinchCustomAttribute;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [],
    execute: function () {
      _export('PinchCustomAttribute', PinchCustomAttribute = function () {
        function PinchCustomAttribute() {
          _classCallCheck(this, PinchCustomAttribute);
        }

        PinchCustomAttribute.prototype.attached = function attached() {
          var _this = this;

          var previousDistance = void 0;
          document.body.addEventListener('touchstart', this._touchstart = function (e) {
            previousDistance = 0;
          }, false);
          document.body.addEventListener('touchmove', this._touchmove = function (e) {
            if (e.targetTouches.length > 1) {
              e.preventDefault();
              var end = _this._readTouches(e.targetTouches);
              var endDistance = _this._distance({ ax: end[1].x, ay: end[1].y }, { bx: end[0].x, by: end[0].y });
              if (previousDistance) {
                if (endDistance > previousDistance) {
                  _this.value({ pinch: 1 });
                } else {
                  _this.value({ pinch: -1 });
                }
              }
              previousDistance = endDistance;
            }
          }, false);
        };

        PinchCustomAttribute.prototype.detached = function detached() {
          document.body.removeEventListener('touchmove', this._touchmove);
          document.body.removeEventListener('touchstart', this._touchstart);
        };

        PinchCustomAttribute.prototype._distance = function _distance(_ref, _ref2) {
          var ax = _ref.ax,
              ay = _ref.ay;
          var bx = _ref2.bx,
              by = _ref2.by;

          return Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2));
        };

        PinchCustomAttribute.prototype._readTouches = function _readTouches(touches) {
          var touchesPositions = [];
          for (var k in Array.from(touches)) {
            touchesPositions.push({
              x: touches[k].screenX,
              y: touches[k].screenY
            });
          }
          return touchesPositions;
        };

        return PinchCustomAttribute;
      }());

      _export('PinchCustomAttribute', PinchCustomAttribute);
    }
  };
});