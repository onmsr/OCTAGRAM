// Generated by CoffeeScript 1.6.3
var GroupedSprite, ImageSprite, SpriteGroup, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

SpriteGroup = (function(_super) {
  __extends(SpriteGroup, _super);

  function SpriteGroup(image) {
    SpriteGroup.__super__.constructor.call(this);
    if (image) {
      this.sprite = new Sprite(image.width, image.height);
      this.sprite.image = image;
    }
  }

  SpriteGroup.prototype.topGroup = function() {
    var top;
    top = this;
    while (top.parentNode && !(top.parentNode instanceof Scene)) {
      top = top.parentNode;
    }
    return top;
  };

  SpriteGroup.prototype.getAbsolutePosition = function() {
    var parent, pos;
    pos = {
      x: this.x,
      y: this.y
    };
    parent = this.parentNode;
    while ((parent != null) && !(parent instanceof Scene)) {
      pos.x += parent.x;
      pos.y += parent.y;
      parent = parent.parentNode;
    }
    return pos;
  };

  SpriteGroup.prototype.setOpacity = function(opacity) {
    var child, _i, _len, _ref, _results;
    _ref = this.childNodes;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      if (child instanceof Sprite) {
        _results.push(child.opacity = opacity);
      } else if (child instanceof SpriteGroup) {
        _results.push(child.setOpacity(opacity));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  SpriteGroup.prototype.setVisible = function(visible) {
    var child, _i, _len, _ref, _results;
    _ref = this.childNodes;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      if (child instanceof Sprite) {
        _results.push(child.visible = visible);
      } else if (child instanceof SpriteGroup) {
        _results.push(child.setVisible(opacity));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  SpriteGroup.prototype.getWidth = function() {
    return this.sprite.width;
  };

  SpriteGroup.prototype.getHeight = function() {
    return this.sprite.height;
  };

  return SpriteGroup;

})(Group);

GroupedSprite = (function(_super) {
  __extends(GroupedSprite, _super);

  function GroupedSprite() {
    _ref = GroupedSprite.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  GroupedSprite.prototype.getAbsolutePosition = function() {
    var parent, pos;
    pos = {
      x: this.x,
      y: this.y
    };
    parent = this.parentNode;
    while ((parent != null) && !(parent instanceof Scene)) {
      pos.x += parent.x;
      pos.y += parent.y;
      parent = parent.parentNode;
    }
    return pos;
  };

  return GroupedSprite;

})(Sprite);

ImageSprite = (function(_super) {
  __extends(ImageSprite, _super);

  function ImageSprite(image, width, height) {
    ImageSprite.__super__.constructor.call(this, width || image.width, height || image.height);
    this.image = image;
  }

  return ImageSprite;

})(Sprite);
