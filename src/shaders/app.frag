precision mediump float;

uniform vec3 uLightColor;
uniform vec3 uAmbientLight;
uniform vec3 uLightPosition;

varying vec4 vColor;
varying vec3 vPosition;
varying vec3 vNormal;

void main () {
  vec3 normal = normalize(vNormal);
  vec3 lightDirection = normalize(uLightPosition - vPosition);
  float nDotL = max(dot(lightDirection, normal), 0.0);
  // 表面漫反射颜色
  vec3 diffuse = uLightColor * vec3(vColor) * nDotL;
  // 环境光反射颜色
  vec3 ambient = uAmbientLight * vec3(vColor);
  gl_FragColor = vec4(diffuse + ambient, vColor.a);
}