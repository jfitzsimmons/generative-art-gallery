export const rndmRng = (h, l) => Math.random() * (h - l) + l

export const distanceToC = (px, py, cx, cy) =>
  Math.sqrt((px - cx) ** 2 + (py - cy) ** 2)

const drawEllipse = (ctx, x, y, w, h) => {
  const kappa = 0.5522848
  const ox = (w / 2) * kappa
  const oy = (h / 2) * kappa
  const xe = x + w
  const ye = y + h
  const xm = x + w / 2
  const ym = y + h / 2

  ctx.beginPath()
  ctx.moveTo(x, ym)
  ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y)
  ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym)
  ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye)
  ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym)
  ctx.fill()
}

export const drawEllipseByCenter = (ctx, cx, cy, w, h) => {
  drawEllipse(ctx, cx - w / 2.0, cy - h / 2.0, w, h)
}

export const coinflip = (a, b) => (Math.floor(Math.random() * 2) === 0 ? a : b)

export const groupBy = (arr, fn) =>
  arr
    .map(typeof fn === 'function' ? fn : (val) => val[fn])
    .reduce((acc, val, i) => {
      acc[val] = (acc[val] || []).concat(arr[i])
      return acc
    }, [])

export const shuffle = (array) => {
  let currentIndex = array.length
  let randomIndex

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    // eslint-disable-next-line no-param-reassign, semi-style
    ;[array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ]
  }

  return array
}

export const randomProperty = function (obj) {
  const keys = Object.keys(obj)
  return obj[keys[(keys.length * Math.random()) << 0]]
}

export const flatten = (arr, depth = 1) =>
  arr.reduce(
    (a, v) =>
      a.concat(depth > 1 && Array.isArray(v) ? flatten(v, depth - 1) : v),
    [],
  )

export const debounce = (func, wait, immediate) => {
  let timeout
  return function (...args) {
    const context = this
    const later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}
