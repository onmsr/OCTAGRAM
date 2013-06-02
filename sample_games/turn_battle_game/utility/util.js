// Generated by CoffeeScript 1.6.2
var Util;

Util = (function() {
  function Util() {}

  Util.includedAngle = function(vec1, vec2) {
    var dot, len1, len2, tmp;

    tmp = 1;
    if ((vec1.y * vec2.x - vec1.x * vec2.y) < 0) {
      tmp *= -1;
    }
    dot = vec1.x * vec2.x + vec1.y * vec2.y;
    len1 = Math.sqrt(vec1.x * vec1.x + vec1.y * vec1.y);
    len2 = Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y);
    return tmp * Math.acos(dot / (len1 * len2));
  };

  Util.toDeg = function(r) {
    return r * 180.0 / (Math.atan(1.0) * 4.0);
  };

  return Util;

})();
