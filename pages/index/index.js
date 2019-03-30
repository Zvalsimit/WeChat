//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    num: 0,
    height: "",
    bg: "#000",
    isShow: false,
    pauseIsShow: true,
    width: "",
    setInter: "",
    normalClock: false,
    runTime: 0,
    index: 0,
    color: [{
      bg: "#000",
      active: '#EE7A73',
      empty: '#232830',
      color: '#dddddd'
    }, {
      bg: "#f0a2a0",
      active: '#CC6D67',
      empty: '#F4DCDC',
      color: '#ffffff'
    }],
    isIKonw: false
  },
  //开始、暂停、重置
  pauseBtn:function(e){
    this.setData({
      pauseIsShow: !this.data.pauseIsShow
    })
    var i = e.currentTarget.dataset.index
    this.setData({
      runTime: this.data.runTime || 0
    })
    if(i == 2){//暂停
      if (this.data.setInter) clearInterval(this.data.setInter)
    } else if(i == 1){//开始
      
      if (this.data.setInter) clearInterval(this.data.setInter)
      this.data.setInter = setInterval(this.drawPolygon, 1000)
    }
  },
  //重置按钮
  reset: function () {
    if (this.data.setInter)
    clearInterval(this.data.setInter)
    this.setData({
      runTime: 0,
      pauseIsShow: true
    }, this.drawPolygon)
  },
  //单位换算
  ratioRPX : function (width) {
    return width <= 320 && 0.426 ||
      width <= 360 && 0.48 ||
      width <= 375 && 0.5 ||
      width <= 395 && 0.526 ||
      0.552
  },
  //获取当前时间
  getTime:function(){
    let now = new Date();
    let currentH = now.getHours();
    let currentM = now.getMinutes();
    let currentS = now.getSeconds();
    return [currentH, currentM, currentS]
  },
  //获取与当前时间差值
  getDiffTime (time) {
    let current = this.getTime();
    if (time)
    return current.reduce((total, num) => {
      return total * 60 + num;
    }) - time.reduce((total, num) => {
      return total * 60 + num;
    })
    else
      return 0
  },
  //转换角度
  computeDeg:function(h, m, s){
    let time = {}
    if(h || m ||s){
      let sDeg = s / 60 * 360 % 360
      let mDeg = (m * 60 + s) / 3600 * 360 % 360
      let hDeg = (h * 3600 + m * 60 + s) / (3600 * 12) * 360
      time = { sDeg: sDeg, mDeg: mDeg, hDeg: hDeg }
    } else{
      time = { sDeg: 0, mDeg: 0, hDeg: 0 }
    }
    return time
  },
  //自动计时
  automation:function(){
    // let startH, startM, currentH, currentM, currentS;
    // let startTime = wx.getStorageSync('startTime') || "8:00";
    // [currentH, currentM, currentS] = [this.getTime()[0], this.getTime()[1], this.getTime()[2]]
    // var timeArr = startTime.split(":");
    // [startH, startM] = [timeArr[0], timeArr[1]];
    // startH = parseInt(startH);
    // startM = parseInt(startM);
    // if (startH + this.data.num < currentH ||
    //   startH + this.data.num === currentH && startM <= currentM) {
    //   return this.computeDeg()
    // } else if (startH == currentH && startM > currentM ||
    //   startH > currentH) {
    //   return this.computeDeg()
    // } else {
    //   let diff = (currentH - startH) * 60 + (currentM - startM)
    //   let m = diff % 60

    //   return this.computeDeg((diff - m) / 60, m, currentS)
    // }
    let startH, startM, currentH, currentM, currentS, diffM;
    let startTime = wx.getStorageSync('startTime') || "8:00";
    [currentH, currentM, currentS] = [this.getTime()[0], this.getTime()[1], this.getTime()[2]]
    var timeArr = startTime.split(":");
    [startH, startM] = [timeArr[0], timeArr[1]];
    startH = parseInt(startH);
    startM = parseInt(startM);
    diffM = startH + this.data.num < 24 && (currentH - startH) * 60 + currentM - startM ||
      startH + this.data.num >= 24 && currentH >= startH && (currentH - startH) * 60 + currentM - startM ||
      startH + this.data.num > 24 && currentH <= (startH + this.data.num) % 24 && (currentH + 24 - startH) * 60 + currentM - startM || 0
    if (diffM > 0 && diffM / 60 < this.data.num) {
      let m = diffM % 60
      return this.computeDeg((diffM - m) / 60, m, currentS)
    } else {
      return this.computeDeg()
    }
  },
  //手动计时
  control:function(){
    if (this.data.runTime >= 0 && this.data.runTime < this.data.num * 3600) {      
      return this.computeDeg(0, 0, !this.data.pauseIsShow && this.data.runTime++ || this.data.runTime)
    } else if (this.data.runTime > this.data.num * 3600) {
      this.setData({
        runTime: 0
      })
      clearInterval(this.data.setInter)
      return this.computeDeg()
    } else {
      return this.computeDeg()
    }
  },
  //时间转换角度
  pointer() {
    if (!this.data.normalClock) {
      return this.automation()
    } else {
      let time = this.getTime()
      return this.computeDeg(time[0], time[1], time[2])
    }
    // if (this.data.switch_manual && !this.data.normalClock) {
    //   return this.control()
    // } else if (!this.data.normalClock) {      
    //   return this.automation()
    // } else {
    //   let time = this.getTime()
    //   return this.computeDeg(time[0], time[1], time[2])
    // }
  },
  //canvas多边形
  drawPolygon:function(){
    //
    var num = this.data.num;
    let lineWidth = num > 8 && 4 || 6
    var time = this.pointer();
    //单位换算
    var width = this.data.width;    
    var w = this.ratioRPX(width)
    const ctx = wx.createCanvasContext('clockCanvas');
    var r = 260 * w, x = 265 * w, y = 265 * w; 
    var rText = 230 * w, xText = 256 * w, yText = 275 * w;
    ctx.save()
    //钟表的中心
    ctx.beginPath();
    var rCenter = 10 * w
    ctx.arc(x, y, rCenter, -0.5 * Math.PI, 1.5 * Math.PI)
    ctx.setFillStyle('#fff')
    ctx.fill()

    //绘制分针
    ctx.lineWidth = '3';
    ctx.beginPath();
    ctx.translate(x, y)
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 120 * w)
    ctx.rotate((time.mDeg / 180 + 1) * Math.PI)
    ctx.setStrokeStyle(this.data.color[this.data.index].color)
    ctx.stroke();
    ctx.restore()
    //秒针
    ctx.save()
    ctx.lineWidth = '2';
    ctx.beginPath();
    ctx.translate(x, y)
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 130 * w)
    ctx.rotate((time.sDeg / 180 + 1) * Math.PI)
    ctx.setStrokeStyle('#ffffff')
    ctx.stroke();
    ctx.restore()
    ctx.setFontSize(14)
    ctx.setFillStyle(this.data.color[this.data.index].color)
    ctx.beginPath();
    ctx.translate(0, 0)
    for (let i = 0; i < num; i++) {
      let newX = x + r * Math.sin(Math.PI * (1 - 2 * (i + 1) / num));
      let newY = y + r * Math.cos(Math.PI * (1 - 2 * (i + 1) / num));
      ctx.lineTo(newX, newY);
      //数字
      let newXText = xText + rText * Math.sin(Math.PI * (1 - 2 * i / num));
      let newYText = yText + rText * Math.cos(Math.PI * (1 - 2 * i / num));
      ctx.fillText(i, newXText, newYText)
    }
    ctx.setLineWidth(lineWidth)
    ctx.setStrokeStyle(this.data.color[this.data.index].empty)
    ctx.closePath();
    ctx.stroke();
    if(!this.data.normalClock){
      let hAmount = Math.floor(time.hDeg / 30)
      let hSurplus = time.hDeg*12/num % (360 / num)
      let hSurplusR = r * Math.cos(Math.PI / num) / Math.cos(Math.PI * (1/num - hSurplus / 180))
      ctx.beginPath();
      for (let i = 0; i < hAmount + 2; i++) {
        let newX;
        let newY;
        if (i < hAmount + 1) {
          newX = x + r * Math.sin(Math.PI * (1 - 2 * i / num));
          newY = y + r * Math.cos(Math.PI * (1 - 2 * i / num));
        } else{
          newX = x + hSurplusR * Math.sin(Math.PI * (1 - (360 / num * (i - 1) + hSurplus) / 180));
          newY = y + hSurplusR * Math.cos(Math.PI * (1 - (360 / num * (i - 1) + hSurplus) / 180));
        }
        ctx.lineTo(newX, newY);
      }
      ctx.setLineWidth(lineWidth)
      ctx.setStrokeStyle(this.data.color[this.data.index].active)
      ctx.stroke(); 
    }else{
      //绘制时针
      ctx.lineWidth = '4';
      ctx.beginPath();
      ctx.translate(x, y)
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 100 * w)
      ctx.rotate((time.hDeg / 180 + 1) * Math.PI)
      ctx.setStrokeStyle(this.data.color[this.data.index].color)
      ctx.stroke();
      ctx.closePath();
    }
    ctx.draw()
  },
  
  //正常时钟开关
  switchChange:function(e){
    this.setData({
      normalClock: !this.data.normalClock
    })
    this.changeStatus(true)
  },
  // 钟表状态处理
  changeStatus (base) {
    if (this.data.setInter) clearInterval(this.data.setInter)
    this.data.setInter = setInterval(this.drawPolygon, 1000)
    // if (!this.data.isShow || this.data.normalClock && !base) {
    //   this.data.setInter = setInterval(this.drawPolygon, 1000)
    // } else if (this.data.isShow && !this.data.pauseIsShow && !this.data.normalClock) {
    //   this.data.runTime = wx.getStorageSync('runTime') + this.getDiffTime(wx.getStorageSync('control'))
    //   this.data.setInter = setInterval(this.drawPolygon, 1000)
    // } else if (this.data.normalClock && this.data.isShow && base) {
    //   wx.setStorageSync('runTime', this.data.runTime)
    //   wx.setStorageSync('control', this.getTime())
    //   this.data.setInter = setInterval(this.drawPolygon, 1000)
    // } else if (this.data.isShow) this.drawPolygon()
  },
  //读取设备的高度
  setWidth () {
    wx.getSystemInfo({
      success: res => {
        this.setData({
          height: res.windowHeight,
          width: res.screenWidth
        })
      }
    })
  },
  iKonw(){
    var iKown = wx.setStorageSync("isIKonw", true)
    this.setData({
      isIKonw: false
    })
  },
  changeNum (e) {
    let i = parseInt(e.currentTarget.dataset.id)
    wx.setStorageSync('num', i)
    this.setData({
      num:  i
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setWidth()
    var iKown = wx.getStorageSync('isIKonw');
    if (!iKown) {
      this.setData({
        isIKonw: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //背景
    this.data.index = wx.getStorageSync('bgChoose') && parseInt(wx.getStorageSync('bgChoose')) || 0;
    this.setData({
      num: wx.getStorageSync('num') || 6,
      bg: this.data.color[this.data.index].bg
    })
    // //手动计时的时候出现的暂停计时 重置
    // var switch_manual = wx.getStorageSync('switch_manual');
    // this.setData({
    //   switch_manual: switch_manual,
    //   isShow: !!switch_manual
    // })
    this.changeStatus()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // if (this.data.isShow && !this.data.pauseIsShow && !this.data.normalClock) {
    //   wx.setStorageSync('runTime', this.data.runTime)
    //   wx.setStorageSync('control', this.getTime())
    //   clearInterval(this.data.setInter)
    // }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
