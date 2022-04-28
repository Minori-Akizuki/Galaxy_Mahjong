import deepEqual from 'deep-equal'
import { _ } from '../util/util'
import { MahjongTile, TileColor } from './mahjong_tile'
import { IMianzi, MianziKind } from './mianzi'
import { MahjongTileParserBase } from './parse_tile'

/**
 * 麻雀ルール、シングルトンで提供される。
 * ベースクラスのためかなり手抜き
 */
export class MahjongRule {
  public parser:MahjongTileParserBase
  protected static _instance: MahjongRule
  protected ALL_TILES:MahjongTile[]

  protected constructor () {
    this.parser = MahjongTileParser.getInstance()
    this.ALL_TILES = this.parser.parseTiles(
      _.formation([
        [1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => n.toString()),
        ['w', 'p', 's']
      ]).map(t => t[0] + t[1]).join('') +
      'wsenblh'
    )
  }

  /**
   * インスタンスの取得
   * @returns 麻雀ルールクラスのインスタンス
   */
  static getInstance (): MahjongRule {
    if (!this._instance) {
      this._instance = new MahjongRule()
    }
    return this._instance
  }

  public getAllTiles ():MahjongTile[] {
    return this.ALL_TILES
  }

  /**
   * tile と expect が同じ牌になれるか
   * @param tile 牌
   * @param expect 牌
   */
  public canBeSameTile (tile: MahjongTile, expect: MahjongTile): boolean {
    throw Error('canBeSameTile: Not Implimented')
  }

  /**
   * nextTile が tile の次の牌になれるか
   * @param tile 牌
   * @param nextTile 次の牌
   */
  public canBeNextTile (tile: MahjongTile, nextTile: MahjongTile): boolean {
    throw Error('canBeNextTile: Not Implimented')
  }

  /**
   * 渡された牌がドラ表になった時のドラを呈示する
   * @param tile ドラ表
   * @returns ドラになる牌の配列
   */
  public deriveDragon (tile: MahjongTile): MahjongTile[] {
    throw Error('deriveDragon: Not Implimented')
  }

  /**
   * 与えられた牌(2つから4つ)から面子もしくは雀頭を作る
   * @param tiles 面子にしたい牌
   * @param isOpend 鳴いた牌かどうか
   * @returns 面子となりうるパターンの配列
   */
  public makeMianzi (tiles: MahjongTile[], isOpend: boolean): IMianzi[] {
    throw Error('makeMianzi: Not Implimented')
  }

  /**
   * 与えられた牌を数字優先で比較する
   * @param tileA 牌
   * @param tileB 牌
   * @returns tileAの方が先であれば負の数、tileBの方が先であれば正の数
   */
  public compareTileByNumber (tileA:MahjongTile, tileB:MahjongTile):number {
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
    // 両者についている特殊牌属性の種類(赤牌等)を列挙する
    const options = Object.keys({ ...tileA.option, ...tileB.option }).sort()
    // 特殊牌属性のついている牌が後にくるように値を返す
    let optionCompare = 0
    options.forEach(optionName => {
      if (!optionCompare && tileA.option[optionName] && !tileB.option[optionName]) {
        optionCompare = 1
      } else if (!optionCompare && !tileA.option[optionName] && tileB.option[optionName]) {
        optionCompare = -1
      }
    })
    return optionCompare
  }

  /**
   * 与えられた牌を色優先で比較する
   * @param tileA 牌
   * @param tileB 牌
   * @returns tileAの方が先であれば負の数、tileBの方が先であれば正の数
   */
  public compareTileByColor (tileA:MahjongTile, tileB:MahjongTile):number {
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
    // 両者についている特殊牌属性の種類(赤牌等)を列挙する
    const options = Object.keys({ ...tileA.option, ...tileB.option }).sort()
    // 特殊牌属性のついている牌が後にくるように値を返す
    let optionCompare = 0
    options.forEach(optionName => {
      if (!optionCompare && tileA.option[optionName] && !tileB.option[optionName]) {
        optionCompare = 1
      } else if (!optionCompare && !tileA.option[optionName] && tileB.option[optionName]) {
        optionCompare = -1
      }
    })
    return optionCompare
  }

  /**
   * 面子同士の比較。一意性があればなんでもいい。
   * @param ma 面子
   * @param mb 面子
   * @returns 比較結果
   */
  public compareMianzi = (ma:IMianzi, mb:IMianzi):number => {
    const compareMember =
      ma.kind - mb.kind ||
      ma.color - mb.color ||
      ma.number - mb.number ||
      _.compareArray(
        ma.tiles.sort((ma, mb) => this.compareTileByNumber(ma, mb)),
        mb.tiles.sort((ma, mb) => this.compareTileByNumber(ma, mb)),
        (ma, mb) => this.compareTileByNumber(ma, mb)
      )
    return compareMember
  }

  /**
   * 手牌から n 枚で構成される面子/対子を抜き出した全てのパターンを返却する
   * @param number 抜き出す枚数、対子なら2枚、など
   * @param tiles 手牌
   * @returns 考えうる面子/対子と残りの牌の組
   */
  protected takeMianziNorm (number: number, tiles: MahjongTile[]):[IMianzi, MahjongTile[]][] {
    // n 枚無い時は例外を吐く
    if (tiles.length < number) {
      throw Error(`Illigal hand: Need ${number} number hand`)
    }
    // 牌を n 枚抜き出し面子(雀頭)判定をする
    const candidateMianzi = _.extractAllN(
      tiles,
      number,
      (ta, tb) => this.compareTileByNumber(ta, tb)
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
  protected takeDuizi (tiles: MahjongTile[]):[IMianzi, MahjongTile[]][] {
    return this.takeMianziNorm(2, tiles)
  }

  /**
   * 手牌から面子を抜き出せるパターンを列挙する
   * @param tiles 手牌
   * @returns 面子と残りの牌の組
   */
  protected takeMianzi (tiles: MahjongTile[]):[IMianzi, MahjongTile[]][] {
    return this.takeMianziNorm(3, tiles)
  }

  /**
   * 手牌から可能な限り対子か面子か雀頭を取得し続け、取得可能なパターンを全て列挙する
   * @param intermediateHand 既に抜いてある面子/雀頭
   * @param takeXZi 面子を取るか雀頭を取るか
   * @returns 取得可能な全ての手牌構成の列
   */
  protected takeAllXZi (
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
                (a, b) => this.compareMianzi(a, b))
            )) {
          // 同一の面子(雀頭)の組み合わせが無い場合のみ結果に追加する
          concatMianzi.push(candidateHand)
        }
      })
    })
    return this.takeAllXZi(concatMianzi, takeXZi)
  }

  /**
   * 晒されていない手牌から通常の上がり形(1雀頭n面子)のパターンを列挙する
   * @param tiles 手牌
   * @returns 通常の上がり形として考えられる形
   */
  protected arrangeNormalHand (tiles: MahjongTile[]): IMianzi[][] {
    // まず雀頭をとる
    const _intermediateHand:[IMianzi, MahjongTile[]][] = this.takeDuizi(tiles)
    // [[面子構成], 手牌] の配列に開く
    const intermediateHand:[IMianzi[], MahjongTile[]][] = _intermediateHand.map(i => [[i[0]], i[1]])
    // 残った手牌から面子をとり続ける
    const arrangedManzi = this.takeAllXZi(intermediateHand, (ts) => this.takeMianzi(ts))
    return arrangedManzi.map(mt => mt[0])
  }

  /**
   * 特殊形(七対子、国士無双)の抽出を試みる
   * @param tiles 手牌
   * @returns 抽出された面子
   */
  private arrangeExceptionalHand (tiles: MahjongTile[]): IMianzi[][] {
    const role:IMianzi[][] = []
    role.concat(this.takeQiDuizi(tiles))
    role.concat(this.takeShisanyao(tiles))
    return role
  }

  /**
   * 手牌から七対子の抽出を試みます
   * @param tiles 手牌
   * @returns 七対子が成立したらそのパターン
   */
  protected takeQiDuizi (tiles:MahjongTile[]): IMianzi[][] {
    const intermediateHand:[IMianzi[], MahjongTile[]][] = [[[], tiles]]
    const qiDuizi = this.takeAllXZi(intermediateHand, (ts) => this.takeDuizi(ts))
    // 対子の抽出しかやってないんだから7個ある確認はしなくていいでしょうというおきもち
    if (qiDuizi.length > 0) {
      const duidis = qiDuizi.map(mt => mt[0])
      const ret:IMianzi[][] = []
      duidis.forEach(ds => {
        if (
          _.makeAllPairsFromHead(ds)
            .every(([d1, d2]) => !(d1.color === d2.color && d1.number === d2.number))
        ) {
          // 全ての対子において色と数の一致が見られなかったら
          // (not or not の方が見やすいかもしれなかったけどパフォーマンスは多分こっちの方がいい)
          ret.push(ds)
        }
      })
      return ret
    }
    return []
  }

  /**
   * 手牌から国士無双の抽出を試みます
   * @param tiles 手牌
   * @returns 国士無双が成立すればそのパターン
   */
  protected takeShisanyao (tiles:MahjongTile[]): IMianzi[][] {
    const hands:[IMianzi[], MahjongTile][] = []
    const yaojiuPais = this.parser.parseTiles('1w9w1p9p1s9swsenblh')
    // 手牌から1牌だけ抽出したパターンを列挙する
    const candidateRemaingHand = _.extractAllOne(tiles)
    candidateRemaingHand.forEach(([r, hs]) => {
      // 残った牌に対して么九牌全ての抜き出しを試みる
      const extracted = _.extractMultiple(
        hs.sort((ta, tb) => this.compareTileByColor(ta, tb)), // ソートされた牌は銀河牌が後にくるので先に銀河牌が抽出される事は無いはず
        yaojiuPais,
        (ta, tb) => this.canBeSameTile(ta, tb)
      )
      if (
        extracted.length === 0 && // 么九牌が全て抜き出せて
        yaojiuPais.findIndex(t => this.canBeSameTile(t, r)) !== -1 && // 残った牌も么九牌
        hands.every((cr) => !deepEqual(cr[1], r)) // 既に抜き出したやつと同じ牌が余ってない
      ) {
        hands.push([
          [{
            tiles,
            kind: MianziKind.shisanyao,
            number: 1,
            color: TileColor.wanzi,
            isOpend: false
          }],
          r
        ])
      }
    })
    return hands.map(r => r[0])
  }

  /**
   * 各色牌の最大数。ドラ等に使用する。
   * @param color 牌色、風牌と三元牌は分ける
   * @returns その色の最大数
   */
  protected getMaxNumber (color: TileColor): number {
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
}

/**
 * 牌オブジェクトを文字列から生成するユーティリティ
 */
class MahjongTileParser extends MahjongTileParserBase {
  private static _instance:MahjongTileParser
  private constructor () {
    super(
      MahjongTileParserBase.tileMap.numberdTileMap,
      MahjongTileParserBase.tileMap.symboledTileMap,
      MahjongTileParserBase.tileMap.option
    )
  }

  static getInstance ():MahjongTileParser {
    if (!this._instance) {
      this._instance = new MahjongTileParser()
    }
    return this._instance
  }
}
