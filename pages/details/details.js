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
    isfriend: false,
    needShowAddGrpBtn:true,//是否显示收藏按扭
    tag:[]
  },
  onLoad(param) {
    wx.showLoading({
      title: '加载中'
    })
    let visitUserId = parseInt(param.id);
    console.log("uid=" + visitUserId);
    var myId = app.Session.get().user.主键;
  
    this._addAccessLog(visitUserId, myId);
    //根据id查询用户
    this._getUserInfo(visitUserId);
    
    this._isFriend(visitUserId);
    
  },

  //记录访问
  _addAccessLog: function (visitUserId,myId){
    //存储浏览信息
    if (visitUserId != myId) {
      app.admx.request({
        url: app.config.service.apiUrlBase + '/record/add',
        data: {
          visit: visitUserId
        },
        method: 'POST',
        succ: function (res) {
          console.log(res);
        }
      })
    }
  },
  //判断是否跟当前访问的人是好友
  _isFriend:function(userid){
    var that = this;
    app.admx.request({
      url: app.config.service.apiUrlBase + '/isfriend',
      data: {
        resource: userid
      },
      succ: function (res) {
        if (!res.list) {
          that.setData({
            isfriend: true,
            needShowAddGrpBtn:false
          })
        }
      }
    });
  },
  /**
   * 根据传入的id,查询用户信息
   */
  _getUserInfo:function(userid){
    var that = this;
    console.log("_getUserinfo");
    console.log(app.Session.get().user);
    var myId = app.Session.get().user.id;
    console.log("--myId:" + myId);
    if (userid != myId) {
      app.admx.request({
        url: app.config.service.apiUrlBase + '/user/get',
        data: {
          uid: userid
        },
        succ: function (res) {
          var userinfo = res.list[0];
          userinfo.age = app.common.computeAge(userinfo.birthday);
          console.log("---年龄:" + age);
          that.setData({
            user: userinfo,
            tag : userinfo.tag.split(" ")
          })
          wx.setNavigationBarTitle({
            title: that.data.user.nickName + "的名片"
          })
        }
      });
    }else{//我自己
      console.log("--- my self");
      var userinfo = app.Session.get().user;
      var age = app.common.computeAge(userinfo.birthday);
      userinfo.age = age;
      that.setData({
        user: userinfo,
        needShowAddGrpBtn: false,
        tag : userinfo.tag.split(" ")
      })
      wx.setNavigationBarTitle({
        title: that.data.user.nickName + "的名片"
      })
    }
  },
  add: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../group/group?id=' + id
    })
  },
  onShareAppMessage: function () {
    var ismyself = (app.Session.get().user.id == this.data.user.id);
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
