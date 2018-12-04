import '../css/index.styl'
import vs from '../shaders/app.vert'
import fs from '../shaders/app.frag'
import initShader from './utils/cuon-utils'

// import Matrix4 from './utils/cuon-matrix'

const App = class {
  constructor (containId) {
    const gl = App.initWebgl(containId)
  }
  static initWebgl (containId) {
    const container  = document.getElementById(containId)
    const { width, height } = container.getBoundingClientRect()
    const canvas = document.createElement('canvas')

    canvas.width = width
    canvas.height = height
    container.appendChild(canvas)

    return canvas.getContext('webgl')
  }
  static initShaders (gl) {

  }
}

new App('rubik-container')