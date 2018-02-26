//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (logincode) {
          wx.getUserInfo({
            success: function (res) {
              var thisuser = res.userInfo;
              wx.request({
                url: 'https://www.blockgis.net/happywork.asmx/login',
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
                data: { usercode: JSON.stringify(logincode.code), nickname: JSON.stringify(thisuser.nickName), imageurl: JSON.stringify(thisuser.avatarUrl) },
                //header: { usercode: logincode.code}, // 设置请求的 header  
                success: function (res) {
                 // console.log(res)
                  thisuser.LoginId = res.data.d.openid
                  that.globalData.userInfo = thisuser
                  typeof cb == "function" && cb(that.globalData.userInfo)
                },
                fail: function () {
                  // fail  
                },
                complete: function () {
                  // complete  
                }
              })
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null
  }
})