import { TileColor } from './rule_base'
import { MahjongTileParserGenerator } from './parse_tile'

export class GalaxyTileParser extends MahjongTileParserGenerator {
  static _instance:GalaxyTileParser
  private constructor () {
    super(
      {
        w: { color: TileColor.wanzi, maxNumber: 9 },
        p: { color: TileColor.tongzi, maxNumber: 9 },
        s: { color: TileColor.siozi, maxNumber: 9 }
      },
      {
        /** 東(west) */
        w: { color: TileColor.feng, number: 1 },
        /** 南(south) */
        s: { color: TileColor.feng, number: 2 },
        /** 西(east) */
        e: { color: TileColor.feng, number: 3 },
        /** 北(noath) */
        n: { color: TileColor.feng, number: 4 },
        /** 白(bai ban) */
        b: { color: TileColor.sanyuan, number: 1 },
        /** 發(lu fa) */
        l: { color: TileColor.sanyuan, number: 2 },
        /** 中(hong zhong) */
        h: { color: TileColor.sanyuan, number: 3 }
      },
      {
        /** 銀河牌マーカー */
        g: 'isGalaxy',
        /** 赤牌 */
        r: 'isRed'
      }
    )
  }

  static getInstance ():GalaxyTileParser {
    if (!this._instance) {
      this._instance = new GalaxyTileParser()
    }
    return this._instance
  }
}
