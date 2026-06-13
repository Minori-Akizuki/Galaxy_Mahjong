import { GalaxyMahjongRule } from '@/lib/mahjong/galaxy_rule'
import { MahjongTile } from '@/lib/mahjong/mahjong_tile'

const GALAXY_RULE = GalaxyMahjongRule.getInstance()
const parseTiles = (str:string):MahjongTile[] => GALAXY_RULE.parser.parseTiles(str)

/**
 * Issue #34: 銀河の字牌が同番号の数牌と同一視されてはならない。
 *
 * 仕様根拠（spec.md §1.3）:
 *   銀河牌は「数牌＝数字固定・色は数牌の範囲で自由／字牌＝同カテゴリ内
 *  （風は風・三元は三元）で自由」。**字牌と数牌をまたいで同一視してはならない**。
 *
 * 内部 number（tile_map.ts）: 風 東=1,南=2,西=3,北=4 / 三元 白=1,發=2,中=3。
 * 数牌は number=1..9。よって 北g(feng,4) と 4s(siozi,4) は number が一致するため、
 * カテゴリ未検査の実装では誤って同一視される。
 */
describe('Issue #34: 銀河字牌と数牌のカテゴリまたぎ同一視の禁止', () => {
  describe('直るべき false（字牌と数牌をまたいではならない）', () => {
    it('銀河の北(feng,4)は数牌の4索とは同一視できない', () => {
      const [ng, s4] = parseTiles('ng4s') // ng = 銀河の北(feng,4), s4 = 4索(siozi,4)
      expect(ng.option.isGalaxy).toBeTruthy()
      expect(GALAXY_RULE.canBeSameTile(ng, s4)).toBeFalsy()
    })

    it('引数の順序を入れ替えても同様（4索 と 銀河の北）', () => {
      const [s4, ng] = parseTiles('4sng') // s4 = 4索(siozi,4), ng = 銀河の北(feng,4)
      expect(ng.option.isGalaxy).toBeTruthy()
      expect(GALAXY_RULE.canBeSameTile(s4, ng)).toBeFalsy()
    })

    it('銀河の西(feng,3)は数牌の3索/3萬/3筒とは同一視できない', () => {
      const [eg] = parseTiles('eg') // e = 西(feng,3)
      const [s3, w3, p3] = parseTiles('3s3w3p')
      expect(eg.option.isGalaxy).toBeTruthy()
      expect(GALAXY_RULE.canBeSameTile(eg, s3)).toBeFalsy()
      expect(GALAXY_RULE.canBeSameTile(eg, w3)).toBeFalsy()
      expect(GALAXY_RULE.canBeSameTile(eg, p3)).toBeFalsy()
    })

    it('銀河の三元(發=sanyuan,2)は数牌の2索/2萬/2筒とは同一視できない', () => {
      const [lg] = parseTiles('lg') // l = 發(sanyuan,2)
      const [s2, w2, p2] = parseTiles('2s2w2p')
      expect(lg.option.isGalaxy).toBeTruthy()
      expect(GALAXY_RULE.canBeSameTile(lg, s2)).toBeFalsy()
      expect(GALAXY_RULE.canBeSameTile(lg, w2)).toBeFalsy()
      expect(GALAXY_RULE.canBeSameTile(lg, p2)).toBeFalsy()
    })

    it('逆向き（数牌の銀河と字牌）も同一視できない: 銀河4索 と 北', () => {
      const [s4g] = parseTiles('4sg')
      const [n] = parseTiles('n') // 北(feng,4)
      expect(s4g.option.isGalaxy).toBeTruthy()
      expect(GALAXY_RULE.canBeSameTile(s4g, n)).toBeFalsy()
    })
  })

  describe('維持されるべき true（既存の正しい挙動を壊さない）', () => {
    it('銀河数牌は同じ数字なら色自由（5索の銀河 と 5萬）', () => {
      const [s5g, w5] = parseTiles('5sg5w')
      expect(GALAXY_RULE.canBeSameTile(s5g, w5)).toBeTruthy()
    })

    it('銀河の風牌は同カテゴリの風牌と同一視できる（北の銀河 と 東）', () => {
      const [ng] = parseTiles('ng')
      const [w] = parseTiles('w') // w = 東(feng,1)
      expect(GALAXY_RULE.canBeSameTile(ng, w)).toBeTruthy()
    })

    it('銀河の三元牌は同カテゴリの三元牌と同一視できる（發の銀河 と 白）', () => {
      const [lg] = parseTiles('lg') // 發(sanyuan,2)
      const [b] = parseTiles('b') // 白(sanyuan,1)
      expect(GALAXY_RULE.canBeSameTile(lg, b)).toBeTruthy()
    })
  })
})
