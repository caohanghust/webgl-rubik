import '../css/index.styl'
import vs from '../shaders/cube.vert'
import fs from '../shaders/cube.frag'
import initShader from './utils/cuon-utils'
import Matrix4 from "./utils/cuon-matrix"
import Scene from './common/Scene'
import Camera from './common/Camera'
import CubeMesh from './modules/CubeMesh'
import requestAnimationFrame from './utils/animationFrame'

// import Matrix4 from './utils/cuon-matrix'

const App = class {
  constructor (containId) {
    const gl = App.initWebgl(containId)
    const scene = this.scene = new Scene(gl)
    const camera = this.initCamera()
    const cube = new CubeMesh()

    scene.add(camera)
    scene.add(cube)
    App.initShaders(gl)

    const stop = requestAnimationFrame(this.render, this)
    this.render()
  }
  initCamera () {
    const camera = new Camera()
    camera.setPerspective(90, 1, .1, 10)
    camera.lookAt(3, 3, 3, 0, 0, 0, 0, 1, 0)
    return camera
  }
  render () {
    const { scene } = this
    scene.render()
  }
  static initWebgl (containId) {
    const container  = document.getElementById(containId)
    const { width, height } = container.getBoundingClientRect()
    const canvas = document.createElement('canvas')

    canvas.width = width
    canvas.height = height
    container.appendChild(canvas)

    return canvas.getContext('webgl')
  }
  static initShaders (gl) {
    initShader(gl, vs, fs)
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.POLYGON_OFFSET_FILL)
  }
}

new App('rubik-container')