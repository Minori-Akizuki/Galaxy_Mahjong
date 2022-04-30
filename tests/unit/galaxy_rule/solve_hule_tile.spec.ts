import { GalaxyMahjongRule } from '@/lib/mahjong/galaxy_rule'
import { galaxyMianziToString, waitForm } from '@/lib/mahjong/mianzi'

const GALAXY_RULE = GalaxyMahjongRule.getInstance()
const parser = (str:string) => GALAXY_RULE.parser.parseTiles(str)

describe('通常形上がり牌探索', () => {
  it('待ち判定', () => {
    const hand = parser('ngegn4s5s6s6p5p4wg1wg1w2w3w')
    const wait = GALAXY_RULE.solveHuleTileCommoon(hand)
    wait.forEach(([mianzis, waitTile, _waitForm]) => {
      console.log(
        mianzis.map(m => galaxyMianziToString(m)).join(','),
        waitTile.map(t => t.toString()).join(','),
        waitForm[_waitForm])
    })
  })

  it('双椪判定', () => {
    const hand = parser('nnll')
    const wait = GALAXY_RULE.solveHuleTileCommoon(hand)
    wait.forEach(([mianzis, waitTile, _waitForm]) => {
      console.log(
        mianzis.map(m => galaxyMianziToString(m)).join(','),
        waitTile.map(t => t.toString()).join(','),
        waitForm[_waitForm])
    })
  })
})
