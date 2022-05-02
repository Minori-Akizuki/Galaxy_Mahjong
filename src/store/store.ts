// store.ts
import { IMianzi, MahjongRule, MahjongTile } from '@/lib/mahjong'
import { InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'
import { MUTATION } from './mutationType'

// ストアのステートに対して型を定義します
export interface State {
  count: number
  mahjongHands: MahjongTile[]
  opendMianzis: IMianzi[]
  mahjongRule: MahjongRule | null
}

// インジェクションキーを定義します
export const key: InjectionKey<Store<State>> = Symbol('injention key')

export const store = createStore<State>({
  state: {
    count: 0,
    mahjongHands: [],
    opendMianzis: [],
    mahjongRule: null
  },
  mutations: {
    [MUTATION.countUp] (state) {
      state.count = state.count + 1
    },
    [MUTATION.countDown] (state) {
      state.count = state.count - 1
    },
    [MUTATION.setNumber] (state, num:number) {
      state.count = num
    },
    /**
     * ルールを格納する
     * @param state ステート
     * @param rule ルール
     */
    [MUTATION.setMahjongRule] (state, rule:MahjongRule) {
      state.mahjongRule = rule
    }
  }
})

// 独自の `useStore` 関数を定義します
export function useStore () {
  return baseUseStore(key)
}
