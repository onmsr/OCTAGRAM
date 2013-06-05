// Generated by CoffeeScript 1.6.2
var TipBackground;

TipBackground = (function() {
  function TipBackground(x, y, xnum, ynum) {
    var background, border, i, image, j, map, margin, space, tip, _i, _j, _ref, _ref1;

    border = Resources.get("mapBorder");
    background = Resources.get("mapTip");
    tip = Resources.get("emptyTip");
    margin = (background.width - 1 - tip.width) / 2;
    space = margin * 2 + tip.width;
    x += border.height;
    y += border.height;
    for (i = _i = -1, _ref = xnum + 1; -1 <= _ref ? _i < _ref : _i > _ref; i = -1 <= _ref ? ++_i : --_i) {
      for (j = _j = -1, _ref1 = ynum + 1; -1 <= _ref1 ? _j < _ref1 : _j > _ref1; j = -1 <= _ref1 ? ++_j : --_j) {
        image = background;
        map = new Sprite(image.width, image.height);
        map.image = image;
        map.moveTo(x + j * space, y + i * space);
        LayerUtil.setOrder(map, Environment.layer.background);
        Game.instance.currentScene.addChild(map);
      }
    }
  }

  return TipBackground;

})();
