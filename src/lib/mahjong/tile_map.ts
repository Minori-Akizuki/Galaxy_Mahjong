import { TileColor } from './mahjong_tile'

export const tileMap = {
  numberdTileMap: {
    /** 萬子 (wanzi) */
    w: { color: TileColor.wanzi, maxNumber: 9 },
    /** 筒子 (本来 tonzi だが日本の言いかたに合わせる) */
    p: { color: TileColor.tongzi, maxNumber: 9 },
    /** 索子 (soizi) */
    s: { color: TileColor.siozi, maxNumber: 9 }
  },
  symboledTileMap: {
    /** 東(west) */
    w: { color: TileColor.feng, number: 1 },
    /** 南(south) */
    s: { color: TileColor.feng, number: 2 },
    /** 西(east) */
    e: { color: TileColor.feng, number: 3 },
    /** 北(noath) */
    n: { color: TileColor.feng, number: 4 },
    /** 白(bai ban) */
    b: { color: TileColor.sanyuan, number: 1 },
    /** 發(lu fa) */
    l: { color: TileColor.sanyuan, number: 2 },
    /** 中(hong zhong) */
    h: { color: TileColor.sanyuan, number: 3 }
  },
  option: {}
}
