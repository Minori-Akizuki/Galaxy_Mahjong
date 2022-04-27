import { GalaxyMahjongRule } from '@/lib/mahjong/galaxy_rule'

const GALAXY_RULE = GalaxyMahjongRule.getInstance()
const parseTiles = (str:string) => GALAXY_RULE.parser.parseTiles(str)

const TILES_FENG = [parseTiles('wsen'), parseTiles('wgsgegng')]
const TILES_SANYUAN = [parseTiles('blh'), parseTiles('bglghg')]
const TILES_ZIPAI = [[...TILES_FENG[0], ...TILES_SANYUAN[0]], [...TILES_FENG[1], ...TILES_SANYUAN[1]]]

describe('ドラ牌', () => {
  it('普通の数牌がドラの場合', () => {
    const [s1, s2, s9] = parseTiles('1s2s9s')
    // 一索がドラの場合
    const s1Dragon = GALAXY_RULE.deriveDragon(s1)
    expect(s1Dragon[0]).toEqual(s2) // 二索がドラである
    expect(s1Dragon.length).toBe(1) // ドラは1枚しかない
    // 九索がドラの場合
    const s9Dragon = GALAXY_RULE.deriveDragon(s9)
    expect(s9Dragon[0]).toEqual(s1) // 一索がドラである
    expect(s9Dragon.length).toBe(1) // ドラは1枚しかない
  })

  it('普通の字牌がドラの場合', () => {
    const [w, s, e, n, b, l, h] = TILES_ZIPAI[0]
    const dragons = [w, s, e, n, b, l, h].map((t) => GALAXY_RULE.deriveDragon(t))
    // 東のドラ
    expect(dragons[0].length).toBe(1)
    expect(dragons[0][0]).toEqual(s)
    // 南のドラ
    expect(dragons[1].length).toBe(1)
    expect(dragons[1][0]).toEqual(e)
    // 西のドラ
    expect(dragons[2].length).toBe(1)
    expect(dragons[2][0]).toEqual(n)
    // 北のドラ
    expect(dragons[3].length).toBe(1)
    expect(dragons[3][0]).toEqual(w)
    // 白のドラ
    expect(dragons[4].length).toBe(1)
    expect(dragons[4][0]).toEqual(l)
    // 發のドラ
    expect(dragons[5].length).toBe(1)
    expect(dragons[5][0]).toEqual(h)
    // 中のドラ
    expect(dragons[6].length).toBe(1)
    expect(dragons[6][0]).toEqual(b)
  })

  it('銀河牌がドラ表の場合/数牌', () => {
    const tiles = parseTiles('1sg1s1w1p2s2w2p9sg')
    const [s1g, s1, w1, p1, s2, w2, p2, s9g] = tiles
    // 一索銀河がドラ表の場合
    const s1gDragon = GALAXY_RULE.deriveDragon(s1g)
    // ドラは3枚存在する
    expect(s1gDragon.length).toBe(3)
    // 2の牌全てがドラである
    expect(s1gDragon).toContainEqual(s2)
    expect(s1gDragon).toContainEqual(w2)
    expect(s1gDragon).toContainEqual(p2)
    // 九索銀河がドラ表の場合
    const s9gDragon = GALAXY_RULE.deriveDragon(s9g)
    // ドラは3枚存在する
    expect(s9gDragon.length).toBe(3)
    // 1の牌全てがドラである
    expect(s9gDragon).toContainEqual(s1)
    expect(s9gDragon).toContainEqual(w1)
    expect(s9gDragon).toContainEqual(p1)
  })

  it('字牌がドラの場合/銀河牌', () => {
    const [w, s, e, n, b, l, h] = TILES_ZIPAI[0]
    const dragons = parseTiles('wgsgegngbglghg').map((t) => GALAXY_RULE.deriveDragon(t))
    // 東のドラ
    expect(dragons[0].length).toBe(4)
    expect(dragons[0]).toContainEqual(w)
    expect(dragons[0]).toContainEqual(s)
    expect(dragons[0]).toContainEqual(e)
    expect(dragons[0]).toContainEqual(n)
    // 南のドラ
    expect(dragons[1].length).toBe(4)
    expect(dragons[1]).toContainEqual(w)
    expect(dragons[1]).toContainEqual(s)
    expect(dragons[1]).toContainEqual(e)
    expect(dragons[1]).toContainEqual(n)
    // 西のドラ
    expect(dragons[2].length).toBe(4)
    expect(dragons[2]).toContainEqual(w)
    expect(dragons[2]).toContainEqual(s)
    expect(dragons[2]).toContainEqual(e)
    expect(dragons[2]).toContainEqual(n)
    // 北のドラ
    expect(dragons[3].length).toBe(4)
    expect(dragons[3]).toContainEqual(w)
    expect(dragons[3]).toContainEqual(s)
    expect(dragons[3]).toContainEqual(e)
    expect(dragons[3]).toContainEqual(n)
    // 白のドラ
    expect(dragons[4].length).toBe(3)
    expect(dragons[4]).toContainEqual(b)
    expect(dragons[4]).toContainEqual(l)
    expect(dragons[4]).toContainEqual(h)
    // 發のドラ
    expect(dragons[5].length).toBe(3)
    expect(dragons[5]).toContainEqual(b)
    expect(dragons[5]).toContainEqual(l)
    expect(dragons[5]).toContainEqual(h)
    // 中のドラ
    expect(dragons[6].length).toBe(3)
    expect(dragons[6]).toContainEqual(b)
    expect(dragons[6]).toContainEqual(l)
    expect(dragons[6]).toContainEqual(h)
  })
})
