
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
    btnLoading: false,
    btnDisable: false
  },
  submit(e) {
    var that = this;
    if (this.data.btnLoading) {
      return;
    }
    var reason = e.detail.value.reason;
    var phone = e.detail.value.phone;
    if (reason.length == 0) {
      wx.showModal({
        content: "推荐理由不能为空",
        showCancel: false
      });
      return;
    }
    if (phone.length == 0) {
      wx.showModal({
        content: "联系电话不能为空",
        showCancel: false
      });
      return;
    }
    this.setData({
      btnLoading: true,
    });
    app.admx.request({
      url: app.config.service.apiUrlBase + '/recommend/add',
      data: {
        phone: phone,
        reason: reason
      },
      method: 'POST',
      succ: function (res) {
        utils.showSuccess('提交成功');
        setTimeout(function () {
          wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
            success: function (res) {
            }
          })
        }, 1000)
      },
      fail: function (res) {

      },
      complete: function () {
        that.setData({
          btnLoading: false,
        })
      }
    })
  }
});
