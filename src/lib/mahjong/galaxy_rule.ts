import { _ } from '../util/util'
import { GalaxyTileParser } from './galaxy_tile_parser'
import { MahjongTile, TileColor } from './mahjong_tile'
import { IMianzi, MianziKind, waitForm } from './mianzi'
import { MahjongRule } from './rule_base'

/**
 * 銀河マージャンルール、シングルトンで提供される
 */
export class GalaxyMahjongRule extends MahjongRule {
  private static galaxyInstance:MahjongRule

  private constructor () {
    super()
    this.parser = GalaxyTileParser.getInstance()
    // 通常牌に銀河属性をつけたものを銀河牌の一覧として登録する
    const glaxyTiles = this.NORMAL_TILE_TYPE.map(t => new MahjongTile(t.color, t.number, { isGalaxy: true }))
    // 赤は伍にだけある
    const redTiles = this.parser.parseTiles('5sr5wr5pr')
    this.ALL_TILE_TYPE = [...this.NORMAL_TILE_TYPE, ...glaxyTiles, ...redTiles]
    this.ALL_TILE_SET = this.provisionAllTileSet(this.NORMAL_TILE_TYPE)
  }

  static getInstance (): MahjongRule {
    if (!GalaxyMahjongRule.galaxyInstance) {
      GalaxyMahjongRule.galaxyInstance = new GalaxyMahjongRule()
    }
    return GalaxyMahjongRule.galaxyInstance
  }

  private static getInstanceAsGalaxyRule ():GalaxyMahjongRule {
    const instance = GalaxyMahjongRule.getInstance()
    return instance as GalaxyMahjongRule
  }

  public canBeNextTile (tile: MahjongTile, nextTile: MahjongTile):boolean {
    if (
      tile.color === TileColor.feng ||
      tile.color === TileColor.sanyuan ||
      tile.number === this.getMaxNumber(tile.color)) {
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
            this.getMaxNumber(tile.color)
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
    const maxDoragonNum = this.getMaxNumber(tile.color)
    const dragonNum = (tile.number % maxDoragonNum) + 1
    return [new MahjongTile(tile.color, dragonNum, { })]
  }

  /** 全ての牌が銀河牌である */
  private areAllGalaxy = (tiles: MahjongTile[]):boolean => {
    return tiles.every((t) => t.option.isGalaxy)
  }

  public makeMianzi (tiles: MahjongTile[], isOpend:boolean): IMianzi[] {
    if (tiles.length >= 5) {
      // 1枚か5枚以上は面子にならない
      return []
    }
    const numColor = [TileColor.siozi, TileColor.tongzi, TileColor.wanzi]
    /** 与えられた全ての牌が同一視できるか */
    const canBeSameAllTile = (tiles:MahjongTile[]):boolean => {
      if (tiles.length === 1) {
        return true
      }
      return _.everyPairAllPairWith((ta, tb) => this.canBeSameTile(ta, tb), tiles)
    }
    if (canBeSameAllTile(tiles)) {
      // 全ての牌が同じ場合(孤立牌か対子か刻子か槓子の場合)
      // 面子の種類を選択する
      const kind:MianziKind = [MianziKind.guli, MianziKind.duizi, MianziKind.kezi, MianziKind.kangzi][tiles.length - 1]

      if (this.areAllGalaxy(tiles)) {
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
      tiles.every(t => t.color !== TileColor.feng && t.color !== TileColor.sanyuan) && // 字牌ではない
      tiles.length === 3 && // 牌が3枚である
      _.everyPairFromHeadWith((c, n) => this.canBeNextTile(c, n), tiles) && // 3つの牌が並びになっている
      _.everyPairAllPairWith((ta, tb) => (ta.option.isGalaxy || tb.option.isGalaxy || ta.color === tb.color), tiles) // 銀河でない牌は全て色が同一である
    ) {
      const kind = MianziKind.shunzi
      if (this.areAllGalaxy(tiles)) {
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

  public makeTazi (tiles:MahjongTile[]): IMianzi[] {
    const isOpend = false
    const numColor = [TileColor.siozi, TileColor.tongzi, TileColor.wanzi]
    if (
      tiles.length === 2 && // 牌が2枚
      tiles.every(t => t.color !== TileColor.feng && t.color !== TileColor.sanyuan) && // 字牌ではない
      (tiles[0].option.isGalaxy || tiles[1].option.isGalaxy || tiles[0].color === tiles[1].color) &&// 二つの牌の色が同一視できるか
      Math.abs(tiles[0].number - tiles[1].number) <= 2 && // ふたつの牌の数差が2以下か
      tiles[0].number !== tiles[1].number // 対子ではない
    ) {
      const kind = MianziKind.tazi
      // TODO: 重複したコード群
      if (this.areAllGalaxy(tiles)) {
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
   * 二つの牌が塔子として扱われた最にどの色になるかを判定する。数牌限定。
   * @param tileA 牌
   * @param tileB 牌
   * @returns 想定される牌の色
   */
  protected shoudBeTaziColor (tileA:MahjongTile, tileB:MahjongTile):TileColor[] {
    if (tileA.option.isGalaxy && tileB.option.isGalaxy) {
      return [TileColor.wanzi, TileColor.tongzi, TileColor.wanzi]
    }
    const nonGalaxyTile = tileA.option.isGalaxy ? tileB : tileA
    return [nonGalaxyTile.color]
  }

  /**
   * この麻雀で使用する全ての牌のセットを提供する
   * @param normalTileType 通常牌の種類
   * @returns 麻雀で使用する牌全てのセット
   */
  protected provisionAllTileSet (normalTileType:MahjongTile[]):MahjongTile[] {
    const tileSet:MahjongTile[] = []
    normalTileType.forEach(t => {
      if (t.number === 5) {
        // 赤伍は1枚入れる、銀河牌も入れる。
        tileSet.push(
          t,
          t,
          new MahjongTile(t.color, t.number, { isRed: true }),
          new MahjongTile(t.color, t.number, { isGalaxy: true })
        )
      } else {
        // 全ての牌に銀河牌を1つ入れる
        tileSet.push(
          t,
          t,
          t,
          new MahjongTile(t.color, t.number, { isGalaxy: true })
        )
      }
    })
    return tileSet
  }
}
