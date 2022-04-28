import { MahjongTile, TileColor } from './mahjong_tile'

export interface MahjongTileParserBase {
  parseTileFromString(str:string):MahjongTile
  parseTilesFromString(str:string):MahjongTile[]
}

/**
 * 文字列から牌を生成するパーサー。
 * 継承先のクラスはシングルトンで提供されるのが前提のため、
 * そのような実装をすること。
 */
export class MahjongTileParserBase {
  protected regexString:string

  static tileMap = {
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

  protected constructor (
    readonly numberdTileMap:{[name:string]: {color:TileColor, maxNumber:number}},
    readonly symboledTileMap:{[name:string]: {color:TileColor, number:number}},
    readonly optionMap:{[name:string]: string}) {
    // /^(([1-9][wps])|[newshlb])g?$/ みたいなのを作りたい
    const numberdColorChars = Object.keys(numberdTileMap).join()
    const symboledColorChars = Object.keys(symboledTileMap).join()
    const optionChars = Object.keys(optionMap).join()
    this.regexString = `(((\\d+?)([${numberdColorChars}]))|([${symboledColorChars}]))([${optionChars}]*?)?`
    /*
    数牌 : [全、牌種、種類、数字、色、*、  オプション]
    字牌 : [全、牌種、*、   *、   *、種類、オプション]
    */
  }

  /**
   * 一つの麻雀牌をパーズする
   * @param tileStr 一つの牌を示す文字列
   * @returns 麻雀牌
   */
  public parseTile (tileStr:string):MahjongTile {
    const regex = new RegExp('^' + this.regexString + '$')
    // 牌をパース
    const parseResult = tileStr.match(regex)
    if (!parseResult) {
      throw Error(`parseTile: ${tileStr} is not match Tile string`)
    }
    // オプションの記憶
    const options: {[name:string]: boolean} = {}
    if (parseResult[6]) {
      const optionArr = parseResult[6].split('')
      optionArr.forEach((opt) => {
        const optionName = this.optionMap[opt]
        if (!optionName) {
          // オプション存在の確認
          throw Error(`parseTile: undefined option ${tileStr}`)
        }
        options[optionName] = true
      })
    }
    // 字牌の生成
    if (parseResult[3] === undefined) {
      // 数字が存在しない事を条件とする
      const tileKind = parseResult[1]
      const color = this.symboledTileMap[tileKind].color
      const number = this.symboledTileMap[tileKind].number
      return new MahjongTile(color, number, options)
    }
    // 数牌の生成
    // 色の取得
    const colorChar = parseResult[4]
    const color = this.numberdTileMap[colorChar].color
    if (color === undefined) {
      // 色の存在チェック
      throw Error(`parseTile: undefined color ${tileStr}: ${colorChar}`)
    }
    // 数字の取得
    const number = parseInt(parseResult[3])
    if (!number) {
      // 数字がちゃんとパースできるか (このガードをつけないと型チェックにひっかかる)
      throw Error(`parseTile: can't parse number ${tileStr}`)
    }
    if (number > this.numberdTileMap[colorChar].maxNumber) {
      // 数字の最大値を越えていないかどうか
      // TODO: 東天紅や三麻などの飛び飛びな牌に対応する
      throw Error(`parseTile: can't parse number ${tileStr}`)
    }
    return new MahjongTile(color, number, options)

    throw Error(`parseTile: unknown error ${tileStr}`)
  }

  /**
   * 麻雀牌が並んだ文字列をパースする
   * @param tilesStr 牌が並んだ文字列
   * @returns 麻雀牌の列
   */
  public parseTiles (tilesStr:string):MahjongTile[] {
    const regex = new RegExp(this.regexString, 'g')
    const tiles = tilesStr.match(regex)
    if (!tiles) {
      throw Error(`parseTiles: can't parse string ${tilesStr}`)
    }
    return tiles.map((s) => this.parseTile(s))
  }
}
