var canvas;
var gl;
var program;
var vBuffer;
var animOn = true;
var vertices;
var lightVectices;
var getVertices = true;
var normals;
var frameRate = 60;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = xAxis;

var theta = [0.0, 0.0, 0.0];

///LIGHT//////////
var lightPositionX = -50.0;
var lightPositionY = 60.0;
var lightPositionZ = 40.0;
var lightPositionW = 0.0;
var lightPosition = vec4(lightPositionX, lightPositionY, lightPositionZ, lightPositionW);

var lightAmbient = vec4(0.4, 0.4, 0.4, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);
var materialAmbient = vec4(1.0, 1.0, 1.0, 1.0);
var materialDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
var materialShininess = 20.0;
var shineninessVal;
var shadingType = 0.0;

var circlePointsIndex = 0;
var pointsBetweenCirclesIndex = 0;
var pointCountOnCircle = 0;
var circleCount = 0;

function getElementByIdPart() {
  document.getElementById("a0").onchange = function () {
    updateObj();
  };
  document.getElementById("a1").onchange = function () {
    updateObj();
  };
  document.getElementById("a2").onchange = function () {
    updateObj();
  };
  document.getElementById("a3").onchange = function () {
    updateObj();
  };
  document.getElementById("a4").onchange = function () {
    updateObj();
  };
  document.getElementById("a5").onchange = function () {
    updateObj();
  };
  document.getElementById("a6").onchange = function () {
    updateObj();
  };
  document.getElementById("a7").onchange = function () {
    updateObj();
  };
  document.getElementById("a8").onchange = function () {
    updateObj();
  };
  document.getElementById("a9").onchange = function () {
    updateObj();
  };
  document.getElementById("rendering").onchange = function () {
    updateObj();
  };
  document.getElementById("gl-canvas").onclick = function () {
    animOn = !animOn;
  };
  document.getElementById("lightPositionX").onchange = function () {
    lightPositionX = parseInt(event.srcElement.value);
    lightPosition = vec4(lightPositionX, lightPositionY, lightPositionZ, lightPositionW);
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition));

  };
  document.getElementById("lightPositionY").onchange = function () {
    lightPositionY = parseInt(event.srcElement.value);
    lightPosition = vec4(lightPositionX, lightPositionY, lightPositionZ, lightPositionW);
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition));
  };
  document.getElementById("lightPositionZ").onchange = function () {
    lightPositionZ = parseInt(event.srcElement.value);
    lightPosition = vec4(lightPositionX, lightPositionY, lightPositionZ, lightPositionW);
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition));
  };
  document.getElementById("shadingType").onchange = function () {
    if (event.srcElement.value == "Gouraud")
		  shadingType = 0.0;
    else if(event.srcElement.value == "Phong")
		  shadingType = 1.0;
	  else 
		  shadingType = 2.0;
    updateObj();
  };
  document.getElementById("shineninessVal").onchange = function () {
    materialShininess = parseInt(event.srcElement.value);
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);
  };
}

window.onload = function init() {
  canvas = document.getElementById("gl-canvas");
  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) { alert("WebGL isn't available"); }
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.9, 1.0, 1.0, 1.0);
  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);
  getElementByIdPart();

  updateObj();

}

function updateObj() {
  // torus knot specs
  var a0 = parseFloat(document.getElementById('a0').value);
  var a1 = parseFloat(document.getElementById('a1').value);
  var a2 = parseFloat(document.getElementById('a2').value);
  var a3 = parseFloat(document.getElementById('a3').value);
  var a4 = parseFloat(document.getElementById('a4').value);
  var a5 = parseFloat(document.getElementById('a5').value);
  var a6 = parseFloat(document.getElementById('a6').value);
  var a7 = parseFloat(document.getElementById('a7').value);
  var a8 = parseFloat(document.getElementById('a8').value);
  var a9 = parseFloat(document.getElementById('a9').value);
  // create torus knot
  var renderStyle = document.getElementById('rendering').value;
  var obj;
  if (renderStyle == "WIREFRAME") {
    obj = makeDecoratedTorusKnotWireframe(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9);
  }
  else {
    obj = makeDecoratedTorusKnot(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9);
  }

  vertices = obj.vertices;
  normals = obj.normals;
  //////////////
  var nBuffer = gl.createBuffer();

  var vNormal = gl.getAttribLocation(program, "a_normal");
  gl.enableVertexAttribArray(vNormal);
  gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);
  gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);


  vBuffer = gl.createBuffer();

  var vPosition = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(vPosition);
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);


  ambientProduct = mult(lightAmbient, materialAmbient);
  diffuseProduct = mult(lightDiffuse, materialDiffuse);
  specularProduct = mult(lightSpecular, materialSpecular);

  gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
  gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
  gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct));
  gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition));
  gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);
  gl.uniform1f(gl.getUniformLocation(program, "shadingType"), shadingType);

  var projectionLocation = gl.getUniformLocation(program, "u_projection");
  var viewLocation = gl.getUniformLocation(program, "u_view");
  var worldLocation = gl.getUniformLocation(program, "u_world");
  var textureLocation = gl.getUniformLocation(program, "u_texture");
  var worldCameraPositionLocation = gl.getUniformLocation(program, "u_worldCameraPosition");

  // Create a texture.
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
  const faceInfos = [
    {
      target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
      url: 'environment/pos-x.jpg',
    },
    {
      target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
      url: 'environment/neg-x.jpg',
    },
    {
      target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
      url: 'environment/pos-y.jpg',
    },
    {
      target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
      url: 'environment/neg-y.jpg',
    },
    {
      target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
      url: 'environment/pos-z.jpg',
    },
    {
      target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
      url: 'environment/neg-z.jpg',
    },
  ];
  faceInfos.forEach((faceInfo) => {
    const { target, url } = faceInfo;

    // Upload the canvas to the cubemap face.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 512;
    const height = 512;
    const format = gl.RGBA;
    const type = gl.UNSIGNED_BYTE;

    // setup each face so it's immediately renderable
    gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);

    // Asynchronously load an image
    const image = new Image();
    image.src = url;
    image.addEventListener('load', function () {
      // Now that the image has loaded make copy it to the texture.
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
      gl.texImage2D(target, level, internalFormat, format, type, image);
      gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    });
  });
  gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  function radToDeg(r) {
    return r * 180 / Math.PI;
  }

  function degToRad(d) {
    return d * Math.PI / 180;
  }

  var fieldOfViewRadians = degToRad(60);
  var modelXRotationRadians = degToRad(0);
  var modelYRotationRadians = degToRad(0);
  var cameraYRotationRadians = degToRad(0);

  var spinCamera = true;
  // Get the starting time.
  
  var then = 0;
  requestAnimationFrame(drawScene);

  // Draw the scene.
  function drawScene(time) {
    // stop start rendering
    if (!animOn) return;

    var renderStyle = document.getElementById('rendering').value;
    var scaling = parseFloat(document.getElementById('s').value);

  

    // convert to seconds
    time *= 0.001;
    // Subtract the previous time from the current time
    var deltaTime = time - then;
    // Remember the current time for the next frame.
    then = time;

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    // Animate the rotation
    modelYRotationRadians += -0.7 * deltaTime;
    modelXRotationRadians += -0.4 * deltaTime;

    // Clear the canvas AND the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Turn on the position attribute
    gl.enableVertexAttribArray(vPosition);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);

    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 3;          // 3 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
      vPosition, size, type, normalize, stride, offset);

    // Turn on the normal attribute
    gl.enableVertexAttribArray(vNormal);

    // Bind the normal buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);

    // Tell the attribute how to get data out of normalBuffer (ARRAY_BUFFER)
    var size = 3;          // 3 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floating point values
    var normalize = false; // normalize the data (convert from 0-255 to 0-1)
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
      vNormal, size, type, normalize, stride, offset);

    // Compute the projection matrix
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var projectionMatrix =
      m4.perspective(fieldOfViewRadians, aspect, 1, 2000);
    gl.uniformMatrix4fv(projectionLocation, false, projectionMatrix);

    var cameraPosition = [0, 0, scaling * 100];
    var target = [0, 0, 0];
    var up = [0, 1, 0];
    // Compute the camera's matrix using look at.
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);

    // Make a view matrix from the camera matrix.
    var viewMatrix = m4.inverse(cameraMatrix);


    var worldMatrix = m4.xRotation(modelXRotationRadians);
    worldMatrix = m4.yRotate(worldMatrix, modelYRotationRadians);

    // Set the uniforms
    gl.uniformMatrix4fv(projectionLocation, false, projectionMatrix);
    gl.uniformMatrix4fv(viewLocation, false, viewMatrix);
    gl.uniformMatrix4fv(worldLocation, false, worldMatrix);
    gl.uniform3fv(worldCameraPositionLocation, cameraPosition);

    // Tell the shader to use texture unit 0 for u_texture
    gl.uniform1i(textureLocation, 0);

    if (renderStyle == "WIREFRAME") {

      gl.drawArrays(gl.LINE_LOOP, 0, vertices.length / 3);
    }
    else {
      // Draw the geometry.
      gl.drawArrays(eval('gl.' + renderStyle), 0, vertices.length / 3);
    }


    requestAnimationFrame(drawScene);
  }
}

// Returns a transformation matrix
function getTM(angleX, angleY, angleZ, scaling) {
  // trigonometri
  var cosX = Math.cos(angleX);
  var sinX = Math.sin(angleX);
  var cosY = Math.cos(angleY);
  var sinY = Math.sin(angleY);
  var cosZ = Math.cos(angleZ);
  var sinZ = Math.sin(angleZ);
  var distance = 100; // distance to camera
  var far = 10; // far plane
  var near = -10; // near plane
  // sepecs
  var camSpecA = distance;
  var camSpecB = (near + far + 2 * distance) / (far - near);
  var camSpecC = -(distance * (2 * near + 2 * far) + 2 * far * near + 2 * distance * distance) / (far - near);

  // transformation matrix
  var array = new Float32Array([
    cosY * cosZ * scaling * camSpecA,
    cosY * scaling * sinZ * camSpecA,
    -scaling * sinY * camSpecB,
    -scaling * sinY,
    scaling * (cosZ * sinX * sinY - cosX * sinZ) * camSpecA,
    scaling * (sinX * sinY * sinZ + cosX * cosZ) * camSpecA,
    cosY * scaling * sinX * camSpecB,
    cosY * scaling * sinX,
    scaling * (sinX * sinZ + cosX * cosZ * sinY) * camSpecA,
    scaling * (cosX * sinY * sinZ - cosZ * sinX) * camSpecA,
    cosX * cosY * scaling * camSpecB,
    cosX * cosY * scaling,
    scaling * (cosZ * sinY - sinZ) * camSpecA,
    scaling * (sinY * sinZ) * camSpecA,
    camSpecC + (scaling * cosY + distance) * camSpecB,
    scaling * cosY + distance
  ]);

  return array;

}
// Creates a 3D torus knot

function makeDecoratedTorusKnot(a0, a1, a2, a3, a4, a5, on, a7, polyNumEqu, polyNumPipe) {
  var verticesArray = new Array();
  var normalsArray = new Array();
  uIncrement = Math.PI * 2 / polyNumEqu;
  vIncrement = Math.PI * 2 / polyNumPipe;

  for (var u = 0; u < Math.PI * 2; u += uIncrement) {
    uNext = u + uIncrement;

    for (var v = 0; v < Math.PI * 2; v += vIncrement) {

      var x = a0 * Math.cos(a1 * u) * (a2 + a3 * (Math.cos(a4 * u) + a5 * Math.cos(on * u))) + Math.cos(v) * Math.cos(a1 * u) * (a2 + a3 * (Math.cos(a4 * u) + a5 * Math.cos(on * u)));
      var y = a0 * Math.sin(a1 * u) * (a2 + a3 * (Math.cos(a4 * u) + a5 * Math.cos(on * u))) + Math.cos(v) * Math.sin(a1 * u) * (a2 + a3 * (Math.cos(a4 * u) + a5 * Math.cos(on * u)));
      var z = Math.sin(v) + a7 * Math.sin(a4 * u);

      verticesArray.push(x);
      verticesArray.push(y);
      verticesArray.push(z);

      normalsArray.push(x);
      normalsArray.push(y);
      normalsArray.push(z);

      // zig zag
      var x = a0 * Math.cos(a1 * uNext) * (a2 + a3 * (Math.cos(a4 * uNext) + a5 * Math.cos(on * uNext))) + Math.cos(v) * Math.cos(a1 * uNext) * (a2 + a3 * (Math.cos(a4 * uNext) + a5 * Math.cos(on * uNext)));
      var y = a0 * Math.sin(a1 * uNext) * (a2 + a3 * (Math.cos(a4 * uNext) + a5 * Math.cos(on * uNext))) + Math.cos(v) * Math.sin(a1 * uNext) * (a2 + a3 * (Math.cos(a4 * uNext) + a5 * Math.cos(on * uNext)));
      var z = Math.sin(v) + a7 * Math.sin(a4 * uNext);

      verticesArray.push(x);
      verticesArray.push(y);
      verticesArray.push(z);

      normalsArray.push(x);
      normalsArray.push(y);
      normalsArray.push(z);
    }
  }

  var result = new Object();
  result.vertices = new Float32Array(verticesArray);
  result.normals = new Float32Array(normalsArray);
  return result;
}
function makeDecoratedTorusKnotWireframe(a0, a1, a2, a3, a4, a5, on, a7, polyNumEqu, polyNumPipe) {
  console.log("wireframe");
  var verticesArray = new Array();
  var normalsArray = new Array();
  uIncrement = Math.PI * 2 / polyNumEqu;
  vIncrement = Math.PI * 2 / polyNumPipe;
  var firstX;
  var firstY;
  var firstZ;
  for (var u = 0; u < Math.PI * 2; u += uIncrement) {
    uNext = u + uIncrement;

    for (var v = 0; v < Math.PI * 2; v += vIncrement) {

      var x = a0 * Math.cos(a1 * u) * (a2 + a3 * (Math.cos(a4 * u) + a5 * Math.cos(on * u))) + Math.cos(v) * Math.cos(a1 * u) * (a2 + a3 * (Math.cos(a4 * u) + a5 * Math.cos(on * u)));
      var y = a0 * Math.sin(a1 * u) * (a2 + a3 * (Math.cos(a4 * u) + a5 * Math.cos(on * u))) + Math.cos(v) * Math.sin(a1 * u) * (a2 + a3 * (Math.cos(a4 * u) + a5 * Math.cos(on * u)));
      var z = Math.sin(v) + a7 * Math.sin(a4 * u);

      verticesArray.push(x);
      verticesArray.push(y);
      verticesArray.push(z);

      normalsArray.push(x);
      normalsArray.push(y);
      normalsArray.push(z);
      if (v == 0) {
        firstX = x;
        firstY = y;
        firstZ = z;
      }
    }
    verticesArray.push(firstX);
    verticesArray.push(firstY);
    verticesArray.push(firstZ);

    normalsArray.push(firstX);
    normalsArray.push(firstY);
    normalsArray.push(firstZ);
  }
  for (var v = 0; v < Math.PI * 2; v += vIncrement) {
    for (var u = 0; u < Math.PI * 2; u += uIncrement) {
      var x = a0 * Math.cos(a1 * u) * (a2 + a3 * (Math.cos(a4 * u) + a5 * Math.cos(on * u))) + Math.cos(v) * Math.cos(a1 * u) * (a2 + a3 * (Math.cos(a4 * u) + a5 * Math.cos(on * u)));
      var y = a0 * Math.sin(a1 * u) * (a2 + a3 * (Math.cos(a4 * u) + a5 * Math.cos(on * u))) + Math.cos(v) * Math.sin(a1 * u) * (a2 + a3 * (Math.cos(a4 * u) + a5 * Math.cos(on * u)));
      var z = Math.sin(v) + a7 * Math.sin(a4 * u);

      verticesArray.push(x);
      verticesArray.push(y);
      verticesArray.push(z);

      normalsArray.push(x);
      normalsArray.push(y);
      normalsArray.push(z);
    }
  }

  var result = new Object();
  result.vertices = new Float32Array(verticesArray);
  result.normals = new Float32Array(normalsArray);
  return result;
}