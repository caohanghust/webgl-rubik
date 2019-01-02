import $ from 'jquery'
const Controller = class {
  constructor (camera) {
    this.camera = camera
    this.fovRange = [ .2, 2 ]
    this.pitchRange = [-Math.PI / 3, Math.PI / 3]
    this.velocity = 1

    this.mousePosition = { x: 0, y: 0 }
    this.prevMousePosition = { x: 0, y: 0 }
    this.phi = 0
    this.theta = 0
    this.lon = 0
    this.lat = 0

    this.looking = false

    this.handleTouchStart = this.handleTouchStart.bind(this)
    this.handleTouchMove = this.handleTouchMove.bind(this)
    this.handleTouchEnd = this.handleTouchEnd.bind(this)
    this.bindEvents()
  }
  bindEvents () {
    if (/iphone|android/i.test(navigator.userAgent)) {
      $('#rubik-container')
        .on('touchstart', this.handleTouchStart)
        .on('touchmove', this.handleTouchMove)
        .on('touchend', this.handleTouchEnd)
    }
    else {
      $('#rubik-container')
        .on('mousedown', this.handleTouchStart)
        .on('mousemove', this.handleTouchMove)
        .on('mouseup', this.handleTouchEnd)
    }
  }
  handleTouchStart (e) {
    const { lon, lat } = this
    const position = Controller.pickPosition(e)
    this.looking = true
    this.mousePosition = this.prevMousePosition = position
  }
  handleTouchMove (e) {
    if (!this.looking) return
    const { velocity } = this
    const sp = this.prevMousePosition = this.mousePosition
    const mp = this.mousePosition = Controller.pickPosition(e)

    const deltaX = mp.x - sp.x
    const deltaY = mp.y - sp.y

    this.lon = Controller.fixLon(this.lon - deltaX * velocity)
    this.lat = Math.min(Math.max(this.lat + deltaY * velocity, -80), 80)
  }
  handleTouchEnd () {
    this.looking = false
  }
  update () {
    const { camera, looking, lon, lat } = this
    if (this.looking) {
      camera.setDegrees(lon, lat)
    }
  }
  static fixLon (lon) {
    return (lon + 360) % 360
  }
  static pickPosition (e) {
    let screenX = 0
    let screenY = 0
    if (/^touch/i.test(e.type)) {
      screenX = e.touches[0].screenX
      screenY = e.touches[0].screenY
    }
    else if (/^mouse/i.test(e.type)) {
      screenX = e.screenX
      screenY = e.screenY
    }
    return {
      x: screenX,
      y: screenY
    }
  }
}
export default Controller