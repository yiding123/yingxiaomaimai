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
    need: ""
  },
  onShow: function (param) {
    this.setData({
      need: app.Session.get().user.need
    })
  },
  add(e) {
    if (this.data.submitting) {
      return;
    }

    var need = e.detail.value.need;
    if (need.length == 0) {
      utils.showModel('错误', '不能为空!');
      return
    }
    if (need.length > 150) {
      utils.showModel('错误', '不能超过150个字!');
      return
    }
    this.setData({
      submitting: true
    })
    var that = this;
    app.admx.request({
      url: app.config.service.apiUrlBase + '/myinfo/chgneed',
      data: {
        need: need
      },
      method: 'POST',
      succ: function (res) {
        var session = app.Session.get();
        session.user.need = need;
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
