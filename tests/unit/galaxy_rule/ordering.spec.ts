import { GalaxyMahjongRule } from '@/lib/mahjong/galaxy_rule'
import { _ } from '@/lib/util/util'

const GALAXY_RULE = GalaxyMahjongRule.getInstance()
const parseTiles = (str:string) => GALAXY_RULE.parser.parseTiles(str)

const TILES_WANZI = [parseTiles('1w2w3w4w5w6w7w8w9w'), parseTiles('1wg2wg3wg4wg5wg6wg7wg8wg9wg')]
const TILES_TONZI = [parseTiles('1p2p3p4p5p6p7p8p9p'), parseTiles('1pg2pg3pg4pg5pg6pg7pg8pg9pg')]
const TILES_SOIZI = [parseTiles('1s2s3s4s5s6s7s8s9s'), parseTiles('1sg2sg3sg4sg5sg6sg7sg8sg9sg')]
const TILES_FENG = [parseTiles('wsen'), parseTiles('wgsgegng')]
const TILES_SANYUAN = [parseTiles('blh'), parseTiles('bglghg')]
const TILES_ZIPAI = [[...TILES_FENG[0], ...TILES_SANYUAN[0]], [...TILES_FENG[1], ...TILES_SANYUAN[1]]]

describe('連続性、同一性の確認', () => {
  it('普通の牌の連続チェック', () => {
    const [s1, s2, s3, w2, p2] = parseTiles('1s2s3s2w2p')
    expect(GALAXY_RULE.canBeNextTile(s1, s2)).toBeTruthy()
    expect(GALAXY_RULE.canBeNextTile(s1, s3)).toBeFalsy()
    expect(GALAXY_RULE.canBeNextTile(s1, w2)).toBeFalsy()
    expect(GALAXY_RULE.canBeNextTile(s1, p2)).toBeFalsy()
  })

  it('9と字牌の連続性の無さチェック', () => {
    const [s1, s9, w, s, e, n, b, l, h] = parseTiles('1s9swsenblh')
    expect(GALAXY_RULE.canBeNextTile(s9, s1)).toBeFalsy()
    expect(GALAXY_RULE.canBeNextTile(w, s)).toBeFalsy()
    expect(GALAXY_RULE.canBeNextTile(s, e)).toBeFalsy()
    expect(GALAXY_RULE.canBeNextTile(e, n)).toBeFalsy()
    expect(GALAXY_RULE.canBeNextTile(b, l)).toBeFalsy()
    expect(GALAXY_RULE.canBeNextTile(l, h)).toBeFalsy()
    expect(GALAXY_RULE.canBeNextTile(h, b)).toBeFalsy()
  })

  it('普通の牌の同一性チェック', () => {
    // オブジェクトが一緒だとあまり意味が無いので別々に生成
    expect(
      GALAXY_RULE.canBeSameTile(
        GALAXY_RULE.parser.parseTile('1s'),
        GALAXY_RULE.parser.parseTile('1s')
      )
    ).toBeTruthy()
    expect(
      GALAXY_RULE.canBeSameTile(
        GALAXY_RULE.parser.parseTile('1s'),
        GALAXY_RULE.parser.parseTile('2s')
      )
    ).toBeFalsy()
  })

  it('銀河牌との同一性/数牌', () => {
    const [s1, s1g, w1g, p1g, s2g] = parseTiles('1s1sg1wg1pg2sg')
    expect(GALAXY_RULE.canBeSameTile(s1, s1g)).toBeTruthy()
    expect(GALAXY_RULE.canBeSameTile(s1, w1g)).toBeTruthy()
    expect(GALAXY_RULE.canBeSameTile(s1, p1g)).toBeTruthy()
    expect(GALAXY_RULE.canBeSameTile(s1, s2g)).toBeFalsy()
  })

  it('銀河牌が前に来たときの連続性', () => {
    const [s1g, s2, w2, p2, s3, w3, p3] = parseTiles('1sg2s2w2p3s3w3p')
    expect(GALAXY_RULE.canBeNextTile(s1g, s2)).toBeTruthy()
    expect(GALAXY_RULE.canBeNextTile(s1g, w2)).toBeTruthy()
    expect(GALAXY_RULE.canBeNextTile(s1g, p2)).toBeTruthy()
    expect(GALAXY_RULE.canBeNextTile(s1g, s3)).toBeFalsy()
    expect(GALAXY_RULE.canBeNextTile(s1g, w3)).toBeFalsy()
    expect(GALAXY_RULE.canBeNextTile(s1g, p3)).toBeFalsy()
  })

  it('銀河牌が後に来たときの連続性', () => {
    const [s1, s2g, w2g, p2g, s3g, w3g, p3g] = parseTiles('1s2sg2wg2pg3sg3wg3pg')
    expect(GALAXY_RULE.canBeNextTile(s1, s2g)).toBeTruthy()
    expect(GALAXY_RULE.canBeNextTile(s1, w2g)).toBeTruthy()
    expect(GALAXY_RULE.canBeNextTile(s1, p2g)).toBeTruthy()
    expect(GALAXY_RULE.canBeNextTile(s1, s3g)).toBeFalsy()
    expect(GALAXY_RULE.canBeNextTile(s1, w3g)).toBeFalsy()
    expect(GALAXY_RULE.canBeNextTile(s1, p3g)).toBeFalsy()
  })

  it('同一性/字牌', () => {
    // 字牌は全て同じ牌にならない
    const charTilePairs = _.makeAllPairsFromHead(TILES_ZIPAI[0])
    charTilePairs.forEach(p => {
      expect(GALAXY_RULE.canBeSameTile(p[0], p[1])).toBeFalsy()
    })

    // 三元牌の銀河はどの三元牌とも同一になれる
    const sanYuanPairWithGalaxy = _.pairOf(TILES_SANYUAN[0], TILES_SANYUAN[1])
    sanYuanPairWithGalaxy.forEach(p => {
      expect(GALAXY_RULE.canBeSameTile(p[0], p[1])).toBeTruthy()
    })

    // 風牌の銀河はどの風牌とも同一になれる
    const fengsPairWithGalaxy = _.pairOf(TILES_FENG[0], TILES_FENG[1])
    fengsPairWithGalaxy.forEach(p => {
      expect(GALAXY_RULE.canBeSameTile(p[0], p[1])).toBeTruthy()
    })
  })
})
