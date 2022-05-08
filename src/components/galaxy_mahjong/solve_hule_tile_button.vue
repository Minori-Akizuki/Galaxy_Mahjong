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
    <div v-if="isSolving" class="spinner-border-sm spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Store } from 'vuex'
import { State } from '@vue/runtime-core'
import { useStore } from '@/store/store'
import { MUTATION } from '@/store/mutationType'

const worker = new Worker(new URL('../../workers/solve_hule_tile.worker.ts', import.meta.url))

@Options({
  components: {
  }
})
export default class SolveHuleTileButton extends Vue {
  store!:Store<State>
  isSolving = false

  created ():void {
    this.store = useStore()
  }

  get canSolveHuleTile ():boolean {
    const tilesCount:number = this.store.state.mahjongHands.length
    return !!([1, 4, 7, 10, 13].find(n => n === tilesCount))
  }

  public solveWaitTiles ():void {
    this.isSolving = true
    const tiles = this.store.state.mahjongHands.map(([t, n]) => t)

    // リスナー
    worker.addEventListener('message', (ev) => {
      // TODO: 型情報が失われているので危険
      const waitPatterns = ev.data
      if (waitPatterns.length === 0) {
        window.alert('テンパイしてませんでした')
      }
      this.store.commit(MUTATION.setSolvedHulePatterns, waitPatterns)
      this.isSolving = false
    })

    worker.postMessage(JSON.stringify(tiles))
  }
}
</script>
<style>
.btn-space {
  min-height: 40px;
}
</style>
