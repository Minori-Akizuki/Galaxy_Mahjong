import { MahjongTileParserBase } from './parse_tile'

export class GalaxyTileParser extends MahjongTileParserBase {
  private static _galaxyTileParserInstance:GalaxyTileParser
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
    if (!this._galaxyTileParserInstance) {
      this._galaxyTileParserInstance = new GalaxyTileParser()
    }
    return this._galaxyTileParserInstance
  }
}
