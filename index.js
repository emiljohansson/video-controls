const defaultOptions = {
  hideCursorTime: 2000
}

export default (target, options = {}) => {
  options = Object.assign({}, defaultOptions, options)
  const instance = {}
  const eventHandlers = []

  instance.destroy = () => {
    eventHandlers.forEach(handler => handler())
    target = null
  }

  const OffHandler = (type, fn, context) => () => context.removeEventListener(type, fn)

  function initAutoHideCursor () {
    var ct = 0
    var cache = 0
    var canAdd = true
    const onMouseMove = () => {
      if (!canAdd) {
        return
      }
      target.style.cursor = 'auto'
      const Timer = () => {
        canAdd = false
        setTimeout(() => {
          if (ct === cache) {
            target.style.cursor = 'none'
            canAdd = true
            return
          }
          cache = ct
          Timer()
        }, options.hideCursorTime)
      }
      Timer()
      ct++
    }
    target.addEventListener('mousemove', onMouseMove)
    eventHandlers.push(OffHandler('mousemove', onMouseMove, target))
  }

  function initKeyboard () {
    const skipSec = 5
    const onKeyUp = event => {
      const key = event.key.toLowerCase()
      if (key === 'f') {
        toggleFullscreen()
      }
      if (key === 'arrowleft') {
        skip(-skipSec)
      }
      if (key === 'arrowright') {
        skip(skipSec)
      }
    }
    document.addEventListener('keyup', onKeyUp)
    eventHandlers.push(OffHandler('keyup', onKeyUp, document))
  }

  function toggleFullscreen () {
    if (target.webkitDisplayingFullscreen) {
      target.webkitExitFullScreen()
      return
    }
    target.webkitEnterFullscreen()
  }

  function skip (time) {
    target.currentTime += time
  }

  initAutoHideCursor()
  initKeyboard()

  return instance
}
