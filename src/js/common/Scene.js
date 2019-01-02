import Mesh from '../common/Mesh'
import Camera from '../common/Camera'
import Light from '../common/Light'

const Scene = class {
  constructor (gl) {
    this.gl = gl
    this.camera = null
    this.light = null
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
      this.light = item
    }
  }
  render () {
    const { gl, camera, light } = this
    const vpMatrix = camera.vpMatrix

    gl.clearColor(0.0, 0.0, 0.0, 0.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    this.children.forEach(mesh => {
      mesh.render(gl, vpMatrix, light)
    })
  }
}
export default Scene