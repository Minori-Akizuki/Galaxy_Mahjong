<template>
  <div :class="{ 'big-tile': isLargeWidth, 'small-tile': !isLargeWidth }">
    <tile-image
      v-for="[tile, id] in hand"
      :key="id"
      :tile="tile"
      v-on:click="removeTile([tile, id])"
      :small="!isLargeWidth"
    />
  </div>
</template>

<script lang="ts">
import { GalaxyMahjongRule, MahjongTile } from '@/lib/mahjong'
import { Options, Vue } from 'vue-class-component'
import { Store } from 'vuex'
import { State } from '@vue/runtime-core'
import { useStore } from '@/store/store'
import { ACTION, MUTATION } from '@/store/mutationType'

import TileImage from '../tile_image.vue'

@Options({
  components: {
    TileImage
  }
})
export default class DisplayHiddenHand extends Vue {
  store!:Store<State>
  rule = GalaxyMahjongRule.getInstance()
  isLargeWidth = true
  largeWidthBreakpoints = 1200

  // !TODO: 副露管理と重複したコード。 mixin でなんとかならない？
  // → vue-mixin-decorator が現在の TypeScript に対応していない
  created ():void {
    this.store = useStore()
    // ブラウザ幅が変った時のイベントを登録
    window.addEventListener('resize', this.handleResize)
    this.handleResize() // 初期値のために一回起動しておく
  }

  public removeTile (tile:[MahjongTile, number]):void {
    this.store.commit(MUTATION.removeTileFromHand, tile)
  }

  get hand ():[MahjongTile, number][] {
    return this.store.state.mahjongHands
  }

  public handleResize ():void {
    const browserWidth = window.innerWidth
    const esc = browserWidth >= this.largeWidthBreakpoints
    if (esc !== this.isLargeWidth) {
      this.store.dispatch(ACTION.replaceHand)
    }
    this.isLargeWidth = esc
  }
}
</script>
<style>
/* define in hand_display.vue */
</style>
