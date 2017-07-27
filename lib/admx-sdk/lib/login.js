var constants = require("./constants.js");
var utils = require("./utils.js");
var Session = require("./session.js");
var Request = require("./request.js");
/**
 * 微信登录，获取 code 和 encryptData
 * callback(error, res)
 */
function getLoginCode(callback) {
    console.log('getLoginCode')
    wx.login({
        success: function (loginResult) {
            console.log('login success')
            wx.getUserInfo({
                success: function (userResult) {
                    callback(null, {
                        code: loginResult.code,
                        encryptedData: userResult.encryptedData,
                        iv: userResult.iv,
                        userInfo: userResult.userInfo,
                    });
                },

                fail: function (userError) {
                    var error = {
                        code: constants.ERR_WX_GET_USER_INFO,
                        message: '获取微信用户信息失败，请检查网络状态',
                        detail: userError
                    };
                    callback(error, null);
                },
            });
        },

        fail: function (loginError) {
            var error = {
                code: constants.ERR_WX_LOGIN_FAILED,
                message: '微信登录失败，请检查网络状态',
                detail: loginError
            };
            callback(error, null);
        },
    });
};

/**
 * 登录
 * 进行服务器登录，以获得登录会话
 *
 * @param {Object} options 登录配置
 * @param {string} options.url 登录使用的 URL，服务器应该在这个 URL 上处理登录请求
 * @param {string} [options.method] 请求使用的 HTTP 方法，默认为 "GET"
 * @param {Function} options.succ(userInfo) 登录成功后的回调函数，参数 userInfo 微信用户信息
 * @param {Function} options.fail(error) 登录失败后的回调函数，参数 error 错误信息
 */
function login(options) {
    console.log('api login called')
    getLoginCode(function (wxLoginError, wxLoginResult) {
        if (wxLoginError) {
            options.fail(wxLoginError);
            return;
        }

        var userInfo = wxLoginResult.userInfo;

        // 构造请求头，包含 code、encryptedData 和 iv
        var code = wxLoginResult.code;
        var encryptedData = wxLoginResult.encryptedData;
        var iv = wxLoginResult.iv;
        var header = {};
        console.log("code=" + code);
        console.log("encryptData=" + encryptedData);
        console.log("iv=" + iv);

        header[constants.WX_HEADER_CODE] = code;
        header[constants.WX_HEADER_ENCRYPTED_DATA] = encryptedData;
        header[constants.WX_HEADER_IV] = iv;

        Request.request(utils.extend({}, options,{
            header:header,
            succ:function(data){
              if (data.session_token) {
                        data.userInfo = userInfo;
                        Session.set(data);
                        options.succ(data);
                    } else {
                        var errorMessage = '登录失败(' + data.code + ')：' + (data.error || '未知错误');
                        var noSessionError = {
                            code: constants.ERR_LOGIN_SESSION_NOT_RECEIVED,
                            message: errorMessage
                        };
                        options.fail(noSessionError);
                    }    
            }
        }));
      
    });

}

module.exports.login = login;





