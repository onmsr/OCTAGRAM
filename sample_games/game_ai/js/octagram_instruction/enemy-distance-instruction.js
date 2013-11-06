// Generated by CoffeeScript 1.6.3
var EnemyDistanceInstruction,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

EnemyDistanceInstruction = (function(_super) {
  __extends(EnemyDistanceInstruction, _super);

  /*
    Enemy Distance Instruction
  */


  function EnemyDistanceInstruction(robot, enemy) {
    var column, labels,
      _this = this;
    this.robot = robot;
    this.enemy = enemy;
    EnemyDistanceInstruction.__super__.constructor.apply(this, arguments);
    this.tipInfo = new TipInfo(function(labels) {
      return "敵機との距離が" + labels[0] + "の場合青い矢印に進みます。<br>そうでなければ、赤い矢印に進みます。      ";
    });
    column = "距離";
    labels = ["近距離", "中距離", "遠距離"];
    this.distanceParam = new TipParameter(column, 0, 0, 2, 1);
    this.distanceParam.id = "distance";
    this.addParameter(this.distanceParam);
    this.tipInfo.addParameter(this.distanceParam.id, column, labels, 0);
    this.icon = new Icon(Game.instance.assets[R.TIP.SEARCH_ENEMY], 32, 32);
    this.conditions = [
      function() {
        var _ref;
        return (0 < (_ref = _this._distance()) && _ref <= 3);
      }, function() {
        var _ref;
        return (3 < (_ref = _this._distance()) && _ref <= 7);
      }, function() {
        return 7 < _this._distance();
      }
    ];
  }

  EnemyDistanceInstruction.prototype._distance = function() {
    var enemyPos, robotPos;
    enemyPos = this.enemy.pos;
    robotPos = this.robot.pos;
    robotPos.sub(enemyPos);
    return robotPos.length();
  };

  EnemyDistanceInstruction.prototype.action = function() {
    return this.conditions[this.distanceParam.value]();
  };

  EnemyDistanceInstruction.prototype.clone = function() {
    var obj;
    obj = this.copy(new EnemyDistanceInstruction(this.robot, this.enemy));
    obj.distanceParam.value = this.distanceParam.value;
    return obj;
  };

  EnemyDistanceInstruction.prototype.onParameterChanged = function(parameter) {
    this.distanceParam = parameter;
    return this.tipInfo.changeLabel(parameter.id, parameter.value);
  };

  EnemyDistanceInstruction.prototype.mkDescription = function() {
    return this.tipInfo.getDescription();
  };

  EnemyDistanceInstruction.prototype.mkLabel = function(parameter) {
    return this.tipInfo.getLabel(parameter.id);
  };

  EnemyDistanceInstruction.prototype.getIcon = function() {
    return this.icon;
  };

  return EnemyDistanceInstruction;

})(BranchInstruction);
