<template>
  <span>
    <img v-if="imageName" :alt="imageName" :src="require(`@/assets/mahjong_tile/${imageName}`)" />
    <p v-else>no set image name</p>
  </span>
</template>
<script lang="ts">
import { MahjongTile, TileColor } from '@/lib/mahjong'
import { Options, Vue } from 'vue-class-component'

@Options({
  props: {
    tile: {
      type: MahjongTile,
      required: false,
      default: null
    },
    small: {
      type: Boolean,
      default: false
    },
    side: {
      type: Boolean,
      default: false
    },
    back: {
      type: Boolean,
      default: false
    }
  }
})
export default class TileImage extends Vue {
  tile!: MahjongTile | null
  small!:boolean
  side!:boolean
  imageName!: string
  back!: boolean
  created ():void {
    const sizeStr = this.small ? '-s' : '-l'
    const sideStr = this.side ? '-yoko' : ''
    if (this.tile && !this.back) {
      const tileColor = this.tile.color
      const tileNumber = this.tile.number
      const optionStr = (this.tile.option.isGalaxy ? '-g' : '') + (this.tile.option.isRed ? '-r' : '')
      this.imageName = TileColor[tileColor] + tileNumber + optionStr + sizeStr + sideStr + '.png'
    } else {
      this.imageName = 'back' + sizeStr + sideStr + '.png'
    }
  }
}
</script>
