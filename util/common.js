var computeAge = function (startDate) {
  console.log("---startDate:" + startDate);
  if (startDate == null) {
    return;
  }
  // 获得今天的时间
  var date = new Date();
  startDate = new Date(startDate);
  var newDate = date.getTime() - startDate.getTime();
  // 向下取整  例如 10岁 20天 会计算成 10岁
  // 如果要向上取整 计算成11岁，把floor替换成 ceil
  return Math.floor(newDate / 1000 / 60 / 60 / 24 / 365);
}

var transUserInfo = function (sessionUser) {
  return {
    avatarUrl: sessionUser.头像,
    address: sessionUser.地址,
    com: sessionUser.公司,
    industry: sessionUser.行业,
    wxid: sessionUser.微信号,
    nickName: sessionUser.姓名,
    birthday: sessionUser.生日,
    job: sessionUser.职务,
    sex: sessionUser.性别,
    coperation: sessionUser.关于合作,
    des: sessionUser.更多介绍,
    need: sessionUser.我需要什么,
    support: sessionUser.我能提供什么,
    phone: sessionUser.联系方式,
    tag: sessionUser.标签,
    id: sessionUser.主键
  };
}

module.exports.computeAge = computeAge;
module.exports.transUserInfo = transUserInfo;