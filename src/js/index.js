import '../css/index.styl'
import vs from '../shaders/app.vert'
import fs from '../shaders/app.frag'
import initShader from './utils/cuon-utils'
import Matrix4 from "./utils/cuon-matrix"

// import Matrix4 from './utils/cuon-matrix'

const App = class {
  constructor (containId) {
    const gl = App.initWebgl(containId)
    App.initShaders(gl)
    App.initLight(gl)
    App.initModel(gl)

    const vpMatrix = App.initCamera()
    const modelMatrix = new Matrix4()
    const normalMatrix = new Matrix4()
    Object.assign(this, { gl, vpMatrix, modelMatrix, normalMatrix })
    this.render = this.render.bind(this)
    const stop = requestAnimationFrame(this.render)
    this.render()
  }
  render () {
    const { gl, vpMatrix, modelMatrix, normalMatrix } = this
    const uMvpMatrix = gl.getUniformLocation(gl.program, 'uMvpMatrix')
    const uNormalMatrix = gl.getUniformLocation(gl.program, 'uNormalMatrix')
    const uModelMatrix = gl.getUniformLocation(gl.program, 'uModelMatrix')
    const mvpMatrix = new Matrix4(vpMatrix)
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    modelMatrix.rotate(1, 0, 1, 0)
    mvpMatrix.multiply(modelMatrix)
    normalMatrix.setInverseOf(modelMatrix)
    normalMatrix.transpose()
    gl.uniformMatrix4fv(uModelMatrix, false, modelMatrix.elements)
    gl.uniformMatrix4fv(uNormalMatrix, false, normalMatrix.elements)
    gl.uniformMatrix4fv(uMvpMatrix, false, mvpMatrix.elements)
    // gl.drawArrays(gl.POINTS, 0, 8)
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0)
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
  static initLight (gl) {
    const uLightColor = gl.getUniformLocation(gl.program, 'uLightColor')
    const uLightPosition = gl.getUniformLocation(gl.program, 'uLightPosition')
    const uAmbientLight = gl.getUniformLocation(gl.program, 'uAmbientLight')

    // 设置光线颜色
    gl.uniform3f(uLightColor, 1.0, 0.0, 0.0)
    // 设置光源位置
    gl.uniform3f(uLightPosition, 5, 5, 5)
    // 全局光颜色
    gl.uniform3f(uAmbientLight, .3, .3, .3)
  }
  static initCamera () {
    const vpMatrix = new Matrix4()
    vpMatrix.setPerspective(90, 1, .1, 10)
    vpMatrix.lookAt(3, 3, 3, 0, 0, 0, 0, 1, 0)
    return vpMatrix
  }
  static initModel (gl) {
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    const vertices = new Float32Array([
      1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, // v0-v1-v2-v3 front

      1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, // v0-v3-v4-v5 right

      1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, // v0-v5-v6-v1 up

      -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, // v1-v6-v7-v2 left

      -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0, // v7-v4-v3-v2 down

      1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0 // v4-v7-v6-v5 back

    ])

    const colors = new Float32Array([
      1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, // v0-v1-v2-v3 front(white)

      1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, // v0-v3-v4-v5 right(white)

      1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, // v0-v5-v6-v1 up(white)

      1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, // v1-v6-v7-v2 left(white)

      1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, // v7-v4-v3-v2 down(white)

      1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0 // v4-v7-v6-v5 back(white)
    ])

    const normals = new Float32Array([
      0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, // v0-v1-v2-v3 front

      1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, // v0-v3-v4-v5 right

      0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, // v0-v5-v6-v1 up

      -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left

      0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, // v7-v4-v3-v2 down

      0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0 // v4-v7-v6-v5 back

    ])

    const indices = new Uint8Array([
      0, 1, 2, 0, 2, 3, // front

      4, 5, 6, 4, 6, 7, // right

      8, 9, 10, 8, 10, 11, // up

      12, 13, 14, 12, 14, 15, // left

      16, 17, 18, 16, 18, 19, // down

      20, 21, 22, 20, 22, 23 // back
    ])

    const indexBuffer = gl.createBuffer()
    if (!App.initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'aPosition')) return
    if (!App.initArrayBuffer(gl, colors, 3, gl.FLOAT, 'aColor')) return
    if (!App.initArrayBuffer(gl, normals, 3, gl.FLOAT, 'aNormal'))
      if (!indexBuffer) return
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

    this.modelMatrix = new Matrix4()
    this.normalMatrix = new Matrix4()
  }
  static initArrayBuffer (gl, data, num, type, attribute) {
    const buffer = gl.createBuffer()
    if (!buffer) return false
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
    const aAttribute = gl.getAttribLocation(gl.program, attribute)
    gl.vertexAttribPointer(aAttribute, num, type, false, 0, 0)
    gl.enableVertexAttribArray(aAttribute)
    return true
  }
}

new App('rubik-container')