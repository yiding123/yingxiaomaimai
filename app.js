App({
  admx: require("./lib/admx-sdk/admx.js"),
  config: require("./config.js"),
  Session: require("./lib/admx-sdk/lib/session.js"),
  common: require("./util/common"),
  utils: function () {
    return this.admx.utils
  },
  refreshCofing: { 
    "contacts": false
  },
  search_result:[],
  search_history:[],
  globalData: {
    userInfo: null,
    systemInfo: null,
    wxUserInfo:null,
    newgroup:null //当新建分组时临时保存
  },
  onLaunch: function () {
    var that = this;
    //调用API从本地缓存中获取数据
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.systemInfo = res;
      },
    });
  }
})