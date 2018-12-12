export function initArrayBufferForLaterUse (gl, data, num, type) {
  const buffer = gl.createBuffer() // Create a buffer object
  if (!buffer) {
    console.log('Failed to create the buffer object')
    return null
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)

  // Keep the information necessary to assign to the attribute variable later
  buffer.num = num
  buffer.type = type

  return buffer
}
export function initElementArrayBufferForLaterUse (gl, data, type) {
  var buffer = gl.createBuffer(); // Create a buffer object
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return null;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);

  buffer.type = type;

  return buffer;
}

export function initAttributeVariable (gl, a_attribute, buffer) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(a_attribute, buffer.num, buffer.type, false, 0, 0);
  gl.enableVertexAttribArray(a_attribute);
}