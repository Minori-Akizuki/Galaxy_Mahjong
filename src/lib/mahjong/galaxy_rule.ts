import { _ } from '../util/util'
import { GalaxyTileParser } from './galaxy_tile_parser'
import { IMianzi, MianziKind } from './mianzi'
import { MahjongTile, AMajongRule, TileColor } from './rule_base'

/**
 * 銀河マージャンルール、シングルトンで提供される
 */
export class GalaxyMahjongRule extends AMajongRule {
  public parser:GalaxyTileParser
  private static _instance: GalaxyMahjongRule
  public NORMAL_TILES:MahjongTile[]
  public RED_TILES:MahjongTile[]
  public GALAXY_TILES:MahjongTile[]
  public ALL_TILES:MahjongTile[]

  private constructor () {
    super()
    this.parser = GalaxyTileParser.getInstance()
    this.NORMAL_TILES = this.parser.parseTiles(
      _.formation([
        [1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => n.toString()),
        ['w', 'p', 's']
      ]).map(t => t[0] + t[1]).join('') +
      'wsenblh'
    )
    this.GALAXY_TILES = this.NORMAL_TILES.map(t => new MahjongTile(t.color, t.number, { isGalaxy: true }))
    this.RED_TILES = this.parser.parseTiles('5sr5wr5pr')
    this.ALL_TILES = [...this.NORMAL_TILES, ...this.GALAXY_TILES, ...this.RED_TILES]
  }

  static getInstance (): GalaxyMahjongRule {
    if (this._instance == null) {
      this._instance = new GalaxyMahjongRule()
    }
    return this._instance
  }

  public canBeNextTile (tile: MahjongTile, nextTile: MahjongTile):boolean {
    if (
      tile.color === TileColor.feng ||
      tile.color === TileColor.sanyuan ||
      tile.number === GalaxyMahjongRule.getMaxNumber(tile.color)) {
      // 字牌、三元牌、9には次の牌は無い
      return false
    }
    if (tile.option.isGalaxy || nextTile.option.isGalaxy) {
      // 銀河牌ならどの色でも次の牌になる
      return (tile.number + 1) === nextTile.number
    }
    // 普通の牌だったら色が同一で次の数である事
    return (tile.color === nextTile.color && tile.number + 1 === nextTile.number)
  }

  public canBeSameTile (tile: MahjongTile, expect: MahjongTile):boolean {
    if (tile.option.isGalaxy || expect.option.isGalaxy) {
      // どちらか片方が銀河牌だった場合
      switch (tile.color) {
        case TileColor.feng:
          // 風牌だった場合は風牌かどうかだけ調べる
          return expect.color === TileColor.feng
        case TileColor.sanyuan:
          // 三元牌だった場合は三元牌かどうかだけ調べる
          return expect.color === TileColor.sanyuan
        default: {
          // 数牌の場合は数字だけ比べる
          return tile.number === expect.number
        }
      }
    }
    // そうでない場合は色と数字を両方比べる
    return (tile.color === expect.color) && (tile.number === expect.number)
  }

  public deriveDragon (tile: MahjongTile):MahjongTile[] {
    if (tile.option.isGalaxy) {
      // ドラ表が銀河牌だった場合
      switch (tile.color) {
        case TileColor.feng:
          // 風牌だった場合、風牌の全てがドラ
          return ['w', 's', 'e', 'n'].map((t) => this.parser.parseTile(t))
        case TileColor.sanyuan:
          // 三元牌だった場合は三元牌の全てがドラ
          return ['b', 'l', 'h'].map((t) => this.parser.parseTile(t))
        default: {
          // 数牌だった場合は、次の数字の全ての色がドラ
          const dragonNumber = ((
            tile.number %
            GalaxyMahjongRule.getMaxNumber(tile.color)
          ) + 1).toString()
          return [
            dragonNumber + 'w',
            dragonNumber + 'p',
            dragonNumber + 's'
          ].map((t) => this.parser.parseTile(t))
        }
      }
    }
    // ドラ表が普通の牌だった場合
    const maxDoragonNum = GalaxyMahjongRule.getMaxNumber(tile.color)
    const dragonNum = (tile.number % maxDoragonNum) + 1
    return [new MahjongTile(tile.color, dragonNum, { })]
  }

  public makeMianzi (tiles: MahjongTile[], isOpend:boolean): IMianzi[] {
    if (tiles.length <= 1 || tiles.length >= 5) {
      // 1枚か5枚以上は面子にならない
      return []
    }
    const numColor = [TileColor.siozi, TileColor.tongzi, TileColor.wanzi]
    /** 与えられた全ての牌が同一視できるか */
    const canBeSameAllTile = (tiles:MahjongTile[]):boolean => {
      return _.everyPairAllPairWith((ta, tb) => this.canBeSameTile(ta, tb), tiles)
    }
    /** 全ての牌が銀河牌である */
    const areAllGalaxy = (tiles: MahjongTile[]):boolean => {
      return tiles.every((t) => t.option.isGalaxy)
    }
    if (canBeSameAllTile(tiles)) {
      // 全ての牌が同じ場合(対子か刻子か槓子の場合)
      // 面子の種類を選択する
      const kind:MianziKind = [MianziKind.duizi, MianziKind.kezi, MianziKind.kangzi][tiles.length - 2]

      if (areAllGalaxy(tiles)) {
        // 牌が全部銀河であった場合
        if (numColor.includes(tiles[0].color)) {
          // 牌か数牌だった場合
          // 全ての色の刻子を返す
          const number = tiles[0].number
          return numColor.map((color):IMianzi => {
            return { tiles, kind, number, color, isOpend }
          })
        } else if (tiles[0].color === TileColor.feng) {
          // 牌が風牌だった場合
          // 東南西北の刻子を返す
          return [1, 2, 3, 4].map((number):IMianzi => {
            return { tiles, kind, number, color: TileColor.feng, isOpend }
          })
        } else if (tiles[0].color === TileColor.sanyuan) {
          // 牌が三元牌だった場合
          // 白發中の刻子を返す
          return [1, 2, 3].map((number):IMianzi => {
            return { tiles, kind, number, color: TileColor.sanyuan, isOpend }
          })
        }
      }
      // 通常の牌が入っていた場合
      // 字牌の考慮をし銀河牌ではない牌を探して採番する
      // find が undefine を返す可能性があるため(ないが)ガードをつけている
      const number:number = (tiles.find(t => !t.option.isGalaxy) || tiles[0]).number
      const color:TileColor = (tiles.find(t => !t.option.isGalaxy) || tiles[0]).color
      return [{ tiles, kind, number, color, isOpend }]
    }
    // 牌が順子の(可能性がある)場合
    if (
      tiles.length === 3 && // 牌が3枚である
      _.everyPairFromHeadWith((c, n) => this.canBeNextTile(c, n), tiles) && // 3つの牌が並びになっている
      _.everyPairAllPairWith((ta, tb) => (ta.option.isGalaxy || tb.option.isGalaxy || ta.color === tb.color), tiles) // 銀河でない牌は全て色が同一である
    ) {
      const kind = MianziKind.shunzi
      if (areAllGalaxy(tiles)) {
        // 全ての牌が銀河だったら
        // 3種の色の面子を全て返す
        return numColor.map((color):IMianzi => {
          return { tiles, kind, number: tiles[0].number, color, isOpend }
        })
      }
      // 通常の牌が入っていた場合
      // 正当性チェックはこの if 節で行っているためどれかの色をとってくればいい
      const color = (tiles.find(t => !t.option.isGalaxy) || tiles[0]).color
      return [{ tiles, kind, number: tiles[0].number, color, isOpend }]
    }
    return []
  }

  /**
   * 晒されていない手牌から通常の上がり形(1雀頭n面子)のパターンを列挙する
   * @param tiles 手牌
   * @returns 通常の上がり形として考えられる形
   */
  private arrangeNormalHand (tiles: MahjongTile[]): IMianzi[][] {
    // まず雀頭をとる
    const _intermediateHand:[IMianzi, MahjongTile[]][] = this.takeDuizi(tiles)
    // 残った手牌から面子をとり続ける
    const intermediateHand:[IMianzi[], MahjongTile[]][] = _intermediateHand.map(i => [[i[0]], i[1]])
    const arrangedManzi = this.takeAllXZi(intermediateHand, (ts) => this.takeMianzi(ts))
    return arrangedManzi.map(mt => mt[0])
  }

  /**
   * 手牌から可能な限り対子か面子か雀頭を取得し続け、取得可能なパターンを全て列挙する
   * @param intermediateHand 既に抜いてある面子/雀頭
   * @param takeXZi 面子を取るか雀頭を取るか
   * @returns 取得可能な全ての手牌構成の列
   */
  private takeAllXZi (
    intermediateHand:[IMianzi[], MahjongTile[]][], takeXZi:(tiles: MahjongTile[]) => [IMianzi, MahjongTile[]][]
  ):[IMianzi[], MahjongTile[]][] {
    if (
      intermediateHand.length === 0 || // 既に成立するパターンが無く全て刈り取られていた場合
      intermediateHand[0][1].length === 0 // 全ての牌が抜き取られこれ以上とる牌が無い場合(最初に同数の牌が与えられている事が前提)
    ) {
      return intermediateHand
    }
    // 結果保存用の変数
    const concatMianzi:[IMianzi[], MahjongTile[]][] = []
    intermediateHand.forEach(i => {
      // 残りの手牌から面子のパターンを抽出
      const takenXZi = takeXZi(i[1])
      takenXZi.forEach(t => {
        // [[...既にある面子, 今とった面子], [残った手牌]]
        const candidateHand:[IMianzi[], MahjongTile[]] = [[...i[0], t[0]], t[1]]
        // 現在取った面子
        const currentMianzi = candidateHand[0]
        // 今迄に取った面子の列
        const existongConcatMianzi = concatMianzi.map(c => c[0])
        if (
          existongConcatMianzi
            .every(
              ms => !_.equalSetArray(
                ms,
                currentMianzi,
                (a, b) => GalaxyMahjongRule.compareGalaxyMianzi(a, b))
            )) {
          // 同一の面子(雀頭)の組み合わせが無い場合のみ結果に追加する
          concatMianzi.push(candidateHand)
        }
      })
    })
    return this.takeAllXZi(concatMianzi, takeXZi)
  }

  /**
   * 手牌から n 枚で構成される面子/対子を抜き出した全てのパターンを返却する
   * @param number 抜き出す枚数、対子なら2枚、など
   * @param tiles 手牌
   * @returns 考えうる面子/対子と残りの牌の組
   */
  private takeMianziNorm (number: number, tiles: MahjongTile[]):[IMianzi, MahjongTile[]][] {
    // n 枚無い時は例外を吐く
    if (tiles.length < number) {
      throw Error(`Illigal hand: Need ${number} number hand`)
    }
    // 牌を n 枚抜き出し面子(雀頭)判定をする
    const candidateMianzi = _.extractAllN(
      tiles,
      number,
      GalaxyMahjongRule.compareTileByNumber
    )
    // 抜き出した物が面子/対子か判定し、成立しなかったものは排除する
    const _mianzis = candidateMianzi
      .map((t:[MahjongTile[], MahjongTile[]]):[IMianzi[], MahjongTile[]] => [this.makeMianzi(t[0], false), t[1]])
      .filter((t:[IMianzi[], MahjongTile[]]) => t[0].length !== 0)
    // 銀河牌により複数の候補がある面子構成を開いて別々にする
    // [[m1, m2, m3], Ts] -> [[m1, Ts], [m2, Ts], [m3, Ts]]
    const mianzis:[IMianzi, MahjongTile[]][] = []
    _mianzis.forEach(_m => {
      const remaingTile = _m[1]
      _m[0].forEach(mianzi => {
        mianzis.push([mianzi, remaingTile])
      })
    })
    return mianzis
  }

  /**
   * 手牌から対子を抜き出せるパターンを列挙する
   * @param tiles 手牌
   * @returns 対子と残りの牌の組
   */
  private takeDuizi (tiles: MahjongTile[]):[IMianzi, MahjongTile[]][] {
    return this.takeMianziNorm(2, tiles)
  }

  /**
   * 手牌から面子を抜き出せるパターンを列挙する
   * @param tiles 手牌
   * @returns 面子と残りの牌の組
   */
  private takeMianzi (tiles: MahjongTile[]):[IMianzi, MahjongTile[]][] {
    return this.takeMianziNorm(3, tiles)
  }

  // static Method

  static getMaxNumber (color: TileColor): number {
    switch (color) {
      case TileColor.wanzi:
      case TileColor.siozi:
      case TileColor.tongzi:
        return 9
      case TileColor.feng:
        return 4
      case TileColor.sanyuan:
        return 3
    }
    throw Error(`Invalid color ${TileColor[color]}`)
  }

  static compareTileByNumber (tileA:MahjongTile, tileB:MahjongTile):number {
    // 数の比較
    const diffNumber = tileA.number - tileB.number
    if (diffNumber !== 0) {
      return diffNumber
    }
    // 色の比較
    const diffColor = tileA.color - tileB.color
    if (diffColor !== 0) {
      return diffColor
    }
    // 赤と銀河が同時についている事はないが、赤を先に判定する
    // オプションついている方が先
    if (tileA.option.isRed && !tileB.option.isRed) {
      return 1
    }
    if (!tileA.option.isRed && tileB.option.isRed) {
      return -1
    }
    if (tileA.option.isGalaxy && !tileB.option.isGalaxy) {
      return 1
    }
    if (!tileA.option.isGalaxy && tileB.option.isGalaxy) {
      return -1
    }
    return 0
  }

  static compareTileByColor (tileA:MahjongTile, tileB:MahjongTile):number {
    // 色の比較
    const diffColor = tileA.color - tileB.color
    if (diffColor !== 0) {
      return diffColor
    }
    // 数の比較
    const diffNumber = tileA.number - tileB.number
    if (diffNumber !== 0) {
      return diffNumber
    }
    // 赤と銀河が同時についている事はないが、赤を先に判定する
    // オプションついている方が先
    if (tileA.option.isRed && !tileB.option.isRed) {
      return 1
    }
    if (!tileA.option.isRed && tileB.option.isRed) {
      return -1
    }
    if (tileA.option.isGalaxy && !tileB.option.isGalaxy) {
      return 1
    }
    if (!tileA.option.isGalaxy && tileB.option.isGalaxy) {
      return -1
    }
    return 0
  }

  private static compareGalaxyMianzi = (ma:IMianzi, mb:IMianzi):number => {
    const compareMember =
      ma.kind - mb.kind ||
      ma.color - mb.color ||
      ma.number - mb.number ||
      _.compareArray(ma.tiles, mb.tiles, GalaxyMahjongRule.compareTileByNumber)
    return compareMember
  }
}
