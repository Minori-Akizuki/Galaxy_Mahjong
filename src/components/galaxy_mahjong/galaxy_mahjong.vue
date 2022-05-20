<template>
  <div>
    <h1>銀河麻雀 上がり牌判定サイト</h1>
    <p>- Galaxy Mahjong - (β)</p>
    <p style="color:dodgerblue">
      Be Mahjalien you TOO!
      <a :href="tweetButtonUrl" target="_blank"><img src="@/assets/twitter.png" /></a>
    </p>
    <div class="readme">
      <p>◆下の牌一覧をクリック(タップ)して手牌を追加できます</p>
      <p>◆上の牌をクリック(タップ)すると削除できます</p>
      <p>◆上がり牌検索結果は牌一覧のさらに下に表示されます</p>
      <p>◆銀河牌が多いと10秒ぐらいかかります。気長に待ってください</p>
    </div>
    <div>
      <solve-hand-button/>
      <solve-hule-tile-button/>
    </div>
    <hand-display/>
    <pickup-tile-area/>
    <hr />
    <solved-hand-view />
    <h2>クレジット</h2>
    <ul>
      <li>元ネタ: <a href="https://youtu.be/IDaKM7eU7zE" target="_blank">麻雀星人からの挑戦状!?銀河麻雀！</a></li>
      <li>牌画像: <a href="https://majandofu.com/mahjong-images" target="_blank">豆腐麻雀</a></li>
      <li>ページ作者: <a href="https://twitter.com/Real_analysis">じつかいせき</a></li>
      <li>リポジトリ: <a href="https://github.com/Minori-Akizuki/Galaxy_Mahjong">こちら</a></li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Store } from 'vuex'
import { State } from '@vue/runtime-core'
import { useStore } from '@/store/store'
import { MUTATION } from '@/store/mutationType'
import { GalaxyMahjongRule } from '@/lib/mahjong'

import SolveHandButton from './solve_hand_button.vue'
import SolveHuleTileButton from './solve_hule_tile_button.vue'
import HandDisplay from './hand_display.vue'
import PickupTileArea from './pickup_tile_area.vue'
import SolvedHandView from './solved_hand_view.vue'

@Options({
  components: {
    SolveHandButton,
    SolveHuleTileButton,
    HandDisplay,
    PickupTileArea,
    SolvedHandView
  }
})
export default class GalaxyMahjong extends Vue {
  store!: Store<State>
  tweetButtonUrl!:string
  created ():void {
    this.store = useStore()
    this.store.commit(MUTATION.setMahjongRule, GalaxyMahjongRule.getInstance())
    this.tweetButtonUrl = this.createTweetButtonUrl()
  }

  public createTweetButtonUrl () {
    const params = {
      text: '銀河麻雀 -君も麻雀星人になろう！-',
      url: 'https://minori-akizuki.github.io/Galaxy_Mahjong/',
      hashtags: '銀河麻雀'
    }
    const url = 'https://twitter.com/intent/tweet?'
    const urlParam = new URLSearchParams(params).toString()
    return url + urlParam
  }
}
</script>
<style>
.readme p {
  margin: 0em;
}
</style>
