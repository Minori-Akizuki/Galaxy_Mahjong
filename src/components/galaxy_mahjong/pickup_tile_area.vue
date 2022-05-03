<template>
  <div class="tile-list container">
    <div v-if="showAlert" class="row">
      <div class="alert alert-danger col">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle" viewBox="0 0 16 16">
          <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
          <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"/>
        </svg>
        {{ alertMessage }}
      </div>
    </div>
    <div class="row row-cols-md-2 row-cols-1 tile-row">
      <div
        v-for="(tiles, index) in displayTiles"
        :key="index"
        class="col tile-col"
        :class="{ 'tile-col-2': tileCol2, 'tile-col-1': tileCol1 }"
      >
        <tile-image
          small v-for="(tile, idx) in tiles"
          :key="idx"
          :tile="tile"
          v-on:click="addTile(tile)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { GalaxyMahjongRule, MahjongRule, MahjongTile, TileColor } from '@/lib/mahjong'
import { Options, Vue } from 'vue-class-component'
import { Store } from 'vuex'
import { State } from '@vue/runtime-core'
import { useStore } from '@/store/store'
import { ACTION, MUTATION } from '@/store/mutationType'

import TileImage from '../tile_image.vue'

@Options({
  components: {
    TileImage
  }
})
export default class PickupTileArea extends Vue {
  rule!: MahjongRule
  displayTiles!:MahjongTile[][]
  browserWidth!: number
  tileCol2 = true
  tileCol1 = false
  readonly mediumBreakpoints = 768
  store!:Store<State>
  showAlert = false
  alertMessage = ''

  created ():void {
    this.store = useStore()
    this.rule = this.store.state.rule
    const allTiles = this.rule.getAllTiles()
    const compareByNumber = this.rule.compareTileByNumber

    // ブラウザ幅が変った時のイベントを登録
    window.addEventListener('resize', this.handleResize)
    this.handleResize() // 初期値のために一回起動しておく

    // 牌一覧に並べる牌を格納する
    // TODO: 多分一般化できる。ルールに依存しない形にする
    this.displayTiles = []
    // 萬子通常牌
    this.displayTiles.push(
      allTiles.filter(t => t.color === TileColor.wanzi && !t.option.isGalaxy)
        .sort(compareByNumber)
    )
    // 萬子銀河牌
    this.displayTiles.push(
      allTiles.filter(t => t.color === TileColor.wanzi && t.option.isGalaxy)
        .sort(compareByNumber)
    )
    // 筒子通常牌
    this.displayTiles.push(
      allTiles.filter(t => t.color === TileColor.tongzi && !t.option.isGalaxy)
        .sort(compareByNumber)
    )
    // 筒子銀河牌
    this.displayTiles.push(
      allTiles.filter(t => t.color === TileColor.tongzi && t.option.isGalaxy)
        .sort(compareByNumber)
    )
    // 索子通常牌
    this.displayTiles.push(
      allTiles.filter(t => t.color === TileColor.siozi && !t.option.isGalaxy)
        .sort(compareByNumber)
    )
    // 索子銀河牌
    this.displayTiles.push(
      allTiles.filter(t => t.color === TileColor.siozi && t.option.isGalaxy)
        .sort(compareByNumber)
    )
    // 字牌通常牌
    this.displayTiles.push(
      allTiles.filter(t => t.color === TileColor.feng && !t.option.isGalaxy)
        .sort(compareByNumber)
        .concat(
          allTiles.filter(t => t.color === TileColor.sanyuan && !t.option.isGalaxy)
            .sort(compareByNumber)
        )
    )
    // 字牌銀河牌
    this.displayTiles.push(
      allTiles.filter(t => t.color === TileColor.feng && t.option.isGalaxy)
        .sort(compareByNumber)
        .concat(
          allTiles.filter(t => t.color === TileColor.sanyuan && t.option.isGalaxy)
            .sort(compareByNumber)
        )
    )
  }

  public async addTile (tile:MahjongTile):Promise<void> {
    this.showAlert = false
    const handTile:MahjongTile[] = await this.store.dispatch(ACTION.getAllHand)
    // 普通の麻雀でもいいように色と数だけ比べる
    const sameTile = handTile.filter(t => tile.color === t.color && tile.number === t.number)
    if (sameTile.length >= 4) {
      this.alertMessage = '既に4枚の同種牌を選択しています'
      this.showAlert = true
      return
    }
    this.store.commit(MUTATION.addTileToHand, tile)
  }

  public handleResize ():void {
    this.browserWidth = window.innerWidth
    this.tileCol1 = this.browserWidth < this.mediumBreakpoints
    this.tileCol2 = this.browserWidth >= this.mediumBreakpoints
  }
}
</script>
<style>
.tile-list {
  min-width: 340px;
}

.tile-row .tile-col-2:nth-child(odd) {
  text-align: right;
}

.tile-row .tile-col-2:nth-child(even) {
  text-align: left;
}

.tile-row .tile-col-1 {
  text-align: center;
}

.tile-col {
  /* display: inline-block; */
  padding-top: 10px;
}

</style>
