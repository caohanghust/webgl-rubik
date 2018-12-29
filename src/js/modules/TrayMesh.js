import { createProgram } from '../utils/cuon-utils'
import { Matrix4, Vector3 } from "../utils/math"
import Geometry from '../common/Geometry'
import Material from '../common/Material'
import Mesh from '../common/Mesh'

import vs from '../../shaders/tray.vert'
import fs from '../../shaders/tray.frag'
import {
  initArrayBufferForLaterUse,
  initAttributeVariable,
  initElementArrayBufferForLaterUse
} from "../utils/arrayBuffer"

//  v3 ---------- v2
//  |             |
//  |             |
//  |             |
//  v0 ---------- v1

const vertices = [
  -1, 0, -1, 1, 0, -1, 1, 0,  1, // v0-v1-v2

  -1, 0, -1, 1, 0, 1, -1, 0, 1, // v0-v2-v3
]

const indices = [
  0, 1, 2,
  3, 4, 5
]

const sts = [
  0, 0,
  1, 0,
  1, 1,
  0, 0,
  1, 1,
  0, 1,
]

const normals = [
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
]

const trayGeom = new Geometry(vertices, indices, normals, sts)
const trayMaterial = new Material(vs, fs)

const drawTrayBg = () => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const size = 500
  const solidWidth = 1
  const solidGap = 25

  canvas.width = canvas.height = size

  ctx.solidWidth = solidWidth
  ctx.strokeStyle = '#999999'

  for (let i = solidGap / 2; i < size; i += solidGap) {
    for (let j = solidGap / 2; j < size; j += solidGap) {
      ctx.moveTo(0, j)
      ctx.lineTo(size, j)
      ctx.stroke()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, size)
      ctx.stroke()
    }
  }

  return canvas
}

const TrayMesh = class extends Mesh {
  constructor () {
    super(trayGeom, trayMaterial)
    this.modelMatrix = new Matrix4().makeTranslation(0, -5, 0)
    this.normalMatrix = new Matrix4()
    this.modelMatrix.scale(new Vector3(10, 1, 10))
  }
  initGlData (gl) {
    this.initArrayBuffer(gl)
    this.initProgram(gl)
    this.initLight(gl)
    this.initTexture(gl)
    this.initStaticUniform(gl)
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
    const { vertexShader, fragmentShader } = this.material
    const program = this.program = createProgram(gl, vertexShader, fragmentShader)

    program.aPosition = gl.getAttribLocation(program, 'aPosition')
    program.aNormal = gl.getAttribLocation(program, 'aNormal')
    program.aTexCoord = gl.getAttribLocation(program, 'aTexCoord')

    program.uMvpMatrix = gl.getUniformLocation(program, 'uMvpMatrix')
    program.uModelMatrix = gl.getUniformLocation(program, 'uModelMatrix')
    program.uNormalMatrix = gl.getUniformLocation(program, 'uNormalMatrix')
  }
  initLight (gl) {
    const { program, scene } = this
    const { light } = scene
    const { ambientLight, pointLights } = light
    const pointLight = pointLights[0]
    gl.useProgram(program)

    const uLightColor = gl.getUniformLocation(program, 'uLightColor')
    const uLightPosition = gl.getUniformLocation(program, 'uLightPosition')
    const uAmbientLight = gl.getUniformLocation(program, 'uAmbientLight')

    // 设置光线颜色
    gl.uniform3f(uLightColor, ...pointLight.color)
    // 设置光源位置
    gl.uniform3f(uLightPosition, ...pointLight.position)
    // 全局光颜色
    gl.uniform3f(uAmbientLight, ...ambientLight)
  }
  initTexture (gl) {
    const { program } = this
    const textureImage = drawTrayBg()
    const texture = gl.createTexture()
    const uSampler = gl.getUniformLocation(program, 'uSample')
    Object.assign(this, { texture, uSampler, textureImage })
    // document.body.append(textureImage)
  }
  loadTexture (gl) {
    const { texture, uSampler, textureImage } = this
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, textureImage)
    gl.uniform1i(uSampler, 0)
  }
  initStaticUniform (gl) {
    const { program, buffers, modelMatrix, normalMatrix } = this
    gl.useProgram(program)
    gl.uniformMatrix4fv(program.uModelMatrix, false, modelMatrix.elements)
    gl.uniformMatrix4fv(program.uNormalMatrix, false, normalMatrix.elements)
  }
  render (gl, vpMatrix) {
    const { program, buffers, modelMatrix } = this

    gl.useProgram(program)
    initAttributeVariable(gl, program.aPosition, buffers.vertexBuffer)
    initAttributeVariable(gl, program.aNormal, buffers.normalBuffer)
    initAttributeVariable(gl, program.aTexCoord, buffers.stBuffer)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indexBuffer)
    this.loadTexture(gl)
    const mvpMatrix = vpMatrix.clone()
    mvpMatrix.multiply(modelMatrix)

    gl.uniformMatrix4fv(program.uMvpMatrix, false, mvpMatrix.elements)
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0)
  }
}
export default TrayMesh


