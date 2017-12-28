var canvas = document.getElementById('canvas')
autoSetCanvasSize()

var context = canvas.getContext('2d')
var using = false // 设置画板使用开关
var lastPoint = { // 坐标
  x: undefined,
  y: undefined
}

canvas.onmousedown = function(e) {
  var x = e.clientX
  var y = e.clientY
  using = true
  if (eraserEnable) {
    context.clearRect(x, y, 5, 5)
  } else { // 更新坐标
    lastPoint = {
      "x": x,
      "y": y
    }
  }
}
canvas.onmousemove = function(e) {
  var x = e.clientX
  var y = e.clientY
  if (!using) { return }
  if (eraserEnable) {
    context.clearRect(x - 5, y - 5, 10, 10)
  } else {
    drawLine(lastPoint.x, lastPoint.y, x, y)
    lastPoint.x = x // 更新坐标
    lastPoint.y = y
  }
}
canvas.onmouseup = function() {
  using = false
}
// 橡皮擦
var eraserEnable = false
var eraser = document.getElementById('eraser')
eraser.onclick = function() {
  eraserEnable = !eraserEnable
}

/******工具函数******/

// 画线条
function drawLine(lastX, lastY, newX, newY) {
  context.beginPath() // 新建路径
  context.moveTo(lastX, lastY) // 设置起始位置
  context.lineWidth = 2 // 设置线条宽度
  context.strokeStyle = 'black' // 设置线条颜色
  context.lineTo(newX, newY) // 绘制线条至new x，y坐标
  context.stroke() // 绘制线条
  context.closePath() // 闭合路径
}

// 默认设置canvas宽高
function autoSetCanvasSize() {
  // 获取页面宽高
  var pageWith = document.documentElement.clientWidth
  var pageHeight = document.documentElement.clientHeight
  // 设置宽高，这时候设置的是 <canvas> 的属性值，而不是样式里的宽高
  canvas.width = pageWith
  canvas.height = pageHeight
}