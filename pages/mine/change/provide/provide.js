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
    submitting: false,
    support: ""
  },
  onShow: function (param) {
    this.setData({
      support: app.Session.get().user.support
    })
  },
  add(e) {
    if (this.data.submitting) {
      return;
    }

    var support = e.detail.value.support;
    if (support.length == 0) {
      utils.showModel('错误', '不能为空!');
      return
    }
    if (support.length > 150) {
      utils.showModel('错误', '不能超过150个字!');
      return
    }
    this.setData({
      submitting: true
    })
    var that = this;
    var userId = wx.getStorageSync('userId');
    app.admx.request({
      url: app.config.service.apiUrlBase + '/myinfo/chgsupport',
      data: {
        userid: userId,
        support: support
      },
      method: 'POST',
      succ: function (res) {
        var session = app.Session.get();
        session.user.support = support;
        app.Session.set(session);
        utils.showSuccess('修改成功');
        setTimeout(function () {
          wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
          })
        }, 1000);

      },
      complete: function (res) {
        that.setData({
          submitting: false
        })
      }
    })
  }

});
