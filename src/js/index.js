import '../css/index.styl'
import Scene from './common/Scene'
import Camera from './common/Camera'
import Light from './common/Light'
import CubeMesh from './modules/CubeMesh'
import requestAnimationFrame from './utils/animationFrame'

const App = class {
  constructor (containId) {
    const gl = App.initWebgl(containId)
    const scene = this.scene = new Scene(gl)

    this.initCamera(scene)
    this.initLight(scene)

    const cube = new CubeMesh()
    scene.add(cube)

    const stop = requestAnimationFrame(this.render, this)
    this.render()
  }
  initCamera (scene) {
    const camera = new Camera()
    camera.setPerspective(90, 1, .1, 10)
    camera.lookAt(3, 3, 3, 0, 0, 0, 0, 1, 0)
    scene.add(camera)
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

    const gl = canvas.getContext('webgl')
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.POLYGON_OFFSET_FILL)

    return gl
  }
}

new App('rubik-container')