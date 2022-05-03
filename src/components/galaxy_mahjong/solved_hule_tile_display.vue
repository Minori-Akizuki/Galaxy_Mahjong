<template>
  <div>
    <div class="row">
      <div class="col">
        上がり牌 :
        <tile-image v-for="tile in waitTiles" :key="tile[1]" :tile="tile[0]" small v-on:click="turnOnHuleTileFilter(tile[0])" />
        <button type="button" class="btn btn-outline-info btn-sm" v-on:click="turnOffHuleTileFilter">
          {{filterButtonMessage}}
        </button>
      </div>
    </div>
    <hr />
    <div>
      <div v-for="hulePattern in solvedHuleTiles" :key="hulePattern[3]">
        <div v-if="!filterMode || isContainedHuleTile(hulePattern, filterTile)">
          <div class="row row-cols-auto">
            <display-mianzi v-for="(mianzi, idx) in hulePattern[0]" :key="idx" :mianzi="() => mianzi" small showColor class="col"/>
            <span class="col">
              <tile-image v-for="(tile, idxT) in hulePattern[1]" :key="idxT" :tile="tile" small />
              {{ formStrings[hulePattern[2]] }}
            </span>
          </div>
          <hr />
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
import { IMianzi, MahjongTile, waitForm } from '@/lib/mahjong'

import DisplayMianzi from './display_mianzi.vue'
import TileImage from '../tile_image.vue'
import { _ } from '@/lib/util/util'
import { ACTION } from '@/store/mutationType'

@Options({
  components: {
    DisplayMianzi,
    TileImage
  }
})
export default class SolvedHuleTileDisplay extends Vue {
  store!:Store<State>
  uid = 0
  waitUniqTiles!:[MahjongTile, number][]
  formStrings = ['両面', '嵌張', '辺張', '単騎', '双椪', 'その他']
  filterMode = false
  filterButtonMessage = '牌タップで絞りこみ'
  filterTile!:MahjongTile
  created ():void {
    this.store = useStore()
    this.waitUniqTiles = []
  }

  public turnOnHuleTileFilter (tile:MahjongTile):void {
    this.filterMode = false
    this.filterTile = tile
    this.filterMode = true
    this.filterButtonMessage = 'フィルター解除'
  }

  public turnOffHuleTileFilter ():void {
    this.filterMode = false
    this.filterButtonMessage = '牌タップで絞りこみ'
  }

  public isContainedHuleTile (pattern:[IMianzi[], MahjongTile[], waitForm, number], tile:MahjongTile):boolean {
    return _.isContained(pattern[1], tile, (ta, tb) => this.store.state.rule.compareTileByColor(ta, tb) === 0)
  }

  public getUid ():number {
    this.uid = this.uid + 1
    return this.uid
  }

  get solvedHuleTiles ():[IMianzi[], MahjongTile[], waitForm, number][] {
    this.turnOffHuleTileFilter()
    return this.store.state.solvedHuleTile
  }

  get waitTiles ():[MahjongTile, number][] {
    let waitTiles:[MahjongTile, number][] =
      this.store.state.solvedHuleTile
        .map(([ms, ts, f, n]) => ts)
        .flat().map(t => [t, this.getUid()])
    waitTiles = waitTiles.sort(([ta, na], [tb, nb]) => this.store.state.rule.compareTileByColor(ta, tb))
    waitTiles = _.uniq(waitTiles, ([ta, na], [tb, nb]) => this.store.state.rule.compareTileByColor(ta, tb))
    return waitTiles
  }
}
</script>
