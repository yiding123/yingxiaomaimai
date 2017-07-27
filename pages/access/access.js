var app = getApp()
var utils = app.admx.utils;
Page({
  data: {
    userInfo: {},
    users: [],
    isHidden: false
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: ''
    })
  },
  onLoad: function (param) {
    var that = this
    var hide = parseInt(param.hide);
    var id = parseInt(param.id);
    console.log(hide);
    console.log(id);
    if (hide === 1) {//我看过谁
      app.admx.request({
        url: app.config.service.apiUrlBase + '/visited',
        succ: function (res) {
          let list = res.list;
          if (list) {
            for (let i = 0; i < list.length; i++) {
              list[i].date = utils.getDateStr(list[i].date)
            }
          }
          that.setData({
            isHidden: hide,
            users: list
          })
        }
      })
    } else if (hide === 0) {//谁看过我
      app.admx.request({
        url: app.config.service.apiUrlBase + '/visitby',
        succ: function (res) {
          let list = res.list;
          if (list) {
            for (let i = 0; i < list.length; i++) {
              list[i].date = utils.getDateStr(list[i].date)
            }
          }
          that.setData({
            isHidden: hide,
            users: list
          })
        }
      })
    } else {
    }
    console.log(this.data.users);
    //更新数据
    that.setData({
      userInfo: app.globalData.userInfo
    })
  },
  onPullDownRefresh: function () {
    console.log("----onPullDownRefresh");
    wx.stopPullDownRefresh();
  },
  upper: function () {
    wx.showNavigationBarLoading()
    this.refresh();
    console.log("upper");
    setTimeout(function () {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }, 2000);
  },
  lower: function (e) {
    wx.showNavigationBarLoading();
    var that = this;
    setTimeout(function () { wx.hideNavigationBarLoading(); that.nextLoad(); }, 1000);
    console.log("lower")
  },
  details(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../details/details?id=' + id
    })
  }
})