import { IMianzi } from './mianzi'

/**
 * 牌の色、三元牌と風牌は別種にしている
 */
export enum TileColor {
  /** 萬子 */
  'wanzi',
  /** 筒子 */
  'tongzi',
  /** 索子 */
  'siozi',
  /** 風牌 */
  'feng',
  /** 三元牌 */
  'sanyuan',
  /** 花 */
  'flower'
}

/**
 * 麻雀牌の種別を示すクラス
 */
export class MahjongTile {
  readonly color: TileColor
  readonly number: number
  readonly option: {[name:string]: boolean}
  public constructor (color:TileColor, number:number, option:{[name:string]: boolean}) {
    this.color = color
    this.number = number
    this.option = option
  }
}

MahjongTile.prototype.toString = function doToString () {
  if (this === undefined) {
    return 'undefined'
  }
  if (this.color === TileColor.flower) {
    // 花牌の場合
    return 'f'
  }
  let str = ''
  if (this.color === TileColor.feng) {
    // 風牌の場合
    str += ['w', 's', 'e', 'n'][this.number - 1]
  } else if (this.color === TileColor.sanyuan) {
    // 三元牌の場合
    str += ['b', 'l', 'h'][this.number - 1]
  } else {
    // 数牌の場合
    str += this.number.toString() + ['w', 'p', 's'][this.color]
  }
  for (const optionName in this.option) {
    if (this.option[optionName]) {
      str += optionName.charAt(2).toLowerCase()
    }
  }
  return str
}

/**
 * 麻雀ルールのアブストラクトクラス、シングルトンで提供されるのが前提
 */
export abstract class AMajongRule {
  /**
   * tile と expect が同じ牌になれるか
   * @param tile 牌
   * @param expect 牌
   */
  abstract canBeSameTile(tile:MahjongTile, expect:MahjongTile):boolean
  /**
   * nextTile が tile の次の牌になれるか
   * @param tile 牌
   * @param nextTile 次の牌
   */
  abstract canBeNextTile(tile:MahjongTile, nextTile:MahjongTile):boolean
  /**
   * 渡された牌がドラ表になった時のドラを呈示する
   * @param tile ドラ表
   * @returns ドラになる牌の配列
   */
  abstract deriveDragon(tile:MahjongTile):MahjongTile[]
  /**
   * 与えられた牌(2つから4つ)から面子を作る
   * @param tiles 面子にしたい牌
   * @param isOpend 鳴いた牌かどうか
   * @returns 面子となりうるパターンの配列
   */
  abstract makeMianzi(tiles:MahjongTile[], isOpend:boolean):IMianzi[]
}
