//index.js
//获取应用实例
var serverUtils = require("../../utils/serverUtils.js")

var app = getApp()
Page({
  data: {
    drivemycar: '今日同乘',
    findaseat: '明日同乘',
    swiperHeight: 0,
    userInfo: {},
    cunrentindex: 0,
    wxid: "null",
    byonecars: [],
    regist: "正在连接服务器...",
    istoday: true,
    istomorrow: false,
    msg_car_icon: "../../images/car.png",
    msg_user_icon: "../../images/isme.png",
    msg: "null"

  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../regist/regist'
    })
  },
  //事件处理函数
  /*
  bindViewTap_today: function (e) {
    var that = this
    var wxid = that.data.wxid
    if (wxid != 'null') {
      wx.showLoading({
        title: '获取中..',
      })
      serverUtils.GetOnecarInfo(
        {
          params: { wxid: JSON.stringify(wxid), day: JSON.stringify("today") },
          success: function (res) {
            var resmsg='null'
            if(res.length==0)
            {
              resmsg='没有同乘的人员，请先预订'
            }
            that.setData({
              byonecar: res,
              msg: resmsg
            })
            wx.hideLoading()
          }
        }
      )
      that.setData({
        istoday: true,
        istomorrow:false
      })
    }
  },
  //事件处理函数
  bindViewTap_tomorrow: function () {
    var that = this
    var wxid = that.data.wxid
    if (wxid != 'null') {
      wx.showLoading({
        title: '获取中..',
      })
      serverUtils.GetOnecarInfo(
        {
          params: { wxid: JSON.stringify(wxid), day: JSON.stringify("tomorrow") },
          success: function (res) {
            var resmsg = 'null'
            if (res.length == 0) {
              resmsg = '没有同乘的人员，请先预订'
            }            
            that.setData({
              byonecar: res,
              msg:resmsg
            })
            wx.hideLoading()
          }
        }
      )
      that.setData({
        istoday: false,
        istomorrow: true
      })
    }
  },*/
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //
      //  console.log(userInfo)
      that.setData({
        userInfo: userInfo,
        wxid: userInfo.LoginId
      })

      wx.showLoading({
        title: '获取中..',
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
      serverUtils.GetOnecarInfo(
        {
          params: { wxid: JSON.stringify(userInfo.LoginId), day: JSON.stringify("today") },
          success: function (res) {
            var resmsg = 'null'
            if (res.length == 0) {
              resmsg = '没有同乘的人员，请先预订'
            }
            var byonecars = []
            var onecar = {}
            onecar.msg = resmsg
            onecar.users = res
            byonecars.push(onecar)
            that.setData({
              byonecars: byonecars,
            })
            serverUtils.GetOnecarInfo(
              {
                params: { wxid: JSON.stringify(userInfo.LoginId), day: JSON.stringify("tomorrow") },
                success: function (res) {
                  var resmsg = 'null'
                  if (res.length == 0) {
                    resmsg = '没有同乘的人员，请先预订'
                  }
                  var onecar = {}
                  onecar.msg = resmsg
                  onecar.users = res
                  byonecars.push(onecar)
                  var height1 = Math.max(byonecars[0].users.length * 158, 630)
                  var height2 = Math.max(byonecars[1].users.length * 158, 630)
                  var height = Math.max(height1, height2)
                  that.setData({
                    byonecars: byonecars,
                    swiperHeight: height
                  })
                  wx.hideLoading()
                }
              }
            )
          }
        }
      )
      var hours = new Date().getHours()
      var day = ""
      if (hours >= 20 && hours < 24) {
        that.setData({
          cunrentindex: 1
        })
        day = "tomorrow"
      }
      else {
        day = "today"
      }
      serverUtils.ConfirmOnecarInfo(
        {
          params: { wxid: JSON.stringify(userInfo.LoginId), day: JSON.stringify(day) },
          success: function (res) { }
        }
      )
      //end getuser
    })
  },
  onShow: function () {
    var that = this
    var today = that.data.istoday ? "today" : "tomorrow";
    var wxid = that.data.wxid
    if (wxid != 'null') {

      serverUtils.GetOnecarInfo(
        {
          params: { wxid: JSON.stringify(wxid), day: JSON.stringify("today") },
          success: function (res) {
            var resmsg = 'null'
            if (res.length == 0) {
              resmsg = '没有同乘的人员，请先预订'
            }
            var byonecars = []
            var onecar = {}
            onecar.msg = resmsg
            onecar.users = res
            byonecars.push(onecar)
            that.setData({
              byonecars: byonecars,
            })
            serverUtils.GetOnecarInfo(
              {
                params: { wxid: JSON.stringify(wxid), day: JSON.stringify("tomorrow") },
                success: function (res) {
                  var resmsg = 'null'
                  if (res.length == 0) {
                    resmsg = '没有同乘的人员，请先预订'
                  }
                  var onecar = {}
                  onecar.msg = resmsg
                  onecar.users = res
                  byonecars.push(onecar)
                  that.setData({
                    byonecars: byonecars,
                  })
                  var height1 = Math.max(byonecars[0].users.length * 158, 630)
                  var height2 = Math.max(byonecars[1].users.length * 158, 630)
                  var height = Math.max(height1, height2)
                  // console.log(height)
                  that.setData({
                    swiperHeight: height
                  })
                  wx.hideLoading()
                }
              }
            )
          }
        }

      )

      serverUtils.Regist(
        {
          params: { wxid: JSON.stringify(wxid), code: JSON.stringify("check") },
          success: function (res) {
            that.setData({
              regist: res ? "已注册" : "未注册"
            })
          }
        }
      )
    }

  },
  swiperChange: function (e) {
    var page = e.detail.current
    var day = page == 0 ? "today" : "tomorrow";
    serverUtils.ConfirmOnecarInfo(
      {
        params: { wxid: JSON.stringify(this.data.wxid), day: JSON.stringify(day) },
        success: function (res) {
          console.log(res)
        }
      }
    )
    var height1 = Math.max(this.data.byonecars[0].users.length * 158, 630)
    var height2 = Math.max(this.data.byonecars[1].users.length * 158, 630)
    var height = Math.max(height1, height2)
    // console.log(height)
    this.setData({
      swiperHeight: height
    })
  },
  //end page
})
