'use strict';

exports.__esModule = true;
exports.PinchCustomAttribute = undefined;

var _dec, _class;

var _aureliaFramework = require('aurelia-framework');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PinchCustomAttribute = exports.PinchCustomAttribute = (_dec = (0, _aureliaFramework.inject)(Element), _dec(_class = function () {
  function PinchCustomAttribute(element) {
    _classCallCheck(this, PinchCustomAttribute);

    this.element = element;
  }

  PinchCustomAttribute.prototype.attached = function attached() {
    var _this = this;

    var previousDistance = void 0;
    this.element.addEventListener('touchstart', function (e) {
      if (e.changedTouches.length > 1) {
        var previous = _this._readTouches(e.changedTouches);
        previousDistance = _this._distance({ ax: previous[1].x, ay: previous[1].y }, { bx: previous[0].x, by: previous[0].y });
      }
    }, false);
    this.element.addEventListener('touchmove', function (e) {
      if (e.changedTouches.length > 1 && previousDistance) {
        e.preventDefault();
        var end = _this._readTouches(e.changedTouches);
        var endDistance = _this._distance({ ax: end[1].x, ay: end[1].y }, { bx: end[0].x, by: end[0].y });

        if (endDistance > previousDistance) {
          _this.value({ pinch: 1 });
        } else {
          _this.value({ pinch: -1 });
        }
        previousDistance = endDistance;
      }
    }, false);
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
}()) || _class);