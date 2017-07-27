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
    address: ""
  },
  onShow: function (param) {
    this.setData({
      address: app.Sessiono.get().user.address
    })
  },
  add(e) {
    if (this.data.submitting) {
      return;
    }

    var address = e.detail.value.address;
    if (address.length == 0) {
      utils.showModel('错误', '不能为空!');
      return
    }
    if (address.length > 20) {
      utils.showModel('错误', '不能超过20个字!');
      return
    }
    this.setData({
      submitting: true
    })
    var that = this;
    app.admx.request({
      url: app.config.service.apiUrlBase + '/myinfo/chgaddress',
      data: {
        address: address
      },
      method: 'POST',
      succ: function (res) {
        var session = app.Session.get();
        session.user.address = address;
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
