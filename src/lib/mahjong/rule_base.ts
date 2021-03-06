import deepEqual from 'deep-equal'
import { _ } from '../util/util'
import { MahjongTile, TileColor } from './mahjong_tile'
import { IMianzi, MianziKind, waitForm } from './mianzi'
import { MahjongTileParserBase } from './parse_tile'
import { tileMap } from './tile_map'

/**
 * 麻雀ルール、シングルトンで提供される。
 * ベースクラスのためかなり手抜き
 */
export class MahjongRule {
  public parser:MahjongTileParserBase
  protected static _instance: MahjongRule
  protected ALL_TILE_TYPE:MahjongTile[]
  protected NORMAL_TILE_TYPE:MahjongTile[]
  protected ALL_TILE_SET:MahjongTile[]

  protected constructor () {
    this.parser = MahjongTileParser.getInstance()
    this.NORMAL_TILE_TYPE = this.generateNormalTileType()
    this.ALL_TILE_TYPE = this.NORMAL_TILE_TYPE
    this.ALL_TILE_SET = this.provisionAllTileSet(this.NORMAL_TILE_TYPE)
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
    return [...this.ALL_TILE_TYPE]
  }

  public getNormalTiles ():MahjongTile[] {
    return [...this.NORMAL_TILE_TYPE]
  }

  public getAllTileSet ():MahjongTile[] {
    return [...this.ALL_TILE_SET]
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
   * 中身は問わず面子の種類だけ比較する。
   * @param ma 面子
   * @param mb 面子
   * @return 比較結果
   */
  private compareMianziKind = (ma:IMianzi, mb:IMianzi):number => {
    return (
      ma.kind - mb.kind ||
      ma.color - mb.color ||
      ma.number - mb.number
    )
  }

  /**
   * 手牌から n 枚で構成される面子/対子を抜き出した全てのパターンを返却する
   * @param number 抜き出す枚数、対子なら2枚、など
   * @param tiles 手牌
   * @returns 考えうる面子/対子と残りの牌の組
   */
  protected takeMianziNorm (number: number, tiles: MahjongTile[]):[IMianzi, MahjongTile[]][] {
    // n 枚無い時は空配列を返す
    if (tiles.length < number) {
      return []
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
   * 牌を単騎扱いする。ここに配列ぶちこむと大変な事になるので1枚しか認めない。
   * @param tile 牌
   * @returns 単騎と空配列
   */
  protected takeGuli (tile: MahjongTile):[IMianzi, MahjongTile[]][] {
    return this.takeMianziNorm(1, [tile])
  }

  /**
   * 手牌から可能な限り対子か面子か雀頭を取得し続け、取得可能なパターンを全て列挙する
   * @param intermediateHand 既に抜いてある面子/雀頭
   * @param takeXZi 面子を取るか雀頭を取るか
   * @returns 取得可能な全ての手牌構成の列と残りの手牌
   */
  protected takeRecursivelyXZi (
    intermediateHand:[IMianzi[], MahjongTile[]][], takeXZi:(tiles: MahjongTile[]) => [IMianzi, MahjongTile[]][]
  ):[IMianzi[], MahjongTile[]][] {
    if (
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
    if (concatMianzi.length === 0) {
      // これ以上取得が不可能であった場合
      // 残った牌と一緒に抜いた面子構成を返却する
      return intermediateHand
    }
    return this.takeRecursivelyXZi(concatMianzi, takeXZi)
  }

  /**
   * 手牌から上がり形の算出を行う
   * @param tiles 手牌
   * @returns 考えうる面子構成のパターン
   */
  public solveHand (tiles: MahjongTile[]): IMianzi[][] {
    return [
      ...this.solveNormalHand(tiles),
      ...this.solveExceptionalHand(tiles)
    ]
  }

  /**
   * 晒されていない手牌から通常の上がり形(1雀頭n面子)のパターンを列挙する
   * @param tiles 手牌
   * @returns 通常の上がり形として考えられる形
   */
  protected solveNormalHand (tiles: MahjongTile[]): IMianzi[][] {
    // まず雀頭をとる
    const _intermediateHand:[IMianzi, MahjongTile[]][] = this.takeDuizi(tiles)
    // [[面子構成], 手牌] の配列に開く
    const intermediateHand:[IMianzi[], MahjongTile[]][] = _intermediateHand.map(i => [[i[0]], i[1]])
    // 残った手牌から面子をとり続ける
    const arrangedManzi = this.takeRecursivelyXZi(intermediateHand, (ts) => this.takeMianzi(ts))
    return arrangedManzi.filter(([mianzis, remaindHand]) => remaindHand.length === 0).map(mt => mt[0])
  }

  /**
   * 特殊形(七対子、国士無双)の抽出を試みる
   * @param tiles 手牌
   * @returns 抽出された面子
   */
  private solveExceptionalHand (tiles: MahjongTile[]): IMianzi[][] {
    return [...this.takeQiDuizi(tiles), ...this.takeShisanyao(tiles)]
  }

  /**
   * 手牌から七対子の抽出を試みる
   * @param tiles 手牌
   * @returns 七対子が成立したらそのパターン
   */
  protected takeQiDuizi (tiles:MahjongTile[]): IMianzi[][] {
    const intermediateHand:[IMianzi[], MahjongTile[]][] = [[[], tiles]]
    const qiDuizi = this.takeRecursivelyXZi(intermediateHand, (ts) => this.takeDuizi(ts))
    if (qiDuizi.length > 0) {
      const duidis = qiDuizi.filter(([ds, remaingHand]) => remaingHand.length === 0).map(mt => mt[0])
      const ret:IMianzi[][] = []
      duidis.forEach(ds => {
        if (
          ds.length === 7 &&
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
   * 手牌から国士無双の抽出を試みる
   * @param hand 手牌
   * @returns 全て単騎として扱った牌の列
   */
  protected takeShisanyao (hand:MahjongTile[]): IMianzi[][] {
    // 絶対に成立しない条件でガード節をつける
    if (
      hand.length !== 14 ||
      !hand.every(t => (t.number === 9 || t.number === 1 || t.color === TileColor.feng || t.color === TileColor.sanyuan))
    ) {
      // 手牌が13枚無く、19字牌以外の牌がある
      return []
    }
    const yaojiuPais = this.parser.parseTiles('1w9w1p9p1s9swsenblh')

    // 全ての牌を単騎牌とした配列を生成する
    let danqiss:IMianzi[][] = _.formation(hand.map(t => this.makeMianzi([t], false)))
    // 同一扱いの牌が3枚以上あるパターンを排除する
    danqiss = danqiss.filter((danqis:IMianzi[]) => _.uniq(danqis, (ma:IMianzi, mb:IMianzi) => this.compareMianziKind(ma, mb)).length > 11)

    const ret:IMianzi[][] = []
    danqiss.forEach(ds => {
      // 単騎として扱われている牌を全て通常牌に戻す
      const asHands = ds.map(d => new MahjongTile(d.color, d.number, {}))
      // 么九牌との差分をとる
      const missingTile = _.extractMultiple(yaojiuPais, asHands, (ta, tb) => this.canBeSameTile(ta, tb))
      if (missingTile.length === 0) {
        // 么九牌が全てあったら国士成立
        ret.push(ds)
      }
    })
    return ret
  }

  public solveHuleTile (hand:MahjongTile[]):[IMianzi[], MahjongTile[], waitForm][] {
    return [
      ...this.solveHuleTileCommoon(hand),
      ...this.solveHuleTileExceptionalHand(hand)
    ]
  }

  /**
   * 手牌から通常形の上がり形と上がり牌を算出する
   * @param hand 手牌
   * @returns [抽出された面子, 上がり牌, 待ち形]
   */
  protected solveHuleTileCommoon (hand:MahjongTile[]):[IMianzi[], MahjongTile[], waitForm][] {
    return [
      ...this.solveHuleTileCommonMianziFirst(hand),
      ...this.solveHuleTileCommonDuiziFirst(hand)
    ]
  }

  /**
   * 待ち牌の検索。面子抜き出し優先で行う
   * @param hand 手牌
   * @returns 面子構成、待ち、待ち形 の列
   */
  protected solveHuleTileCommonMianziFirst (hand:MahjongTile[]):[IMianzi[], MahjongTile[], waitForm][] {
    // まずは面子をできるだけ抜く
    // 同一パターンの刈り取りはこの時点でされている筈
    const completePartial = this.takeRecursivelyXZi([[[], hand]], (tiles) => this.takeMianzi(tiles))
    const ret:[IMianzi[], MahjongTile[], waitForm][] = []
    completePartial.forEach(([takenMianzis, remaingTiles]) => {
      if (remaingTiles.length === 1) {
        // 単騎待ちの場合
        const gulis = this.takeGuli(remaingTiles[0])
        gulis.forEach(([guli, none]) => {
          // 単騎待ちの形を配列に追加する
          const [waitTile, waitForm] = this.deriveHuleTileCommonFromWait([guli])
          ret.push([[...takenMianzis, guli], waitTile, waitForm])
        })
      } else if (remaingTiles.length === 4) {
        // 4枚残っている場合。双椪か 対子 + 塔子 のはず
        // 対子の抽出を試みる
        const triedTakeDuizis = this.takeRecursivelyXZi([[[], remaingTiles]], (tiles) => this.takeDuizi(tiles))
        triedTakeDuizis.forEach(([mianzis, remaingTiles]) => {
          // 塔子が残る場合は solveHuleTileCommonDuiziFirst でカバーする
          if (mianzis.length === 2) {
            // 双椪待ちの場合
            // 待ちを算出して配列に追加する
            const [waitTile, waitForm] = this.deriveHuleTileCommonFromWait(mianzis)
            ret.push([takenMianzis.concat(mianzis), waitTile, waitForm])
          }
        })
      }
      return ret
    })
    // 最後に結果の列を返す
    return ret
  }

  /**
   * 対子優先で待ち牌の算出を行う
   * @param hand 手牌
   * @returns [面子構成, 待ち牌, 待ち形] の列
   */
  protected solveHuleTileCommonDuiziFirst (hand:MahjongTile[]):[IMianzi[], MahjongTile[], waitForm][] {
    /**
     * 塔子をいままで抜いた面子にくっつける
     * @param takenMianzis 既に抜いた面子
     * @param tiles 牌(2枚)
     * @returns 面子構成、待ち牌、待ち形の配列
     */
    const conbineMianzisAndTazi = (takenMianzis:IMianzi[], tiles:MahjongTile[]):[IMianzi[], MahjongTile[], waitForm][] => {
      const ret:[IMianzi[], MahjongTile[], waitForm][] = []
      const triedMakeTazi = this.makeTazi(tiles)
      triedMakeTazi.forEach(tazi => {
        const [waitTile, waitForm] = this.deriveHuleTileCommonFromWait([tazi])
        ret.push([[...takenMianzis, tazi], waitTile, waitForm])
      })
      return ret
    }
    // 対子を一つ抜く
    const takenDuiziPatternsFromHand = this.takeDuizi(hand)
    const ret:[IMianzi[], MahjongTile[], waitForm][] = []
    takenDuiziPatternsFromHand.forEach(([duizi, remaindTiles]) => {
      // 面子を可能な限り取得する
      const completePartial = this.takeRecursivelyXZi([[[duizi], remaindTiles]], (tiles) => this.takeMianzi(tiles))
      completePartial.forEach(([mianzis, remaindTiles]) => {
        if (remaindTiles.length === 2) {
          // 残ってる牌が2枚だった場合
          // 塔子の生成を試みる
          ret.push(...conbineMianzisAndTazi(mianzis, remaindTiles))
        }
      })
    })
    return ret
  }

  /**
   * 特殊形の待ち牌算出を試みる
   * @param hand 手牌
   * @returns [面子構成, 待ち牌, 待ち形] の列
   */
  protected solveHuleTileExceptionalHand (hand:MahjongTile[]):[IMianzi[], MahjongTile[], waitForm][] {
    return [...this.solveHuleTileQiDuizi(hand), ...this.solveHuleTileShisanyao(hand)]
  }

  /**
   * 手牌から七対子の待ち牌算出を試みる
   * @param hand 手牌
   * @returns [面子構成, 待ち牌, 待ち形] の列
   */
  protected solveHuleTileQiDuizi (hand:MahjongTile[]):[IMianzi[], MahjongTile[], waitForm][] {
    if (hand.length !== 13) {
      // 手牌が13枚でない時は即座に終了する
      return []
    }
    // 手牌から対子をできるだけ抽出する
    const ret:[IMianzi[], MahjongTile[], waitForm][] = []
    const duizis = this.takeRecursivelyXZi([[[], hand]], (ts) => this.takeDuizi(ts))
    duizis.forEach(([duizis, remaingTiles]) => {
      if (remaingTiles.length === 1) {
        ret.push(...this
          .takeGuli(remaingTiles[0])
          .map(([guli, none]):[IMianzi, [MahjongTile[], waitForm]] => [guli, this.deriveHuleTileCommonFromWait([guli])])
          .map(([guli, [tiles, waitForm]]):[IMianzi[], MahjongTile[], waitForm] => [[...duizis, guli], tiles, waitForm])
        )
      }
    })
    return ret
  }

  /**
   * 手牌から国士無双の待ち牌算出を試みる
   * @param hand 手牌
   * @return [手牌構成全て単騎扱い, 待ち牌, 待ち形(便宜的に単騎)] の列
   */
  protected solveHuleTileShisanyao (hand:MahjongTile[]):[IMianzi[], MahjongTile[], waitForm][] {
    if (
      hand.length !== 13 ||
      !hand.every(t => (t.number === 9 || t.number === 1 || t.color === TileColor.feng || t.color === TileColor.sanyuan))
    ) {
      // 手牌が13枚無く、19字牌以外の牌がある
      return []
    }

    // 么九牌の組
    const yaojiuPais = this.parser.parseTiles('1w9w1p9p1s9seswnblh')

    // 全ての牌を単騎牌とした配列を生成する
    let danqiss:IMianzi[][] = _.formation(hand.map(t => this.makeMianzi([t], false)))
    // 同一扱いの牌が3枚以上あるパターンを排除する
    danqiss = danqiss.filter((danqis:IMianzi[]) => _.uniq(danqis, (ma:IMianzi, mb:IMianzi) => this.compareMianziKind(ma, mb)).length > 11)

    const ret:[IMianzi[], MahjongTile[], waitForm][] = []
    danqiss.forEach(ds => {
      // 単騎として扱われている牌を全て通常牌に戻す
      const asHands = ds.map(d => new MahjongTile(d.color, d.number, {}))
      // 么九牌との差分をとる
      const missingTile = _.extractMultiple(yaojiuPais, asHands, (ta, tb) => this.canBeSameTile(ta, tb))
      if (missingTile.length === 1 || missingTile.length === 0) {
        // 么九牌が全てあったら 13 面待ち
        const waitTile = missingTile.length === 1 ? missingTile : yaojiuPais
        ret.push([ds, waitTile, waitForm.danqi])
      }
    })
    return ret
  }

  /**
   * 塔子、双椪から待ちの種類と待ち牌を算出する
   * @param ms 塔子1つか対子1つ
   * @returns [待ち牌, 待ち形] の列
   */
  public deriveHuleTileCommonFromWait (ms:IMianzi[]):[MahjongTile[], waitForm] {
    if (ms.length === 2 && ms[0].kind === MianziKind.duizi && ms[1].kind === MianziKind.duizi) {
      // 双椪
      const [m1, m2] = ms
      const tiles:MahjongTile[] = [
        new MahjongTile(m1.color, m1.number, {}),
        new MahjongTile(m2.color, m2.number, {})
      ]
      return [tiles, waitForm.shuangPong]
    }
    const m = ms[0]
    if (m.kind === MianziKind.guli) {
      // 孤立牌(単騎)
      return [[new MahjongTile(m.color, m.number, {})], waitForm.danqi]
    }
    const [t1, t2] = m.tiles.sort(this.compareTileByNumber)
    if (t1.number + 2 === t2.number) {
      // 嵌張
      return [[new MahjongTile(m.color, t1.number + 1, {})], waitForm.quianZhang]
    }
    if (t1.number + 1 === t2.number) {
      // 連続した牌の場合(本当はこの条件いらんけど一応)
      if (t1.number === 8) { // TODO: マジックナンバーなのが気に食わない
        return [[new MahjongTile(m.color, t1.number - 1, {})], waitForm.bianShang]
      }
      if (t1.number === 1) {
        return [[new MahjongTile(m.color, t2.number + 1, {})], waitForm.bianShang]
      }
      return [
        [
          new MahjongTile(m.color, t1.number - 1, {}),
          new MahjongTile(m.color, t2.number + 1, {})
        ],
        waitForm.ligngMain
      ]
    }
    throw Error('deriveHuleTileCommon: Illigal wait form')
  }

  /**
   * 塔子を作成する。数牌限定。
   * 通常の面子作成に組み込んでしまうとパターンが爆発的に増えてしまうので別にしなければいけない
   * @param tileA 牌
   * @param tileB 牌
   * @returns 塔子
   */
  public makeTazi (tiles:MahjongTile[]):IMianzi[] {
    const [tileA, tileB] = tiles
    const symboledTileColor = [TileColor.feng, TileColor.sanyuan]
    const equal = (a:number, b:number) => a === b
    if (_.isContained(symboledTileColor, tileA.color, equal) || _.isContained(symboledTileColor, tileB.color, equal)) {
      return []
    }
    if (Math.abs(tileA.number - tileB.number) <= 2 && tileA.number !== tileB.number) {
      return this.shoudBeTaziColor(tileA, tileB).map(color => {
        return {
          tiles: [tileA, tileB],
          color,
          number: Math.min(tileA.number, tileB.number),
          kind: MianziKind.tazi,
          isOpend: false
        }
      })
    }
    return []
  }

  /**
   * 二つの牌が塔子として扱われた最にどの色になるかを判定する。数牌限定
   * @param tileA 牌
   * @param tileB 牌
   * @returns 想定される色の種類
   */
  protected shoudBeTaziColor (tileA:MahjongTile, tileB:MahjongTile):TileColor[] {
    if (tileA.color === tileB.color) {
      return [tileA.color]
    }
    return []
  }

  /**
   * 手牌から対子を一つ抽出する
   * @param tile 手牌
   * @returns 対子と残りの牌の組の配列
   */
  protected takeTazi (hand: MahjongTile[]):[IMianzi, MahjongTile[]][] {
    const _hand = [...hand]
    const compare = (ta:MahjongTile, tb:MahjongTile) => this.compareTileByNumber(ta, tb)
    // 数字順に並べたペアを用意する
    const sortedHandPairs = _.makeAllPairsFromHead(_hand.sort(compare))
    // 返却用の変数
    const ret:[IMianzi, MahjongTile[]][] = []

    sortedHandPairs.forEach(ts => {
      // 今迄抽出した牌を列挙する
      const takedTiles = ret.map(([mianzi, tiles]) => mianzi.tiles)
      if (takedTiles.every(tm => !_.compareArray(tm, ts, compare))) {
        // 同一牌の組合せが無かったら
        // 「残りの牌」を生成する
        const remaingTile = _.extractMultiple(hand, ts, (ta, tb) => compare(ta, tb) === 0)
        const tazis = this.makeTazi(ts)
        ret.push(...tazis.map((m:IMianzi):[IMianzi, MahjongTile[]] => [m, remaingTile]))
      }
    })
    return ret
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

  /**
   * 特殊牌ではない牌の一覧の生成
   * @returns 使用される通常牌の一覧
   */
  protected generateNormalTileType ():MahjongTile[] {
    const ret:MahjongTile[] = []
    // 数牌の生成
    for (const kind in tileMap.numberdTileMap) {
      for (let number = 1; number <= tileMap.numberdTileMap[kind].maxNumber; number++) {
        ret.push(new MahjongTile(tileMap.numberdTileMap[kind].color, number, {}))
      }
    }
    // 字牌の生成
    for (const tile in tileMap.symboledTileMap) {
      ret.push(new MahjongTile(tileMap.symboledTileMap[tile].color, tileMap.symboledTileMap[tile].number, {}))
    }
    return ret
  }

  /**
   * この麻雀で使用する全ての牌のセットを提供する
   * @param normalTileType 通常牌の種類
   * @returns 麻雀で使用する牌全てのセット
   */
  protected provisionAllTileSet (normalTileType:MahjongTile[]):MahjongTile[] {
    // TODO: このクラスの役割じゃない気がしている。多分 PlayMahjong かその派生クラスに移すのが適当。
    const tileSet:MahjongTile[] = []
    // 通常牌を4枚ずつ用意する
    normalTileType.forEach(t => tileSet.push(t, t, t, t))
    return tileSet
  }
}

/**
 * 牌オブジェクトを文字列から生成するユーティリティ
 */
class MahjongTileParser extends MahjongTileParserBase {
  private static _instance:MahjongTileParser
  private constructor () {
    super(
      tileMap.numberdTileMap,
      tileMap.symboledTileMap,
      tileMap.option
    )
  }

  static getInstance ():MahjongTileParser {
    if (!this._instance) {
      this._instance = new MahjongTileParser()
    }
    return this._instance
  }
}
