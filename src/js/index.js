import '../css/index.styl'
import vs from '../shaders/cube.vert'
import fs from '../shaders/cube.frag'
import initShader from './utils/cuon-utils'
import Matrix4 from "./utils/cuon-matrix"
import CubeMesh from './modules/CubeMesh'
import requestAnimationFrame from './utils/animationFrame'

// import Matrix4 from './utils/cuon-matrix'

const App = class {
  constructor (containId) {
    const gl = App.initWebgl(containId)
    const scene = App.initScene(gl)
    const cube = this.cube = new CubeMesh(gl)
    App.initShaders(gl)
    App.initLight(gl)

    const vpMatrix = App.initCamera()
    const modelMatrix = new Matrix4()
    const normalMatrix = new Matrix4()
    Object.assign(this, { gl, vpMatrix, modelMatrix, normalMatrix })
    const stop = requestAnimationFrame(this.render, this)
    this.render()
  }
  render () {
    const { gl, cube, vpMatrix, modelMatrix, normalMatrix } = this
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    cube.render(gl, vpMatrix, modelMatrix, normalMatrix)
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
  static initScene (gl) {

  }
  static initShaders (gl) {
    initShader(gl, vs, fs)
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.POLYGON_OFFSET_FILL)
  }
  static initLight (gl) {
    // const uLightColor = gl.getUniformLocation(gl.program, 'uLightColor')
    // const uLightPosition = gl.getUniformLocation(gl.program, 'uLightPosition')
    // const uAmbientLight = gl.getUniformLocation(gl.program, 'uAmbientLight')
  }
  static initCamera () {
    const vpMatrix = new Matrix4()
    vpMatrix.setPerspective(90, 1, .1, 10)
    vpMatrix.lookAt(3, 3, 3, 0, 0, 0, 0, 1, 0)
    return vpMatrix
  }
}

new App('rubik-container')