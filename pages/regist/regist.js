//logs.js
var util = require('../../utils/util.js')
var serverUtils = require("../../utils/serverUtils.js")
var app = getApp()
Page({
  data: {
    reg: '',
    wxid: ''
  },
  onLoad: function () {
    var that = this
    app.getUserInfo(function (userInfo) {
      that.setData({
        wxid: userInfo.LoginId,
      })
    })
  },
  bindInput: function (e) {
    var that = this
    that.setData(
      {
        reg: e.detail.value
      }
    )
  },
  bindRegist: function () {
    var that = this  
    if (that.data.reg=="") {
      wx.showToast({
        title: '口令不能为空',
      })
      return
    }
    serverUtils.Regist(
      {
        params: { wxid: JSON.stringify(that.data.wxid), code: JSON.stringify(that.data.reg) },
        success: function (res) {
         
          if (res) {
            wx.showToast({
              title: '注冊成功',
            })
          }else
          {
            wx.showToast({
              title: '注冊失败',
            })
          }
        }
      }
    )   
  },
  bindViewTap: function () {
    wx.navigateTo({
      url: '../help/help'
    })
  },

})
