/**
 * 用户自定义需要显示的分类
 */
const app = getApp();
var admx = app.admx;



Page({
    data: {
        search: "",
        hot: ['cloudadmx', 'java', '营销'],
        history: app.globalData.search_history,
    },
    onLoad() {

    },
    onShow() {
        var history = app.globalData.search_history||[];
        var res = [history[0]];
        for (var i = 1; i < history.length; i++) {
            var repeat = false;
            for (var j = 0; j < res.length; j++) {
                if (history[i] == res[j]) {
                    repeat = true;
                    break;
                }
            }
            if (!repeat) {
                res.push(history[i]);
            }
        }
        if(res[0]){
            this.setData({
                history: res
            })
        }
        
    },
    search:function(e) {
        var data = e.detail.value;
        if (!(data.search)) {
            admx.utils.showModel('失败', '搜索内容不能为空');
            return;
        }
        admx.request({
            url: app.config.service.apiUrlBase + '/resource/tag',
            data: {
                tag: data.search
            },
            succ: function (res) {
              if (!res.list) {
                admx.utils.showModel('>.<', '没有搜索到相关内容');
                return;
              }
              app.globalData.search_result = res.list;
              var arr = app.globalData.search_history;
              if (arr) {
                app.globalData.search_history.push(data.search);
              } else {
                arr = new Array();
                arr.push(data.search);
                app.globalData.search_history = arr;
              }
              wx.switchTab({
                url: '../index/index',
              })
            },
            complete: function () {
                wx.hideLoading();
            }
        })
    },
    tagsearch(e) {
        let key = e.currentTarget.dataset.key
        admx.request({
            url: app.config.service.apiUrlBase + '/resource/tag',
            data: {
                tag: key
            },
            succ: function (res) {
                if (!res.list) {
                    admx.utils.showModel('>.<', '没有搜索到相关内容');
                    return;
                }
                app.globalData.search_result = res.list;
                var arr = app.globalData.search_history;
                if (arr) {
                    app.globalData.search_history.push(key);
                } else {
                    arr = new Array();
                    arr.push(key);
                    app.globalData.search_history = arr;
                }
                wx.switchTab({
                    url: '../index/index',
                })
            },
            complete: function () {
                wx.hideLoading();
            }
        })
    },
    clearhistory() {
        console.log('clear')
        let arr = new Array();
        app.globalData.search_history = arr;
        console.log(this.data.history);
        this.setData({
            history: arr
        })
        console.log(this.data.history);
    },

    mylocation() {
      var userId = wx.getStorageSync('userId');
      wx.navigateTo({
        url: '../mylocation/mylocation?id=' + userId
      })
    }

})