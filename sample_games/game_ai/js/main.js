// Generated by CoffeeScript 1.6.3
var R, Random, RobotGame, RobotScene, RobotWorld, ViewWorld, runGame,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

R = Config.R;

Random = new MersenneTwister();

ViewWorld = (function(_super) {
  __extends(ViewWorld, _super);

  function ViewWorld(x, y, scene) {
    ViewWorld.__super__.constructor.call(this);
    scene.addChild(this);
    this.x = x;
    this.y = y;
    this.background = new Background(0, 0);
    this.header = new Header(16, 16);
    this.map = new Map(16, 68);
    this.footer = new Footer(25, this.map.y + this.map.height);
    this.addChild(this.background);
    this.addChild(this.header);
    this.addChild(this.map);
    this.addChild(this.footer);
  }

  ViewWorld.prototype.initEvent = function(world) {
    this.footer.initEvent(world);
    this.map.initEvent(world);
    return this.header.initEvent(world);
  };

  ViewWorld.prototype.update = function(world) {
    return this.map.update();
  };

  ViewWorld.prototype.reset = function() {
    return this.map.reset();
  };

  return ViewWorld;

})(Group);

RobotWorld = (function(_super) {
  __extends(RobotWorld, _super);

  function RobotWorld(x, y, scene) {
    var _this = this;
    if (RobotWorld.instance != null) {
      return RobotWorld.instance;
    }
    RobotWorld.__super__.constructor.call(this);
    RobotWorld.instance = this;
    this._robots = [];
    this.setup("bullets", []);
    this.setup("items", []);
    this.addObserver("bullets", function(data, method) {
      if (method === "push") {
        return _this.insertBefore(data, _this._robots[0]);
      }
    });
    this.addObserver("items", function(data, method) {
      if (method === "push") {
        return _this.addChild(data);
      }
    });
    this._player = new PlayerRobot(this);
    this._enemy = new EnemyRobot(this);
    this._robots.push(this._player);
    this._robots.push(this._enemy);
    scene.addChild(this);
    this.addChild(this._player);
    this.addChild(this._enemy);
    this.diePlayer = false;
    this.player.addObserver("hp", function(hp) {
      if (hp <= 0 && _this.diePlayer === false) {
        _this.diePlayer = _this.player;
        return _this.dispatchEvent(new RobotEvent('gameEnd', {
          lose: _this.player,
          win: _this.enemy
        }));
      }
    });
    this.enemy.addObserver("hp", function(hp) {
      if (hp <= 0 && _this.diePlayer === false) {
        _this.diePlayer = _this.enemy;
        return _this.dispatchEvent(new RobotEvent('gameEnd', {
          win: _this.player,
          lose: _this.enemy
        }));
      }
    });
  }

  RobotWorld.prototype.properties = {
    player: {
      get: function() {
        return this._player;
      }
    },
    enemy: {
      get: function() {
        return this._enemy;
      }
    },
    robots: {
      get: function() {
        return this._robots;
      }
    }
  };

  RobotWorld.prototype.initInstructions = function(octagram) {
    var enemyProgram, playerProgram;
    this.octagram = octagram;
    playerProgram = this.octagram.createProgramInstance();
    enemyProgram = this.octagram.createProgramInstance();
    this.playerProgramId = playerProgram.id;
    this.enemyProgramId = enemyProgram.id;
    playerProgram.addInstruction(new MoveInstruction(this._player));
    playerProgram.addInstruction(new RandomMoveInstruction(this._player));
    playerProgram.addInstruction(new ApproachInstruction(this._player, this._enemy));
    playerProgram.addInstruction(new LeaveInstruction(this._player, this._enemy));
    playerProgram.addInstruction(new ShotInstruction(this._player));
    playerProgram.addInstruction(new SupplyInstruction(this._player));
    playerProgram.addInstruction(new TurnEnemyScanInstruction(this._player, this._enemy));
    playerProgram.addInstruction(new HpBranchInstruction(this._player));
    playerProgram.addInstruction(new EnemyDistanceInstruction(this._player, this._enemy));
    playerProgram.addInstruction(new EnergyBranchInstruction(this._player));
    playerProgram.addInstruction(new EnemyEnergyBranchInstruction(this._enemy));
    playerProgram.addInstruction(new ResourceBranchInstruction(this._player));
    enemyProgram.addInstruction(new MoveInstruction(this._enemy));
    enemyProgram.addInstruction(new RandomMoveInstruction(this._enemy));
    enemyProgram.addInstruction(new ApproachInstruction(this._enemy, this._player));
    enemyProgram.addInstruction(new LeaveInstruction(this._enemy, this._player));
    enemyProgram.addInstruction(new ShotInstruction(this._enemy));
    enemyProgram.addInstruction(new SupplyInstruction(this._enemy));
    enemyProgram.addInstruction(new TurnEnemyScanInstruction(this._enemy, this._player));
    enemyProgram.addInstruction(new HpBranchInstruction(this._enemy));
    enemyProgram.addInstruction(new EnemyDistanceInstruction(this._enemy, this._player));
    enemyProgram.addInstruction(new EnergyBranchInstruction(this._enemy));
    enemyProgram.addInstruction(new EnemyEnergyBranchInstruction(this._player));
    enemyProgram.addInstruction(new ResourceBranchInstruction(this._enemy));
    return this.octagram.showProgram(this.playerProgramId);
  };

  RobotWorld.prototype.initialize = function(views) {
    var plate;
    plate = Map.instance.getPlate(1, 1);
    this.player.moveImmediately(plate);
    plate = Map.instance.getPlate(7, 5);
    return this.enemy.moveImmediately(plate);
  };

  RobotWorld.prototype.collisionBullet = function(bullet, robot) {
    return bullet.holder !== robot && bullet.within(robot, 32);
  };

  RobotWorld.prototype.updateItems = function() {
    var del, i, v, _i, _len, _ref,
      _this = this;
    del = -1;
    _ref = this.items;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      v = _ref[i];
      if (v.animated === false) {
        del = i;
        this.items[i] = false;
      }
    }
    if (del !== -1) {
      return this.items.some(function(v, i) {
        if (v === false) {
          return _this.items.splice(i, 1);
        }
      });
    }
  };

  RobotWorld.prototype.updateBullets = function() {
    var del, i, robot, v, _i, _j, _len, _len1, _ref, _ref1,
      _this = this;
    del = -1;
    _ref = this._robots;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      robot = _ref[_i];
      _ref1 = this.bullets;
      for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
        v = _ref1[i];
        if (v !== false) {
          if (this.collisionBullet(v, robot)) {
            del = i;
            v.hit(robot);
            this.bullets[i] = false;
          } else if (v.animated === false) {
            del = i;
            this.bullets[i] = false;
          }
        }
      }
    }
    if (del !== -1) {
      return this.bullets.some(function(v, i) {
        if (v === false) {
          return _this.bullets.splice(i, 1);
        }
      });
    }
  };

  RobotWorld.prototype._isAnimated = function(array, func) {
    var animated, i, _i, _len;
    animated = false;
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      i = array[_i];
      animated = func(i);
      if (animated === true) {
        break;
      }
    }
    return animated;
  };

  RobotWorld.prototype.reset = function() {
    this.enemy.reset(7, 5);
    this.player.reset(1, 1);
    return this.diePlayer = false;
  };

  RobotWorld.prototype.updateRobots = function() {
    var i, _i, _len, _ref, _results;
    _ref = this._robots;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      _results.push(i.update());
    }
    return _results;
  };

  RobotWorld.prototype.update = function(views) {
    this.updateItems();
    this.updateRobots();
    return this.updateBullets();
  };

  return RobotWorld;

})(GroupModel);

RobotScene = (function(_super) {
  __extends(RobotScene, _super);

  function RobotScene(game) {
    var __this;
    this.game = game;
    this.restart = __bind(this.restart, this);
    RobotScene.__super__.constructor.call(this, this);
    this.views = new ViewWorld(Config.GAME_OFFSET_X, Config.GAME_OFFSET_Y, this);
    this.world = new RobotWorld(Config.GAME_OFFSET_X, Config.GAME_OFFSET_Y, this);
    __this = this;
    this.world.addEventListener('gameEnd', function(evt) {
      var id, params, prg, _i, _len, _ref;
      params = evt.params;
      _ref = [this.enemyProgramId, this.playerProgramId];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        id = _ref[_i];
        prg = this.octagram.getInstance(id);
        prg.stop();
      }
      return setTimeout((function() {
        return __this.restart();
      }), 2000);
    });
    this.views.initEvent(this.world);
    this.world.initialize();
  }

  RobotScene.prototype.onenterframe = function() {
    return this.update();
  };

  RobotScene.prototype.restart = function() {
    this.views.reset();
    return this.world.reset();
  };

  RobotScene.prototype.update = function() {
    this.world.update(this.views);
    return this.views.update(this.world);
  };

  return RobotScene;

})(Scene);

RobotGame = (function(_super) {
  __extends(RobotGame, _super);

  function RobotGame(width, height, callback) {
    this.callback = callback;
    RobotGame.__super__.constructor.call(this, width, height);
    this._assetPreload();
    this.keybind(87, 'w');
    this.keybind(65, 'a');
    this.keybind(88, 'x');
    this.keybind(68, 'd');
    this.keybind(83, 's');
    this.keybind(81, 'q');
    this.keybind(69, 'e');
    this.keybind(67, 'c');
    this.keybind(80, 'p');
    this.keybind(76, 'l');
    this.keybind(77, 'm');
    this.keybind(78, 'n');
    this.keybind(74, 'j');
    this.keybind(73, 'i');
    this.keybind(75, 'k');
    this.keybind(79, 'o');
  }

  RobotGame.prototype._assetPreload = function() {
    var load,
      _this = this;
    load = function(hash) {
      var k, path, _results;
      _results = [];
      for (k in hash) {
        path = hash[k];
        _results.push(_this.preload(path));
      }
      return _results;
    };
    load(R.CHAR);
    load(R.BACKGROUND_IMAGE);
    load(R.UI);
    load(R.EFFECT);
    load(R.BULLET);
    load(R.ITEM);
    return load(R.TIP);
  };

  RobotGame.prototype.onload = function() {
    var _this = this;
    this.scene = new RobotScene(this);
    this.pushScene(this.scene);
    this.octagram = new Octagram(Config.OCTAGRAM_DIR);
    this.octagram.onload = function() {
      _this.scene.world.initInstructions(_this.octagram);
      if (_this.callback) {
        return _this.callback();
      }
    };
    this.assets["font0.png"] = this.assets['resources/ui/font0.png'];
    this.assets["apad.png"] = this.assets['resources/ui/apad.png'];
    this.assets["icon0.png"] = this.assets['resources/ui/icon0.png'];
    return this.assets["pad.png"] = this.assets['resources/ui/pad.png'];
  };

  return RobotGame;

})(Core);

runGame = function(callback) {
  var game;
  game = new RobotGame(Config.GAME_WIDTH, Config.GAME_HEIGHT, callback);
  return game.start();
};
