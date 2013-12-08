getUniqueArray = (ary) ->
   storage = []
   uniqueArray = []
   for value in ary
     if !(value in storage)
       storage.push(value)
       uniqueArray.push(value)
       uniqueArray

    uniqueArray

arrayEqual = (a, b) ->
    a.length is b.length and a.every (elem, i) -> elem is b[i]

class GraphSearcher
  constructor: () ->
    @visited = []
    @predecessors = {}

  visit: (node) -> @visited.push(node)
  isVisited: (node) -> node in @visited

  init: () -> 
    @visited = []

  getChilds: (node, cpu, expand) ->
    if expand? then expand(node)
    else
      dirs = 
        if node.getNextDir? then [node.getNextDir()]
        else if node.getConseqDir? then [node.getConseqDir(), node.getAlterDir()]
        else null

      if dirs?
        idx = node.getIndex()
        childs = (cpu.getTip(d.x + idx.x, d.y + idx.y) for d in dirs)

  findUnvisitedChild: (node, cpu, expand) ->
    childs = @getChilds(node, cpu, expand)

    if childs?
      unvisited = (child for child in childs when !@isVisited(child))
      if unvisited? then unvisited[0] else null

  findVisitedChild: (node, cpu, expand) ->
    childs = @getChilds(node, cpu, expand)

    if childs?
      visited = (child for child in childs when @isVisited(child))
      if visited? then visited[0] else null

  findLoop: (node, cpu, stack) ->
    child = @findVisitedChild(node, cpu)

    if child?
      idx = stack.indexOf(child)
      (stack[i] for i in [idx...stack.length])

  getSuccessors: (node, context) ->
    successors = []
    graph = new GraphSearcher()
    graph.dfs(node, context.cpu, (obj) -> 
      if context.end? && obj.node == context.end then false
      else
        successors.push(obj.node)
        true
    )

    successors

  getImmediatePredecessors: (node, context) ->
    if !@predecessors[node.order]?
      @predecessors[node.order] = []
      for dx in [-1..1]
        for dy in [-1..1] 
          cur = node.getIndex()
          nx = cur.x + dx
          ny = cur.y + dy
          inRange = (v) -> -1 <= v && v < 8

          if inRange(nx) && inRange(ny)
            cand = context.cpu.getTip(nx, ny)
            candSucc = @getChilds(cand, context.cpu)
            if candSucc? && node in candSucc 
              @predecessors[node.order].push(cand)

    @predecessors[node.order]

  calcPredecessors: (root, context) ->
    _calcPredecessors = (node) =>
      for pre in @predecessors[node.order]
        _calcPredecessors(pre, context)

    _calcPredecessors(root)

  getPredecessors: (root, context) ->
    calced = []

    _getPredecessors = (node) =>
      if !(node in calced)
        calced.push(node)
        predecessors = []
        if !@predecessors[node.order]? then @calcPredecessors(node, context)
        parents = @predecessors[node.order]

        if parents.length > 0
          for p in parents
            predecessors.push(p)
            predecessors = predecessors.concat(_getPredecessors(p))

        getUniqueArray(predecessors)
      else []

    _getPredecessors(root)

  findRoute: (start, end, cpu) ->
    route = []
    graph = new GraphSearcher()

    graph.dfs(start, cpu, (obj) -> 
      if obj.node == end 
        route = obj.stack
        false
      else true
    )

    route

  assignOrder: (root, context) ->
    graph = new GraphSearcher()
    order = 0

    graph.dfs(root, context.cpu, (obj) => 
      obj.node.order = order++;
      true
    )

  dfs: (root, cpu, callback, expand) ->
    @init()

    end = false

    stack = []
    _visit = (node) =>
      stack.push(node)
      @visit(node)
      callback({stack: stack, node: node, backtrack: false})

    end = !_visit(root)

    while stack.length > 0 && !end
      node = stack[stack.length - 1]
      child = @findUnvisitedChild(node, cpu, expand)

      if child? then end = !_visit(child)
      else stack.pop()

class LoopFinder
  constructor: () ->

  initDominators: (root, universal) ->
    dominators = {}

    for u in universal
      dominators[u.order] = 
        if u == root then [u]
        else universal.slice(0)

  createDominatorTree: (root, universal, graph, context) ->
    dominators = @calcDominators(root, universal, graph, context)
    nodes = universal.slice(0)

    for node in nodes then node.childs = []

    for node in nodes when node != root
      dom = dominators[node.order]
      idom = dom[dom.length - 2]

      idom.childs.push(node)

    nodes

  calcDominators: (root, universal, graph, context) ->
    intersection = (arrA, arrB) ->
      exist = {}
      for a in arrA then exist[a.order] = true
      (b for b in arrB when exist[b.order])


    dominators = @initDominators(root, universal)

    preDominators = []
    isChangeOccurred = (pre, cur) ->
      if pre.length != cur.length then return true

      for i in [0...cur.length]
        if !arrayEqual(pre[i], cur[i]) then return true

      false

    while isChangeOccurred(preDominators, dominators)
      preDominators = dominators.slice(0)
      for u in universal when u != root
        dominators[u.order] = universal.slice(0)
        for p in graph.getImmediatePredecessors(u, context) when dominators[p.order]?
          dominators[u.order] = intersection(dominators[u.order], dominators[p.order])
        dominators[u.order] = dominators[u.order].concat([u])

     #console.log ((n.order for n in d) for d in dominators)
     #domTree = @createDominatorTree(root, dominators, universal)
     #console.log domTree
     #console.log (n.childs for n in domTree)

     dominators

  findLoopHeaders: (root, dominators, graph, context) ->
    headers = []
    grpah.dfs(root, context.cpu, (obj) ->
    )

  findBackEdges: (root, dominators, graph, context) ->
    backedges = []
    graph.dfs(root, context.cpu, (obj) ->
      succ = graph.getChilds(obj.node, context.cpu)
      dom = dominators[obj.node.order]

      if succ?
        #backedge = ({src: obj.node, dst: s} for s in succ when s.order < obj.node.order)
        backedge = ({src: obj.node, dst: s} for s in succ when s in dom)
        if backedge.length > 0 then backedges = backedges.concat(backedge)

      true
    )

    backedges

  find: (cpu) ->
    root = cpu.getStartTip()
    context = {cpu: cpu}

    graph = new GraphSearcher()
    graph.assignOrder(root, context)

    universal = []
    graph.dfs(root, cpu, (obj) => universal.push(obj.node))

    dominators = @calcDominators(root, universal, graph, context)

    backedges = @findBackEdges(root, dominators, graph, context)

    loops = []
    for edge in backedges
      lp = graph.findRoute(edge.dst, edge.src, cpu)
      loops.push(lp)

      console.log (n.order for n in lp)

    loops

class JsConstant
  @indent = '  '

class JsText
  constructor: () ->
    @lines = []

  insertLine: (node, text) -> 
    @lines.push({node: (if node instanceof Array then node else [node]), text: text})

  insertBlock: (block) -> @insertArray(block.generateCode())
  insertArray: (array) -> @lines = @lines.concat(array)

  clean: () -> @lines = []

  generateCode: () -> @lines

class JsPlainBlock extends JsText
  constructor: () ->
    super()
    @childs = []

  addChild: (child) ->
    @childs.push(child)
    child.parent = @

class JsBlock extends JsPlainBlock
  generateCode: () ->
    code = ({node: line.node, text: JsConstant.indent + line.text} for line in @lines)
    nodes = (line.node[0] for line in @lines)
    code.unshift({node: nodes, text: '{'})
    code.push({node: nodes, text: '}'})
    code

  clone: () ->
    block = new JsBlock()
    block.lines = @lines.slice(0)
    block

class JsWhileBlock extends JsBlock
  constructor: (@condition) ->
    super()
  createCondition: () -> @condition

  generateCode: () ->
    code = super()
    code[0].text = 'while( ' + @createCondition() + ' ) ' + code[0].text
    code

class JsForBlock extends JsBlock
  constructor: (@condition) ->
    super()

  createCondition: () -> @condition

  generateCode: () ->
    code = super()
    code[0].text = 'for( ' + @createCondition() + ' ) ' + code[0].text
    code

class JsBranchBlock
  constructor: (@condition, @root) ->
    @ifBlock = new JsBlock()
    @elseBlock = new JsBlock()
    @breakBlock = new JsPlainBlock()
    @headerBlock = new JsPlainBlock()

  getIfBlock: () -> @ifBlock
  getElseBlock: () -> @elseBlock

  createCondition: () -> @condition

  removeCommonProcess: (ifLines, elseLines) ->
    long = if ifLines.length > elseLines.length then ifLines else elseLines
    short = if ifLines.length <= elseLines.length then ifLines else elseLines

    common = new JsPlainBlock()

    if long.length > 0 && short.length > 0
      for i in [1..short.length]
        ln = long[long.length - 1].node
        sn = short[short.length - 1].node
        
        if arrayEqual(ln, sn)
          line = long.pop()
          short.pop()

          common.insertLine(line.node, line.text)
        else break

    common.lines.reverse()
    common

  generateCode: () ->
    ifBlock = @ifBlock.clone()
    elseBlock = @elseBlock.clone()
    commonBlock = @removeCommonProcess(ifBlock.lines, elseBlock.lines)

    ifCode = ifBlock.generateCode()
    elseCode = elseBlock.generateCode()

    ifCode[0].text = 'if( ' + @createCondition() + ' ) ' + ifCode[0].text
    elseCode[0].text = 'else ' + elseCode[0].text

    ifCode[0].node.unshift(@root)
    ifCode[ifCode.length - 1].node.unshift(@root)
    elseCode[0].node.unshift(@root)
    elseCode[elseCode.length - 1].node.unshift(@root)

    commonCode = commonBlock.generateCode()
    headerCode = @headerBlock.generateCode()

    headerCode.concat(ifCode.concat(elseCode).concat(commonCode))

class JsGenerator
  constructor: () ->
    @currentBlock = new JsPlainBlock()
    @blockStack = []
    @loops = []

  isBranchTransitionTip: (node) -> node.getConseqDir? && node.getAlterDir?
  isSingleTransitionTip: (node) -> node.getNextDir?

  getOperationName: (node) ->
    if node.code.instruction? then node.code.instruction.constructor.name else node.code.constructor.name

  insertToCurrentBlock: (node) ->
    @currentBlock.insertLine(node, @getOperationName(node) + '();')

  registerLoop: (newLp) ->
    sort = (arr) -> arr.sort (a, b) -> a - b
    newOrder = sort((node.order for node in newLp))
    for lp in @loops
      order = sort((node.order for node in lp))
      if arrayEqual(order, newOrder) then return false

    @loops.push(newLp.slice(0))

  findAllLoop: (root, context) ->
    # 重いが、コントロールフロー解析による確実な探索
    finder = new LoopFinder()
    finder.find(context.cpu)

    # 軽いが、DFSによる不確実な探索(ループが重なると見逃す)
    #graph = new GraphSearcher()
    #loops = []

    #graph.dfs(root, context.cpu, (obj) ->
    #  lp = graph.findLoop(obj.node, context.cpu, obj.stack)
    #  if lp? then loops.push(lp)
    #  true
    #)
    #
    #loops

  findLoopByEnterNode: (node) ->
    for lp in @loops
      if node == lp[0] then return lp

    null

  getBranchNodes: (node, context) ->
    ifDir = node.getConseqDir()
    elseDir = node.getAlterDir()
    cur = node.getIndex()

    ifNext = context.cpu.getTip(cur.x + ifDir.x, cur.y + ifDir.y)
    elseNext = context.cpu.getTip(cur.x + elseDir.x, cur.y + elseDir.y)

    {ifNext: ifNext, elseNext: elseNext}

  getMergeNode: (node, context) ->
    graph = new GraphSearcher()

    nodes = @getBranchNodes(node, context)

    context.end = node
    ifSuccessors = graph.getSuccessors(nodes.ifNext, context)
    elseSuccessors = graph.getSuccessors(nodes.elseNext, context)

    for s in ifSuccessors
      if s in elseSuccessors then return s

    null

  isChildLoopNode: (node, childLoop) ->
    for lp in childLoop
      for n in lp 
        if node == n then return true

    false

  generateWhileCode: (root, context) ->
    block = new JsWhileBlock('true')
    childLoop = []

    for node in context.loop[context.loop.length - 1]
      # 子ループの要素はスキップ
      if @isChildLoopNode(node, childLoop) then continue

      lp = @findLoopByEnterNode(node)
      if lp? 
        if !@isTraversedLoopHeader(node, context)
          childLoop.push(lp)
          if !context.loop? then context.loop = []
          context.loop.push(lp)
          block.insertBlock(@generateWhileCode(node, context))
          context.loop.pop()

      if @isBranchTransitionTip(node)
        block.insertBlock(@generateBranchCode(node, context))
        break
      else if @isSingleTransitionTip(node)
        block.insertLine(node, @getOperationName(node) + '();')

    block
   
  findBreakNode: (root, branchNodes, context) ->
    result = {if: false, true: false, err: false}

    mergeNode = @getMergeNode(root, context)
    result.err = !mergeNode?

    if !mergeNode? || !@isOnLoop(mergeNode, context.loop[context.loop.length - 1])
      lp = context.loop[context.loop.length - 1]

      if !(branchNodes.ifNext in lp)
        result.if = true
        result.else = false
      else if !(branchNodes.elseNext in lp)
        result.if = false
        result.else = true

    result

  generateBranchCode: (root, context) ->
    block = new JsBranchBlock(@getOperationName(root), root)
    nodes = @getBranchNodes(root, context)

    printBreakError = (b) ->
      b.insertLine(root, '// 現在、ループ外に出る条件分岐を含むコードのJavascript生成には対応していません。')
      b.insertLine(root, '// 誤ったコードが生成されている可能性があります。')


    # ループ中の分岐の場合
    if context.loop? && context.loop.length > 0 && @isOnLoop(root, context.loop[context.loop.length - 1])
      block.headerBlock.insertLine(root, '// 現在、ループ中に条件分岐を含むコードのJavascript生成には対応していません。')
      block.headerBlock.insertLine(root, '// 誤ったコードが生成されている可能性があります。')

      # ループ外に出る分岐を探索
      result = @findBreakNode(root, nodes, context)

      # ループ外に出る場合はbreakを出力
      if result.if 
        if result.err then printBreakError(block.ifBlock)
        block.ifBlock.insertLine(root, 'break;')
      else block.ifBlock.insertBlock(@generateCode(nodes.ifNext, context))
      if result.else 
        if result.err then printBreakError(block.elseBlock)
        block.elseBlock.insertLine(root, 'break;')
      else block.elseBlock.insertBlock(@generateCode(nodes.elseNext, context))
    # 通常の分岐
    else 
      block.ifBlock.insertBlock(@generateCode(nodes.ifNext, context))
      block.elseBlock.insertBlock(@generateCode(nodes.elseNext, context))

    block

  isTraversedLoopHeader: (node, context) ->
    if context.loop?
      for lp in context.loop
        if lp[0] == node then return true

    false

  isChildLoopHeader: (node, context) ->
    if context.loop?
      for n in @loops[@loops.length - 1]
        if n == node then return true

    false

  isOnLoop: (node, lp) ->
    for n in lp
      if node == n then return true

    false

  generateCode: (root, context) ->
    graph = new GraphSearcher()
    block = new JsPlainBlock()

    graph.dfs(root, context.cpu, (obj) => 
      node = obj.node
      lp = @findLoopByEnterNode(node)
      if lp?
        if !@isTraversedLoopHeader(node, context)
          if !context.loop? then context.loop = []
          context.loop.push(lp)
          block.insertBlock(@generateWhileCode(node, context))
          context.loop.pop()
        false
      else if @isBranchTransitionTip(node)
        block.insertBlock(@generateBranchCode(node, context))
        false
      else if @isSingleTransitionTip(node)
        block.insertLine(node, @getOperationName(node) + '();')
        true
    )

    block

  generate: (cpu) ->
    root = cpu.getStartTip()
    context = {cpu: cpu}

    @loops = @findAllLoop(root, context)
    block = @generateCode(root, context)
    block.generateCode()
