var DualEnpowerEffect, Effect, EnpowerEffect, Explosion, NormalEnpowerEffect, R, ShotEffect, SpotDualEffect, SpotEffect, SpotNormalEffect, SpotWideEffect, WideEnpowerEffect,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

R = Config.R;

Effect = (function(_super) {
  __extends(Effect, _super);

  function Effect(w, h, endFrame, step) {
    this.endFrame = endFrame;
    this.step = step;
    Effect.__super__.constructor.call(this, w, h);
    this.frame = 0;
  }

  Effect.prototype.onenterframe = function() {
    if (this.age % this.step === 0) {
      this.frame += 1;
      if (this.frame > this.endFrame) {
        return this.parentNode.removeChild(this);
      }
    }
  };

  return Effect;

})(Sprite);

Explosion = (function(_super) {
  __extends(Explosion, _super);

  Explosion.SIZE = 64;

  function Explosion(x, y) {
    Explosion.__super__.constructor.call(this, Explosion.SIZE, Explosion.SIZE, 24, 1);
    this.image = Game.instance.assets[R.EFFECT.EXPLOSION];
    this.x = x;
    this.y = y;
  }

  return Explosion;

})(Effect);

ShotEffect = (function(_super) {
  __extends(ShotEffect, _super);

  ShotEffect.SIZE = 64;

  function ShotEffect(x, y) {
    ShotEffect.__super__.constructor.call(this, Explosion.SIZE, Explosion.SIZE, 16, 1);
    this.image = Game.instance.assets[R.EFFECT.SHOT];
    this.x = x;
    this.y = y;
  }

  return ShotEffect;

})(Effect);

SpotEffect = (function(_super) {
  __extends(SpotEffect, _super);

  SpotEffect.SIZE = 64;

  function SpotEffect(x, y, image) {
    SpotEffect.__super__.constructor.call(this, SpotEffect.SIZE, SpotEffect.SIZE, 10, 3);
    this.image = Game.instance.assets[image];
    this.x = x;
    this.y = y;
  }

  SpotEffect.prototype.onenterframe = function() {
    if (this.age % this.step === 0) {
      this.frame += 1;
      if (this.frame > this.endFrame) {
        return this.frame = 0;
      }
    }
  };

  return SpotEffect;

})(Effect);

SpotNormalEffect = (function(_super) {
  __extends(SpotNormalEffect, _super);

  function SpotNormalEffect(x, y) {
    SpotNormalEffect.__super__.constructor.call(this, x, y, R.EFFECT.SPOT_NORMAL);
  }

  return SpotNormalEffect;

})(SpotEffect);

SpotWideEffect = (function(_super) {
  __extends(SpotWideEffect, _super);

  function SpotWideEffect(x, y) {
    SpotWideEffect.__super__.constructor.call(this, x, y, R.EFFECT.SPOT_WIDE);
  }

  return SpotWideEffect;

})(SpotEffect);

SpotDualEffect = (function(_super) {
  __extends(SpotDualEffect, _super);

  function SpotDualEffect(x, y) {
    SpotDualEffect.__super__.constructor.call(this, x, y, R.EFFECT.SPOT_DUAL);
  }

  return SpotDualEffect;

})(SpotEffect);

EnpowerEffect = (function(_super) {
  __extends(EnpowerEffect, _super);

  EnpowerEffect.SIZE = 128;

  function EnpowerEffect(x, y, image) {
    EnpowerEffect.__super__.constructor.call(this, EnpowerEffect.SIZE, EnpowerEffect.SIZE, 10, 2);
    this.image = Game.instance.assets[image];
    this.x = x - EnpowerEffect.SIZE * 0.25;
    this.y = y - EnpowerEffect.SIZE * 0.25;
  }

  return EnpowerEffect;

})(Effect);

NormalEnpowerEffect = (function(_super) {
  __extends(NormalEnpowerEffect, _super);

  function NormalEnpowerEffect(x, y) {
    NormalEnpowerEffect.__super__.constructor.call(this, x, y, R.EFFECT.ENPOWER_NORMAL);
  }

  return NormalEnpowerEffect;

})(EnpowerEffect);

WideEnpowerEffect = (function(_super) {
  __extends(WideEnpowerEffect, _super);

  function WideEnpowerEffect(x, y) {
    WideEnpowerEffect.__super__.constructor.call(this, x, y, R.EFFECT.ENPOWER_WIDE);
  }

  return WideEnpowerEffect;

})(EnpowerEffect);

DualEnpowerEffect = (function(_super) {
  __extends(DualEnpowerEffect, _super);

  function DualEnpowerEffect(x, y) {
    DualEnpowerEffect.__super__.constructor.call(this, x, y, R.EFFECT.ENPOWER_DUAL);
  }

  return DualEnpowerEffect;

})(EnpowerEffect);
