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
    com: ""
  },
  onShow: function (param) {
    this.setData({
      com: app.Session.get().user.com
    })
  },
  add(e) {
    if (this.data.submitting) {
      return;
    }

    var name = e.detail.value.name;
    if (name.length == 0) {
      utils.showModel('错误', '不能为空!');
      return
    }
    if (name.length > 25) {
      utils.showModel('错误', '不能超过25个字!');
      return
    }
    this.setData({
      submitting: true
    })
    var that = this;
    app.admx.request({
      url: app.config.service.apiUrlBase + '/myinfo/chgcom',
      data: {
        com: name
      },
      method: 'POST',
      succ: function (res) {
        var session = app.Session.get();
        session.user.com = name;
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
