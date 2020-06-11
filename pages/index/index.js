//index.js
//获取应用实例
const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {

  },
  //事件处理函数
  bindViewBlue: function () {
    wx.closeBluetoothAdapter()
    wx.openBluetoothAdapter({
      success(res) {
        console.log(res)
        wx.startBluetoothDevicesDiscovery({
          success: function (res) {
            wx.navigateTo({
              url: '/pages/blueDevices/blueDevices',
            })
          }
        })
      },
      fail(res) {
        util.showToast("Please turn on the system Bluetooth");
      }
    })
  },
  bindViewWifi: function () {
    wx.navigateTo({
      url: '/pages/operate/operate',
    })
  },
  onLoad: function (option) {
    if (option.next == 'operate') {
      this.bindViewWifi();
    }
    wx.getSystemInfo({
      success(res) {
        app.data.system = res.platform
      }
    })
  },
  //分享
  onShareAppMessage: function (res) {
    return {
      title: 'ESP Moonlight',
      path: '/pages/index/index'
    }
  },

})
