import { createProgram } from '../utils/cuon-utils'
import { Matrix4, Vector3 } from '../utils/math'
import Geometry from '../common/Geometry'
import Material from '../common/Material'
import Mesh from '../common/Mesh'

import vs from '../../shaders/axes.vert'
import fs from '../../shaders/axes.frag'

const vertices = [
  0, 0, 0, 1, 0, 0, //v0
  1, 0, 0, 1, 0, 0, //v1
  0, 0, 0, 0, 1, 0, //v0
  0, 1, 0, 0, 1, 0, //v2
  0, 0, 0, 0, 0, 1, //v0
  0, 0, 1, 0, 0, 1, //v3
]

const axesGeom = new Geometry(vertices)
const axesMaterial = new Material(vs, fs)

const AxesMesh = class extends Mesh {
  constructor () {
    super(axesGeom, axesMaterial)
    this.modelMatrix = new Matrix4()
    this.modelMatrix.scale(new Vector3(100, 100, 100))
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
    vertexBuffer.fsize = fsize

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
    gl.vertexAttribPointer(program.aPosition, 3, gl.FLOAT, false, fsize * 6, 0)
    gl.enableVertexAttribArray(program.aPosition)
    gl.vertexAttribPointer(program.aColor, 3, gl.FLOAT, false, fsize * 6, fsize * 3)
    gl.enableVertexAttribArray(program.aColor)

    const mvpMatrix = vpMatrix.clone()
    mvpMatrix.multiply(modelMatrix)

    gl.uniformMatrix4fv(program.uMvpMatrix, false, mvpMatrix.elements)
    gl.drawArrays(gl.LINES, 0, 6)
  }
}

export default AxesMesh