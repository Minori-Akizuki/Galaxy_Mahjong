<template>
  <div class="hand-display">
    <display-hidden-hand />
    <display-opend-mianzis/>
    {{ browserWidth }}
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

import DisplayHiddenHand from './display_hidden_hand.vue'
import DisplayOpendMianzis from './display_opend_mianzis.vue'

@Options({
  components: {
    DisplayHiddenHand,
    DisplayOpendMianzis
  }
})
export default class HandDisplay extends Vue {
  browserWidth = 0
  readonly mobileWidthM = 375
  mounted ():void {
    this.browserWidth = window.innerWidth
    window.addEventListener('resize', this.handleResize)
  }

  public handleResize ():void {
    this.browserWidth = window.innerWidth
  }
}
</script>
<style>
.hand-display {
  border: solid 1px cyan;
}
</style>
