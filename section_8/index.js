const vertexString = `
  attribute vec3 a_position;
  uniform float angleX;
  uniform float angleY;
  void main() {
    gl_Position = vec4(
      a_position.x + angleX,
      a_position.y + angleY,
      0,
      1.0
    );
  }
`;
const fragmentString = `
  void main() {
    gl_FragColor = vec4(0.0,0.0,1.0,1.0);
  }
`;
const webglDiv = document.getElementById("webglCanvas");
const projMat4 = mat4.create();
const points = [];

let webgl = null;
let countX = 0;
let countY = 0;

/**
 * 入口函数
 */
function init() {
  initWebgl();
  initShader();
  initEvent();
  initBuffer();
  draw();
}

/**
 * webgl初始化函数
 */
function initWebgl() {
  const webglDiv = document.getElementById("webglCanvas");
  webgl = webglDiv.getContext("webgl");
  webgl.viewport(0, 0, webglDiv.clientWidth, webglDiv.clientHeight);
}

/**
 * shader初始化函数
 */
function initShader() {
  const vsShader = webgl.createShader(webgl.VERTEX_SHADER);
  const fsShader = webgl.createShader(webgl.FRAGMENT_SHADER);

  webgl.shaderSource(vsShader, vertexString);
  webgl.shaderSource(fsShader, fragmentString);

  webgl.compileShader(vsShader);
  webgl.compileShader(fsShader);

  const program = webgl.createProgram();
  webgl.attachShader(program, vsShader);
  webgl.attachShader(program, fsShader);

  webgl.linkProgram(program);
  webgl.useProgram(program);
  webgl.program = program;
}

/**
 * 监听键盘按下事件
 */
function initEvent() {
  document.onkeydown = handleKeyDown;
}

/**
 * 键盘按下事件处理函数
 * @param {MouseEvent} event
 */
function handleKeyDown(event) {
  if (String.fromCharCode(event.keyCode) === "W") {
    countY += 0.01;
  } else if (String.fromCharCode(event.keyCode) === "S") {
    countY -= 0.01;
  } else if (String.fromCharCode(event.keyCode) === "D") {
    countX += 0.01;
  } else if (String.fromCharCode(event.keyCode) === "A") {
    countX -= 0.01;
  }
}

/**
 * 数据缓存区函数
 */
function initBuffer() {
  // countX += 0.01;
  // countY += 0.01;
  const arr = [
    [0.1, 0.4, 0.0],
    [0.1, 0.5, 0.0],
    [0.2, 0.4, 0.0],
  ];

  const float = new Float32Array(arr.flat());
  const buffer = webgl.createBuffer();
  webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
  webgl.bufferData(webgl.ARRAY_BUFFER, float, webgl.STATIC_DRAW);

  const aPosition = webgl.getAttribLocation(webgl.program, "a_position");
  webgl.vertexAttribPointer(aPosition, 3, webgl.FLOAT, false, 0, 0);
  webgl.enableVertexAttribArray(aPosition);

  const xAngle = webgl.getUniformLocation(webgl.program, "angleX");
  const yAngle = webgl.getUniformLocation(webgl.program, "angleY");
  webgl.uniform1f(xAngle, countX);
  webgl.uniform1f(yAngle, countY);
}

/**
 * webgl绘制函数
 */
function draw() {
  webgl.clearColor(0.0, 0.0, 0.0, 1);
  webgl.clear(webgl.COLOR_BUFFER_BIT);
  webgl.drawArrays(webgl.TRIANGLES, 0, 3);
}

function onload() {
  init();
  window.requestAnimationFrame(onload);
}

onload();
