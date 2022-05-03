<template>
    <div class="row">
      <div class="col select-hand-or-hulu">
        <div class="form-check">
          <input
            type="radio"
            class="form-check-input"
            name="selectHandOrHulu"
            id="checkHand"
            :value="addTileMode.hand"
            v-model="checkdAddTileMode"
            checked
          />
          <label class="form-check-label" for="selectHandOrHulu">手牌を選択する</label>
        </div>
      </div>
      <div class="col select-hand-or-hulu">
        <div class="form-check">
          <input
            class="form-check-input"
            type="radio"
            name="selectHandOrHulu"
            id="checkHulu"
            :value="addTileMode.hulu"
            v-model="checkdAddTileMode"
            disabled
          />
          <label class="form-check-label" for="selectHandOrHulu">副露を作成する (明槓できるモード)</label>
        </div>
      </div>
      <div class="col select-hand-or-hulu">
        <div class="form-check">
          <input
            class="form-check-input"
            type="radio"
            name="selectHandOrHulu"
            id="checkHuluAngang"
            :value="addTileMode.huluWithAngang"
            v-model="checkdAddTileMode"
            disabled
          />
          <label class="form-check-label" for="selectHandOrHulu">副露を作成する (暗槓できるモード)</label>
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Store } from 'vuex'
import { State } from '@vue/runtime-core'
import { useStore } from '@/store/store'
import { MUTATION } from '@/store/mutationType'
import { AddTileMode } from '@/store/store_enum'

@Options({
  components: {
  },
  watch: {
    checkdAddTileMode (value) {
      this.store.commit(MUTATION.switchAddTileMode, value)
    }
  },
  data () {
    const store = useStore()
    return {
      store
    }
  }
})
export default class SelectAddTileMode extends Vue {
  addTileMode = AddTileMode
  checkdAddTileMode = AddTileMode.hand
  store!:Store<State>
}
</script>
