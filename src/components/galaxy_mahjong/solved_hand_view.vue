<template>
  <div>
    <solved-hand-combination-display v-if="displayMode === solveMode.hand" />
    <solved-hule-tile-display v-if="displayMode === solveMode.waitTile" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { SolveMode } from '@/store/store_enum'
import { Store } from 'vuex'
import { State } from '@vue/runtime-core'
import { useStore } from '@/store/store'

import SolvedHandCombinationDisplay from './solved_hand_combination_display.vue'
import SolvedHuleTileDisplay from './solved_hule_tile_display.vue'

@Options({
  components: {
    SolvedHandCombinationDisplay,
    SolvedHuleTileDisplay
  }
})
export default class SolvedHandView extends Vue {
  solveMode = SolveMode
  store!:Store<State>

  created ():void {
    this.store = useStore()
  }

  get displayMode ():SolveMode {
    return this.store.state.solveMode
  }
}
</script>
