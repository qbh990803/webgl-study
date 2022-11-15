const vertexString = `
  attribute vec4 a_position;
  uniform mat4 proj;
  void main() {
    gl_Position = proj * a_position;
    gl_PointSize = 60.0;
  }
`;
const fragmentString = `
  void main() {
    gl_FragColor = vec4(0,0,1.0,1.0);
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
  const clientWidth = webglDiv.clientWidth;
  const clientHeight = webglDiv.clientHeight;
  webgl = webglDiv.getContext("webgl");
  webgl.viewport(0, 0, clientWidth, clientHeight);
  mat4.ortho(0, clientWidth, clientHeight, 0, -1, 1, projMat4);
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
  const aPosition = webgl.getAttribLocation(webgl.program, "a_position");
  const arr = [
    [100.0, 100.0, 0, 1],
    [200.0, 200.0, 0, 1],
    [300.0, 200.0, 0, 1],
    [400.0, 600.0, 0, 1],
    [500.0, 700.0, 0, 1],
  ];
  const arrIndex = [
    [0, 1, 2],
    [0, 3, 4],
    [0, 2, 4],
  ];

  const pointPosition = new Float32Array(arr.flat());

  // 创建缓冲区对象
  const lineBuffer = webgl.createBuffer();
  // 绑定缓冲区对象
  webgl.bindBuffer(webgl.ARRAY_BUFFER, lineBuffer);
  // 顶点数组data数据传入缓冲区
  webgl.bufferData(webgl.ARRAY_BUFFER, pointPosition, webgl.STATIC_DRAW);
  // 允许数据传递
  webgl.enableVertexAttribArray(aPosition);
  // 缓冲区数据按照一定的规律传递给位置变量aPosition
  webgl.vertexAttribPointer(aPosition, 4, webgl.FLOAT, false, 4 * 4, 0 * 4);

  const indexArr = new Uint16Array(arrIndex.flat());
  // 创建缓冲区对象
  const indexBuffer = webgl.createBuffer();
  // 绑定缓冲区对象
  webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  // 索引数组indexes传入缓冲区
  webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, indexArr, webgl.STATIC_DRAW);
  const uniformProj = webgl.getUniformLocation(webgl.program, "proj");
  webgl.uniformMatrix4fv(uniformProj, false, projMat4);
}

/**
 * webgl绘制函数
 */
function draw() {
  webgl.clearColor(0.0, 0.0, 0.0, 1);
  webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
  // webgl.drawArrays(webgl.TRIANGLES, 0, 3);
  webgl.drawElements(webgl.TRIANGLES, 9, webgl.UNSIGNED_SHORT, 0);
}
