// Generated by CoffeeScript 1.6.2
var ParameterConfigPanel, ParameterSlider,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ParameterSlider = (function(_super) {
  __extends(ParameterSlider, _super);

  function ParameterSlider(parameter) {
    this.parameter = parameter;
    ParameterSlider.__super__.constructor.call(this, this.parameter.min, this.parameter.max, this.parameter.step, this.parameter.value);
  }

  ParameterSlider.prototype.show = function() {
    this.scroll(this.parameter.getValue());
    return ParameterSlider.__super__.show.call(this);
  };

  ParameterSlider.prototype.onValueChanged = function() {
    ParameterSlider.__super__.onValueChanged.call(this);
    return this.parameter.setValue(this.value);
  };

  return ParameterSlider;

})(Slider);

ParameterConfigPanel = (function(_super) {
  __extends(ParameterConfigPanel, _super);

  function ParameterConfigPanel() {
    ParameterConfigPanel.__super__.constructor.call(this, Resources.get("dummy"));
  }

  ParameterConfigPanel.prototype.addParameter = function(parameter) {
    var slider;

    slider = new ParameterSlider(parameter);
    slider.moveTo(this.x + slider.titleWidth, this.y + this.children.length * slider.height);
    slider.setTitle(parameter.valueName);
    return this.addChild(slider);
  };

  ParameterConfigPanel.prototype.clear = function() {
    return this.children = [];
  };

  return ParameterConfigPanel;

})(UISpriteComponent);
