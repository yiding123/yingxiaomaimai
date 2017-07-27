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
    phone : ""
  },
  onShow: function (param) {
    this.setData({
      phone: app.Session.get().user.phone
    })
  },
  add(e) {
    if (this.data.submitting) {
      return;
    }

    var phone = e.detail.value.phone;
    if (phone.length == 0) {
      utils.showModel('错误', '手机号不能为空!');
      return
    }
    if (phone.length > 11) {
      utils.showModel('错误', '手机号不正确');
      return
    }
    this.setData({
      submitting: true
    })
    var that = this;
    app.admx.request({
      url: app.config.service.apiUrlBase + '/myinfo/chgphone',
      data: {
        phone: phone
      },
      method: 'POST',
      succ: function (res) {
        var session = app.Session.get();
        session.user.phone = phone;
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
