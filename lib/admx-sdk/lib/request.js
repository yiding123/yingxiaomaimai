var constants = require('./constants');
var utils = require('./utils');
var Session = require('./session');

var noop = function noop() { };

/***
 * @class
 * 表示请求过程中发生的异常
 */
var RequestError = (function () {
  function RequestError(type, message) {
    Error.call(this, message);
    this.type = type;
    this.message = message;
  }

  RequestError.prototype = new Error();
  RequestError.prototype.constructor = RequestError;

  return RequestError;
})();

var buildAuthHeader = function buildAuthHeader(session) {
  var header = {};
  if (session && session.session_token) {
    header[constants.HEADER_SKEY] = session.session_token;
  }
  header[constants.HEADER_APPKEY] = constants.APPKEY;
  return header;
};

var defaultOptions = {
  method: 'GET',
  header: {
    'content-type': 'application/json'
  },
  succ: function (body) { },
  error: function (errorRes) {
    console.log(errorRes);
    wx.showModal({
      content: errorRes.error || "连接超时,请重试",
      showCancel: false
    });
  }
};


function request(options) {
  if (typeof options !== 'object') {
    var message = '请求传参应为 object 类型，但实际传了 ' + (typeof options) + ' 类型';
    throw new RequestError(constants.ERR_INVALID_PARAMS, message);
  }
  var originHeader = options.header || {};

  // 是否已经进行过重试
  var hasRetried = false;
  console.log("request.url:" + options.url);
  _doRequest();

  // 实际进行请求的方法
  function _doRequest() {
    var authHeader = buildAuthHeader(Session.get());
    var paramOptions = utils.extend({}, defaultOptions, options);
    var requestOptions = utils.extend({}, {
      success: function (response) {
        console.log("-----admx.request.success");
        console.log(response);
        if (response.statusCode > 200) {
          paramOptions.error("请求失败,code:" + response.statusCode);
          return;
        }
        var data;
        if (typeof (response.data) == "object") {
          data = response.data;
        } else {
          data = JSON.parse(response.data);
        }
        if (data && data.code == "0") {
          paramOptions.succ(data.body);
        } else if (data.code == constants.ERR_INVALID_SESSION) {
          if (!hasRetried) {
            hasRetried = true;
            //TODO 提示Session过期
            return;
          }
        } else {
          paramOptions.error(data);
        }
      },
      fail: function (responseError) {
        paramOptions.error(responseError);
      },
      complete: function () {
        if (wx.canIUse('hideLoading')) {
          wx.hideLoading();
        }
      }
    }, paramOptions);
    requestOptions.header = utils.extend({}, originHeader, authHeader);
    wx.request(requestOptions);
  };

};

module.exports = {
  RequestError: RequestError,
  request: request,
};