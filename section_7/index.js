const vertexString = `
  attribute vec3 a_position;
  uniform float angle;
  void main() {
    gl_Position = vec4(
      a_position.x * cos(angle) - a_position.y * sin(angle),
      a_position.x * sin(angle) + a_position.y * cos(angle),
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

init();
/**
 * 入口函数
 */
function init() {
  initWebgl();
  initShader();
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
 * 数据缓存区函数
 */
function initBuffer() {
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

  const uAngle = webgl.getUniformLocation(webgl.program, "angle");
  const angle1 = (180 * Math.PI) / 180;
  webgl.uniform1f(uAngle, angle1);
}

/**
 * webgl绘制函数
 */
function draw() {
  webgl.clearColor(0.0, 0.0, 0.0, 1);
  webgl.clear(webgl.COLOR_BUFFER_BIT);
  webgl.drawArrays(webgl.TRIANGLES, 0, 3);
}
