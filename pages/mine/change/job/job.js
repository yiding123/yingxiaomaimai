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
    job : ""
  },
  onShow: function (param) {
    this.setData({
      job: app.Session.get().user.job
    })
  },
  add(e) {
    if (this.data.submitting) {
      return;
    }

    var job = e.detail.value.job;
    if (job.length == 0) {
      utils.showModel('错误', '不能为空!');
      return
    }
    if (job.length > 20) {
      utils.showModel('错误', '不能超过20个字!');
      return
    }
    this.setData({
      submitting: true
    })
    var that = this;
    app.admx.request({
      url: app.config.service.apiUrlBase + '/myinfo/chgjob',
      data: {
        job: job
      },
      method: 'POST',
      succ: function (res) {
        var session = app.Session.get();
        session.user.job = job;
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
