const Material = class {
  constructor (vertexShader, fragmentShader, uniforms) {
    Object.assign(this, { vertexShader, fragmentShader, uniforms })
  }
}
export default Material