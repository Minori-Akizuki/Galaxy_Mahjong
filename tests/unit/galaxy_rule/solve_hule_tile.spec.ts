import { GalaxyMahjongRule } from '@/lib/mahjong/galaxy_rule'
import { galaxyMianziToString, waitForm } from '@/lib/mahjong/mianzi'

const GALAXY_RULE = GalaxyMahjongRule.getInstance()
const parser = (str:string) => GALAXY_RULE.parser.parseTiles(str)

describe('通常形上がり牌探索', () => {
  it('待ち判定', () => {
    const hand = parser('1s1s2s3s')
    const wait = GALAXY_RULE.solveHuleTileCommoon(hand)
    wait.forEach(([mianzis, waitTile, _waitForm]) => {
      console.log(
        mianzis.map(m => galaxyMianziToString(m)).join(','),
        waitTile.map(t => t.toString()).join(','),
        waitForm[_waitForm])
    })
  })
})
