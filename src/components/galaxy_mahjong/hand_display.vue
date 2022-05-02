<template>
  <div>
    <display-hidden-hand />
    <display-opend-mianzis/>
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
}
</script>
