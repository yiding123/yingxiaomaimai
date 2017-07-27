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
    tag : ""
  },
  onShow: function (param) {
    console.log(app.Session.get().user.tag);
    this.setData({
      tag: app.Session.get().user.tag
    })
  },
  add(e) {
    if (this.data.submitting) {
      return;
    }

    var name = e.detail.value.name;
    if (name.length == 0) {
      utils.showModel('错误', '昵称不能为空!');
      return
    }
    if (name.length > 50) {
      utils.showModel('错误', '昵称不能超过50个字!');
      return
    }
    this.setData({
      submitting: true
    })
    var that = this;
    app.admx.request({
      url: app.config.service.apiUrlBase + '/myinfo/chgtag',
      data: {
        tag: name
      },
      method: 'POST',
      succ: function (res) {
        var session = app.Session.get();
        session.user.tag = name;
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
