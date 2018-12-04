attribute vec4 aPosition;
attribute vec4 aColor;
attribute vec4 aNormal;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec4 vColor;
uniform mat4 uModelMatrix;
uniform mat4 uMvpMatrix;
uniform mat4 uNormalMatrix;

void main () {
  gl_Position = uMvpMatrix * aPosition;
  gl_PointSize = 10.0;

  vNormal = normalize(vec3(uNormalMatrix * aNormal));
  vPosition = vec3(uModelMatrix * aPosition);
  vColor = aColor;
}