// store.ts
import { IMianzi, MahjongRule, MahjongTile, waitForm } from '@/lib/mahjong'
import { _ } from '@/lib/util/util'
import deepEqual from 'deep-equal'
import { InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'
import { ACTION, MUTATION } from './mutationType'
import { AddTileMode, SolveMode } from './store_enum'

// ストアのステートに対して型を定義します
export interface State {
  count: number
  rule: MahjongRule
  handNumber: number
  mahjongHands: [MahjongTile, number][]
  opendMianzis: [IMianzi, number][]
  patialMianzi: MahjongTile[]
  addTileMode: AddTileMode
  solveMode: SolveMode
  solvedHand: IMianzi[][]
  solvedHuleTile: [IMianzi[], MahjongTile[], waitForm, number][]
}

// インジェクションキーを定義します
export const key: InjectionKey<Store<State>> = Symbol('injention key')

export const store = createStore<State>({
  state: {
    count: 0,
    rule: MahjongRule.getInstance(),
    handNumber: 0,
    mahjongHands: [],
    opendMianzis: [],
    patialMianzi: [],
    addTileMode: AddTileMode.hand,
    solveMode: SolveMode.waitTile,
    solvedHand: [],
    solvedHuleTile: []
  },
  mutations: {
    [MUTATION.countUp] (state) {
      state.count = state.count + 1
    },
    [MUTATION.countDown] (state) {
      state.count = state.count - 1
    },
    [MUTATION.setMahjongRule] (state, rule:MahjongRule) {
      state.rule = rule
    },
    [MUTATION.setUniqNumber] (state, num:number) {
      state.handNumber = num
    },
    [MUTATION.addTileToHand] (state, tile:MahjongTile) {
      state.handNumber = state.handNumber + 1
      const newHand:[MahjongTile, number][] = [...state.mahjongHands, [tile, state.handNumber]]
      state.mahjongHands = newHand
        .sort(([ta, na], [tb, nb]) => state.rule.compareTileByColor(ta, tb))
    },
    [MUTATION.removeTileFromHand] (state, tile:[MahjongTile, number]) {
      state.mahjongHands = _.extract(state.mahjongHands, tile, deepEqual)
        .sort(([ta, na], [tb, nb]) => state.rule.compareTileByColor(ta, tb))
    },
    [MUTATION.dropAllHand] (state) {
      state.mahjongHands = []
      state.opendMianzis = []
    },
    [MUTATION.switchAddTileMode] (state, mode:AddTileMode) {
      state.addTileMode = mode
    },
    [MUTATION.setSolvedHulePatterns] (state, hulePatterns:[IMianzi[], MahjongTile[], waitForm][]) {
      state.solvedHuleTile = []
      hulePatterns.forEach(([ms, ts, f]) => {
        state.handNumber = state.handNumber + 1
        state.solvedHuleTile.push([ms, ts, f, state.handNumber])
      })
    }
  },

  actions: {
    [ACTION.replaceHand] (context) {
      const tiles = context.state.mahjongHands.map(([tile, num]) => tile)
      context.commit(MUTATION.dropAllHand)
      tiles.forEach(t => {
        context.commit(MUTATION.addTileToHand, t)
      })
    },
    [ACTION.getAllHand] (context):MahjongTile[] {
      const tiles = context.state.mahjongHands.map(([tile, num]) => tile)
      const opendTiles = context.state.opendMianzis.map(([mianzi, num]) => mianzi.tiles).flat()
      const allHand = [...tiles, ...opendTiles]
      return allHand.sort(context.state.rule.compareTileByColor)
    },
    [ACTION.getUniqNumber] (context):number {
      context.commit(MUTATION.setUniqNumber, context.state.handNumber + 1)
      return context.state.handNumber
    }
  }
})

// 独自の `useStore` 関数を定義します
export function useStore () {
  return baseUseStore(key)
}
