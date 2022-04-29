import { MahjongTile } from './mahjong_tile'
import { IMianzi } from './mianzi'
import { MahjongRule } from './rule_base'

export class PlayMahjong {
  private mahjongRule:MahjongRule
  public constructor (mahjongRule:MahjongRule) {
    this.mahjongRule = mahjongRule
  }
}
