var app = getApp()

var dateUtils = require("../../utils/dateUtils.js")
var serverUtils = require("../../utils/serverUtils.js")
var util = require('../../utils/util.js')

Page({
  data: {
    wxid: "",
    currentday: {},
    dateTitles: [
      "一", "二", "三", "四", "五", "六", "日"
    ],
    windowWidth: 0,
    windowHeight: 0,
    titleCellWidth: 0,
    titleCellHeight: 60, // rpx
    dateCellWidth: 0,
    dateCellHeight: 120, // rpx
    monthDatas: [],
    swiperHeight: 0,
    curent_monthindex: 0,
    curent_dayindex: {},
    bookcar_icon: "../../images/bookinf.png",
    booked_icon: "../../images/booked.png",
    car_icon: "../../images/car.png",
    isme_icon: "../../images/isme.png",
    msg_ap_icon: "../../images/bycar_ap.png",
    msg_am_icon: "../../images/bycar_am.png",
    msg_pm_icon: "../../images/bycar_pm.png",
    submitmsg:{ptype:'warn',text:"不接收通知",isreceive:false,formid:'null'}
  },
  onLoad: function () {
    var thatData = this
    var tmp = getInitDate()
    var date = new Date()

    wx.getSystemInfo({
      success: function (res) {
        thatData.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
          titleCellWidth: res.windowWidth / 7 - 1.1,
          dateCellWidth: res.windowWidth / 7 - 1.1

        })
      }
    })
    app.getUserInfo(function (userInfo) {
      //更新数据
      var wxid = userInfo.LoginId
      thatData.setData({
        wxid: wxid
      })
      wx.showLoading({
        title: '查询中..',
      })
      getServerData({
        monthdatas: tmp, wxid: userInfo.LoginId,
        success: function (drs) {
          wx.hideLoading()
          var todayindex = getTodayindex(drs[0].data)
          thatData.setData({
            curent_dayindex: todayindex,
          })
          var today = drs[0].data[todayindex]
          if (today.iscar && !today.isdriver) {
            wx.showLoading({
              title: '更新中..',
            })
            var temp = [today.driversAP, today.driversAm, today.driversPm]
            for (var t in temp) {
              for (var d in temp[t]) {
                var dr = temp[t][d]
                dr.t = t
                dr.d = d
                getServerBookInfo(
                  {
                    driver: dr,
                    wxid: wxid,
                    success: function (drv) {

                      temp[drv.t][drv.d] = drv
                      thatData.setData({
                        currentday: today
                      })
                    }
                  }
                )
              }
            }
            wx.hideLoading()
          }
          thatData.setData({
            currentday: today
          })
          thatData.setData({
            monthDatas: drs
          })
        }
      })
    })
    thatData.setData({
      monthDatas: tmp,
      swiperHeight: tmp[0].dataHarr.length * 122,
    })

  },
  onShow: function () {
    var thatData = this
    var wxid = thatData.data.wxid
    //使用新的月份，但不用更改today获取新的预约信息
    var temp = getInitDate()
    if (typeof (wxid) != "undefined" && wxid != "") {
      getServerData({
        monthdatas: temp, wxid: wxid,
        success: function (drs) {
          var todayindex = getTodayindex(drs[0].data)
          thatData.setData({
            curent_monthindex: 0,
            curent_dayindex: todayindex
          })
          var today = drs[0].data[todayindex]
          
          if (today.iscar && !today.isdriver) {
            wx.showLoading({
              title: '更新中..',
            })
            var temp = [today.driversAP, today.driversAm, today.driversPm]
            for (var t in temp) {
              for (var d in temp[t]) {
                var dr = temp[t][d]
                dr.t = t
                dr.d = d
                getServerBookInfo(
                  {
                    driver: dr,
                    wxid: wxid,
                    success: function (drv) {

                      temp[drv.t][drv.d] = drv
                      thatData.setData({
                        currentday: today
                      })
                    }
                  }
                )
              }
            }          
            wx.hideLoading()
          }
          thatData.setData({
            currentday: today
          })
          thatData.setData({
            monthDatas: drs
          })

        }
      })
    }
  },
  swiperChange: function (e) {
    var page = e.detail.current
    this.setData({
      swiperHeight: this.data.monthDatas[page].dataHarr.length * 122
    })
  },
  bindIndexDaySelected: function (e) {
    var thatData = this
    var mindex = e.currentTarget.dataset.indexmonth
    var dindex = e.currentTarget.dataset.indexday
    var tem = thatData.data.monthDatas
    var wxid = thatData.data.wxid
    for (var d in tem[mindex].data) {
      tem[mindex].data[d].selected = false;
    }
    tem[mindex].data[dindex].selected = !tem[mindex].data[dindex].selected
    var today = tem[mindex].data[dindex]
    if (today.iscar && !today.isdriver) {
      wx.showLoading({
        title: '更新中..',
      })
      var temp = [today.driversAP, today.driversAm, today.driversPm]
      for (var t in temp) {
        for (var d in temp[t]) {
          var dr = temp[t][d]
          dr.t = t
          dr.d = d
          getServerBookInfo(
            {
              driver: dr,
              wxid: wxid,
              success: function (drv) {
                temp[drv.t][drv.d] = drv

                thatData.setData({
                  currentday: today
                })
                wx.hideLoading()
              }
            }
          )
        }
      }
    }
    thatData.setData({
      currentday: today,
      monthDatas: tem,
      curent_monthindex: mindex,
      curent_dayindex: dindex
    })
  },
  bindChangeBookcar: function (e) {

    var formid=e.detail.formId
    console.log(formid)

    var ptype = e.currentTarget.dataset.ptype
    var index = e.currentTarget.dataset.pindex
    //
    var thatData = this
    var today = thatData.data.currentday
    if (today.iscar) {
      var isAmOrnotPm = ptype.indexOf("Am") >= 0
      var temp = [today.driversAP, today.driversAm, today.driversPm]
      //获取当前day。driver 并记录其index
      var driver = {};
      var tempindex = {};
      var ampm = isAmOrnotPm ? "Am" : "Pm"
      if (ptype == "Am") {
        driver = today.driversAm[index]
        tempindex = 1
      } else if (ptype == "Pm") {
        driver = today.driversPm[index]
        tempindex = 2
      } else {
        driver = today.driversAP[index]
        tempindex = 0
      }
      //
      //当前返回项是否已经预定
      var isBookorDel = isAmOrnotPm ? temp[tempindex][index].ambooked : temp[tempindex][index].pmbooked
      isBookorDel = !isBookorDel
      if (isBookorDel)//如果要预定 
      {
        //清除所有预约标记
        for (var t in temp) {
          for (var d in temp[t]) {
            //driver
            var dr = temp[t][d]
            dr.t = t
            dr.d = d
            if (isAmOrnotPm) {
              temp[t][d].ambooked = false
            } else {
              temp[t][d].pmbooked = false
            }
          }
        }
        wx.showLoading({
          title: '提交中',
        })
        //向服务器提交预定信息
        serverUtils.BookCar(
          {
            params: { driverid: JSON.stringify(driver.ids), wxid: JSON.stringify(thatData.data.wxid), ampm: JSON.stringify(ampm), formid: JSON.stringify(formid) },
            success: function (drs) {
              
              if (drs.errcode== 0) {
                today.isbook = true;
                if (isAmOrnotPm) {
                  temp[tempindex][index].amseatnum = drs.value
                }
                else {
                  temp[tempindex][index].pmseatnum = drs.value
                }
              }
              else if (drs.errcode== -4) {
                wx.showToast({
                  title: '座位已完',
                })
              }
              else {
                wx.showToast({
                  title: '预定失败',
                })
              }
              thatData.setData(
                {
                  currentday: today
                }
              )
              wx.hideLoading()
            }
          }
        )
      }
      else//取消预定
      {
        // 查询是否还有预定项目 
        var hasbookinf = {}
        for (var t in temp) {
          for (var d in temp[t]) {
            //driver
            var dr = temp[t][d]
            dr.t = t
            dr.d = d
            if (isAmOrnotPm) {//如果是am 则只查询pm的
              hasbookinf = temp[t][d].pmbooked
            } else {
              hasbookinf = temp[t][d].ambooked
            }
            if (hasbookinf) {
              break;
            }
          }
          if (hasbookinf) {
            break;
          }
        }
        today.isbook = hasbookinf
        wx.showLoading({
          title: '提交中',
        })
        //向服务器提交取消预定信息
        serverUtils.DeBookCar(
          {
            params: { driverid: JSON.stringify(driver.ids), wxid: JSON.stringify(thatData.data.wxid), ampm: JSON.stringify(ampm) },
            success: function (drs) {
              if(drs.errcode==0)
              {
              if (isAmOrnotPm) {
                temp[tempindex][index].amseatnum = drs.value
              }
              else {
                temp[tempindex][index].pmseatnum = drs
              }
              thatData.setData(
                {
                  currentday: today
                }
              )
              }
              else
              {
                wx.showToast({
                  title: '取消失败',
                })
              }
              wx.hideLoading()
            }
          }
        )
      }
      //更改本地预定信息
      if (isAmOrnotPm) {
        temp[tempindex][index].ambooked = isBookorDel
      }
      else {
        temp[tempindex][index].pmbooked = isBookorDel
      }

      var mindex = thatData.data.curent_monthindex
      var dindex = thatData.data.curent_dayindex
      var tem = thatData.data.monthDatas
     // console.log(tem)
      tem[mindex].data[dindex] = today
      //更改预定状态
      thatData.setData(
        {
          currentday: today,
          monthDatas: tem
        }
      )
    }
  },
  bindviewonecar: function () {
    var thatData = this
    var mindex = thatData.data.curent_monthindex
    var dindex = thatData.data.curent_dayindex
    var tem = thatData.data.monthDatas
    var day = tem[mindex].data[dindex]
    if (day.iscar) {
      var stringday = day.year + util.formatNumber(day.month) + util.formatNumber(day.day)
      var wxid = thatData.data.wxid
      wx.navigateTo({
        url: '../bookinfo/bookinfo?wxid=' + wxid + "&day=" + stringday
      })
    }
    else {
      wx.showToast({
        title: '今日无车',
      })
    }
  },
  /*bindsubmit:function(e)
  {
    var that =this
    var newmsg=that.data.submitmsg//:{ ptype: 'warn', text:"不接收通知", isreceive:false }
    newmsg.isreceive = !newmsg.isreceive
    if (newmsg.isreceive)
    {
      newmsg.ptype ='primary'
      newmsg.text='允许接受通知'
      newmsg.formid=e.detail.formId      
    }
    else
    {
      newmsg.ptype = 'warn'
      newmsg.text = '不接收通知'
      newmsg.formid = 'null'
    }
    that.setData({
      submitmsg:newmsg
    })
     wx.showToast({
       title: '重新预约后生效',
     })    
  }
  */
  //endpage

})

function getInitDate() {
  var arr = []
  var offset = 0 // 测试用
  arr.push(getDataObj(dateUtils.initThisMonthDates(offset)))
  arr.push(getDataObj(dateUtils.initNextMonthDates(offset)))
  return arr
}

function getDataObj(arr) {
  var obj = {
    data: arr,
    dataHarr: dateUtils.initRowList(arr.length / 7)
  }
  return obj

}

function getServerData(temp) {
  var tmp = temp.monthdatas
  serverUtils.GetDrivers(
    {
      params: { isme: JSON.stringify("false"), wxid: JSON.stringify(temp.wxid) },
      success: function (drs) {
        // console.log(drs)

        for (var n in drs) {
          for (var m in tmp) {
            for (var d in tmp[m].data) {
              if (tmp[m].data[d].day == parseInt(drs[n].dateday)
                && tmp[m].data[d].month == parseInt(drs[n].datemonth)
                && tmp[m].data[d].year == parseInt(drs[n].dateyear)
              ) {
                tmp[m].data[d].iscar = true
                if (!tmp[m].data[d].isdriver) {
                  tmp[m].data[d].isdriver = drs[n].isdriver == "true"
                }
                if (!tmp[m].data[d].isbook) {
                  tmp[m].data[d].isbook = drs[n].isbook == "true"
                }
                ////////////////////
                if (typeof (tmp[m].data[d].driversAP) == 'undefined') {
                  tmp[m].data[d].driversAP = [];
                  if (drs[n].ampm == "AP") {
                    tmp[m].data[d].driversAP.push(drs[n])
                  }
                }
                else if (drs[n].ampm == "AP") {
                  tmp[m].data[d].driversAP.push(drs[n])
                }
                /////////////
                if (typeof (tmp[m].data[d].driversAm) == 'undefined') {
                  tmp[m].data[d].driversAm = [];
                  if (drs[n].ampm == "Am") {
                    tmp[m].data[d].driversAm.push(drs[n])
                  }
                }
                else if (drs[n].ampm == "Am") {
                  tmp[m].data[d].driversAm.push(drs[n])
                }
                /////////////
                if (typeof (tmp[m].data[d].driversPm) == 'undefined') {
                  tmp[m].data[d].driversPm = [];
                  if (drs[n].ampm == "Pm") {
                    tmp[m].data[d].driversPm.push(drs[n])
                  }
                }
                else if (drs[n].ampm == "Pm") {
                  tmp[m].data[d].driversPm.push(drs[n])
                }

                break;
              }
            }
          }
        }
        temp.success(tmp)
      }
    }
  )
}
//初始当前天车辆座位剩余信息amseatnum pmseatnum.
function getServerBookInfo(temp) {
  var driver = temp.driver
  var wxid = temp.wxid
  serverUtils.GetBookInfo(
    {
      params: { driverid: JSON.stringify(driver.ids) },
      success: function (bks) {
        // console.log(drs)
        var amseatnum = parseInt(driver.seatnum)
        var pmseatnum = parseInt(driver.seatnum)
        for (var u in bks) {
          switch (bks[u].ampm) {
            case "AP":
              amseatnum -= 1;
              pmseatnum -= 1;
              break;
            case "Am":
              if (bks[u].wxid == wxid) {
                driver.ambooked = true
              }
              amseatnum -= 1;
              break;
            case "Pm":
              if (bks[u].wxid == wxid) {
                driver.pmbooked = true
              }
              pmseatnum -= 1;
              break;
          }

        }
        driver.amseatnum = amseatnum
        driver.pmseatnum = pmseatnum
        driver.bookinfo = bks
        temp.success(driver)
      }
    }
  )

}

function getTodayindex(days) {
  for (var i = 0; i < days.length; i++) {
    if (days[i].type == 1) {
      return i;
    }
  }
}