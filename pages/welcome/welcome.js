var app = getApp();
/**
 * 使用 Page 初始化页面，具体可参考微信公众平台上的文档
 */
Page({
  /**
   * 初始数据
   */
  data: {

  },
  onShow() {
    var that = this;
    console.log("--onshow");
    app.admx.login({
      url: app.config.service.loginUrl,
      succ: function (wxUserInfo) {
        console.log("--login success");
        console.log(wxUserInfo);
        if (wxUserInfo.user.姓名) {
          var newuser = app.common.transUserInfo(wxUserInfo.user);
          wxUserInfo.user = newuser;
          app.Session.set(wxUserInfo);
          console.log("------主键:" + wxUserInfo.user.id);
          wx.switchTab({
            url: '../index/index'
          })
        } else {
          wx.redirectTo({
            url: '../reg/reg'
          });
        }
      }
    });
  },
  onReady() {

  },
  onLoad() {
  }

});
