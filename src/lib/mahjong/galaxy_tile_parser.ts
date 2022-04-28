import { MahjongTileParserBase } from './parse_tile'

export class GalaxyTileParser extends MahjongTileParserBase {
  static _instance:GalaxyTileParser
  private constructor () {
    super(
      MahjongTileParserBase.tileMap.numberdTileMap,
      MahjongTileParserBase.tileMap.symboledTileMap,
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
