import Mesh from '../common/Mesh'
import Camera from '../common/Camera'
import Light from '../common/Light'
import Matrix4 from "../utils/cuon-matrix"


const Scene = class {
  constructor (gl) {
    this.gl = gl
    this.camera = null
    this.light = []
    this.children = []
  }
  add (item) {
    const { gl, children } = this

    // add Mesh
    if (item instanceof Mesh) {
      children.push(item)
      item.scene = this
      item.initGlData(gl)
    }

    // add Camera
    if (item instanceof Camera) {
      this.camera = item
    }

    // add Light
    if (item instanceof Light) {
      this.light.push(item)
    }
  }
  render () {
    const { gl, camera } = this
    const vpMatrix = camera.matrix

    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    this.children.forEach(mesh => {
      mesh.render(gl, vpMatrix)
    })
  }
}
export default Scene