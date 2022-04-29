import { GalaxyMahjongRule } from '@/lib/mahjong/galaxy_rule'
import { MahjongTile } from '@/lib/mahjong/mahjong_tile'

const GALAXY_RULE = GalaxyMahjongRule.getInstance()
const parseTiles = (str:string):MahjongTile[] => GALAXY_RULE.parser.parseTiles(str)

describe('牌ソート確認', () => {
  it('数字順', () => {
    const [h, l, b, w, s, e, n, s1, p2, w3, p5, p5r, s1g] = parseTiles('hlbwsen1s2p3w5p5pr1sg')
    const expectTile = [s1, s1g, w, b, p2, s, l, w3, e, h, n, p5, p5r]
    const tiles = [p5r, p5, s1g, p2, w3, s1, w, s, e, n, b, l, h]
    tiles.sort(GALAXY_RULE.compareTileByNumber)
    // console.log(tiles.map(t => t.toString()).join(','))
    tiles.forEach((t, i) => {
      expect(t).toMatchObject(expectTile[i])
    })
  })

  it('色順', () => {
    const [h, l, b, w, s, e, n, s1, p2, w3, p5, p5r, s1g] = parseTiles('hlbwsen1s2p3w5p5pr1sg')
    const expectTile = [w3, p2, p5, p5r, s1, s1g, w, s, e, n, b, l, h]
    const tiles = [p5r, p5, s1g, h, l, b, w, s, e, n, p2, w3, s1]
    tiles.sort(GALAXY_RULE.compareTileByColor)
    // console.log(tiles.map(t => t.toString()).join(','))
    tiles.forEach((t, i) => {
      expect(t).toMatchObject(expectTile[i])
    })
  })
})
