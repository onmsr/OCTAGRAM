// Generated by CoffeeScript 1.6.3
var BarrierMap, EnemyRobot, ItemQueue, PlayerRobot, R, Robot,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

R = Config.R;

/*
  store bullet objects
*/


ItemQueue = (function() {
  function ItemQueue(collection, max) {
    this.collection = collection != null ? collection : [];
    this.max = max != null ? max : -1;
  }

  ItemQueue.prototype.enqueue = function(item) {
    if (this.max !== -1 && this.max <= this.collection.length) {
      return false;
    } else {
      this.collection.push(item);
      return true;
    }
  };

  ItemQueue.prototype.dequeue = function(count) {
    var i, ret, _i;
    if (count == null) {
      count = 1;
    }
    ret = [];
    for (i = _i = 0; 0 <= count ? _i < count : _i > count; i = 0 <= count ? ++_i : --_i) {
      ret.push(this.collection.shift());
    }
    return ret;
  };

  ItemQueue.prototype.empty = function() {
    return this.collection.length === 0;
  };

  ItemQueue.prototype.index = function(i) {
    return this.collection[i];
  };

  ItemQueue.prototype.size = function() {
    return this.collection.length;
  };

  return ItemQueue;

})();

BarrierMap = (function(_super) {
  __extends(BarrierMap, _super);

  function BarrierMap(robot) {
    this.robot = robot;
  }

  BarrierMap.prototype.get = function(key) {
    var ret;
    ret = this[key];
    delete this[key];
    this.robot.onResetBarrier(key);
    return ret;
  };

  BarrierMap.prototype.isset = function(key) {
    if (this[key] != null) {
      return true;
    } else {
      return false;
    }
  };

  return BarrierMap;

})(Object);

Robot = (function(_super) {
  var DIRECT_FRAME, FRAME_DIRECT;

  __extends(Robot, _super);

  Robot.MAX_HP = 4;

  DIRECT_FRAME = {};

  DIRECT_FRAME[Direct.RIGHT] = 0;

  DIRECT_FRAME[Direct.RIGHT | Direct.DOWN] = 5;

  DIRECT_FRAME[Direct.LEFT | Direct.DOWN] = 7;

  DIRECT_FRAME[Direct.LEFT] = 2;

  DIRECT_FRAME[Direct.LEFT | Direct.UP] = 6;

  DIRECT_FRAME[Direct.RIGHT | Direct.UP] = 4;

  FRAME_DIRECT = {};

  FRAME_DIRECT[0] = Direct.RIGHT;

  FRAME_DIRECT[5] = Direct.RIGHT | Direct.DOWN;

  FRAME_DIRECT[7] = Direct.LEFT | Direct.DOWN;

  FRAME_DIRECT[2] = Direct.LEFT;

  FRAME_DIRECT[6] = Direct.LEFT | Direct.UP;

  FRAME_DIRECT[4] = Direct.RIGHT | Direct.UP;

  function Robot(width, height) {
    var plate, pos;
    Robot.__super__.constructor.call(this, width, height);
    this.name = "robot";
    this.setup("hp", Robot.MAX_HP);
    this.bulletQueue = {
      normal: new ItemQueue([], 5),
      wide: new ItemQueue([], 5),
      dual: new ItemQueue([], 5)
    };
    this.barrierMap = new BarrierMap(this);
    this.plateState = 0;
    RobotWorld.instance.addChild(this);
    plate = Map.instance.getPlate(0, 0);
    this.prevPlate = this.currentPlate = plate;
    pos = plate.getAbsolutePos();
    this.moveTo(pos.x, pos.y);
  }

  Robot.prototype.properties = {
    direct: {
      get: function() {
        return FRAME_DIRECT[this.frame];
      },
      set: function(direct) {
        return this.frame = DIRECT_FRAME[direct];
      }
    }
  };

  Robot.prototype.move = function(direct, onComplete) {
    var plate, pos, ret;
    ret = false;
    plate = Map.instance.getTargetPoision(this.currentPlate, direct);
    this.frame = this.directFrame(direct);
    this.prevPlate = this.currentPlate;
    if ((plate != null) && plate.lock === false) {
      pos = plate.getAbsolutePos();
      this.tl.moveTo(pos.x, pos.y, PlayerRobot.UPDATE_FRAME).then(onComplete);
      this.currentPlate = plate;
      ret = new Point(plate.ix, plate.iy);
    } else {
      ret = false;
    }
    return ret;
  };

  Robot.prototype.shot = function(bulletType, onComplete) {
    var b, bltQueue, ret, _i, _len, _ref;
    switch (bulletType) {
      case BulletType.NORMAL:
        bltQueue = this.bulletQueue.normal;
        break;
      case BulletType.WIDE:
        bltQueue = this.bulletQueue.wide;
        break;
      case BulletType.DUAL:
        bltQueue = this.bulletQueue.dual;
    }
    if (!bltQueue.empty()) {
      _ref = bltQueue.dequeue();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        b = _ref[_i];
        b.shot(this.x, this.y, this.direct);
        setTimeout(onComplete, Util.toMillisec(b.maxFrame));
        ret = b;
      }
    }
    return ret;
  };

  Robot.prototype.pickup = function(bulletType, onComplete) {
    var blt, bltQueue, item, itemClass, ret;
    ret = false;
    blt = BulletFactory.create(bulletType, this);
    switch (bulletType) {
      case BulletType.NORMAL:
        bltQueue = this.bulletQueue.normal;
        itemClass = NormalBulletItem;
        break;
      case BulletType.WIDE:
        bltQueue = this.bulletQueue.wide;
        itemClass = WideBulletItem;
        break;
      case BulletType.DUAL:
        bltQueue = this.bulletQueue.dual;
        itemClass = DualBulletItem;
    }
    if (bltQueue != null) {
      ret = bltQueue.enqueue(blt);
    }
    if (ret !== false) {
      item = new itemClass(this.x, this.y);
      item.setOnCompleteEvent(onComplete);
      ret = blt;
    }
    return ret;
  };

  Robot.prototype.turn = function(onComplete) {
    var _this = this;
    if (onComplete == null) {
      onComplete = function() {};
    }
    return setTimeout((function() {
      _this.direct = Direct.next(_this.direct);
      return onComplete(_this);
    }), Util.toMillisec(15));
  };

  Robot.prototype.onHpReduce = function(views) {};

  Robot.prototype.onKeyInput = function(input) {};

  Robot.prototype.onSetBarrier = function(bulletType) {};

  Robot.prototype.onResetBarrier = function(bulletType) {};

  Robot.prototype.onCmdComplete = function(id, ret) {
    var msgbox;
    msgbox = this.scene.views.msgbox;
    switch (id) {
      case RobotInstruction.MOVE:
        this.prevPlate.onRobotAway(this);
        this.currentPlate.onRobotRide(this);
        if (ret !== false) {
          msgbox.print(R.String.move(this.name, ret.x + 1, ret.y + 1));
          return this.animated = true;
        } else {
          return msgbox.print(R.String.CANNOTMOVE);
        }
        break;
      case RobotInstruction.SHOT:
        if (ret !== false) {
          msgbox.print(R.String.shot(this.name));
          return this.animated = true;
        } else {
          return msgbox.print(R.String.CANNOTSHOT);
        }
        break;
      case RobotInstruction.PICKUP:
        if (ret !== false) {
          msgbox.print(R.String.pickup(this.name));
          return this.animated = true;
        } else {
          return msgbox.print(R.String.CANNOTPICKUP);
        }
    }
  };

  Robot.prototype.moveToPlate = function(plate) {
    var pos;
    this.prevPlate.onRobotAway(this);
    this.pravState = this.currentPlate;
    this.currentPlate = plate;
    this.currentPlate.onRobotRide(this);
    pos = plate.getAbsolutePos();
    return this.moveTo(pos.x, pos.y);
  };

  Robot.prototype.damege = function() {
    this.hp -= 1;
    return this.onHpReduce();
  };

  Robot.prototype.update = function() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.onKeyInput(Game.instance.input);
    return true;
  };

  Robot.prototype.directFrame = function(direct) {
    return DIRECT_FRAME[direct];
  };

  return Robot;

})(SpriteModel);

PlayerRobot = (function(_super) {
  __extends(PlayerRobot, _super);

  PlayerRobot.WIDTH = 64;

  PlayerRobot.HEIGHT = 74;

  PlayerRobot.UPDATE_FRAME = 10;

  function PlayerRobot(parentNode) {
    PlayerRobot.__super__.constructor.call(this, PlayerRobot.WIDTH, PlayerRobot.HEIGHT, parentNode);
    this.name = R.String.PLAYER;
    this.image = Game.instance.assets[R.CHAR.PLAYER];
    this.plateState = Plate.STATE_PLAYER;
    this.debugCmd = new DebugCommand(this);
  }

  PlayerRobot.prototype.onKeyInput = function(input) {
    if (this.animated === true) {
      return;
    }
    if (input.w === true && input.p === true) {
      return this.debugCmd.move(4);
    } else if (input.a === true && input.p === true) {
      return this.debugCmd.move(3);
    } else if (input.x === true && input.p === true) {
      return this.debugCmd.move(5);
    } else if (input.d === true && input.p === true) {
      return this.debugCmd.move(0);
    } else if (input.e === true && input.p === true) {
      return this.debugCmd.move(1);
    } else if (input.c === true && input.p === true) {
      return this.debugCmd.move(2);
    } else if (input.q === true && input.m === true) {
      return this.debugCmd.pickup(this.wideBltQueue, 1);
    } else if (input.q === true && input.n === true) {
      return this.debugCmd.pickup(this.dualBltQueue, 2);
    } else if (input.q === true && input.l === true) {
      return this.debugCmd.pickup(this.bltQueue, 0);
    } else if (input.s === true && input.m === true) {
      return this.debugCmd.shot(this.wideBltQueue);
    } else if (input.s === true && input.n === true) {
      return this.debugCmd.shot(this.dualBltQueue);
    } else if (input.s === true && input.l === true) {
      return this.debugCmd.shot(this.bltQueue);
    }
  };

  PlayerRobot.prototype.onSetBarrier = function(bulletType) {
    return Util.dispatchEvent("setBarrier", {
      bulletType: bulletType
    });
  };

  PlayerRobot.prototype.onResetBarrier = function(bulletType) {
    return Util.dispatchEvent("resetBarrier", {
      bulletType: bulletType
    });
  };

  PlayerRobot.prototype.onCmdComplete = function(id, ret) {
    var effect, i;
    PlayerRobot.__super__.onCmdComplete.call(this, id, ret);
    switch (id) {
      case RobotInstruction.MOVE:
        if (Math.floor(Math.random() * 10.) === 1) {
          return i = 1;
        }
        break;
      case RobotInstruction.SHOT:
        if (ret !== false) {
          effect = new ShotEffect(this.x, this.y);
          this.scene.addChild(effect);
          if (ret instanceof WideBullet) {
            return Util.dispatchEvent("dequeueBullet", {
              bulletType: BulletType.WIDE
            });
          } else if (ret instanceof NormalBullet) {
            return Util.dispatchEvent("dequeueBullet", {
              bulletType: BulletType.NORMAL
            });
          } else if (ret instanceof DualBullet) {
            return Util.dispatchEvent("dequeueBullet", {
              bulletType: BulletType.DUAL
            });
          }
        }
        break;
      case RobotInstruction.PICKUP:
        if (ret !== false) {
          if (ret instanceof WideBullet) {
            return Util.dispatchEvent("enqueueBullet", {
              bulletType: BulletType.WIDE
            });
          } else if (ret instanceof NormalBullet) {
            return Util.dispatchEvent("enqueueBullet", {
              bulletType: BulletType.NORMAL
            });
          } else if (ret instanceof DualBullet) {
            return Util.dispatchEvent("enqueueBullet", {
              bulletType: BulletType.DUAL
            });
          }
        }
    }
  };

  PlayerRobot.prototype.onHpReduce = function(views) {
    var hpBar, scene;
    scene = Game.instance.scene;
    hpBar = scene.views.playerHpBar;
    return hpBar.reduce();
  };

  return PlayerRobot;

})(Robot);

EnemyRobot = (function(_super) {
  __extends(EnemyRobot, _super);

  EnemyRobot.WIDTH = 64;

  EnemyRobot.HEIGHT = 74;

  EnemyRobot.UPDATE_FRAME = 10;

  function EnemyRobot(parentNode) {
    EnemyRobot.__super__.constructor.call(this, EnemyRobot.WIDTH, EnemyRobot.HEIGHT, parentNode);
    this.name = R.String.ENEMY;
    this.image = Game.instance.assets[R.CHAR.ENEMY];
    this.plateState = Plate.STATE_ENEMY;
    this.debugCmd = new DebugCommand(this);
  }

  EnemyRobot.prototype.onHpReduce = function(views) {
    var hpBar;
    hpBar = this.scene.views.enemyHpBar;
    return hpBar.reduce();
  };

  EnemyRobot.prototype.onKeyInput = function(input) {
    if (this.animated === true) {
      return;
    }
    if (input.w === true && input.o === true) {
      return this.debugCmd.move(4);
    } else if (input.a === true && input.o === true) {
      return this.debugCmd.move(3);
    } else if (input.x === true && input.o === true) {
      return this.debugCmd.move(5);
    } else if (input.d === true && input.o === true) {
      return this.debugCmd.move(0);
    } else if (input.e === true && input.o === true) {
      return this.debugCmd.move(1);
    } else if (input.c === true && input.o === true) {
      return this.debugCmd.move(2);
    }
  };

  return EnemyRobot;

})(Robot);
