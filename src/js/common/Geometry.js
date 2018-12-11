const Geometry = class {
  constructor (vertices, indices, normals, sts) {
    vertices = new Float32Array(vertices)
    indices = new Uint8Array(indices)
    sts = new Float32Array(sts)
    normals = new Float32Array(normals)
    Object.assign(this, { vertices, indices, sts, normals })
  }
}
export default Geometry