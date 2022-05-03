<template>
  <span class="mianzi">
    <span v-if="_mianzi.kind === mianziKind.kangzi && !_mianzi.isOpend">
      <!-- 暗槓 -->
      <tile-image back :small="small"/>
      <tile-image :tile="displayTiles[1][0]" :small="small" />
      <tile-image :tile="displayTiles[2][0]" :small="small" />
      <tile-image back :small="small" />
    </span>
    <span v-else>
      <!-- その他 -->
      <tile-image
        v-for="tile in displayTiles"
        :key="tile[1]"
        :tile="tile[0]"
        :side="_mianzi.isOpend && tile[1] === 0"
        :small="small"
      />
    </span>
    <span v-if="showColor" class="fs-6">
      {{displayColor}}
    </span>
  </span>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { IMianzi, MahjongTile, MianziKind, TileColor } from '@/lib/mahjong'
import TileImage from '../tile_image.vue'

@Options({
  props: {
    mianzi: {
      type: Object as () => IMianzi,
      required: true
    },
    small: {
      type: Boolean,
      required: false,
      default: false
    },
    showColor: {
      type: Boolean,
      default: false
    }
  },
  components: {
    TileImage
  }
})
export default class DisplayMianzi extends Vue {
  mianzi!: () => IMianzi
  small!:boolean
  _mianzi!: IMianzi
  displayTiles!:[MahjongTile, number][]
  mianziKind = MianziKind
  showColor!: boolean
  displayColor!:string

  created ():void {
    this._mianzi = this.mianzi()
    this.displayTiles = this._mianzi.tiles.map((t, i) => [t, i])
    this.displayColor = ''
    if (this._mianzi.color === TileColor.sanyuan) {
      this.displayColor = ['白', '發', '中'][this._mianzi.number - 1]
    } else if (this._mianzi.color === TileColor.feng) {
      this.displayColor = ['東', '南', '西', '北'][this._mianzi.number - 1]
    } else {
      this.displayColor = ['萬', '筒', '索'][this._mianzi.color]
    }
    this.displayColor = '(' + this.displayColor + ')'
  }
}
</script>
<style>
.mianzi {
  margin-right: 5px;
}
</style>
