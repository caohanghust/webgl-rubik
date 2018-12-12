import Matrix4 from '../utils/cuon-matrix'
const Camera = class {
  constructor () {
    this.matrix = new Matrix4()
  }
  setPerspective (...opts) {
    this.matrix.setPerspective(...opts)
  }
  lookAt (...opts) {
    this.matrix.lookAt(...opts)
  }
}
export default Camera