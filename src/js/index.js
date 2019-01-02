import '../css/index.styl'
import { Matrix4, Vector3 } from "./utils/math"
import Scene from './common/Scene'
import Camera, { CameraType } from './common/Camera'
import Light from './common/Light'
import CubeMesh from './modules/CubeMesh'
import AxesMesh from './modules/AxesMesh'
import TrayMesh from './modules/TrayMesh'
import CompassMesh from './modules/CompassMesh'
import Controller from './common/Controller'
import requestAnimationFrame from './utils/animationFrame'

const App = class {
  constructor (containId) {
    const gl = App.initWebgl(containId)
    const scene = this.scene = new Scene(gl)
    const camera = this.camera = this.initCamera(scene)
    this.controller = this.initController(camera)
    this.initLight(scene)

    const axes = new AxesMesh()
    const tray = new TrayMesh()
    const compass = new CompassMesh()

    scene.add(axes)
    scene.add(tray)
    scene.add(compass)

    const stop = requestAnimationFrame(this.render, this)
    this.render()
  }
  initController (camera) {
    return new Controller(camera)
  }
  initCamera (scene) {
    const type = CameraType.ORTHO
    const position = new Vector3(4, 4, 4)
    const targetPosition = new Vector3(0, 0, 0)
    const upDirection = new Vector3(0, 1, 0)
    const left = -6
    const right = 6
    const top = 6
    const bottom = -6
    const near = .1
    const far = 100
    const camera = new Camera({
      type,
      position,
      targetPosition,
      upDirection,
      left,
      right,
      top,
      bottom,
      near,
      far
    })
    scene.add(camera)
    return camera
  }
  initLight (scene) {
    const light = new Light()
    // 环境光
    light.setAmbientLight(.3, .3, .3)
    // light.setAmbientLight(0, 0, 0)
    // 点光源
    const position = [ 10, 10, 10 ]
    const color = [ .7, .7, .7 ]
    light.addPointLight(position, color)
    scene.add(light)
  }
  render () {
    const { scene, controller } = this
    controller.update()
    scene.render()
  }
  static initWebgl (containId) {
    const container  = document.getElementById(containId)
    const { width, height } = container.getBoundingClientRect()
    const canvas = document.createElement('canvas')

    canvas.width = width
    canvas.height = height
    container.appendChild(canvas)

    const gl = canvas.getContext('webgl')
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.POLYGON_OFFSET_FILL)

    return gl
  }
}

new App('rubik-container')