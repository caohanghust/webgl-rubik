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
    const cube = new CubeMesh()
    App.initShaders(gl)
    App.initLight(gl)

    App.initModel(gl, cube)
    App.initTexture(gl)

    const vpMatrix = App.initCamera()
    const modelMatrix = new Matrix4()
    const normalMatrix = new Matrix4()
    Object.assign(this, { gl, vpMatrix, modelMatrix, normalMatrix })
    const stop = requestAnimationFrame(this.render, this)
    this.render()
  }
  render () {
    const { gl, vpMatrix, modelMatrix, normalMatrix } = this
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    const uMvpMatrix = gl.getUniformLocation(gl.program, 'uMvpMatrix')
    const uNormalMatrix = gl.getUniformLocation(gl.program, 'uNormalMatrix')
    const uModelMatrix = gl.getUniformLocation(gl.program, 'uModelMatrix')
    const mvpMatrix = new Matrix4(vpMatrix)

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
  static loadTexture (gl, texture, uSampler, image) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)
    gl.uniform1i(uSampler, 0)
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
    const uLightColor = gl.getUniformLocation(gl.program, 'uLightColor')
    const uLightPosition = gl.getUniformLocation(gl.program, 'uLightPosition')
    const uAmbientLight = gl.getUniformLocation(gl.program, 'uAmbientLight')

    // 设置光线颜色
    gl.uniform3f(uLightColor, .7, .7, .7)
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
  static initModel (gl, cube) {
    const { geometry, material } = cube
    const { vertices, sts, normals, indices } = geometry
    const indexBuffer = gl.createBuffer()

    if (!App.initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'aPosition')) return
    if (!App.initArrayBuffer(gl, sts, 2, gl.FLOAT, 'aTexCoord')) return
    if (!App.initArrayBuffer(gl, normals, 3, gl.FLOAT, 'aNormal'))
      if (!indexBuffer) return
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

    this.modelMatrix = new Matrix4()
    this.normalMatrix = new Matrix4()
  }
  static initTexture (gl) {
    const content = App.drawAllFace()
    const texture = gl.createTexture()
    const uSampler = gl.getUniformLocation(gl.program, 'uSample')
    App.loadTexture(gl, texture, uSampler, content)
    // document.body.append(content)
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

  static drawAllFace () {
    const canvas = document.createElement('canvas')
    const itemSize = 100
    const solidWidth = 10
    const ctx = canvas.getContext('2d')
    canvas.width = itemSize * 3
    canvas.height = itemSize * 2

    ctx.lineJoin = 'round'
    ctx.lineWidth = solidWidth
    const drawItem = (x, y, color) => {
      ctx.beginPath()
      ctx.fillStyle = color
      ctx.strokeStyle = color
      ctx.rect(x + solidWidth, y + solidWidth, itemSize - 2 * solidWidth, itemSize - 2 * solidWidth)
      ctx.stroke()
      ctx.fill()
      ctx.closePath()
    }
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    drawItem(itemSize * 0, itemSize * 0, 'red')     //f
    drawItem(itemSize * 1, itemSize * 0, 'orange')  //b
    drawItem(itemSize * 2, itemSize * 0, 'white')   //l
    drawItem(itemSize * 0, itemSize * 1, 'yellow')  //r
    drawItem(itemSize * 1, itemSize * 1, 'blue')    //u
    drawItem(itemSize * 2, itemSize * 1, 'green')   //d
    return canvas
  }
}

new App('rubik-container')