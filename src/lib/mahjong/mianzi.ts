import { MahjongTile, TileColor } from './rule_base'

/**
 * 面子の種類
 */
export enum MianziKind {
  /** 順子 */
  'shunzi',
  /** 刻子 */
  'kezi',
  /** 槓子 */
  'kangzi',
  /** 対子 */
  'duizi',
  /** 塔子 */
  'tazi'
}

/**
 * 面子一般を示すインターフェイス、対子も含める。
 */
export interface IMianzi {
  /** 実際の牌 */
  tiles: MahjongTile[]
  /** 面子の種類 */
  kind: MianziKind
  /** 数。順子であれば開始されている数 */
  number: number
  /** 色、牌そのものとは別にとっておく */
  color: TileColor
  /** 鳴いている牌かどうか */
  isOpend: boolean
}

export const galaxyMianziToString = (m:IMianzi):string => {
  let str = ''
  str = m.tiles.map(t => t.toString()).join('')
  if (m.isOpend) {
    str = '(' + str + ')'
  }
  str += ['(w)', '(p)', '(s)', '', '', ''][m.color]
  if (m.color === TileColor.feng) {
    str += ['(w)', '(s)', '(e)', '(n)'][m.number - 1]
  }
  if (m.color === TileColor.sanyuan) {
    str += ['(b)', '(l)', '(h)'][m.number - 1]
  }
  return str
}
