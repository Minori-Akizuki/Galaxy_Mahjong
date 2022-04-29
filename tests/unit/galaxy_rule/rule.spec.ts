import { GalaxyMahjongRule } from '@/lib/mahjong/galaxy_rule'
import { MahjongRule } from '@/lib/mahjong/rule_base'

const GALAXY_RULE = GalaxyMahjongRule.getInstance()

describe('インスタンス存在確認', () => {
  it('インスタンス存在確認', () => {
    expect(GALAXY_RULE).toBeInstanceOf(GalaxyMahjongRule)
    expect(GALAXY_RULE).toBeInstanceOf(MahjongRule)
  })

  it('使用牌の確認', () => {
    expect(GALAXY_RULE.getNormalTiles().length).toBe(34)
    expect(GALAXY_RULE.getAllTileSet().length).toBe(136)
  })
})

/*
describe('牌がちゃんと入ってるか', () => {
  it('全ての牌のチェック', () => {
    console.log(GALAXY_RULE.NORMAL_TILES.map(t => t.toString()).join(','))
    console.log(GALAXY_RULE.GALAXY_TILES.map(t => t.toString()).join(','))
    console.log(GALAXY_RULE.RED_TILES.map(t => t.toString()).join(','))
    console.log(GALAXY_RULE.ALL_TILES.map(t => t.toString()).join(','))
  })
})
*/
