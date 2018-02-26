var serverUtils = require("../../utils/serverUtils.js")

// pages/books/bookinfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},   
    msg: "null",
    msg_car_icon: "../../images/car.png",
    msg_user_icon: "../../images/isme.png",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {   
    var thatData=this;
     //获取服务器的数据    
    var wxid = options.wxid
    var sday = options.day
    if (wxid != 'null') {
      wx.showLoading({
        title: '获取中..',
      })
      serverUtils.GetOnecarInfo(
        {
          params: { wxid: JSON.stringify(wxid), day: JSON.stringify(sday) },
          success: function (res) {
            var resmsg = 'null'
            if (res.length == 0) {
              resmsg = '没有同乘的人员，请先预订'
            }
            thatData.setData({
              byonecar: res,
              msg: resmsg
            })
            wx.hideLoading()
          }
        }
      )
    }
  },

})