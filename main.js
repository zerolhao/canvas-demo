/*** 1.一些数据的初始化，方便省事就不扔函数了****/
var canvas = document.getElementById('canvas')
var context = canvas.getContext('2d')

autoSetCanvasSize() // 设置默认canvas宽高
autoSetCanvasBgC() // 设置默认背景颜色
setPenColor("black") // 设置默认画笔颜色
setLineWidth(2) // 设置默认画笔粗细

var using = false // 设置画板使用开关
var lastPoint = { // 坐标
  x: undefined,
  y: undefined
}
var eraserEnable = false  // 橡皮擦开关

// 2.监听用户动作
listenUser()
// 3.所有工具
allTolls()


/******工具函数******/

// 设置默认canvas宽高
function autoSetCanvasSize() {
  // 获取页面宽高
  var pageWith = document.documentElement.clientWidth
  var pageHeight = document.documentElement.clientHeight
  // 设置宽高，这时候设置的是 <canvas> 的属性值，而不是样式里的宽高
  canvas.width = pageWith
  canvas.height = pageHeight
}

// 设置默认背景颜色
function autoSetCanvasBgC() {
  context.fillStyle = "white" // 设置填充颜色
  context.fillRect(0, 0, canvas.width, canvas.height) // 填充整个canvas
}

// 画线条
function drawLine(lastX, lastY, newX, newY) {
  context.beginPath() // 新建路径
  context.moveTo(lastX, lastY) // 设置起始位置
  //  context.lineWidth = 2 // 设置线条宽度
  //  context.strokeStyle = 'black' // 设置线条颜色
  context.lineTo(newX, newY) // 绘制线条至new x，y坐标
  context.stroke() // 绘制线条
  context.closePath() // 闭合路径
}
// 设置画笔粗细
function setLineWidth(width) {
  context.lineWidth = width
}
// 设置颜色
function setPenColor(color) {
  context.strokeStyle = color
}
// 关闭颜色设置
function closeColorList() {
  if (colorList.className !== "colorList") {
    colorList.classList.remove("active")
  }
}
// 颜色列表-设置当前画笔颜色及显示
function changeColor(e) {
  var color = this.id.toString()
  setPenColor(color) // 设置画笔颜色
  activeColor.style.backgroundColor = color // 同时更改显示的颜色
  closeColorList() // 关闭颜色列表
  e.stopPropagation() // 停止事件冒泡
}

/*****下面是一些整段整段扔进函数的代码，如果想要复原直接将内部代码放到上面对应函数部位即可******/

// 监听用户操作
function listenUser() {
  // 特性检测，此检测是否支持触屏
  if (document.body.ontouchstart !== undefined) {
    // 触屏设备
    canvas.ontouchstart = function(e) {
      var x = e.touches[0].clientX
      var y = e.touches[0].clientY
      using = true
      if (eraserEnable) {
        context.fillRect(x, y, 5, 5)
      } else { // 更新坐标
        lastPoint = {
          "x": x,
          "y": y
        }
      }
    }
    canvas.ontouchmove = function(e) {
      var x = e.touches[0].clientX
      var y = e.touches[0].clientY
      if (!using) { return }
      if (eraserEnable) {
        context.fillRect(x - 5, y - 5, 10, 10)
      } else {
        drawLine(lastPoint.x, lastPoint.y, x, y)
        lastPoint.x = x // 更新坐标
        lastPoint.y = y
      }
    }
    canvas.ontouchend = function(e) {
      using = false
    }
  } else {
    // 非触屏设备
    canvas.onmousedown = function(e) {
      var x = e.clientX
      var y = e.clientY
      using = true
      if (eraserEnable) {
        context.fillRect(x, y, 5, 5)
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
        context.fillRect(x - 5, y - 5, 10, 10)
      } else {
        drawLine(lastPoint.x, lastPoint.y, x, y)
        lastPoint.x = x // 更新坐标
        lastPoint.y = y
      }
    }
    canvas.onmouseup = function() {
      using = false
    }
  }
}

// 所有工具
function allTolls() {
  // 橡皮擦
  var eraser = document.getElementById('eraser')
  eraser.onclick = function() {
    eraserEnable = true
    this.classList.add('active')
    pen.classList.remove('active')

    closeColorList()
  }
  // 画笔
  var pen = document.getElementById('pen')
  pen.onclick = function() {
    eraserEnable = false
    this.classList.add('active')
    eraser.classList.remove('active')

    closeColorList()
  }

  // 画笔颜色列表
  var colorList = document.getElementById('colorList') // 颜色列表
  colorList.onclick = function() {
    this.classList.add('active')
  }
  var activeColor = document.getElementById('activeColor') // 当前画笔颜色
  var red = document.getElementById('red')
  var green = document.getElementById('green')
  var blue = document.getElementById('blue')
  var black = document.getElementById('black')
  red.addEventListener('click', changeColor) // 更改画笔颜色及显示
  green.addEventListener('click', changeColor)
  blue.addEventListener('click', changeColor)
  black.addEventListener('click', changeColor)

  canvas.addEventListener('click', closeColorList) // 点击canvas也可以关闭颜色列表

  // 画笔粗细
  var lineWidth = document.getElementById('lineWidth')
  lineWidth.onclick = function() {
    var width = prompt("请输入画笔大小（1~9,比如：2）")
    if(width <= 9 && width >= 1){
      setLineWidth(width)
    }else{
      return
    }

    closeColorList()
  }
  // 清空canvas
  var clear = document.getElementById('clear')
  clear.onclick = function() {
    /*  BUG:  由于 canvas 实际上并没有背景色，是透明的，css中的背景色并不会在图片中得到展现
     *  而 clearRect(x, y, width, height) 清除指定矩形区域，让清除部分完全透明，
     *  所以实际上用这个 api 来模拟橡皮擦会导致最后 保存的图片中出现 黑的的方块，那其实是橡皮擦
     *  所以这里橡皮擦和初始化背景色全部使用了 fillRect() api，也因此限定了背景色和橡皮擦都为白色
     *  fillStyle 已经在 autoSetCanvasBgC() 函数中设定，并随着一开始的初始化使得橡皮擦也变成白色
    */
    context.fillRect(0, 0, canvas.width, canvas.height)
    autoSetCanvasBgC() // 设置默认背景颜色，清空操作会将之前设置的背景色也清掉

    closeColorList()
  }

  // 将图画下载
  var download = document.getElementById('download')
  download.onclick = function() {
    var url = canvas.toDataURL()
    var a = document.createElement('a')
    a.href = url
    a.download = "name.jpg"
    a.click()

    closeColorList()
  }
}