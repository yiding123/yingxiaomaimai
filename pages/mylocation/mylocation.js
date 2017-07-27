var app = getApp()
var utils = app.admx.utils;
Page({
  data: {
    recommendation: [
    ],//推荐
    feed: [],
    feed_length: 0,
    windowWidth: app.globalData.systemInfo.windowWidth,
    windowHeight: app.globalData.systemInfo.windowHeight,
    page: 1,
    showtips: true,
    tips: ""
  },
  bindSearchNavigate: function () {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  add: function (e) {
    var id = e.currentTarget.dataset.id;
    let userId = wx.getStorageSync('userId');
    let flag = false;
    app.admx.request({
      url: app.config.service.apiUrlBase + '/isfriend',
      data: {
        user: userId,
        resource: id
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      succ: function (res) {
        if (res.list) {
          utils.showModel('', '与目标已经是朋友');
          return;
        }
        wx.navigateTo({
          url: '../group/group?id=' + id
        })
      },
      complete: function () {

      }
    })
  },
  details: function (e) {
    console.log(e.currentTarget)
    var id = e.currentTarget.dataset.id;
    console.log('id:' + id)
    if (!id) return;
    wx.navigateTo({
      url: '../details/details?id=' + id
    })
  },
  onLoad: function (param) {
    console.log('----index.onLoad')
    this.setData({
      userinfo: app.globalData.userInfo
    })
    this.getIndexData();
  },
  onShow() {
    console.log('----index.onShow');
    if (app.globalData.search_result) {
      if (app.globalData.search_result.length == 0) {
        this._getUsers();
        return;
      }
      this.setData({
        feed: app.globalData.search_result,
        showtips: true
      })
    }
  },
  onPullDownRefresh: function () {
    console.log("----onPullDownRefresh");
    this.getIndexData();
    wx.stopPullDownRefresh();
  },
  onReachBottom: function () {
    console.log("----onReachBottom");
    console.log(app.globalData.search_result)
    if (app.globalData.search_result || !this.data.showtips) {
      return
    }
    // wx.showNavigationBarLoading();
    var that = this;
    that.setData({
      showtips: false,
      tips: '正在加载...'
    })
    setTimeout(function () {
      // wx.hideNavigationBarLoading(); 
      that.nextLoad();
    }, 1000);
  },
  //首页推荐
  _getRecommandtion: function () {
    var that = this;
    app.admx.request({
      url: app.config.service.recommendations,
      data: {
        startdate: '2017-04-01',
        enddate: '2018-04-01',
        status: 1
      },
      succ: function (res) {
        // success
        that.setData({
          recommendation: res.list
        })
      }
    });
  },
  //首页上获取资源数据
  _getUsers: function () {
    var that = this;
    app.admx.request({
      url: app.config.service.users,
      data: {
        oid: app.Session.get().openid
      },
      succ: function (res) {
        app.globalData.search_result = undefined;
        that.setData({
          feed: res.list,
          feed_length: res.list.length,
          page: 1,
          showtips: true
        })
      }
    });
  },
  //获取首页上所有需要显示的数据
  getIndexData: function () {
    this._getUsers();
    this._getRecommandtion();
  },

  nextLoad: function () {
    var that = this;
    var openid = app.Session.get().openid;
    that.setData({
      page: that.data.page + 1
    })
    app.admx.request({
      url: app.config.service.users + '?page=' + that.data.page,
      data: {
        oid: openid
      },
      succ: function (res) {
        if (res.list) {
          that.setData({
            feed: that.data.feed.concat(res.list),
            showtips: true
          })
        } else {
          that.setData({
            tips: '——————————————— 这是我的底线了 ———————————————'
          })
        }

      }
    });
  },


  data: {
    address: {}
  },

  onLoad: function () {
    //获取当前经纬度信息
    wx.getLocation({
      success: ({latitude, longitude}) => {

        //调用后台API，获取地址信息
        wx.request({
          url: 'http://localhost:3000/lbs/location',

          data: {
            latitude: latitude,
            longitude: longitude
          },

          success: (res) => {
            let info = res.data.data.result.ad_info
            this.setData({ address: info })
          },

          fail: () => {
          },

          complete: () => {
          }
        })
      }
    })
  },

  chooseplace() {
    var userId = wx.getStorageSync('userId');
    wx.navigateTo({
      url: '../chooseplace/chooseplace?id=' + userId
    })
  }  

})
