window.MazeDefine = {}

window.MazeDefine =
  '#1':
    map: [
      [  WT,  WT,  WT,  WT,  WT,  WT, WT,  WC1, WA3, WC2],
      [  WT, WT, WT, WT, WT, WT, WT, WA2, GL,  WA4],
      [  WT, WT, WT, WT, WT, WT, WT, WA2, RO,  WA4],
      [  WT, WT, WT, WT, WT, WT, WT, WA2, RO,  WA4],
      [  WT, WT, WT, WT, WT, WT, WT, WA2, RO,  WA4],
      [  WT, WT, WT, WT, WT, WT, WT, WA2, RO,  WA4],
      [  WT, WT, WT, WT, WT, WT, WT, WA2, RO,  WA4],
      [  WC1, WA3, WA3, WA3, WA3, WA3, WA3, WL3, RO,  WA4],
      [  WA2, ST, RO, RO, RO, RO,  RO,  RO, RO,  WA4],
      [  WC4,  WA1,  WA1,  WA1,  WA1,  WA1,  WA1,  WA1, WA1, WC3],
    ]
    direction: Direction.RIGHT
  '#2':
    map: [
      [  WT,  WT,  WT,  WT,  WT,  WT, WT,  WT, WT, WT],
      [  WT, WT, WT, WT, WT, WT, WT, WT, WT,  WT],
      [  WT, WT, WT, WT, WT, WT, WT, WT, WT,  WT],
      [  WT, WT, WT, WT, WT, WT, WT, WT, WT,  WT],
      [  WC1, WA3, WA3, WA3, WA3, WA3, WA3, WA3, WA3,  WC2],
      [  WA2, ST, RO, RO, RO, RO,  RO,  RO, GL,  WA4],
      [  WC4,  WA1,  WA1,  WA1,  WA1,  WA1,  WA1,  WA1, WA1, WC3],
      [  WT, WT, WT, WT, WT, WT, WT, WT, WT,  WT],
      [  WT, WT, WT, WT, WT, WT, WT, WT, WT,  WT],
      [  WT, WT, WT, WT, WT, WT, WT, WT, WT,  WT],
    ]
    direction: Direction.RIGHT
  '#3':
    map: [
      [  WT,  WT,  WT,  WT,  WT,  WT, WC1,  WA3, WA3, WC2],
      [  WT,  WT,  WT,  WT,  WT,  WC1, WL3,  RO, GL, WA4],
      [  WT,  WT,  WT,  WT,  WC1,  WL3, RO,  RO, WL1, WC3],
      [  WT,  WT,  WT,  WC1,  WL3,  RO, RO,  WL1, WC3, WT],
      [  WT,  WT,  WC1,  WL3,  RO,  RO, WL1,  WC3, WT, WT],
      [  WT,  WC1,  WL3,  RO,  RO,  WL1, WC3,  WT, WT, WT],
      [  WC1,  WL3,  RO,  RO,  WL1,  WC3, WT,  WT, WT, WT],
      [  WA2,  RO,  RO,  WL1,  WC3,  WT, WT,  WT, WT, WT],
      [  WA2,  ST,  WL1,  WC3,  WT,  WT, WT,  WT, WT, WT],
      [  WC4,  WA1,  WC3,  WT,  WT,  WT, WT,  WT, WT, WT],
    ]
    direction: Direction.UP
  '#4':
    map: [
      [  WT,  WT,  WT,  WT,  WT,  WT, WT,  WT, WT, WT],
      [  WT,  WT,  WT,  WT,  WT,  WT, WT,  WT, WT, WT],
      [  WT,  WC1,  WA3,  WA3,  WA3,  WA3, WA3,  WC2,  WT, WT],
      [  WT,  WA2,  RO,  RO,  RO,  RO, RO,  WA4, WT, WT],
      [  WT,  WA2,  RO,  WU3,  WV,  WR2, RO,  WA4, WT, WT],
      [  WT,  WA2,  RO,  RO,  GL,  WH, RO,  WA4, WT, WT],
      [  WT,  WX1,  WV,  WV,  WV,  WR3, RO,  WA4, WT, WT],
      [  WT,  WA2,  ST,  RO,  RO,  RO, RO,  WA4, WT, WT],
      [  WT,  WC4,  WA1,  WA1,  WA1,  WA1, WA1,  WC3, WT, WT],
      [  WT,  WT,  WT,  WT,  WT,  WT, WT,  WT, WT, WT],
    ]
    # map: [
    #   [  WL1,  WA1,  WA1,  WL2,  WT,  WT, WT,  WT, WU4, WT],
    #   [  WL4,  WA3,  WA3,  WL3,  WT,  WT, WT, WU3,  WV, WU1],
    #   [  WT,  WC1,  WA3,  WA3,  WA3,  WA3, WA3,  WC2,  WU2, WT],
    #   [  WT,  WA2,  RO,  RO,  RO,  RO, RO,  WA4, WT, WT],
    #   [  WT,  WA2,  RO,  WU3,  WV,  WR2, RO,  WA4, WT, WT],
    #   [  WT,  WA2,  RO,  RO,  GL,  WH, RO,  WA4, WT, WT],
    #   [  WT,  WX1,  WV,  WV,  WV,  WR3, RO,  WA4, WT, WT],
    #   [  WT,  WA2,  ST,  RO,  RO,  RO, RO,  WA4, WT, WT],
    #   [  WT,  WC4,  WA1,  WA1,  WA1,  WA1, WA1,  WC3, WU3, WV],
    #   [  WT,  WT,  WT,  WT,  WT,  WT, WT,  WT, WT, WT],
    # ]

    direction: Direction.RIGHT
  '#5':
    map: [
      [  WT, WT,  WT,  WT,  WT,  WT,  WT, WT,  WT, WT],
      [  WT, WC1,  WA3,  WX2,  WA3,  WC2,  WC1, WA3,  WC2, WT],
      [  WT, WA2,  RO,  WH,  RO,  WL4,  WL3, GL,  WA4, WT],
      [  WT, WA2,  RO,  WH,  RO,  RO,  RO, RO,  WA4, WT],
      [  WT, WA2,  RO,  WH,  RO,  WL1,  WL2, RO,  WA4, WT],
      [  WT, WA2,  RO,  WU2,  RO,  WA4,  WA2, RO,  WA4, WT],
      [  WT, WA2,  RO,  RO,  RO,  WL4,  WL3, RO,  WA4, WT],
      [  WT, WA2,  ST,  WU4,  RO,  RO,  RO, RO,  WA4, WT],
      [  WT, WC4,  WA1,  WX4,  WA1,  WA1,  WA1, WA1,  WC3, WT],
      [  WT, WT,  WT,  WT,  WT,  WT,  WT, WT,  WT, WT],
    ]
    direction: Direction.UP

MazeDefine.get = (hash = window.location.hash) ->
  return if window.MazeDefine[hash] == undefined then window.MazeDefine['#1'] else window.MazeDefine[hash]
