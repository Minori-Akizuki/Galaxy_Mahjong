/* eslint dot-notation:off */
// private method のテストをしているため dot-notation はオフにしておく

import { GalaxyMahjongRule } from '@/lib/mahjong/galaxy_rule'

const GALAXY_RULE = GalaxyMahjongRule.getInstance()
const parseTiles = (str:string) => GALAXY_RULE.parser.parseTiles(str)

describe('手牌からの抜き出し', () => {
  it('対子の抜き出し/通常牌のみ', () => {
    const duizis = GALAXY_RULE['takeDuizi'](parseTiles('1s1s2w2w3s'))
    expect(duizis.length).toBe(2)
  })

  it('対子の抜き出し/銀河牌あり', () => {
    const duizis = GALAXY_RULE['takeDuizi'](parseTiles('1s1s1sg2w2w3s'))
    expect(duizis.length).toBe(3)
  })

  it('面子の抜き出し', () => {
    const manzis = GALAXY_RULE['takeMianzi'](parseTiles('1s1s1s2s3s'))
    expect(manzis.length).toBe(2)
  })

  it('面子の抜き出し/銀河牌あり', () => {
    const manzis = GALAXY_RULE['takeMianzi'](parseTiles('1s1s1sg2s3s'))
    expect(manzis.length).toBe(3)
    const manzis2 = GALAXY_RULE['takeMianzi'](parseTiles('1sg2wg3pg4w'))
    expect(manzis2.length).toBe(4)
  })

  it('手牌からの抜き出し/通常形/数牌のみ', () => {
    const hand1 = GALAXY_RULE['arrangeNormalHand'](parseTiles('1s1s2s2s3s3s4s4s'))
    expect(hand1.length).toBe(2)
    const hand2 = GALAXY_RULE['arrangeNormalHand'](parseTiles('1s1s2s2s3s3s4s5s'))
    expect(hand2.length).toBe(0)
    const head1 = GALAXY_RULE['arrangeNormalHand'](parseTiles('1s1s'))
    expect(head1.length).toBe(1)
  })

  it('手牌からの抜き出し/通常形/字牌絡み', () => {
    const hand1 = GALAXY_RULE['arrangeNormalHand'](parseTiles('bblllhhh'))
    expect(hand1.length).toBe(1)
    const hand2 = GALAXY_RULE['arrangeNormalHand'](parseTiles('nnsswhhh'))
    expect(hand2.length).toBe(0)
  })

  it('銀河牌がからんだ手牌からの抜き出し/通常形/数牌のみ', () => {
    const hand1 = GALAXY_RULE['arrangeNormalHand'](parseTiles('1s1wg2s2s3s3s4wg4pg'))
    expect(hand1.length).toBe(4)
    const hand2 = GALAXY_RULE['arrangeNormalHand'](parseTiles('1s1wg2s2s3s3s4wg5pg'))
    expect(hand2.length).toBe(0)
  })

  it('銀河牌がからんだ手牌からの抜き出し/通常形/字牌絡み', () => {
    // ここまで来ると正解なんてわからんから
    // コンソール出力してそれっぽい事確かめてからアサーション作成する

    // 三元牌
    const hand1 = GALAXY_RULE['arrangeNormalHand'](parseTiles('bbglllghhhg'))
    /*
    console.log('hand1:')
    hand1.forEach(ms => {
      console.log(ms.map(m => galaxyMianziToString(m)).join(','))
    })
    */
    expect(hand1.length).toBe(12)
    // 風牌
    const hand2 = GALAXY_RULE['arrangeNormalHand'](parseTiles('ngnsswghhh'))
    /*
    console.log('hand2:')
    hand2.forEach(ms => {
      console.log(ms.map(m => galaxyMianziToString(m)).join(','))
    })
    */
    expect(hand2.length).toBe(3)
    // 三元牌と風牌の混在
    const hand3 = GALAXY_RULE['arrangeNormalHand'](parseTiles('ngnsswgbhhg'))
    expect(hand3.length).toBe(0)
  })
})
