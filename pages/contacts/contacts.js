var app = getApp();
var utils = app.admx.utils;
Page({
  data: {
    feed: [],
    feed_length: 0,
    groups: [
      {
        id: 0,
        groupname: '全部',
        selected: 1
      }
    ],
    hide: false
  },
  onLoad: function () {
    utils.showLoading("加载中");
    this.getData();
  },
  bindSearchNavigate: function () {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  onShow() {
    var refreshCofing = app.refreshCofing;
    var that = this;
    if (refreshCofing.contacts) {
      utils.showLoading("加载中");
      this.getData();
      refreshCofing.contacts = false;
    }else{
      if(app.globalData.newgroup != null){
        var grouptemp = that.data.groups;
        grouptemp.push(app.globalData.newgroup);
        that.setData({
          groups: grouptemp
        });
        console.log(grouptemp);
        app.globalData.newgroup = null;
      }
    }
  },
  //当点击人脉时跳转到详情页
  details: function (e) {
    var id = e.currentTarget.dataset.id;
    console.log("id=" + id)
    wx.navigateTo({
      url: '../details/details?id=' + id
    })
  },
  //当点击group时刷新分组下的人脉及分组选中情况
  filter:function(e) {
    wx.showLoading({
      title: '加载中'
    })
    var that = this;
    var id = e.currentTarget.dataset.id;
    var groups = that.data.groups;
    for (var i = 0; i < groups.length; i++) {
      groups[i].selected = 0;
      if (groups[i].id == id) {
        groups[i].selected = 1;
      }
    }
    that.setData({
      groups: groups
    })
    if (id == 0) {
      this.getData();
      return;
    }

    var userId = wx.getStorageSync('userId');
    app.admx.request({
      url: app.config.service.apiUrlBase + '/contactgroup',
      data: {
        group: id
      },
      succ: function (res) {
        if (res.list != undefined) {
          that.setData({
            feed: res.list,
          })
        } else {
          that.setData({
            feed: [],
          })
        }
      }
    })
  },
  showall() {
    this.getData();
  },
  //使用本地 fake 数据实现刷新效果
  getData: function (complete) {
    this._getGroups();
    this._getResoures();
    
  },

  //
  _getResoures:function(){
    var that = this;
    var userId = wx.getStorageSync('userId');
    app.admx.request({
      url: app.config.service.apiUrlBase + '/resources',
      data: {
        user: userId
      },
      succ: function (res) {
        console.log(res);
        // success
        if (res) {
          that.setData({
            feed: res.list,
            hide: true
          })
        } else {
          that.setData({
            hide: false
          })
        }
      }
    })
  },

  //load groups 
  _getGroups:function(){
    var that = this;
    var userId = wx.getStorageSync('userId');
    var requestJson = {
      url: app.config.service.apiUrlBase + '/group',
      data: {
        user: userId
      },
      succ: function (res) {
        console.log('-.-.-.-.')
        console.log(res)
        if (res.list) {
          for (var i = 0; i < res.list.length; i++) {
            res.list[i].selected = 0;
          }
          res.list.unshift(that.data.groups[0]);
          that.setData({
            groups: res.list
          })
        }
      }

    }
    app.admx.request(requestJson);
  },

  nextLoad: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 4000
    })
    var next = util.getNext();
    console.log("continueload");
    var next_data = next.data;
    this.setData({
      feed: this.data.feed.concat(next_data),
      feed_length: this.data.feed_length + next_data.length
    });
    setTimeout(function () {
      wx.showToast({
        title: '加载成功',
        icon: 'success',
        duration: 2000
      })
    }, 3000)
  },

  add() {
    var that = this;
    wx.navigateTo({
      url: '../plusgroup/plusgroup?id=' + that.data.resource
    })
  }


})
