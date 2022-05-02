import { IMianzi, MahjongRule, MahjongTile } from '@/lib/mahjong'
import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'

declare module '@vue/runtime-core' {
  // ストアのステートを宣言する
  interface State {
    count: number
    mahjongHands: MahjongTile[]
    opendMianzis: IMianzi[],
    mahjongRule: MahjongRule
  }

  // `this.$store` の型付けを提供する
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}
