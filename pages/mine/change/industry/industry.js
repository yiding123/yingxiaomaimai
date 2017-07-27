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
    industry: "",
    industries: [
      "艺术", "教育", "工程", "学术", "医疗", "政府部门", "事业单位", "科研院所", "IT", "互联网", "媒体", "餐饮", "金融", "法律", "制造业", "农牧渔", "军事", "其它"
    ]
  },
  onShow: function (param) {
    this.setData({
      industry: app.Session.get().user.industry
    })
  },
  changeIndustry:function(e) {
    
    if (this.data.submitting) {
      return;
    }

    var industry = e.currentTarget.id;
    if (industry.length == 0) {
      utils.showModel('错误', '不能为空!');
      return
    }
    if (industry.length > 150) {
      utils.showModel('错误', '不能超过150个字!');
      return
    }
    this.setData({
      submitting: true
    })
    var that = this;
    app.admx.request({
      url: app.config.service.apiUrlBase + '/myinfo/chgindustry',
      data: {
        industry: industry
      },
      method: 'POST',
      succ: function (res) {
        var session = app.Session.get();
        session.user.industry = industry;
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
    });
  }

});
