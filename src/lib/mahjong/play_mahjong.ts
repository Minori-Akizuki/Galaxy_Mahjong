import { MahjongTile } from './mahjong_tile'
import { IMianzi } from './mianzi'
import { MahjongRule } from './rule_base'

export class PlayMahjong {
  private mahjongRule:MahjongRule
  public constructor (mahjongRule:MahjongRule) {
    this.mahjongRule = mahjongRule
  }

  public solveHuleTileAll (tiles:MahjongTile[]):[IMianzi[], MahjongTile][] {
    const allNormalTile = this.mahjongRule.getNormalTiles()
    let huleForms:[IMianzi[], MahjongTile][] = []
    allNormalTile.forEach(huleTile => {
      huleForms = huleForms.concat(this.solveHileTile(tiles, huleTile))
    })
    return huleForms
  }

  private solveHileTile (tiles:MahjongTile[], huleTile:MahjongTile):[IMianzi[], MahjongTile][] {
    const solevedHand = this.mahjongRule.solveHand([...tiles, huleTile])
    const ret:[IMianzi[], MahjongTile][] = []
    solevedHand.forEach(ms => ret.push([ms, huleTile]))
    return ret
  }
}
