import { GalaxyMahjongRule } from '@/lib/mahjong/galaxy_rule'
import { galaxyMianziToString, waitForm } from '@/lib/mahjong/mianzi'
import { _ } from '@/lib/util/util'

const GALAXY_RULE = GalaxyMahjongRule.getInstance()
const parser = (str:string) => GALAXY_RULE.parser.parseTiles(str)

describe('通常形上がり牌探索', () => {
  it('待ち判定', () => {
    const hand = parser('ngegn4s5s6s6p5p4wg1wg1w2w3w')
    const wait = GALAXY_RULE.solveHuleTile(hand)
    /*
    wait.forEach(([mianzis, waitTile, _waitForm]) => {
      console.log(
        mianzis.map(m => galaxyMianziToString(m)).join(','),
        waitTile.map(t => t.toString()).join(','),
        waitForm[_waitForm])
    })
    */
    expect(wait.length).toBe(6)
  })

  it('双椪判定', () => {
    const hand = parser('nnlglg')
    const wait = GALAXY_RULE.solveHuleTile(hand)
    /*
    wait.forEach(([mianzis, waitTile, _waitForm]) => {
      console.log(
        mianzis.map(m => galaxyMianziToString(m)).join(','),
        waitTile.map(t => t.toString()).join(','),
        waitForm[_waitForm])
    })
    */
    expect(wait.length).toBe(3)
  })

  it('七対子判定', () => {
    const hand = parser('1w1w1wg3p3p5s5snnwwhh')
    const wait = GALAXY_RULE.solveHuleTile(hand)
    /*
    wait.forEach(([mianzis, waitTile, _waitForm]) => {
      console.log(
        mianzis.map(m => galaxyMianziToString(m)).join(','),
        waitTile.map(t => t.toString()).join(','),
        waitForm[_waitForm])
    })
    */
    expect(wait.length).toBe(4)
  })

  it('国士無双判定', () => {
    const hand = parser('1wg9wg9p1s9swssgenbbgh')
    const wait = GALAXY_RULE.solveHuleTile(hand)
    /*
    wait.forEach(([mianzis, waitTile, _waitForm]) => {
      console.log(
        mianzis.map(m => galaxyMianziToString(m)).join(','),
        waitTile.map(t => t.toString()).join(','),
        waitForm[_waitForm])
    })
    */
    expect(wait.length).toBe(8)
  })

  it('国士七対子総合判定', () => {
    const hand = parser('9s1p9pg1wg9wgesgwngblghhg')
    const wait = GALAXY_RULE.solveHuleTile(hand)
    /*
    wait.forEach(([mianzis, waitTile, _waitForm]) => {
      console.log(
        mianzis.map(m => galaxyMianziToString(m)).join(','),
        waitTile.map(t => t.toString()).join(','),
        waitForm[_waitForm])
    })
    */
    const waitTiles = _.uniq(wait.map(([mianzi, tiles, form]) => tiles).flat(), (ta, tb) => GALAXY_RULE.compareTileByNumber(ta, tb))
    expect(waitTiles.length).toBe(5)
    parser('1s1w9p9w9s').forEach(w => {
      expect(waitTiles).toContainEqual(w)
    })
  })
})
