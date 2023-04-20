import { ctx, h, w } from '../utils/canvas'
import { coinflip, rndmRng } from '../utils/helpers'

let t = 0
let sunX = 0
let sunW = 0
const palette = ['220', '174', '191', '22', '344', '44']

function sunset() {
  const gradient = ctx.createLinearGradient(
    Math.round(w * rndmRng(0.53, 0.5)),
    Math.round(t * rndmRng(0.2, 0.1)),
    Math.round(w * rndmRng(0.5, 0.47)),
    Math.round(t * rndmRng(1, 0.8)),
  )

  gradient.addColorStop(0, '#30497A')
  gradient.addColorStop(rndmRng(0.3, 0.05), '#38778F')
  gradient.addColorStop(rndmRng(0.6, 0.35), '#3A8B9E')
  gradient.addColorStop(rndmRng(0.95, 0.65), '#42B7B3')
  gradient.addColorStop(1, '#41CFC1')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, w, t)
}

function sun() {
  sunX = Math.round(rndmRng(w * 0.75, w * 0.25))
  sunW = Math.round(rndmRng(w * 0.15, w * 0.05))
  const gradient = ctx.createLinearGradient(
    Math.round(w * 0.5),
    Math.round(rndmRng(t * 0.8, t * 0.4)),
    Math.round(w * 0.5),
    t,
  )
  gradient.addColorStop(0, '#FDD1B8')
  gradient.addColorStop(1, '#FFE8B8')
  ctx.beginPath()
  ctx.arc(sunX, t, sunW, 0, Math.PI * 2, true)
  ctx.fillStyle = gradient
  ctx.fill()
}

function cloudWisps(loops) {
  for (let i = loops; i--; ) {
    let x = rndmRng(w, -100)
    let y = rndmRng(10, -100)
    let line = 100
    let increase = true

    while (y < t) {
      ctx.lineWidth = rndmRng(4, 1)
      ctx.moveTo(x, y)
      ctx.lineTo(x + line, y)

      if (y < t * rndmRng(0.35, 0.15)) {
        ctx.strokeStyle = `rgba(164, 86, 107, ${rndmRng(0.2, 0.1)})`
      } else if (y < t * rndmRng(0.6, 0.4)) {
        ctx.strokeStyle = `rgba(174, 111, 116, ${rndmRng(0.2, 0.1)})`
      } else if (y < t * rndmRng(0.85, 0.65)) {
        ctx.strokeStyle = `rgba(207, 160, 119, ${rndmRng(0.2, 0.1)})`
      } else {
        ctx.strokeStyle = `rgba(237, 210, 135, ${rndmRng(0.2, 0.1)})`
      }

      if (x < -line * 2 || x > w - line / 4 || line < 20) {
        x = rndmRng(w, -100)
        line = 100
        increase = true
      }

      if (line > w * 0.33 && increase === true) {
        increase = false
      }

      ctx.stroke()
      ctx.beginPath()
      line = increase === true ? line + rndmRng(100, 1) : line - rndmRng(100, 1)
      x = Math.round(x + rndmRng(line / 3, -line / 3))
      y += rndmRng(4, 2)
    }
  }
}

function ocean() {
  const gradient = ctx.createLinearGradient(
    Math.round(w * 0.5),
    t,
    Math.round(w * 0.5),
    h,
  )
  gradient.addColorStop(0, 'rgba(64, 167, 186, 1)')
  gradient.addColorStop(rndmRng(0.02, 0.07), 'rgba(73, 206, 187, 1)')
  gradient.addColorStop(rndmRng(0.12, 0.08), 'rgba(59, 162, 181, 1)')
  gradient.addColorStop(rndmRng(0.17, 0.13), 'rgba(68, 201, 182, 1)')
  gradient.addColorStop(rndmRng(0.29, 0.19), 'rgba(54, 157, 176, 1)')
  gradient.addColorStop(rndmRng(0.39, 0.31), 'rgba(63, 196, 177, 1)')
  gradient.addColorStop(rndmRng(0.49, 0.41), 'rgba(49, 152, 171, 1)')
  gradient.addColorStop(rndmRng(0.59, 0.51), 'rgba(58, 191, 172, 1)')
  gradient.addColorStop(rndmRng(0.79, 0.61), 'rgba(44, 147, 166, 1)')
  gradient.addColorStop(rndmRng(0.95, 0.81), 'rgba(53, 186, 167, 1)')
  gradient.addColorStop(1, 'rgba(39, 142, 161, 1)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, t, w, h)
}

function waves() {
  let wvs = t

  while (wvs < h) {
    ctx.fillStyle = `rgba(${rndmRng(100, 30)}, ${rndmRng(215, 145)}, ${rndmRng(
      225,
      185,
    )}, ${rndmRng(0.4, 0.1)})`
    ctx.beginPath()
    let counter = 0
    let x = -100

    let height = rndmRng(12, 4)
    let increase = ((90 / 180) * Math.PI) / rndmRng(25, 8)
    let y = wvs

    for (let i = 0; i <= w + 100; i += 10) {
      x = i
      y = Math.round(wvs - Math.sin(counter) * height)
      counter += increase
      ctx.lineTo(x, y)
    }

    height = rndmRng(12, 4)
    increase = ((90 / 180) * Math.PI) / rndmRng(25, 8)
    y += 40

    for (let i = w + 100; i >= -100; i -= 10) {
      x = i
      y = Math.round(wvs - Math.sin(counter) * height + 10)
      counter += increase
      ctx.lineTo(x, y)
    }

    ctx.lineTo(x, y - height)
    ctx.closePath()
    ctx.fill()

    wvs += 16
  }
}

function sunReflection() {
  ctx.shadowBlur = 9
  ctx.shadowColor = '#FDF7AD'
  let chunk = rndmRng(100, 30)
  let count = 0
  let increment = 0
  let m = 2
  let y = t
  let x = sunX - sunW
  ctx.beginPath()
  ctx.moveTo(x, y)

  while (y < h) {
    const gradient = ctx.createLinearGradient(sunX, y, sunX, y + chunk)
    ctx.fillStyle = gradient
    gradient.addColorStop(0, `rgba(253, 247, 173, ${m - 1.2})`)
    gradient.addColorStop(0.5, `rgba(252, 231, 186, ${m - 1.2})`)
    gradient.addColorStop(1, `rgba(253, 247, 173, ${m - 1.2})`)

    while (count < chunk) {
      increment = rndmRng(5, 16)
      y += increment
      count += increment
      ctx.lineTo(Math.round(x - rndmRng(sunW * m, sunW / 2)), y)
      increment = rndmRng(5, 16)
      y += increment
      count += increment
      ctx.lineTo(Math.round(x + rndmRng(sunW * m, sunW / 2)), y)
      x -= 5
    }

    x = sunX + sunW

    while (count > 0 + increment) {
      increment = rndmRng(5, 16)
      y -= increment
      count -= increment
      ctx.lineTo(Math.round(x + rndmRng(sunW * m, sunW / 2)), y)
      increment = rndmRng(5, 16)
      y -= increment
      count -= increment
      ctx.lineTo(Math.round(x - rndmRng(sunW * m, sunW / 2)), y)
      x += 5
    }

    ctx.closePath()
    ctx.fill()
    ctx.beginPath()
    y += chunk
    x = sunX - sunW
    ctx.moveTo(x, y)
    chunk = rndmRng(100, 30)
    count = 0
    m -= 0.1
  }
}

export default function loadSunset() {
  t = Math.round(h * rndmRng(0.75, 0.5))

  sunset()
  sun()
  cloudWisps(16)
  ocean()
  waves()
  sunReflection()

  const grd = ctx.createRadialGradient(
    sunX,
    t,
    h * rndmRng(0.4, 0.2),
    sunX,
    t,
    h * rndmRng(1.1, 0.9),
  )
  grd.addColorStop(
    0,
    `hsla(${
      palette[Math.round(rndmRng(palette.length - 1, 0))]
    }, 100%, 65%, 0)`,
  )
  grd.addColorStop(
    coinflip(0.3, 0.4),
    `hsla(${
      palette[Math.round(rndmRng(palette.length - 1, 0))]
    }, 100%, ${Math.round(rndmRng(50, 40))}%, .${coinflip(1, 2)})`,
  )
  grd.addColorStop(
    1,
    `hsla(${
      palette[Math.round(rndmRng(palette.length - 1, 0))]
    }, 100%, ${Math.round(rndmRng(25, 10))}%, .${coinflip(2, 3)})`,
  )

  ctx.fillStyle = grd
  ctx.filter = `sepia(${Math.round(rndmRng(75, 0))}%) saturate(${Math.round(
    rndmRng(190, 10),
  )}% blur(${Math.round(rndmRng(20, 0))})`
  ctx.fillRect(0, 0, w, h)
}
