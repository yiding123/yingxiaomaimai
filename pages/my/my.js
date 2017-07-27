
var app = getApp();
Page({
  data: {
    user:{},
    tag:[]
  },
  toAccess:function(e){
    var hide = e.currentTarget.dataset.hide;
    var userId = wx.getStorageSync('userId');
    wx.navigateTo({
      url: '../access/access?hide='+hide
    })
  },
  onLoad: function () {

  },
  onShow(){
    console.log('mine onshow')
    var userinfo = app.Session.get().user;
    this.setData({
      user: userinfo,
      tag: userinfo.tag.split(" ")
    })
    console.log(this.data.tag);
  },
  mine(){
    var userId = wx.getStorageSync('userId');
    wx.navigateTo({
      url: '../mine/mine'
    })
  },
  recommend(){
    var userId = wx.getStorageSync('userId');
    wx.navigateTo({
      url: '../recommend/recommend'
    })
  },
  edit(){
    wx.navigateTo({
      url: '../mine/mine?method='+'w'
    })
  }
})