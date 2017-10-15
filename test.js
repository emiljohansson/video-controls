import test from 'ava'
import sinon from 'sinon'
import VideoControls from '.'

const fireEvent = (el, type) => {
  if (el.fireEvent) {
    el.fireEvent('on' + type)
  } else {
    const evObj = document.createEvent('Events')
    evObj.initEvent(type, true, false)
    el.dispatchEvent(evObj)
  }
}

const fireKeyEvent = key => {
  const event = new window.KeyboardEvent('keyup', {
    bubbles : true,
    cancelable : true,
    key,
    shiftKey : true
  })
  document.dispatchEvent(event)
}

const timeout = (getValue, delay = 0) => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(getValue())
  }, delay)
})

const TestHandler = () => {
  const videoEl = document.createElement('video')
  videoEl.webkitDisplayingFullscreen = false
  videoEl.webkitExitFullScreen = function () {
    this.webkitDisplayingFullscreen = false
  }
  videoEl.webkitEnterFullscreen = function () {
    this.webkitDisplayingFullscreen = true
  }
  videoEl.currentTime = 0
  return {
    el: videoEl,
    cleanup: vc => {
      vc.destroy()
    }
  }
}

test('should hide mouse cursor', async t => {
  const th = TestHandler()
  const vc = VideoControls(th.el, {
    hideCursorTime: 0
  })
  fireEvent(th.el, 'mousemove')
  let actual = await timeout(() => th.el.style.cursor)
  t.is(actual, 'auto')
  fireEvent(th.el, 'mousemove')
  actual = await timeout(() => th.el.style.cursor, 100)
  t.is(actual, 'none')
  th.cleanup(vc)
})

test('should toggle fullscreen', t => {
  const th = TestHandler()
  const vc = VideoControls(th.el)
  fireKeyEvent('f')
  t.true(th.el.webkitDisplayingFullscreen)
  fireKeyEvent('f')
  t.false(th.el.webkitDisplayingFullscreen)
  th.cleanup(vc)
})

test('should fast forward and reverse current time', t => {
  const th = TestHandler()
  const vc = VideoControls(th.el)
  fireKeyEvent('arrowright')
  t.is(th.el.currentTime, 5)
  fireKeyEvent('arrowleft')
  t.is(th.el.currentTime, 0)
  th.cleanup(vc)
})