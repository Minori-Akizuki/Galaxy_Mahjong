import { IMianzi, MahjongRule, MahjongTile } from '@/lib/mahjong'
import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'
import { SolveMode } from './store_enum'

declare module '@vue/runtime-core' {
  // ストアのステートを宣言する
  interface State {
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

  // `this.$store` の型付けを提供する
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}
