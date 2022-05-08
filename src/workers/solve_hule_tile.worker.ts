import { GalaxyMahjongRule, MahjongTile } from '@/lib/mahjong'

const solveHuleTileWorker = self as DedicatedWorkerGlobalScope

solveHuleTileWorker.addEventListener('message', (ev) => {
  console.log('---- solveHuleTileWorker')
  const rule = GalaxyMahjongRule.getInstance()
  const tiles: MahjongTile[] = JSON.parse(ev.data)
  const waitPatterns = rule.solveHuleTile(tiles)
  solveHuleTileWorker.postMessage(waitPatterns)
  solveHuleTileWorker.close()
})
