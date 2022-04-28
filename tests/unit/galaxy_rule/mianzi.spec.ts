import { GalaxyMahjongRule } from '@/lib/mahjong/galaxy_rule'
import { TileColor } from '@/lib/mahjong/mahjong_tile'
import { MianziKind } from '@/lib/mahjong/mianzi'

const GALAXY_RULE = GalaxyMahjongRule.getInstance()
const parseTiles = (str:string) => GALAXY_RULE.parser.parseTiles(str)

const TILES_FENG = [parseTiles('wsen'), parseTiles('wgsgegng')]
const TILES_SANYUAN = [parseTiles('blh'), parseTiles('bglghg')]
const TILES_ZIPAI = [[...TILES_FENG[0], ...TILES_SANYUAN[0]], [...TILES_FENG[1], ...TILES_SANYUAN[1]]]

describe('面子判定', () => {
  it('対子の判定/数牌', () => {
    const [s1, s2, w1] = parseTiles('1s2s1w')
    // 普通の対子、基本的な判定ができているか
    const duizi1 = GALAXY_RULE.makeMianzi([s1, s1], false)
    expect(duizi1.length).toBe(1) // 考えられる構成
    expect(duizi1[0]).toMatchObject({
      tiles: [s1, s1],
      kind: MianziKind.duizi,
      number: 1,
      color: TileColor.siozi,
      isOpend: false
    })
    // 違う数は対子にならない
    expect(GALAXY_RULE.makeMianzi([s1, s2], false).length).toBe(0)
    // 違う色は対子にならない
    expect(GALAXY_RULE.makeMianzi([s1, w1], false).length).toBe(0)
  })

  it('銀河牌がからんだ対子の判定/数牌', () => {
    const [s1g, s2g, w1] = parseTiles('1sg2sg1w')
    // 片方が銀河牌
    const duizi1 = GALAXY_RULE.makeMianzi([w1, s1g], false)
    expect(duizi1.length).toBe(1)
    expect(duizi1[0].color).toBe(TileColor.wanzi) // 色が非銀河牌に合わせたものになっているか
    // 両方が銀河牌
    const duizi2 = GALAXY_RULE.makeMianzi([s1g, s1g], false)
    expect(duizi2.length).toBe(3) // 両方銀河なので3色全部の可能性がある
    const duizi2Color = duizi2.map(d => d.color) // 数牌の色が3色入っているか
    expect(duizi2Color).toContain(TileColor.siozi)
    expect(duizi2Color).toContain(TileColor.wanzi)
    expect(duizi2Color).toContain(TileColor.tongzi)
    // 銀河牌同士でも違う数は対子にならない
    expect(GALAXY_RULE.makeMianzi([s1g, s2g], false).length).toBe(0)
  })

  it('対子の判定/字牌', () => {
    const [w, s, e, n, b, l, h] = TILES_ZIPAI[0]
    // 普通の対子
    expect(GALAXY_RULE.makeMianzi([w, w], false).length).toBe(1)
    expect(GALAXY_RULE.makeMianzi([b, b], false).length).toBe(1)
    // 異なる牌は対子にならない
    expect(GALAXY_RULE.makeMianzi([s, e], false).length).toBe(0)
    expect(GALAXY_RULE.makeMianzi([h, l], false).length).toBe(0)
    expect(GALAXY_RULE.makeMianzi([n, w], false).length).toBe(0)
  })

  it('銀河牌がからんだ対子の判定/字牌', () => {
    const [w, s, e, n, b, l, h] = TILES_ZIPAI[0]
    const [wg, sg, eg, ng, bg, lg, hg] = parseTiles('wgsgegngbglghg')
    // 片方が銀河牌
    const duizi1 = GALAXY_RULE.makeMianzi([w, sg], false)
    expect(duizi1.length).toBe(1)
    expect(duizi1[0].number).toBe(1) // 風の種類がちゃんと非銀河牌に合わせてあるか
    const duizi2 = GALAXY_RULE.makeMianzi([b, lg], false)
    expect(duizi2.length).toBe(1)
    expect(duizi2[0].number).toBe(1)
    // 両方が銀河牌/風牌
    const duizi3 = GALAXY_RULE.makeMianzi([eg, ng], false)
    expect(duizi3.length).toBe(4) // 風牌全ての用途がある
    expect(duizi3[0].color).toBe(TileColor.feng)
    const duizi3Number = duizi3.map(d => d.number)
    expect(duizi3Number).toContain(1)
    expect(duizi3Number).toContain(2)
    expect(duizi3Number).toContain(3)
    expect(duizi3Number).toContain(4)
    // 両方が銀河牌/三元牌
    const duizi4 = GALAXY_RULE.makeMianzi([lg, hg], false)
    expect(duizi4.length).toBe(3)
    expect(duizi4[0].color).toBe(TileColor.sanyuan)
    const duizi4Number = duizi4.map(d => d.number)
    expect(duizi4Number).toContain(1)
    expect(duizi4Number).toContain(2)
    expect(duizi4Number).toContain(3)
    // 銀河牌が混在していても風牌と三元牌は対子にならない
    expect(GALAXY_RULE.makeMianzi([wg, bg], false).length).toBe(0)
    expect(GALAXY_RULE.makeMianzi([e, hg], false).length).toBe(0)
    expect(GALAXY_RULE.makeMianzi([ng, l], false).length).toBe(0)
  })

  it('刻子判定/数牌', () => {
    const [s1, s2] = parseTiles('1s2s')
    // 通常の刻子判定、基礎情報チェック
    const kezi1 = GALAXY_RULE.makeMianzi([s1, s1, s1], false)
    expect(kezi1.length).toBe(1)
    expect(kezi1[0]).toMatchObject({
      tiles: [s1, s1, s1],
      kind: MianziKind.kezi,
      number: 1,
      color: TileColor.siozi,
      isOpend: false
    })
    // 鳴きが反映されるか
    const kezi2 = GALAXY_RULE.makeMianzi([s1, s1, s1], true)
    expect(kezi2.length).toBe(1)
    expect(kezi2[0].isOpend).toBeTruthy()
    // 違う牌が混在していると刻子にならない
    const kezi3 = GALAXY_RULE.makeMianzi([s1, s1, s2], false)
    expect(kezi3.length).toBe(0)
  })

  it('刻子判定/字牌', () => {
    const [w, s, b, l] = parseTiles('wsbl')
    // 通常の刻子判定、基礎情報チェック
    // 風牌
    const kezi1 = GALAXY_RULE.makeMianzi([s, s, s], false)
    expect(kezi1.length).toBe(1)
    expect(kezi1[0]).toMatchObject({
      tiles: [s, s, s],
      kind: MianziKind.kezi,
      number: 2,
      color: TileColor.feng,
      isOpend: false
    })
    // 三元牌
    const kezi2 = GALAXY_RULE.makeMianzi([b, b, b], false)
    expect(kezi2.length).toBe(1)
    expect(kezi2[0]).toMatchObject({
      tiles: [b, b, b],
      kind: MianziKind.kezi,
      number: 1,
      color: TileColor.sanyuan,
      isOpend: false
    })
    // 異なる風牌が混入すると刻子にならない
    const kezi3 = GALAXY_RULE.makeMianzi([w, s, s], false)
    expect(kezi3.length).toBe(0)
    // 異なる三元牌が混入すると刻子にならない
    const kezi4 = GALAXY_RULE.makeMianzi([b, b, l], false)
    expect(kezi4.length).toBe(0)
    // 三元牌と風牌が混在していても刻子にならない
    const kezi5 = GALAXY_RULE.makeMianzi([w, w, l], false)
    expect(kezi5.length).toBe(0)
  })

  it('銀河牌の絡んだ刻子判定/数牌', () => {
    const [s1, s1g, s2g, w1g, p1g] = parseTiles('1s1sg2sg1wg1pg')
    // 銀河牌が混在していても、数が同じなら刻子になる
    const kezi1 = GALAXY_RULE.makeMianzi([s1, s1g, w1g], false)
    expect(kezi1.length).toBe(1) // 通常の牌が混ざっているので1種類にしかならない
    expect(kezi1[0]).toMatchObject({
      kind: MianziKind.kezi,
      number: 1,
      color: TileColor.siozi
    }) // 最低限の中身の確認
    // 銀河牌が混在していても、数字が違えば刻子にならない
    const kezi2 = GALAXY_RULE.makeMianzi([s1, s1g, s2g], false)
    expect(kezi2.length).toBe(0)
    // 全ての牌が銀河牌ならそれはどの色の刻子にもなりうる
    const kezi3 = GALAXY_RULE.makeMianzi([w1g, p1g, s1g], false)
    expect(kezi3.length).toBe(3)
    const kezi3Color = kezi3.map(m => m.color)
    expect(kezi3Color).toContain(TileColor.siozi)
    expect(kezi3Color).toContain(TileColor.tongzi)
    expect(kezi3Color).toContain(TileColor.wanzi)
  })

  it('銀河牌の絡んだ刻子判定/字牌', () => {
    const [w, s, e, n, b, l, h] = TILES_ZIPAI[0]
    const [wg, sg, eg, ng, bg, lg, hg] = TILES_ZIPAI[1]
    // 銀河牌が混在している風牌の刻子
    const kezi1 = GALAXY_RULE.makeMianzi([w, sg, ng], false)
    expect(kezi1.length).toBe(1)
    expect(kezi1[0]).toMatchObject({
      color: TileColor.feng,
      number: 1
    }) // 銀河じゃない牌として刻子が扱われているか
    // 銀河牌が混在している三元牌の刻子
    const kezi2 = GALAXY_RULE.makeMianzi([bg, l, hg], false)
    expect(kezi2.length).toBe(1)
    expect(kezi2[0]).toMatchObject({
      color: TileColor.sanyuan,
      number: 2
    }) // 銀河じゃない牌として刻子が扱われているか
    // 全て銀河牌である風牌の刻子
    const kezi3 = GALAXY_RULE.makeMianzi([wg, eg, ng], false)
    expect(kezi3.length).toBe(4)
    expect(kezi3[0].color).toBe(TileColor.feng)
    const kezi3Number = kezi3.map(m => m.number)
    expect(kezi3Number).toContain(1)
    expect(kezi3Number).toContain(2)
    expect(kezi3Number).toContain(3)
    expect(kezi3Number).toContain(4)
    // 全て銀河牌である三元牌の刻子
    const kezi4 = GALAXY_RULE.makeMianzi([bg, lg, hg], false)
    expect(kezi4.length).toBe(3)
    expect(kezi4[0].color).toBe(TileColor.sanyuan)
    const kezi4Number = kezi3.map(m => m.number)
    expect(kezi4Number).toContain(1)
    expect(kezi4Number).toContain(2)
    expect(kezi4Number).toContain(3)
  })

  it('順子判定', () => {
    const [s1, s2, s3, s4, s9] = parseTiles('1s2s3s4s9s')
    // 基本的な順子判定
    const shunzi1 = GALAXY_RULE.makeMianzi([s1, s2, s3], false)
    expect(shunzi1.length).toBe(1)
    expect(shunzi1[0]).toMatchObject({
      tiles: [s1, s2, s3],
      kind: MianziKind.shunzi,
      number: 1,
      color: TileColor.siozi,
      isOpend: false
    })
    // 飛んだ牌は順子にならない
    const shunzi2 = GALAXY_RULE.makeMianzi([s1, s3, s4], false)
    expect(shunzi2.length).toBe(0)
    // 1 と 9 は繋がらない
    const shunzi3 = GALAXY_RULE.makeMianzi([s9, s1, s2], false)
    expect(shunzi3.length).toBe(0)
  })

  it('銀河牌の絡んだ順子判定', () => {
    const [s1, s2, s3, s4] = parseTiles('1s2s3s4s')
    const [s1g, s2g, s3g, s4g] = parseTiles('1sg2sg3sg4sg')
    const [w1g, w2g, p3g] = parseTiles('1wg2wg3pg')
    // 銀河牌が絡んだ順子を判定できるか
    const shunzi1 = GALAXY_RULE.makeMianzi([w1g, s2, s3], false)
    expect(shunzi1.length).toBe(1)
    expect(shunzi1[0]).toMatchObject({
      kind: MianziKind.shunzi,
      number: 1,
      color: TileColor.siozi, // 銀河でない牌に色が当ってるか
      isOpend: false
    })
    const shunzi2 = GALAXY_RULE.makeMianzi([s1, w2g, s3], false)
    expect(shunzi2.length).toBe(1)
    expect(shunzi2[0]).toMatchObject({
      kind: MianziKind.shunzi,
      number: 1,
      color: TileColor.siozi,
      isOpend: false
    })
    const shunzi3 = GALAXY_RULE.makeMianzi([s1, s2, p3g], false)
    expect(shunzi3.length).toBe(1)
    expect(shunzi3[0]).toMatchObject({
      kind: MianziKind.shunzi,
      number: 1,
      color: TileColor.siozi,
      isOpend: false
    })
    const shunzi4 = GALAXY_RULE.makeMianzi([s1, w2g, p3g], false)
    expect(shunzi4.length).toBe(1)
    expect(shunzi4[0]).toMatchObject({
      kind: MianziKind.shunzi,
      number: 1,
      color: TileColor.siozi,
      isOpend: false
    })
    // 全て銀河牌だった場合
    const shunzi5 = GALAXY_RULE.makeMianzi([s1g, w2g, p3g], false)
    expect(shunzi5.length).toBe(3)
    // 三色全ての色として扱われているか
    const shunzi5Color = shunzi5.map(m => m.color)
    expect(shunzi5Color).toContain(TileColor.siozi)
    expect(shunzi5Color).toContain(TileColor.tongzi)
    expect(shunzi5Color).toContain(TileColor.wanzi)
    // 順子の頭が狂ってないか
    expect(shunzi5.map(m => m.number).every(n => n === 1)).toBeTruthy()
  })
})
