import { createProgram } from '../utils/cuon-utils'
import Matrix4 from '../utils/cuon-matrix'
import Geometry from '../common/Geometry'
import Material from '../common/Material'
import Mesh from '../common/Mesh'
import {
  initArrayBufferForLaterUse,
  initAttributeVariable,
  initElementArrayBufferForLaterUse
} from "../utils/arrayBuffer"

import vs from '../../shaders/cube.vert'
import fs from '../../shaders/cube.frag'
//    v6----- v5
//   /|      /|
//  v1------v0|
//  | |     | |
//  | |v7---|-|v4
//  |/      |/
//  v2------v3
const vertices = [
  1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, // v0-v1-v2-v3 front

  1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, // v0-v3-v4-v5 right

  1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, // v0-v5-v6-v1 up

  -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, // v1-v6-v7-v2 left

  -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0, // v7-v4-v3-v2 down

  1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0 // v4-v7-v6-v5 back
]

//(0,1)               (1,1)
//  -------------------
//  |     |     |     |
//  |  f  |  b  |  l  |
//  |_____|_____|_____|
//  |     |     |     |
//  |  r  |  u  |  d  |
//  |_____|_____|_____|
//(0,0)               (1,0)
const st = new Float32Array([
  1 / 3, 1, 0, 1, 0, .5, 1 / 3, .5, // v0-v1-v2-v3 front

  0, 0, 0, .5, 1 / 3, .5, 1 / 3, 0, // v0-v3-v4-v5 right

  1 / 3, 0, 1 / 3, .5, 2 / 3, .5, 2 / 3, 0, // v0-v5-v6-v1 up

  2 / 3, .5, 2 / 3, 1, 1, 1, 1, .5, // v1-v6-v7-v2 left

  2 / 3, 0, 2 / 3, .5, 1, .5, 1, 0, // v7-v4-v3-v2 down

  1 / 3, .5, 1 / 3, 1, 2 / 3, 1, 2 / 3, .5 // v4-v7-v6-v5 back
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

const drawAllFace = () => {
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

const uniforms = {}

const cubeGeom = new Geometry(vertices, indices, normals, st)
const cubeMaterial = new Material(uniforms)

const CubeMesh = class extends Mesh {
  constructor (gl) {
    super(cubeGeom, cubeMaterial)
    this.initArrayBuffer(gl)
    this.initProgram(gl)
    this.initUniform(gl)
    this.initTexture(gl)
  }
  initArrayBuffer (gl) {
    const { vertices, normals, sts, indices } = this.geometry
    const vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT)
    const normalBuffer = initArrayBufferForLaterUse(gl, normals, 3, gl.FLOAT)
    const stBuffer = initArrayBufferForLaterUse(gl, sts, 2, gl.FLOAT)
    const indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.STATIC_DRAW)

    if (!vertexBuffer || !normalBuffer || !stBuffer || !indexBuffer) {
      console.error('init array buffer fail!')
    }
    this.buffers = { vertexBuffer, normalBuffer, stBuffer, indexBuffer }
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
  }
  initProgram (gl) {
    const program = this.program = createProgram(gl, vs, fs)

    program.aPosition = gl.getAttribLocation(program, 'aPosition')
    program.aNormal = gl.getAttribLocation(program, 'aNormal')
    program.aTexCoord = gl.getAttribLocation(program, 'aTexCoord')

    program.uMvpMatrix = gl.getUniformLocation(program, 'uMvpMatrix')
    program.uModelMatrix = gl.getUniformLocation(program, 'uModelMatrix')
    program.uNormalMatrix = gl.getUniformLocation(program, 'uNormalMatrix')

  }
  initUniform (gl) {
    const { program } = this
    gl.useProgram(program)

    const uLightColor = gl.getUniformLocation(program, 'uLightColor')
    const uLightPosition = gl.getUniformLocation(program, 'uLightPosition')
    const uAmbientLight = gl.getUniformLocation(program, 'uAmbientLight')

    // 设置光线颜色
    gl.uniform3f(uLightColor, .7, .7, .7)
    // 设置光源位置
    gl.uniform3f(uLightPosition, 5, 5, 5)
    // 全局光颜色
    gl.uniform3f(uAmbientLight, .3, .3, .3)
  }
  initTexture (gl) {
    const { program } = this
    const textureImage = drawAllFace()
    const texture = gl.createTexture()
    const uSampler = gl.getUniformLocation(program, 'uSample')
    this.loadTexture(gl, texture, uSampler, textureImage)
    // document.body.append(textureImage)
  }
  loadTexture (gl, texture, uSampler, image) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)
    gl.uniform1i(uSampler, 0)
  }
  render (gl, vpMatrix, modelMatrix, normalMatrix) {
    const { program, buffers } = this

    gl.useProgram(program)
    initAttributeVariable(gl, program.aPosition, buffers.vertexBuffer)
    initAttributeVariable(gl, program.aNormal, buffers.normalBuffer)
    initAttributeVariable(gl, program.aTexCoord, buffers.stBuffer)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indexBuffer)

    const mvpMatrix = new Matrix4(vpMatrix)
    modelMatrix.rotate(1, 0, 1, 0)
    mvpMatrix.multiply(modelMatrix)
    normalMatrix.setInverseOf(modelMatrix)
    normalMatrix.transpose()

    gl.uniformMatrix4fv(program.uMvpMatrix, false, mvpMatrix.elements)
    gl.uniformMatrix4fv(program.uModelMatrix, false, modelMatrix.elements)
    gl.uniformMatrix4fv(program.uNormalMatrix, false, normalMatrix.elements)

    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0)
  }
}

export default CubeMesh