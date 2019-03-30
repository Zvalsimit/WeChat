// pages/setting/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgChoose: true,
    bgChoosed: false,
    startTime: "8:00",
    sliderValue: 6,
    height: "",
    switchChecked: false,
    isShow: false
  },
  //背景选择
  chooseBg:function(e){
    var i = e.currentTarget.dataset.index;
    if(i == 0){
      this.setData({
        bgChoose: true,
        bgChoosed: false
      })
    }else if(i == 1){
      this.setData({
        bgChoose: false,
        bgChoosed: true
      })
    }
    wx.setStorageSync("bgChoose", e.currentTarget.dataset.index)
  },
  //设置时间
  sliderChange:function(e){
    wx.setStorageSync("num", e.detail.value)
  },
  //设置起始时间
  bindTimeChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      startTime: e.detail.value
    })
    wx.setStorageSync("startTime", this.data.startTime)
  },
  // //计时方式
  //   //手动计时
  // switchChange:function(e){
  //   if (e.detail.value == true){
  //     this.setData({
  //       isShow: false
  //     })
  //   }else{
  //     this.setData({
  //       isShow: true
  //     })
  //   }
  //   console.log(e.detail.value)
  //   wx.setStorageSync("switch_manual", e.detail.value)
  // },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    //读取设备的高度
    wx.getSystemInfo({
      success(res) {
        _this.setData({
          height: res.windowHeight
        })
      }
    })
    
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
    var bg = wx.getStorageSync('bgChoose');
    if (bg == 0) {
      this.setData({
        bgChoose: true,
        bgChoosed: false
      })
    } else if (bg == 1) {
      this.setData({
        bgChoose: false,
        bgChoosed: true
      })
    }
    //手动计时
    // var switch_manual = wx.getStorageSync('switch_manual');
    // if (switch_manual){
    //   this.setData({
    //     switchChecked: switch_manual,
    //     isShow: !switch_manual,     
    //   })
    // }else{
    //   this.setData({
    //     isShow: true,
    //     startTime: wx.getStorageSync("startTime") || '8:00'
    //   })
    // }
    this.setData({
      startTime: wx.getStorageSync("startTime") || '8:00',
      sliderValue: wx.getStorageSync('num') || this.data.sliderValue
    })
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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