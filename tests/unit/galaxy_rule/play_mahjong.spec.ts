/* eslint dot-notation:off */
import { GalaxyMahjongRule } from '@/lib/mahjong/galaxy_rule'
import { galaxyMianziToString } from '@/lib/mahjong/mianzi'
import { PlayMahjong } from '@/lib/mahjong/play_mahjong'

const GALAXY_RULE = GalaxyMahjongRule.getInstance()
const parser = (str:string) => GALAXY_RULE.parser.parseTiles(str)
const playMahjong = new PlayMahjong(GALAXY_RULE)

describe('上がり形探索', () => {
  it('dummy', () => {
    // nothing todo
  })
  // 時間がかかりすぎるため一旦廃止
})
