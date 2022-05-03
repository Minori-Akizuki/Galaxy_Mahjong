<template>
  <div class="hand-display">
    <select-add-tile-mode />
    <div class="row row-cols-auto">
      <display-hidden-hand class="col"/>
      <display-opend-mianzis class="col"/>
    </div>
    <button
      type="button"
      class="btn btn-outline-danger btn-sm"
      data-bs-toggle="modal"
      data-bs-target="#confirmation-clear"
    >
      クリア
    </button>
    <!-- TODO: 別にした方がいいのか考える -->
    <!-- Modal -->
    <div
      class="modal fade"
      id="confirmation-clear"
      tabindex="-1"
      aria-labelledby="confirmation-modal-label"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="confirmation-modal-label">手牌のクリア</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            手牌を消去しますか？
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">消去しない</button>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" v-on:click="dropHand">消去する</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Store } from 'vuex'
import { State } from '@vue/runtime-core'
import { useStore } from '@/store/store'
import { ACTION, MUTATION } from '@/store/mutationType'

import DisplayHiddenHand from './display_hidden_hand.vue'
import DisplayOpendMianzis from './display_opend_mianzis.vue'
import SelectAddTileMode from './select_add_mode.vue'

@Options({
  components: {
    DisplayHiddenHand,
    DisplayOpendMianzis,
    SelectAddTileMode
  }
})
export default class HandDisplay extends Vue {
  store!:Store<State>

  created ():void {
    this.store = useStore()
  }

  public dropHand ():void {
    this.store.commit(MUTATION.dropAllHand)
  }
}
</script>
<style>
.hand-display {
  border: solid 1px cyan;
}

.big-tile {
  min-height: 100px;
}

.small-tile {
  min-height: 50px;
}
</style>
