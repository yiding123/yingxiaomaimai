var app = getApp();

/**
 * 使用 Page 初始化页面，具体可参考微信公众平台上的文档
 */
Page({

  /**
   * 初始数据
   */
  data: {
    user: {},
    isfriend: false
  },
  onLoad(param) {
    wx.showLoading({
      title: '加载中'
    })
    let id = parseInt(param.id);
    console.log("uid=" + id);
    let visitby = parseInt(wx.getStorageSync('userId'));
    var that = this;
    //存储浏览信息
    if (id != visitby) {
      app.admx.request({
        url: app.config.service.apiUrlBase + '/record/add',
        data: {
          user: id,
          visitby: visitby
        },
        method: 'POST',
        succ: function (res) {
          console.log(res);
        }
      })
    }


    //根据id查询用户
    app.admx.request({
      url: app.config.service.apiUrlBase + '/user/get',
      data: {
        id: id
      },
      succ: function (res) {
        that.setData({
          user: res.list[0]
        })
      }
    })

    let userId = wx.getStorageSync('userId');
    app.admx.request({
      url: app.config.service.apiUrlBase + '/isfriend',
      data: {
        user: userId,
        resource: id
      },
      succ: function (res) {
        if (!res.list && userId != id) {
          that.setData({
            isfriend: true
          })
        }
      }
    })
  },
  add: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../group/group?id=' + id
    })
  },
  onShareAppMessage: function () {
    var ismyself = (wx.getStorageSync('userId') == this.data.user.id);
    var _title = ismyself ? "我的名片" : "我分享了人脉资源";
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
  //复制微信号
  copyWxid: function () {
    if (this.data.user.wxid) {
      wx.setClipboardData({ data: this.data.user.wxid });
      wx.showToast({
        title: '复制成功',
      });
    } else {
      wx.showToast({
        title: '没有填微信号',
      });
    }

  }
});
