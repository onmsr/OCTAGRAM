// Generated by CoffeeScript 1.6.3
(function() {
  var arg, d, s, _i, _len, _results;
  window.octagram = {};
  Duplicator.copyOctagramObject(window);
  s = document.getElementsByTagName("script");
  d = s[s.length - 1].src.substring(0, s[s.length - 1].src.lastIndexOf("/") + 1);
  _results = [];
  for (_i = 0, _len = arguments.length; _i < _len; _i++) {
    arg = arguments[_i];
    _results.push(document.write('<script type="text/javascript" src="' + d + arg + '"></script>'));
  }
  return _results;
})("core/util/storage.js", "core/event/event.js", "core/ui/sprite-group.js", "core/effect.js", "core/tip/tip-model.js", "core/util/util.js", "core/resource.js", "core/tip/tip-effect.js", "core/tip/transition.js", "core/tip/tip-view.js", "core/tip/tip-factory.js", "core/tip/instruction/instruction-preset.js", "core/tip/instruction/tip-instruction-stack.js", "core/tip/instruction/tip-instruction-counter.js", "core/tip/instruction/custom-instruction-tip.js", "core/ui/background.js", "core/cpu/cpu.js", "core/cpu/cpu-executer.js", "core/ui/slider.js", "core/ui/sidebar.js", "core/ui/config-panel.js", "core/ui/ui.js", "core/ui/direction-selector.js", "core/environment.js", "core/octagram-content.js", "core/octagram-core.js");
