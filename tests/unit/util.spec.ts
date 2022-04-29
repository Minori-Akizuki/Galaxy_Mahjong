import { _ } from '@/lib/util/util'

describe('ユーティリティテスト', () => {
  it('makePairsFromHead', () => {
    const pairs = _.makePairsFromHead([1, 2, 3, 4])
    expect(pairs.length).toBe(3)
    expect(pairs).toEqual([[1, 2], [2, 3], [3, 4]])
  })

  it('makeAllPairs', () => {
    const pairs = _.makeAllPairsFromHead([1, 2, 3, 4])
    expect(pairs.length).toBe(6)
    expect(_.makeAllPairsFromHead([]).length).toBe(0)
  })

  it('compareFromHeadWith', () => {
    expect(_.everyPairFromHeadWith((a, b) => a < b, [1, 2, 3, 4])).toBeTruthy()
    expect(_.everyPairFromHeadWith((a, b) => a < b, [1, 3, 2, 4])).toBeFalsy()
  })

  it('pairOf', () => {
    const pairs = _.pairOf([1, 2], [3, 4])
    expect(pairs.length).toBe(4)
    expect(pairs).toEqual([
      [1, 3], [1, 4],
      [2, 3], [2, 4]
    ])
    // 片方が空配列だった場合
    expect(_.pairOf([], [1, 2]).length).toBe(0)
  })

  it('extractAllOne', () => {
    const extracted = _.extractAllOne([1, 2, 3])
    expect(extracted.length).toBe(3)
    expect(extracted).toEqual([
      [1, [2, 3]],
      [2, [1, 3]],
      [3, [1, 2]]
    ])
  })

  it('equalArray', () => {
    const compare = (a:number, b:number):number => a - b
    expect(_.equalArray([1, 2, 3], [1, 2, 3], compare)).toBeTruthy()
    expect(_.equalArray([1, 2, 3], [1, 3, 5], compare)).toBeFalsy()
    expect(_.equalArray([1, 2], [1, 2, 3], compare)).toBeFalsy()
  })

  it('compareArray', () => {
    const compare = (a:number, b:number):number => a - b
    expect(_.compareArray([1, 2, 3], [1, 2, 3], compare)).toBe(0)
    expect(_.compareArray([1, 2, 3], [1, 3, 5], compare) < 0).toBeTruthy()
    expect(_.compareArray([1, 6, 3], [1, 3, 5], compare) > 0).toBeTruthy()
    expect(_.compareArray([1, 2], [1, 2, 3], compare) < 0).toBeTruthy()
    expect(_.compareArray([1, 2, 3], [1, 2], compare) > 0).toBeTruthy()
  })

  it('equaleSetArray', () => {
    const compare = (a:number, b:number):number => a - b
    expect(_.equalSetArray([1, 2, 3], [1, 3, 2], compare)).toBeTruthy()
    expect(_.equalSetArray([1, 2, 3], [5, 3, 2], compare)).toBeFalsy()
    expect(_.equalSetArray([1, 2, 3, 2], [1, 3, 2], compare)).toBeFalsy()
  })

  it('extractN', () => {
    const extracted = _.extractAllN([1, 2, 3, 4, 5, 6], 3, (a, b) => a - b)
    expect(extracted.length).toBe(20)
  })

  it('formation', () => {
    const formation = _.formation([[1, 2], [3, 4, 5], [6, 7]])
    expect(formation.length).toBe(12)
  })

  it('extract', () => {
    const arr = [1, 2, 3, 4]
    const equal = (a:number, b:number) => a === b
    expect(_.extract(arr, 3, equal)).toEqual([1, 2, 4])
    expect(_.extract(arr, 5, equal)).toEqual([1, 2, 3, 4])
    expect(_.extractMultiple(arr, [1, 3], equal)).toEqual([2, 4])
  })

  it('shuffle', () => {
    const arrLength = 100
    // 0-99 の配列を生成する
    const arr = [...Array(arrLength)].map((u, index) => index)
    const shuffleArr = _.shuffleArr(arr)
    expect(shuffleArr.length).toBe(arrLength)
    // 100個もあれば流石に同じ配列になるこたないだろうという楽観的なチェック
    expect(shuffleArr).not.toEqual(arr)
    for (let number = arr.length - 1; number >= 0; number--) {
      expect(shuffleArr).toContain(number)
    }
  })
})
