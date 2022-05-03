<template>
  <galaxy-mahjong />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

import GalaxyMahjong from './components/galaxy_mahjong/galaxy_mahjong.vue'

@Options({
  components: {
    GalaxyMahjong
  }
})
export default class App extends Vue {
}
</script>

<style>
#app {
  font-family: ヒラギノ角ゴシック, 游ゴシック, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
