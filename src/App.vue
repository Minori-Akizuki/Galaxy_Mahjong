<template>
  <galaxy-mahjong />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { useStore } from './store/store'
import { MahjongTile, TileColor } from './lib/mahjong'
import { MUTATION } from './store/mutationType'

import GalaxyMahjong from './components/galaxy_mahjong/galaxy_mahjong.vue'

@Options({
  components: {
    GalaxyMahjong
  }
})
export default class App extends Vue {
  tile!:MahjongTile
  created ():void {
    this.tile = new MahjongTile(TileColor.siozi, 5, { isRed: true })
    const store = useStore()
    store.commit(MUTATION.setNumber, 0)
  }
}
</script>

<style>
#app {
  font-family: ヒラギノ角ゴシック, 游ゴシック, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
