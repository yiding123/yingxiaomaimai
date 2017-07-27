
/**
 * 拓展对象
 */
module.exports.extend = function extend(target) {
    var sources = Array.prototype.slice.call(arguments, 1);

    for (var i = 0; i < sources.length; i += 1) {
        var source = sources[i];
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
    }

    return target;
};

var showLoading= function(text){
    if(wx.canIUse('showLoading')){
        wx.showLoading({
            title: text,
            icon: 'loading',
        });
    }else{
        showBusy(text);
    }
}
var closeLoading=function(){
    wx.hideLoading();
}
// 显示繁忙提示
var showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
});

// 显示成功提示
var showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
});

// 显示失败提示
var showModel = (title, content) => {
    wx.hideToast();

    wx.showModal({
        title,
        content: JSON.stringify(content),
        showCancel: false
    });
};

module.exports.showBusy = showBusy;
module.exports.showSuccess = showSuccess;
module.exports.showModel = showModel;
module.exports.showLoading=showLoading;
module.exports.closeLoading=closeLoading;


var getDateStr = function(date){
    if(date == null)
        return date;
    
    var str = date; 
    var a = str.split(" "); 
    var b = a[0].split("-"); 
    return b[1]+'-'+b[2]; 
}

var fmtDateStr = function(date){
    if(!(date instanceof Date)){
        return date;
    }

    return date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
}

module.exports.getDateStr = getDateStr;