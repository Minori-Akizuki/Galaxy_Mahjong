<template>
  <div>
    <h1>銀河麻雀</h1>
    <solve-hand-button/>
    <solve-hule-tile-button/>
    <hand-display/>
    <pickup-tile-area/>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

import SolveHandButton from './solve_hand_button.vue'
import SolveHuleTileButton from './solve_hule_tile_button.vue'
import HandDisplay from './hand_display.vue'
import PickupTileArea from './pickup_tile_area.vue'

@Options({
  components: {
    SolveHandButton,
    SolveHuleTileButton,
    HandDisplay,
    PickupTileArea
  }
})
export default class GalaxyMahjong extends Vue {
}
</script>
