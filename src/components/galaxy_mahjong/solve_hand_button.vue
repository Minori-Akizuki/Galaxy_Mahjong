<template>
  <div>
    <button class="btn btn-outline-primary" :disabled="!canSolveHuleTile" hidden>
      手牌構成を解析する
    </button>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Store } from 'vuex'
import { State } from '@vue/runtime-core'
import { useStore } from '@/store/store'

@Options({
  components: {
  }
})
export default class SolveHandButton extends Vue {
  store!:Store<State>

  created ():void {
    this.store = useStore()
  }

  get canSolveHuleTile ():boolean {
    const tilesCount:number = this.store.state.mahjongHands.length
    return !!([2, 5, 8, 11, 14].find(n => n === tilesCount))
  }
}
</script>
