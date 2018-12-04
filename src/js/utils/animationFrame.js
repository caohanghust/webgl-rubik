const noop = () => {}
const _requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  (fn => setTimeout(fn, 16))


export function nextFrame (fn=noop, delay=0) {
  if (delay <= 0) _requestAnimationFrame(fn)
  else _requestAnimationFrame(() => requestAnimationFrame(fn, delay - 1))
}

export default function requestAnimationFrameInterval (fn=noop, context, ...args) {
  let stoped = false
  let loop = time => {
    fn.call(context, time, ...args)
    if (!stoped && loop) _requestAnimationFrame(loop)
  }
  _requestAnimationFrame(loop)
  return () => { loop = null, stoped = true }
}

export function getFrameTime (callback=noop) {
  if (getFrameTime.cache) callback(getFrameTime.cache)
  const start = Date.now()
  _requestAnimationFrame(() => {
    callback(getFrameTime.cache = Date.now() - start)
  })
}

getFrameTime()

