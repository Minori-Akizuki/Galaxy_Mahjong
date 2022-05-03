<template>
  <div class="btn-space">
    <button
      class="btn btn-outline-primary"
      :disabled="!canSolveHuleTile"
      :hidden="!canSolveHuleTile"
      v-on:click="solveWaitTiles"
    >
      上がり牌を検索する
    </button>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Store } from 'vuex'
import { State } from '@vue/runtime-core'
import { useStore } from '@/store/store'
import { MUTATION } from '@/store/mutationType'

@Options({
  components: {
  }
})
export default class SolveHuleTileButton extends Vue {
  store!:Store<State>

  created ():void {
    this.store = useStore()
  }

  get canSolveHuleTile ():boolean {
    const tilesCount:number = this.store.state.mahjongHands.length
    return !!([1, 4, 7, 10, 13].find(n => n === tilesCount))
  }

  public solveWaitTiles ():void {
    const tiles = this.store.state.mahjongHands.map(([t, n]) => t)
    const waitPatterns = this.store.state.rule.solveHuleTile(tiles)
    if (waitPatterns.length === 0) {
      window.alert('テンパイしてませんでした')
    }
    this.store.commit(MUTATION.setSolvedHulePatterns, waitPatterns)
  }
}
</script>
<style>
.btn-space {
  min-height: 40px;
}
</style>
