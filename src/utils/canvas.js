import { rndmRng } from './helpers'

export const canvas = document.getElementById('canvas1')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

export const ctx = canvas.getContext('2d')
// need a better way of getting height testjpf
export let w = window.innerWidth
export let h = window.innerHeight

export const setDashedLines = () => {
  const lineDash = rndmRng(5, 1)
  const lineSpace = rndmRng(6, 3)

  ctx.lineWidth = rndmRng(5, 1)
  ctx.setLineDash([lineDash, lineSpace])

  return [lineDash, lineSpace]
}

export function resetCanvas() {
  w = window.innerWidth
  h = window.innerHeight
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  ctx.clearRect(0, 0, w, h)
  ctx.shadowColor = '#000'
  ctx.shadowBlur = 0
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
  ctx.setLineDash([])
  ctx.lineWidth = 0
}
