const app = getApp();
const util = require('../../utils/util.js');
var udp = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    width: 0,
    platform: "ios",
    pixelRatio: 1,
    color: "rgba(255, 255, 255, 1)",
    currentHue: 360,
    currentSaturation: 100,
    currentLuminance: 100,
    currentSaturationText: 100,
    currentLuminanceText: 100,
  },
  // 初始化色彩
  initColor: function () {
    const self = this;
    var h = 0, s = 100, v = 100, t = 0, b = 100;
    var rgb = util.hsvToRgb(h / 360, s / 100, 1);
    self.setData({
      currentHue: h,
      currentSaturation: s,
      currentLuminance: v,
      currentSaturationText: s,
      currentLuminanceText: v,
      color: "rgba(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ", " + (v / 100) + ")"
    });
  },
  // 获取点击色盘位置的颜色
  getColor(event) {
    util.getColor(this, event);
  },
  // 拖动过程中修改亮度
  editDeviceL: function (e) {
    const self = this;
    setTimeout(function () {
      self.changeDeviceL(e);
      self.setDeviceStatus();
    }, 200)
  },
  // 拖动结束修改亮度
  changeDeviceL(e) {
    this.setData({
      currentLuminanceText: e.detail.value
    })
    this.setBgColor(this.data.currentHue, this.data.currentSaturationText, 100, e.detail.value);
  },
  // 拖动过程中修改饱和度
  editDeviceS: function (e) {
    const self = this;
    setTimeout(function () {
      self.changeDeviceS(e);
      self.setDeviceStatus();
    }, 200)
  },
  // 拖动结束修改饱和度
  changeDeviceS(e) {
    this.setData({
      currentSaturationText: e.detail.value
    })
    this.setBgColor(this.data.currentHue, e.detail.value, 100, this.data.currentLuminanceText);
  },
  // 修改设备的色彩状态
  setDeviceStatus: function () {
    const self = this;
    var rgb = util.hsvToRgb(this.data.currentHue / 360, this.data.currentSaturationText / 100, this.data.currentLuminanceText / 100);
    setTimeout(function () {
      self.postData({ led: { red: rgb[0], green: rgb[1], blue: rgb[2] } });
    })
  },
  // 设置中间小圆圈的背景色
  setBgColor: function (h, s, b, p) {
    h = h / 360;
    s = s / 100;
    b = b / 100;
    var rgb = util.hsvToRgb(h, s, b);
    this.setData({
      color: "rgba(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ", " + p / 100 + ")",
    })
  },
  // 创建udp实例
  createUdp() {
    udp = wx.createUDPSocket()
    udp.bind()
  },
  // udp广播发送数据
  postData: function (data) {
    var timeout = 0
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        udp.send({
          address: '255.255.255.255', //广播地址
          port: 3333, //小夜灯端口号
          message: JSON.stringify(data)
        })
      }, timeout)
      timeout += 200;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this;
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          width: res.windowWidth,
          height: res.windowHeight,
          pixelRatio: res.pixelRatio,
          platform: res.platform,
        })
      },
    })
    setTimeout(function () {
      self.createUdp();
      self.initColor();
    }, 100);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const self = this;
    setTimeout(function () {
      util.createCanvas(self);
    }, 800)
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
    wx.reLaunch({
      url: 'pages/index/index'
    })

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
  onShareAppMessage: function (res) {
    return {
      title: '小夜灯',
      path: '/pages/index/index'
    }
  },
})
