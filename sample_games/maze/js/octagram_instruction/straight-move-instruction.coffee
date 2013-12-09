        
class StraightMoveInstruction extends ActionInstruction
  ###
     StraightMove Instruction
  ###

  constructor : (@player) ->
    super
    @setAsynchronous(true)
    @icon = new Icon(Game.instance.assets[R.TIP.ARROW], 32, 32)

  action : () ->
    ret = false
    @player.move()
    @setAsynchronous(ret != false)
    # @robot.onCmdComplete(RobotInstruction.MOVE, ret)

  clone : () ->
    obj = @copy(new StraightMoveInstruction(@player))
    return obj

  mkDescription: () ->
    "現在向いている方の目の前のマスに移動します"

  getIcon: () ->
    @icon.frame = 0
    return @icon
