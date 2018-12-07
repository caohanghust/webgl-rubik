precision mediump float;

uniform vec3 uLightColor;
uniform vec3 uAmbientLight;
uniform vec3 uLightPosition;
uniform sampler2D uSampler;

varying vec2 vTexCoord;
varying vec3 vPosition;
varying vec3 vNormal;

void main () {
  vec4 color = texture2D(uSampler, vTexCoord);
  vec3 normal = normalize(vNormal);
  vec3 lightDirection = normalize(uLightPosition - vPosition);
  float nDotL = max(dot(lightDirection, normal), 0.0);
  // 表面漫反射颜色
  vec3 diffuse = uLightColor * vec3(color) * nDotL;
  // 环境光反射颜色
  vec3 ambient = uAmbientLight * vec3(color);
  gl_FragColor = vec4(diffuse + ambient, color.a);
}