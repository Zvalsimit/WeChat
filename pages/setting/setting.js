// pages/setting/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgChoose:true,
    bgChoosed:false,
    time:"12:01",
    height:""
  },
  //背景选择
  chooseBg:function(e){
    
    var i = e.currentTarget.dataset.index;
    console.log(i)
    if(i == 1){
      this.setData({
        bgChoose: true,
        bgChoosed: false
      })
    }else if(i == 2){
      this.setData({
        bgChoose: false,
        bgChoosed: true
      })
    }
  },
  //设置时间
  sliderChange:function(e){
    console.log(e.detail.value)
  },
  //设置起始时间
  bindTimeChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    //读取设备的高度
    wx.getSystemInfo({
      success(res) {
        console.log(res.windowHeight)
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