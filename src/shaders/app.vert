attribute vec4 aPosition;
attribute vec4 aColor;
attribute vec4 aNormal;
attribute vec2 aTexCoord;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vTexCoord;

uniform mat4 uModelMatrix;
uniform mat4 uMvpMatrix;
uniform mat4 uNormalMatrix;

void main () {
  gl_Position = uMvpMatrix * aPosition;
  gl_PointSize = 10.0;

  vNormal = normalize(vec3(uNormalMatrix * aNormal));
  vPosition = vec3(uModelMatrix * aPosition);
  vTexCoord = aTexCoord;
}