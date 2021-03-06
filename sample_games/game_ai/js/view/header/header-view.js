// Generated by CoffeeScript 1.6.3
var Header, R,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

R = Config.R;

Header = (function(_super) {
  __extends(Header, _super);

  Header.WIDTH = 600;

  function Header(x, y) {
    var offset;
    Header.__super__.constructor.apply(this, arguments);
    this.x = x;
    this.y = y;
    offset = 16;
    this.addView(new PlayerHp(offset + 8, offset));
    this.addView(new EnemyHp(Header.WIDTH / 2 + 8 + offset, offset));
    this.addView(new PlayerEnergy(8 + offset, 26 + offset));
    this.addView(new EnemyEnergy(Header.WIDTH / 2 + 8 + offset, 26 + offset));
    this.addView(new TimerView(8, 0));
  }

  return Header;

})(ViewGroup);
