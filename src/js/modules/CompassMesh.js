import { createProgram } from '../utils/cuon-utils'
import { Matrix4, Vector3, Euler } from '../utils/math'
import Geometry from '../common/Geometry'
import Material from '../common/Material'
import Mesh from '../common/Mesh'
import {
  initArrayBufferForLaterUse,
  initAttributeVariable,
  initElementArrayBufferForLaterUse
} from "../utils/arrayBuffer"

import vs from '../../shaders/compass.vert'
import fs from '../../shaders/compass.frag'


const v0 = [ 1.0, 0.0, 0.0 ]
const v1 = [ 0.0, 0.0, -0.4 ]
const v2 = [ 0.0, 0.0, 0.4 ]
const v3 = [ -1.0, 0.0, 0.0 ]
const v4 = [ 0.0, 0.3, 0.0 ]
const v5 = [ 0.0, -0.3, 0.0 ]

const r1 = [ 0.96484375, 0.296875, 0.1875 ]
const r2 = [ 0.62890625, 0.1328125, .05078125 ]
const r3 = [ 0.8984375, 0.28125, 0.1796875 ]
const r4 = [ 0.5390625, 0.11328125, 0.046875 ]

const w1 = [ 1.0, 1.0, 1.0 ]
const w2 = [ 0.765625, 0.765625, 0.765625 ]
const w3 = [ 0.90625, 0.90625, 0.90625]
const w4 = [ 0.67578125, 0.67578125, 0.67578125 ]

// 点-颜色-点-颜色-点-颜色
const vertices = [
  ...v0, ...v1, ...v4,
  ...v0, ...v5, ...v1,
  ...v0, ...v4, ...v2,
  ...v0, ...v2, ...v5,
  ...v1, ...v3, ...v4,
  ...v1, ...v5, ...v3,
  ...v2, ...v4, ...v3,
  ...v2, ...v3, ...v5
]
const colors = [
  ...r1, ...r1, ...r1,
  ...r3, ...r3, ...r3,
  ...r2, ...r2, ...r2,
  ...r4, ...r4, ...r4,
  ...w1, ...w1, ...w1,
  ...w3, ...w3, ...w3,
  ...w2, ...w2, ...w2,
  ...w4, ...w4, ...w4
]

const compassGeom = new Geometry({ vertices, colors })
const compassMaterial = new Material(vs, fs)

const CompassMesh = class extends Mesh {
  constructor () {
    super(compassGeom, compassMaterial)
    this.modelMatrix = new Matrix4()
  }
  initGlData (gl) {
    this.initArrayBuffer(gl)
    this.initProgram(gl)
  }
  initArrayBuffer (gl) {
    const { vertices, colors } = this.geometry

    const vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT)
    const colorsBuffer = initArrayBufferForLaterUse(gl, colors, 3, gl.FLOAT)

    this.buffers = { vertexBuffer, colorsBuffer }

    gl.bindBuffer(gl.ARRAY_BUFFER, null)
  }
  initProgram (gl) {
    const { vertexShader, fragmentShader } = this.material
    const program = this.program = createProgram(gl, vertexShader, fragmentShader)

    program.aPosition = gl.getAttribLocation(program, 'aPosition')
    program.aColor = gl.getAttribLocation(program, 'aColor')
    program.uMvpMatrix = gl.getUniformLocation(program, 'uMvpMatrix')
  }
  render (gl, vpMatrix) {
    const { program, buffers, modelMatrix } = this

    gl.useProgram(program)

    initAttributeVariable(gl, program.aPosition, buffers.vertexBuffer)
    initAttributeVariable(gl, program.aColor, buffers.colorsBuffer)

    const mvpMatrix = vpMatrix.clone()
    mvpMatrix.multiply(modelMatrix)

    gl.uniformMatrix4fv(program.uMvpMatrix, false, mvpMatrix.elements)
    gl.drawArrays(gl.TRIANGLES, 0, 24)
  }
}
export default CompassMesh
