import { Matrix4, Vector3 } from "../utils/math/index"

export const CameraType = {
  PERSPECTIVE: 0,
  ORTHO: 1
}
const Camera = class {
  constructor ({
    type = CameraType.PERSPECTIVE,
    position = new Vector3(1, 1, 1),
    targetPosition = new Vector3(0, 0, 0),
    upDirection = new Vector3(0, 1, 0),
    left = -1,
    right = 1,
    bottom = -1,
    top = 1,
    fov = 90,
    aspect = 1,
    near = .1,
    far = 10
  }) {
    if (type === CameraType.PERSPECTIVE) {
      Object.assign(this, { type, fov, aspect, near, far })
    }
    else if (type === CameraType.ORTHO) {
      Object.assign(this, { type, left, right, bottom, top, near, far })
    }
    else {
      throw new Error('camera type is error')
    }

    this.viewMatrix = new Matrix4()
    this.projMatrix = new Matrix4()
    this.vpMatrix = new Matrix4()

    this.position = position
    this.targetPosition = targetPosition
    this.upDirection = upDirection

    // console.log(this.viewMatrix)
    // this.updateViewMatrix()
    this.updateProjMatrix()
    // console.log('proj', this.projMatrix.elements)
    this.updateViewMatrix()
    // console.log('view', this.viewMatrix.elements)
    this.updateVPMatrix()
    // console.log('vp', this.vpMatrix.elements)
  }
  updateVPMatrix () {
    const { viewMatrix, projMatrix, vpMatrix } = this
    vpMatrix.copy(projMatrix.clone().multiply(viewMatrix.clone()))
  }
  setDegrees (lon, lat) {
    const { targetPosition } = this
    const phi = (90 - lat) / 180 * Math.PI
    const theta = lon / 180 * Math.PI
    // 固定距离
    const distance = 5

    const x = -distance * Math.sin(phi) * Math.sin(theta) + targetPosition.x
    const y = distance * Math.cos(phi)
    const z = -distance * Math.sin(phi) * Math.cos(theta) + targetPosition.z
   
    this.setPosition(new Vector3(x, y, z))
  }
  setPosition (vec3) {
    this.position = vec3
    this.updateViewMatrix()
    this.updateVPMatrix()
  }
  setTargetPosition (vec3) {
    this.targetPosition = vec3
    this.updateViewMatrix()
    this.updateVPMatrix()
  }
  setUpDirection (vec3) {
    this.upDirection = vec3
    this.updateViewMatrix()
    this.updateVPMatrix()
  }
  updateViewMatrix () {
    const { position, targetPosition, upDirection, viewMatrix } = this
    const { x: eyeX, y: eyeY, z: eyeZ } = position
    const { x: centerX, y: centerY, z: centerZ } = targetPosition
    const { x: upX, y: upY, z: upZ } = upDirection

    const e = viewMatrix.elements
    let fx, fy, fz, rlf, sx, sy, sz, rls, ux, uy, uz

    fx = centerX - eyeX
    fy = centerY - eyeY
    fz = centerZ - eyeZ

    // Normalize f.
    rlf = 1 / Math.sqrt(fx*fx + fy*fy + fz*fz)
    fx *= rlf
    fy *= rlf
    fz *= rlf

    // Calculate cross product of f and up.
    sx = fy * upZ - fz * upY
    sy = fz * upX - fx * upZ
    sz = fx * upY - fy * upX

    // Normalize s.
    rls = 1 / Math.sqrt(sx*sx + sy*sy + sz*sz)
    sx *= rls
    sy *= rls
    sz *= rls

    // Calculate cross product of s and f.
    ux = sy * fz - sz * fy
    uy = sz * fx - sx * fz
    uz = sx * fy - sy * fx

    // Set to this.
    e[0] = sx
    e[1] = ux
    e[2] = -fx
    e[3] = 0

    e[4] = sy
    e[5] = uy
    e[6] = -fy
    e[7] = 0

    e[8] = sz
    e[9] = uz
    e[10] = -fz
    e[11] = 0

    e[12] = -e[0] * eyeX - e[4] * eyeY - e[8]  * eyeZ
    e[13] = -e[1] * eyeX - e[5] * eyeY - e[9]  * eyeZ
    e[14] = -e[2] * eyeX - e[6] * eyeY - e[10] * eyeZ
    e[15] = 1 - e[3] * eyeX + e[7] * eyeY + e[11] * eyeZ

    return e
  }
  updateProjMatrix () {
    const { type } = this
    if (type === CameraType.PERSPECTIVE) {
      this.updatePerspectiveProjMatrix()
    }
    else if (type === CameraType.ORTHO) {
      this.updateOrthoProjMatrix()
    }
  }
  updateOrthoProjMatrix () {
    let { projMatrix, left, right, bottom, top, near, far } = this
    const e = projMatrix.elements
    let rw, rh, rd

    if (left === right || bottom === top || near === far) {
      throw 'null frustum'
    }

    rw = 1 / (right - left)
    rh = 1 / (top - bottom)
    rd = 1 / (far - near)


    e[0]  = 2 * rw
    e[1]  = 0
    e[2]  = 0
    e[3]  = 0

    e[4]  = 0
    e[5]  = 2 * rh
    e[6]  = 0
    e[7]  = 0

    e[8]  = 0
    e[9]  = 0
    e[10] = -2 * rd
    e[11] = 0

    e[12] = -(right + left) * rw
    e[13] = -(top + bottom) * rh
    e[14] = -(far + near) * rd
    e[15] = 1

    return e
  }
  updatePerspectiveProjMatrix () {
    let { projMatrix, fov, aspect, near, far } = this
    const e = projMatrix.elements
    let rd, s, ct

    if (near === far || aspect === 0) { throw 'null frustum' }
    if (near <= 0) { throw 'near <= 0' }
    if (far <= 0) { throw 'far <= 0' }

    fov = Math.PI * fov / 180 / 2
    s = Math.sin(fov)
    if (s === 0) { throw 'null frustum' }

    rd = 1 / (far - near)
    ct = Math.cos(fov) / s

    e[0]  = ct / aspect
    e[1]  = 0
    e[2]  = 0
    e[3]  = 0

    e[4]  = 0
    e[5]  = ct
    e[6]  = 0
    e[7]  = 0

    e[8]  = 0
    e[9]  = 0
    e[10] = -(far + near) * rd
    e[11] = -1

    e[12] = 0
    e[13] = 0
    e[14] = -2 * near * far * rd
    e[15] = 0

    return e
  }
}
export default Camera