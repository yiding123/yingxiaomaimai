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
    submitting: false
  },
  onLoad: function (param) {
    this.setData({
      resource: param.id
    })
  },
  add(e) {
    if (this.data.submitting) {
      return;
    }

    var name = e.detail.value.name;
    if (name.length == 0) {
      utils.showModel('错误', '分组名不能为空!');
      return
    }
    if (name.length > 8) {
      utils.showModel('错误', '分组名不能超过5个字!');
      return
    }
    this.setData({
      submitting: true
    })
    var that = this;
    var userId = wx.getStorageSync('userId');
    app.admx.request({
      url: app.config.service.apiUrlBase + '/group/add',
      data: {
        user: userId,
        name: name
      },
      method: 'POST',
      succ: function (res) {
        app.globalData.newgroup = {
          groupname: name,
          id: res.primarykey,
          selected: 0
        };
        console.log(res);
        utils.showSuccess('操作成功');
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
