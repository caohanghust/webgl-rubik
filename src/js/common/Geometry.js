const Geometry = class {
  constructor (opts) {
    for (let key in opts) {
      if (Array.isArray(opts[key])) {
        switch (key) {
          case 'indices':
            this[key] = new Uint8Array(opts[key])
            break
          default:
            this[key] = new Float32Array(opts[key])
            break
        }
      }
      else {
        this[key] = opts[key]
      }
    }
  }
}
export default Geometry