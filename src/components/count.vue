<template>
  <div>
    <button class="btn btn-outline-primary" v-on:click="countup">
      countup : {{ currentCount }}
    </button>
  </div>
</template>

<script lang="ts">
import { MUTATION } from '@/store/mutationType'
import { Options, Vue } from 'vue-class-component'
import { useStore } from '@/store/store'
import { Store } from 'vuex'
import { State } from '@vue/runtime-core'

@Options({})
export default class Count extends Vue {
  localCount = 0
  store!:Store<State>

  created ():void {
    this.store = useStore()
    this.localCount = this.store.state.count
  }

  public countup ():void {
    this.store.commit(MUTATION.countUp)
    this.localCount = this.store.state.count
  }

  get currentCount ():number {
    return this.store.state.count
  }
}
</script>
