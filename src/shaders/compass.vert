attribute vec4 aPosition;
attribute vec4 aColor;

uniform mat4 uMvpMatrix;

varying vec4 vColor;

void main () {
  gl_Position = uMvpMatrix * aPosition;
  vColor = aColor;
}