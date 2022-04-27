import { GalaxyMahjongRule } from '@/lib/mahjong/galaxy_rule'
import { galaxyMianziToString } from '@/lib/mahjong/mianzi'

const GALAXY_RULE = GalaxyMahjongRule.getInstance()
const parseTiles = (s:string) => GALAXY_RULE.parser.parseTiles(s)

describe('toString系のテスト', () => {
  it('Tile.prototype.toString', () => {
    const tiles1 = parseTiles('1s2w3p1pgwsen')
    expect(tiles1.map(t => t.toString()).join('')).toBe('1s2w3p1pgwsen')
  })

  it('galaxyMianziToString', () => {
    const mianzi1 = GALAXY_RULE.makeMianzi(parseTiles('1s2wg3s'), true)
    expect(galaxyMianziToString(mianzi1[0])).toBe('(1s2wg3s)(s)')
    const mianzi2 = GALAXY_RULE.makeMianzi(parseTiles('bblg'), false)
    expect(galaxyMianziToString(mianzi2[0])).toBe('bblg(b)')
    const mianzi3 = GALAXY_RULE.makeMianzi(parseTiles('wwwg'), false)
    expect(galaxyMianziToString(mianzi3[0])).toBe('wwwg(w)')
  })
})
