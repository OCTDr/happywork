// pages/meinfo/meifo.js
var app = getApp()
var serverUtils = require("../../utils/serverUtils.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    regist: "未注册",
    WeekTitles: [
      "周一", "周二", "周三", "周四", "周五", "不限行"
    ],
    WeekIndex: 5,
    isDrive: false,
    selectmode:'selector'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据  
      that.setData({

        userInfo: userInfo
      })

      serverUtils.Regist(
        {
          params: { wxid: JSON.stringify(userInfo.LoginId), code: JSON.stringify("check") },
          success: function (res) {
            that.setData({
              regist: res ? "已注册" : "未注册"
            })
          }
        }
      )

    })
    try {
      var valueWeekIndex = wx.getStorageSync('WeekIndex')
      var valueisDrive = wx.getStorageSync('isDrive')
      var tem = valueisDrive ?"selector":"null"
      valueWeekIndex = valueWeekIndex >= 5 ? 5 : valueWeekIndex
      that.setData(
        {
          WeekIndex: valueWeekIndex,
          isDrive: valueisDrive,
          selectmode: tem
        }
      )
    } catch (e) {
      // Do something when catch error

      wx.setStorage({
        key: "WeekIndex",
        data: 5
      })
      wx.setStorage({
        key: "isDrive",
        data: false
      })
    }   

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    serverUtils.Regist(
      {
        params: { wxid: JSON.stringify(that.data.userInfo.LoginId), code: JSON.stringify("check") },
        success: function (res) {
          that.setData({
            regist: res ? "已注册" : "未注册"
          })
        }
      }
    )
  },
  
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../regist/regist'
    })
  },
  bindIndexChange: function (e) {
    var that = this
    var index = e.detail.value == 5 ? 7 : e.detail.value;
    that.setData(
      {
        WeekIndex: e.detail.value
      }
    )
    wx.setStorage({
      key: "WeekIndex",
      data: index
    })
  },
  bindswitchchange: function (e) {
    var that = this   
    var index = e.detail.value ? wx.getStorageSync("WeekIndex"):5;
    var tem = e.detail.value ? "selector" : "null"
    wx.setStorage({
      key: "WeekIndex",
      data: index
    })
    wx.setStorage({
      key: "isDrive",
      data: e.detail.value
    })
    that.setData({
      WeekIndex: index,
      selectmode: tem
    })
  }
  //endpage
})