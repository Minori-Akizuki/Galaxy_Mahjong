<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div class="container-sm bg">100% wide until small breakpoint</div>
    <div class="container-md bg">100% wide until medium breakpoint</div>
    <div class="container-lg bg">100% wide until large breakpoint</div>
    <div class="container-xl bg">100% wide until extra large breakpoint</div>
    <div class="container-xxl bg">100% wide until extra extra large breakpoint</div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

@Options({
  props: {
    msg: String
  }
})
export default class HelloWorld extends Vue {
  msg!: string
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bg {
  background-color: lightgray;
}
</style>
