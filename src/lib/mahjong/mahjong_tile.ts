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
