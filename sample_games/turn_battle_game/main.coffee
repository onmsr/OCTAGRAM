
R = Config.R

class CommandPool
    constructor: (robot) ->
        end = new RobotInstruction RobotInstruction.END, () ->
            return true
        @end = new Command end
        @moveLeftUp = new Command(new MoveLeftUp, robot)
        @moveleftDown = new Command(new MoveLeftDown, robot)
        @moveRightUp = new Command(new MoveRightUp, robot)
        @moveRightDown = new Command(new MoveRightDown, robot)
        @moveRight = new Command(new MoveRight, robot)
        @moveLeft = new Command(new MoveLeft, robot)

        @pickupNormal = new Command(new Pickup(), robot,[BulletType.NORMAL, NormalBulletItem,robot.bltQueue])
        @pickupWide = new Command(new Pickup(), robot, [BulletType.WIDE, WideBulletItem,robot.wideBltQueue])
        @pickupDual = new Command(new Pickup(), robot, [BulletType.DUAL, DualBulletItem,robot.dualBltQueue])

        @shotNormal = new Command(new Shot(), robot, [robot.bltQueue])
        @shotWide = new Command(new Shot(), robot, [robot.wideBltQueue])
        @shotDual = new Command(new Shot(), robot, [robot.dualBltQueue])

        @search = new Command(new Searching, robot)
        @getHp = new Command(new GetHp, robot)
        @getBulletQueueSize = Command(new GetBulletQueueSize, robot)
            
class ViewGroup extends Group
    constructor: (x, y, @scene) ->
        super
        @x = x
        @y = y
        @background = new Background 0, 0
        @addChild @background

        @header = new Header 16, 16
        @playerHpBar = @header.playerHpBar
        @enemyHpBar = @header.enemyHpBar
        @addChild @header

        @map = new Map 16, 48
        @addChild @map

        @footer = new Footer(25, @map.y + @map.height)
        @msgbox = @footer.msgbox
        @addChild @footer
        #@nextBtn = new NextButton @msgbox.x + MsgBox.WIDTH + 8, @msgbox.y
        #@addChild @nextBtn

    update: (world) ->
        for i in world.robots
            i.onViewUpdate(@)
        @map.update()

class TurnSwitcher
    constructor: (@world) ->
        @i = 0

    update: ->
        animated = bullet = false
        for i in @world.bullets
            bullet = i.animated
            break if bullet == true
        for i in @world.robots
            animated = i.isAnimated()
            break if animated == true

        if bullet is false and animated is false
            if @world.robots[@i].update()
                @i++
                @i = 0 if @i == @world.robots.length

class RobotWorld extends Group
    constructor: (x, y, @scene) ->
        super
        @game = Game.instance
        @map = Map.instance
        @robots = []
        @bullets = []
        @items = []
        @player = new PlayerRobot
        plate = @map.getPlate(4,5)
        pos = plate.getAbsolutePos()
        @player.currentPlate = plate
        @player.x = pos.x
        @player.y = pos.y
        @addChild @player
        @robots.push @player

        @enemy = new EnemyRobot
        @addChild @enemy
        @robots.push @enemy

        Game.instance.addInstruction(new MoveRightInstruction(@player))
        # @swicher = new TurnSwitcher @

    initialize: (views)->

    collisionBullet: (bullet, robot) ->
        return bullet.holder != robot and bullet.within(robot, 32)

    updateItems: () ->
        del = -1
        for v,i in @items
            if v.animated == false
                del = i
                @items[i] = false
        if del != -1
            @items = _.compact(@items)
        

    updateBullets: () ->
        del = -1
        for robot in @robots
            for v,i in @bullets
                if v != false
                    if @collisionBullet(v, robot)
                        del = i
                        v.hit(robot)
                        @bullets[i] = false
                    else if v.animated == false
                        del = i
                        @bullets[i] = false
        if del != -1
            @bullets = _.compact(@bullets)

    _isAnimated: (array, func) ->
        animated = false
        for i in array
            animated = func(i)
            break if animated == true
        return animated

    updateRobots: () ->
        animated = false
        for i in [@bullets, @robots, @items]
            animated = @_isAnimated(i, (x) -> x.animated)
            break if animated == true

        if animated is false
            for i in @robots
                i.update()

    update: (views)->
        #@swicher.update()
        @updateItems()
        @updateRobots()
        @updateBullets()

class RobotScene extends Scene
    constructor: (@game) ->
        super @
        @views = new ViewGroup Config.GAME_OFFSET_X, Config.GAME_OFFSET_Y, @
        @world = new RobotWorld Config.GAME_OFFSET_X, Config.GAME_OFFSET_Y, @
        @addChild @views
        @addChild @world

        @world.initialize @views

    onenterframe: ->
        @update()
        
    update: ->
        @world.update(@views)
        @views.update(@world)

class RobotGame extends TipBasedVPL
    constructor: (width, height) ->
        super width, height, "./tip_based_vpl/resource/"
        @_assetPreload()
        @keybind(87, 'w')
        @keybind(65, 'a')
        @keybind(88, 'x')
        @keybind(68, 'd')
        @keybind(83, 's')
        @keybind(81, 'q')
        @keybind(69, 'e')
        @keybind(67, 'c')

        @keybind(76, 'l')
        @keybind(77, 'm')
        @keybind(74, 'j')
        @keybind(73, 'i')
        @keybind(75, 'k')

    _assetPreload: ->
        load = (hash) =>
            for k,path of hash
                Debug.log "load image #{path}"
                @preload path

        load R.CHAR
        load R.BACKGROUND_IMAGE
        load R.UI
        load R.EFFECT
        load R.BULLET
        load R.ITEM

    onload: ->
        @scene = new RobotScene @
        @pushScene @scene
        super
        @assets["font0.png"] = @assets['resources/ui/font0.png']
        @assets["apad.png"] = @assets['resources/ui/apad.png']
        @assets["icon0.png"] = @assets['resources/ui/icon0.png']
        @assets["pad.png"] = @assets['resources/ui/pad.png']
        Game.instance.loadInstruction()

window.onload = () ->
    game = new RobotGame Config.GAME_WIDTH, Config.GAME_HEIGHT
    game.start()




