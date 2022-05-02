<template>
  <div class="tile-list container">
    <div class="row row-cols-md-2 row-cols-1">
      <div v-for="(tiles, index) in displayTiles" :key="index" class="tile-row">
        <tile-image small v-for="(tile, idx) in tiles" :key="idx" :tile="tile" v-on:click="addTile(tile)"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { GalaxyMahjongRule, MahjongRule, MahjongTile, TileColor } from '@/lib/mahjong'
import { Options, Vue } from 'vue-class-component'
import TileImage from '../tile_image.vue'

@Options({
  components: {
    TileImage
  }
})
export default class PickupTileArea extends Vue {
  rule!: MahjongRule
  displayTiles!:MahjongTile[][]

  created ():void {
    this.rule = GalaxyMahjongRule.getInstance()
    const allTiles = this.rule.getAllTiles()
    const compareByNumber = this.rule.compareTileByNumber
    // 牌一覧に並べる牌を格納する
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

  public addTile (tile:MahjongTile):void {
    console.log(`---- [addTile]: ${tile.toString()}`)
  }
}
</script>
<style>
.tile-list {
  justify-content: center;
  align-items: center;
  min-width: 340px;
}

.tile-row {
  /* display: inline-block; */
  padding-top: 10px;
}

</style>
