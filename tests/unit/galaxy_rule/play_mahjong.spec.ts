/* eslint dot-notation:off */
import { GalaxyMahjongRule } from '@/lib/mahjong/galaxy_rule'
import { galaxyMianziToString } from '@/lib/mahjong/mianzi'
import { PlayMahjong } from '@/lib/mahjong/play_mahjong'

const GALAXY_RULE = GalaxyMahjongRule.getInstance()
const parser = (str:string) => GALAXY_RULE.parser.parseTiles(str)
const playMahjong = new PlayMahjong(GALAXY_RULE)

describe('上がり形探索', () => {
  it('単独牌', () => {
    const hand = parser('2s2s3s3s4s4s5s6s6s7s7s8s8s')
    const [huleTile] = parser('5s')
    const huleForm = playMahjong['solveHileTile'](hand, huleTile)
    expect(huleForm.length).toBe(4)
    expect(huleForm[0][1]).toMatchObject(huleTile)
  })

  it('全ての牌', () => {
    const hand = parser('2p2p2p3p3p3p4p4p4p5p')
    const huleForm = playMahjong.solveHuleTileAll(hand)
    /*
    huleForm.forEach(([ms, tile]) => {
      console.log(`${ms.map(m => galaxyMianziToString(m)).join(',')} : ${tile.toString()}`)
    })
    */
    expect(huleForm.length).toBe(7)
  })

  it('銀河牌の絡んだ上がり形探索', () => {
    const hand1 = parser('1s1s6sg7pg')
    const huleForm1 = playMahjong.solveHuleTileAll(hand1)
    expect(huleForm1.length).toBe(6)
  })
})
