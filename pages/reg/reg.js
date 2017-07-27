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
    userinfo: {},
    openid: "",
    submitting: false,
    sexRange: ['男', '女'],
    selectedSexIndex: 0,
    dateValue: ""
  },
  onLoad: function (param) {

  },
  onShow: function () {
    var wxUser = app.Session.get().userInfo;
    console.log(wxUser);
    this.setData({
      userinfo: wxUser,
    });
    if (wxUser.gender){
      this.setData({
        selectedSexIndex: wxUser.gender-1
      });
    }
  },
  doRequest: function (e) {
    var that = this;
    if (that.data.submitting) {
      return;
    }
    var data = e.detail.value;
    console.log(data)
    if (data.name.length == 0) {
      utils.showModel('错误', '姓名不能为空');
      return;
    }
    if (data.wxid.length == 0) {
      utils.showModel('错误', '微信号不能为空');
      return;
    }
    if (data.tag.length == 0) {
      utils.showModel('错误', '请输入个人属性标签');
      return;
    }
    data.sex = this.data.sexRange[this.data.selectedSexIndex];
    data.birthday = this.data.dateValue;
    if (data.sex.length == 0) {
      utils.showModel('错误', '请输入性别');
      return;
    }
    if (data.birthday.length == 0) {
      utils.showModel('错误', '请输入出生日期');
      return;
    }
    that.setData({
      submit: true
    })
    utils.showLoading("保存中");
    var that = this;
    app.admx.request({
      url: app.config.service.apiUrlBase + '/completeAcc',
      data: data,
      method: 'POST',
      succ: function (res) {
        utils.showSuccess("保存成功");
        console.log(res);
        if (res.effect) {
          var session = app.Session.get();
          session.user.wxid = data.wxid;
          session.user.nickName = data.name;
          session.user.sex = data.sex;
          session.user.birthday = data.b;
          session.user.tag = data.tag;
          session.user.avatarUrl = data.avatarUrl;
          app.Session.set(session);
          wx.switchTab({
            url: '../index/index'
          })
        }
      },
      complete: function () {
        wx.hideLoading();
        that.setData({
          submit: false
        })
      }
    });
  },



  sexPickerBindchange: function (e) {
    this.setData({
      selectedSexIndex: e.detail.value
    })
  },
  //修改出生日期
  datePickerBindchange: function (e) {
    this.setData({
      dateValue: e.detail.value
    })
  }
})