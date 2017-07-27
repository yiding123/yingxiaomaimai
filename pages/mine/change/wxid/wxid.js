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
    wxid : ""
  },
  onShow: function (param) {
    this.setData({
      wxid: app.Session.get().user.wxid
    })
  },
  add(e) {
    if (this.data.submitting) {
      return;
    }

    var wxid = e.detail.value.wxid;
    if (wxid.length == 0) {
      utils.showModel('错误', '微信号不能为空!');
      return
    }
    if (wxid.length > 20) {
      utils.showModel('错误', '微信号不能超过20个字!');
      return
    }
    this.setData({
      submitting: true
    })
    var that = this;
    app.admx.request({
      url: app.config.service.apiUrlBase + '/myinfo/chgwxid',
      data: {
        wxid: wxid
      },
      method: 'POST',
      succ: function (res) {
        var session = app.Session.get();
        session.user.wxid = wxid;
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
