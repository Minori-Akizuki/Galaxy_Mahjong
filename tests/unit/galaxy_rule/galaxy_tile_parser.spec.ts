import { GalaxyMahjongRule } from '@/lib/mahjong/galaxy_rule'
import { MahjongTile, TileColor } from '@/lib/mahjong/rule_base'

const GALAXY_RULE = GalaxyMahjongRule.getInstance()

describe('パーサの確認', () => {
  const sTiles:string[] = [
    '1s', '9s',
    '1w', '9w',
    '1p', '9p',
    '1pg', '5pr',
    'w', 's', 'e', 'n', 'wg', 'sg', 'eg', 'ng',
    'b', 'l', 'h', 'bg', 'lg', 'hg'
  ]
  it('正常系のテスト', () => {
    const tiles:MahjongTile[] = sTiles.map((t) => GALAXY_RULE.parser.parseTile(t))
    const expectTiles:MahjongTile[] = [
      { color: TileColor.siozi, number: 1, option: {} },
      { color: TileColor.siozi, number: 9, option: {} },
      { color: TileColor.wanzi, number: 1, option: {} },
      { color: TileColor.wanzi, number: 9, option: {} },
      { color: TileColor.tongzi, number: 1, option: {} },
      { color: TileColor.tongzi, number: 9, option: {} },
      { color: TileColor.tongzi, number: 1, option: { isGalaxy: true } },
      { color: TileColor.tongzi, number: 5, option: { isRed: true } },
      { color: TileColor.feng, number: 1, option: {} },
      { color: TileColor.feng, number: 2, option: {} },
      { color: TileColor.feng, number: 3, option: {} },
      { color: TileColor.feng, number: 4, option: {} },
      { color: TileColor.feng, number: 1, option: { isGalaxy: true } },
      { color: TileColor.feng, number: 2, option: { isGalaxy: true } },
      { color: TileColor.feng, number: 3, option: { isGalaxy: true } },
      { color: TileColor.feng, number: 4, option: { isGalaxy: true } },
      { color: TileColor.sanyuan, number: 1, option: {} },
      { color: TileColor.sanyuan, number: 2, option: {} },
      { color: TileColor.sanyuan, number: 3, option: {} },
      { color: TileColor.sanyuan, number: 1, option: { isGalaxy: true } },
      { color: TileColor.sanyuan, number: 2, option: { isGalaxy: true } },
      { color: TileColor.sanyuan, number: 3, option: { isGalaxy: true } }
    ]
    tiles.forEach((t, i) => {
      expect(t).toEqual(expectTiles[i])
    })
  })

  it('存在しない数字', () => {
    expect(() => GALAXY_RULE.parser.parseTile('10s')).toThrow()
    expect(() => GALAXY_RULE.parser.parseTile('10sg')).toThrow()
  })

  it('存在しない色', () => {
    expect(() => GALAXY_RULE.parser.parseTile('9k')).toThrow()
    expect(() => GALAXY_RULE.parser.parseTile('9kg')).toThrow()
  })

  it('存在しない字牌', () => {
    expect(() => GALAXY_RULE.parser.parseTile('r')).toThrow()
    expect(() => GALAXY_RULE.parser.parseTile('rg')).toThrow()
  })

  it('存在しないオプション', () => {
    expect(() => GALAXY_RULE.parser.parseTile('wt')).toThrow()
    expect(() => GALAXY_RULE.parser.parseTile('wtg')).toThrow()
  })
})
