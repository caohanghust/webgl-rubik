const Light = class {
  constructor () {
    this.ambientLight = [ 1, 1, 1 ]
    this.pointLights = []
  }
  setAmbientLight (...opts) {
    this.ambientLight = opts
  }
  addPointLight (position, color) {
    this.pointLights.push({ position, color })
  }
}
export default Light