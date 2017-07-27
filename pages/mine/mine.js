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
    user: {},
    tag: [],
    method: "",
    sexRange: ['男', '女'],
    selectedSexIndex: 0,
    dateValue: null,
    submit: true
  },

  onShow: function (param) {
    var that = this;
    console.log("--onshow");
    var userinfo = app.Session.get().user;
    that.setData({
      user: userinfo,
    });
    console.log(userinfo);
    that.setData({
      selectedSexIndex: that.data.sexRange.indexOf(userinfo.sex),
      dateValue: userinfo.birthday,
      tag: userinfo.tag.split(" ")
    });
    console.log("sex:" + userinfo.sex);
    console.log("selectedSexIndex:" + that.data.selectedSexIndex);
  },

  mylocation: function () {
    var userId = wx.getStorageSync('userId');
    wx.navigateTo({
      url: '../mylocation/mylocation?id=' + userId
    })
  },

  provide: function () {
    var userId = wx.getStorageSync('userId');
    wx.navigateTo({
      url: '../provide/provide?id=' + userId
    })
  },

  need: function () {
    var userId = wx.getStorageSync('userId');
    wx.navigateTo({
      url: '../need/need?id=' + userId
    })
  },

  cooperation: function () {
    var userId = wx.getStorageSync('userId');
    wx.navigateTo({
      url: '../cooperation/cooperation?id=' + userId
    })
  },
  //修改昵称
  changeNickName: function () {
    wx.navigateTo({
      url: 'change/chgnickname/chgnickname'
    })
  },

  //修改微信号
  changeWxid: function () {
    wx.navigateTo({
      url: 'change/wxid/wxid'
    })
  },

  company: function () {
    var userId = wx.getStorageSync('userId');
    wx.navigateTo({
      url: '../plusgroup/plusgroup?id=' + userId
    })
  },

  userinfo: function () {
    var userId = wx.getStorageSync('userId');
    wx.navigateTo({
      url: '../userinfo/userinfo?id=' + userId
    })
  },

  sexPickerBindchange: function (e) {
    var that = this;
    var userId = wx.getStorageSync('userId');
    var sex = that.data.sexRange[e.detail.value];
    app.admx.request({
      url: app.config.service.apiUrlBase + '/myinfo/chgsex',
      data: {
        userid: userId,
        sex: sex
      },
      method: 'POST',
      succ: function (res) {
        //utils.showSuccess("修改成功");
        var userinfo = app.userinfoUtil.get();
        userinfo.sex = sex;
        app.userinfoUtil.set(userinfo);
        that.setData({
          selectedSexIndex: e.detail.value
        })
      }
    });
  },
  //修改出生日期
  datePickerBindchange: function (e) {
    var that = this;
    var userId = wx.getStorageSync('userId');
    app.admx.request({
      url: app.config.service.apiUrlBase + '/myinfo/chgbirthday',
      data: {
        userid: userId,
        birthday: e.detail.value
      },
      method: 'POST',
      succ: function (res) {
        //utils.showSuccess("修改成功");
        var userinfo = app.userinfoUtil.get();
        userinfo.birthday = e.detail.value;
        app.userinfoUtil.set(userinfo);
        that.setData({
          dateValue: e.detail.value
        })
      }
    });
  },
  //分享我的名称
  onShareAppMessage: function () {
    var _title = "我的名片";
    return {
      title: _title,
      success: function (res) {
        console.log("---分享成功");
      },
      fail: function (res) {
        console.log("---分享失败");
      }
    }
  },
  //点击分享按扭时
  share: function () {
    console.log("---share");
    if (wx.showShareMenu) {
      console.log("--show share menu");
      wx.showShareMenu({
        withShareTicket: true
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  }


});
