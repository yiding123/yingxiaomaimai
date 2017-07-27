var app = getApp();
var utils = app.admx.utils;

/**
 * 使用 Page 初始化页面，具体可参考微信公众平台上的文档
 */
Page({

  /**
   * 初始数据
   */
  data: {
    groups: [],
    resource: 0,
    selected: true,
    height: 700,
    scroll_height: 600
  },
  onReady: function () {

  },
  onLoad: function (param) {
    console.log('group onload')
    console.log("windowHeight:" + app.globalData.systemInfo.windowHeight);
    console.log(app.globalData.systemInfo.windowHeight)
    if (app.globalData.systemInfo.windowHeight) {
      this.setData({
        height: app.globalData.systemInfo.windowHeight,
        scroll_height: app.globalData.systemInfo.windowHeight - 85
      })
    }
    var that = this;
    var userId = wx.getStorageSync('userId');
    that.setData({
      resource: param.id
    })
  },
  onShow: function () {
    var that = this;
    app.admx.request({
      url: app.config.service.apiUrlBase + '/group',
      succ: function (res) {
        that.setData({
          groups: res.list
        })
      }
    })
  },
  select: function (e) {
    if (!this.data.selected)
      return;
    this.setData({
      selected: false
    })
    var that = this;
    console.log(e.target);
    var userId = wx.getStorageSync('userId');
    console.log(userId)
    wx.showLoading({
      title: '加载中'
    });
    app.admx.request({
      url: app.config.service.apiUrlBase + '/contact/add',
      method: 'POST',
      data: {
        group: e.target.id,
        resource: that.data.resource
      },
      succ: function (res) {
        wx.showToast({
          title: '成功收藏为人脉',
          icon: 'success',
          duration: 2000
        })
        //刷新好友页面
        app.refreshCofing.contacts = true;
        setTimeout(function () {
          wx.switchTab({
            url: '../index/index'
          })
        }, 1000)
      }
    })
  },
  add:function() {
    var that = this;
    wx.navigateTo({
      url: '../plusgroup/plusgroup?id=' + that.data.resource
    })
  },

});
