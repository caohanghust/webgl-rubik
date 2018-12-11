import vs from '../../shaders/cube.vert'
import fs from '../../shaders/cube.frag'
import Geometry from '../common/Geometry'
import Material from '../common/Material'
import Mesh from '../common/Mesh'

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
const cubeMaterial = new Material(vs, fs, uniforms)

const CubeMesh = class extends Mesh {
  constructor () {
    super(cubeGeom, cubeMaterial)
  }
}

export default CubeMesh