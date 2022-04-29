export class _ {
  /**
   * 先頭から比較関数を使って順番に要素を比べ、全てが true であれば true を返却する
   * @param f 比較関数
   * @param arr 配列
   * @returns 比較結果
   */
  static everyPairFromHeadWith<T> (f:(current:T, next:T) => boolean, arr:T[]):boolean {
    const pairs = _.makePairsFromHead(arr)
    return pairs.every((p) => f(p[0], p[1]))
  }

  /**
   * 与えられた配列から得られる全てのペアを比較関数で比較し、
   * 全てが true であった場合に true を返却する。
   * 比較は元々配列に格納されている順番で行われる。
   * @param f 比較関数
   * @param arr 配列
   * @returns 比較結果
   */
  static everyPairAllPairWith<T> (f:(a:T, b:T) => boolean, arr:T[]):boolean {
    const pairs = _.makeAllPairsFromHead(arr)
    return pairs.every((p) => f(p[0], p[1]))
  }

  /**
   * 配列内の要素から順序性の保たれた全てのペアを作成する。
   * [1, 2, 3, 4] -> [ [ 1, 2 ], [ 1, 3 ], [ 1, 4 ], [ 2, 3 ], [ 2, 4 ], [ 3, 4 ] ]
   * @param arr 配列
   * @returns 配列の要素を全てペアにしたものの配列
   */
  static makeAllPairsFromHead<T> (arr:T[]):[T, T][] {
    if (arr.length <= 1) {
      return []
    }
    const pairs: [T, T][] = []
    for (let indexA = 0; indexA < arr.length - 1; indexA++) {
      for (let indexB = indexA + 1; indexB < arr.length; indexB++) {
        pairs.push([arr[indexA], arr[indexB]])
      }
    }
    return pairs
  }

  /**
   * 先頭から順番に2つの組を作成する。[1, 2, 3] -> [[1, 2], [2, 3]]
   * @param arr 配列
   * @returns 配列を先頭からペアにしたもの
   */
  static makePairsFromHead<T> (arr:T[]):[T, T][] {
    const pairs: [T, T][] = []
    for (let index = 0; index < arr.length - 1; index++) {
      pairs.push([arr[index], arr[index + 1]])
    }
    return pairs
  }

  /**
   * 与えられた2つの配列からそれぞれ要素を組み合わせた全てのペアを生成する。
   * @param arrT 配列
   * @param arrS 配列
   * @returns ペア配列
   */
  static pairOf<T, S> (arrT:T[], arrS:S[]):[T, S][] {
    const pairs:[T, S][] = []
    arrT.forEach((t) => {
      arrS.forEach((s) => {
        pairs.push([t, s])
      })
    })
    return pairs
  }

  /**
   * 配列の要素について [一つの要素, 残りの要素] である全ての結果を返します
   * @param arr 配列
   * @returns 一つだけ抽出された要素と残りの配列の組の配列
   */
  static extractAllOne<T> (arr:T[]):[T, T[]][] {
    return arr.map((v, i, arr) => {
      const _arr:T[] = arr.concat()
      _arr.splice(i, 1)
      return [v, _arr]
    })
  }

  /**
   * 配列を比較関数で比較し要素の数、順番が一致した時に true を返却します
   * @param arrA 配列
   * @param arrB 配列
   * @param compare 要素に対する比較関数( @see Array.prototype.sort() )
   * @returns 配列が一致しているか
   */
  static equalArray<T> (arrA:T[], arrB:T[], compare:(a:T, b:T) => number):boolean {
    if (arrA.length !== arrB.length) {
      return false
    }
    let ret = true
    arrA.forEach((a, i) => {
      ret = ret && (compare(a, arrB[i]) === 0)
    })
    return ret
  }

  /**
   * 二つの配列が同一要素で構成されているかを比較する。配列の中身は順不同。
   * equalArray(as.sort(compare), bs.sort(compare), compare) と同一の結果を返すがイミュータブルである。
   * @param arrA 配列
   * @param arrB 配列
   * @param compare 要素に対する比較関数( @see Array.prototype.sort() )
   * @returns 配列の中身が一致しているか
   */
  static equalSetArray<T> (arrA:T[], arrB:T[], compare:(a:T, b:T) => number):boolean {
    const _arrA = [...arrA].sort(compare)
    const _arrB = [...arrB].sort(compare)
    return this.equalArray(_arrA, _arrB, compare)
  }

  /**
   * 両者を辞書式に比較し、その比較結果を返す
   * @param arrA 配列A
   * @param arrB 配列B
   * @param compare 要素に対する比較対象 ( @see Array.prototype.sort() )
   * @returns 比較結果、A の方が小さければ負の数
   */
  static compareArray<T> (arrA:T[], arrB:T[], compare:(a:T, b:T) => number):number {
    for (let i = 0; i < arrA.length; i++) {
      if (i >= arrB.length) {
        return 1
      }
      const compared = compare(arrA[i], arrB[i])
      if (compared !== 0) {
        return compared
      }
    }
    if (arrA.length < arrB.length) {
      return -1
    }
    return 0
  }

  /**
   * 配列から n 個抽出したパターンを全て列挙する。
   * 抽出したものは compare によって ソートされ同一の物が抽出されたパターンは排除される
   * @param arr 配列
   * @param n 抽出個数
   * @param compare ソートのための比較関数
   * @returns [[抽出対象][配列の残り]]
   */
  static extractAllN<T> (
    arr:T[],
    n:number,
    compare:(a:T, b:T) => number
  ):[T[], T[]][] {
    const allOne = this.extractAllOne(arr).map((p: [T, T[]]):[T[], T[]] => [[p[0]], p[1]])
    if (n === 1) {
      return allOne
    }
    const store = allOne.flatMap((p) => {
      const extracted = p[0]
      const nextExtract = this.extractAllN(p[1], n - 1, compare)
      return nextExtract.map((p2:[T[], T[]]):[T[], T[]] => [extracted.concat(p2[0]).sort(compare), p2[1]])
    })

    const ret:[T[], T[]][] = []

    store.forEach((sp) => {
      let included = false
      ret.forEach((rp) => {
        included = included || this.equalArray(sp[0], rp[0], compare)
      })
      if (!included) {
        ret.push(sp)
      }
    })
    return ret
  }

  /**
   * 各々の配列の一つの要素を抜き取った全ての組合せを列挙する
   * @param arr 配列の配列
   * @returns 各配列から1つ要素を選んだ場合の全ての組合せの列挙
   */
  static formation<T> (arr:T[][]):T[][] {
    const _arr:T[][] = []
    arr.forEach((p) => {
      _arr.push([...p])
    })
    const firstMaterials:T[][] = (_arr.shift() || []).map(m => [m])
    return this._formation(firstMaterials, _arr)
  }

  /**
   * formation の被ラップ関数
   * @param conbined 抽出済の要素
   * @param arr 残りの要素
   */
  private static _formation<T> (conbined:T[][], arr:T[][]):T[][] {
    if (arr.length === 0) {
      return conbined
    }
    const _retConbined:T[][] = []
    const arrHead:T[] = arr.shift() || []
    conbined.forEach(cs => {
      arrHead.forEach(hm => {
        const _cs:T[] = [...cs]
        _cs.push(hm)
        _retConbined.push(_cs)
      })
    })
    return this._formation(_retConbined, arr)
  }

  /**
   * arr から equal に基づき最初に一致した m を抜き出した配列を返却します。
   * m を発見できなかった時は変化のない配列が返されます。
   * arr 自体は変更されません。
   * @param arr 配列
   * @param m 対象
   * @param equal 比較関数
   * @returns 抜き出した後の arr
   */
  static extract<T> (arr:T[], m:T, equal:(a:T, b:T) => boolean):T[] {
    const _arr = [...arr]
    const index = _arr.findIndex((f) => equal(f, m))
    if (index === -1) {
      return _arr
    }
    _arr.splice(index, 1)
    return _arr
  }

  /**
   * arr から equal に基づき ms と一つずつ比較し、それらを抜き出した配列を返却します。
   * ms の中の要素を発見できなかった時は特に変化は起こりません。
   * arr 自体は変更されません。
   * @param arr 配列
   * @param ms 抜き出す要素の配列
   * @param equal 比較関数
   * @returns 抜き出した後の arr
   */
  static extractMultiple<T> (arr:T[], ms:T[], equal:(a:T, b:T) => boolean):T[] {
    let _arr = [...arr]
    ms.forEach(m => {
      _arr = this.extract(_arr, m, equal)
    })
    return _arr
  }

  /**
   * 配列をシャッフルする。元の配列は変更されない。
   * @param arr 配列
   * @returns シャッフルされた配列
   */
  static shuffleArr<T> (arr:T[]) {
    const _arr = [...arr]
    let out:T[] = []
    for (let index = _arr.length; index >= 0; index--) {
      const randomIndex = Math.floor(Math.random() * (index + 1))
      const s = _arr.splice(randomIndex, 1)
      out = out.concat(s)
    }
    return out
  }
}
