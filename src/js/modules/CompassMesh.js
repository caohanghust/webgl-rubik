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


const v0 = [ 0.0, 1.0, 0.0 ]
const v1 = [ -0.4, 0.0 ,0.0 ]
const v2 = [ 0.4, 0.0, 0.0 ]
const v3 = [ 0.0, -1.0, 0.0 ]
const v4 = [ 0.0, 0.0, 0.3 ]

const r1 = [ 0.96484375, 0.296875, 0.1875 ]
const r2 = [ 0.62890625, 0.1328125, .05078125]
const w1 = [ 1.0, 1.0, 1.0 ]
const w2 = [ 0.765625, 0.765625, 0.765625 ]

// 点-颜色-点-颜色-点-颜色
const verticeColors = [
  // ...v0, ...w1, ...v1, ...w1, ...v4, ...w1,
  // ...v0, ...w2, ...v4, ...w2, ...v2, ...w2,
  // ...v1, ...w1, ...v3, ...w1, ...v4, ...w1,
  // ...v2, ...w2, ...v4, ...w2, ...v3, ...w2
  ...v0, ...v1, ...v4,
  ...v0, ...v4, ...v2,
  ...v1, ...v3, ...v4,
  ...v2, ...v4, ...v3,
]

// const verticeColors = [
//   0, 0, 0, 1, 0, 0, //v0
//   1, 0, 0, 1, 0, 0, //v1
//   0, 0, 0, 0, 1, 0, //v0
//   0, 1, 0, 0, 1, 0, //v2
//   0, 0, 0, 0, 0, 1, //v0
//   0, 0, 1, 0, 0, 1, //v3
// ]
console.log(verticeColors)

const compassGeom = new Geometry(verticeColors)
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
    const { vertices } = this.geometry

    const fsize = vertices.BYTES_PER_ELEMENT
    const vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
    vertexBuffer.fszie = fsize

    this.buffers = { vertexBuffer }

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

    const fsize = buffers.vertexBuffer.fsize
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertexBuffer)
    gl.vertexAttribPointer(program.aPosition, 3, gl.FLOAT, false, fsize * 3, 0)
    gl.enableVertexAttribArray(program.aPosition)
    // gl.vertexAttribPointer(program.aColor, 3, gl.FLOAT, false, fsize * 6, fsize * 3)
    // gl.enableVertexAttribArray(program.aColor)

    const mvpMatrix = vpMatrix.clone()
    mvpMatrix.multiply(modelMatrix)

    gl.uniformMatrix4fv(program.uMvpMatrix, false, mvpMatrix.elements)
    gl.drawArrays(gl.TRIANGLES, 0, 12)
  }
}
export default CompassMesh
