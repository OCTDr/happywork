var app = getApp()

var serverUtils = require("../../utils/serverUtils.js")
var dateUtils = require("../../utils/dateUtils.js")
var util = require('../../utils/util.js')
Page({
  data: {
    drivername: {},
    wxid: "",
    arry: ['1个', '2个', '3个', '4个', '5个', '6个'],
    index: 2,
    amtime: '07:41',
    pmtime: '17:06',
    dateTitles: [
      "一", "二", "三", "四", "五", "六", "日"
    ],
    remarkinput: '',
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
    car_icon: "../../images/car.png",
    isdrive: false,
    bycar_icon: "../../images/car.png",
    nocar_icon: "../../images / nocar.png",
    nocar: 4,
    msg_car_icon: "../../images/car.png",
    msg_nocar_icon: "../../images/nocar.png",
    AP: {},
    msg_ap_icon: "../../images/bycar_ap.png",
    msg_am_icon: "../../images/bycar_am.png",
    msg_pm_icon: "../../images/bycar_pm.png",
    msg_no_icon: "../../images/bycar_no.png",
    msg_aps_icon: "../../images/bycar_ap_s.png",
    msg_ams_icon: "../../images/bycar_am_s.png",
    msg_pms_icon: "../../images/bycar_pm_s.png",
    msg_nos_icon: "../../images/bycar_no_s.png",
    msg_cmt_icon: "../../images/remarkcmt.png",
    msg_car_info: "正在获取出行信息~"
  },
  onLoad: function () {
    var thatData = this
    wx.getStorage({
      key: 'WeekIndex',
      success: function (res) {
        thatData.setData({
          nocar: nocar
        })
      },
    })
    try {
      var nocar = wx.getStorageSync("WeekIndex")
      thatData.setData({
        nocar: nocar
      })
    }
    catch (e) {

    }

    var tmp = getInitDate()

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
      getServerData({
        monthdatas: tmp, wxid: userInfo.LoginId,
        success: function (tmp) {
          var todayindex = getTodayindex(tmp[0].data)
          var day = tmp[0].data[todayindex]
          var ap = iniAPinfo(day.ampm)
          var isby = day.iscar
          var date = new Date()
          thatData.setData({
            isdrive: isby,
            msg_car_info: isby ? "今天要开车哦~ ^_ ^小心驾驶" : date.getDay() == thatData.data.nocar + 1 ? "今天限行，不要开车哦~" : "今天你不用开车~",
            curent_dayindex: todayindex,
            monthDatas: tmp,
            amtime: typeof (day.driver) != 'undefined' ? day.driver.timeam : "07:40",
            pmtime: typeof (day.driver) != 'undefined' ? day.driver.timepm : "17:00",
            index: typeof (day.driver) != 'undefined' ? parseInt(day.driver.seatnum) - 1 : 3,
            AP: ap
          })
        }
      })
      thatData.setData({
        wxid: userInfo.LoginId,
        drivername: userInfo.nickName
      })
    })
    thatData.setData({
      monthDatas: tmp,
      swiperHeight: tmp[0].dataHarr.length * 122
    })

  },
  onShow: function () {
    var thatData = this
    try {
      var nocar = wx.getStorageSync("WeekIndex")
      thatData.setData({
        nocar: nocar
      })
    }
    catch (e) {
      thatData.setData({
        nocar: 0
      })
    }
    var wxid = thatData.data.wxid
    if (typeof (wxid) != "undefined" && wxid != "") {
      getServerData({
        monthdatas: thatData.data.monthDatas, wxid: thatData.data.wxid,
        success: function (tmp) {
          thatData.setData({
            monthDatas: tmp
          })
        }
      })
    }
  },

  swiperChange: function (e) {
    var thatData=this 
    var page = e.detail.current
 var temp = getInitDate()
    this.setData({
      swiperHeight: this.data.monthDatas[page].dataHarr.length * 122
    })

    var wxid = thatData.data.wxid
    if (typeof (wxid) != "undefined" && wxid != "") {
      getServerData({
        monthdatas: temp, wxid: thatData.data.wxid,
        success: function (tmp) {
          thatData.setData({
            monthDatas: tmp
          })
        }
      })
    }
  },
  bindIndexDaySelected: function (e) {
    var thatData = this
    var mindex = e.currentTarget.dataset.indexmonth
    var dindex = e.currentTarget.dataset.indexday
    var tem = thatData.data.monthDatas
    for (var d in tem[mindex].data) {
      tem[mindex].data[d].selected = false;
    }
    var day = tem[mindex].data[dindex]
    tem[mindex].data[dindex].selected = !day.selected
    var isby = day.iscar
    var ap = iniAPinfo(day.ampm)
    var date = new Date(day.year, day.month - 1, day.day)
    //console.log(day)
    this.setData({
      monthDatas: tem,
      isdrive: isby,
      msg_car_info: isby ? "今天要开车哦~ ^_ ^小心驾驶" : date.getDay() == thatData.data.nocar + 1 ? "今天限行，不要开车哦~" : "今天你不用开车~",
      curent_monthindex: mindex,
      curent_dayindex: dindex,
      amtime: typeof (day.driver) != 'undefined' && day.driver != null ? day.driver.timeam : "07:40",
      pmtime: typeof (day.driver) != 'undefined' && day.driver != null ? day.driver.timepm : "17:00",
      index: typeof (day.driver) != 'undefined' && day.driver != null ? parseInt(day.driver.seatnum) - 1 : 3,
      remarkinput: typeof (day.driver) != 'undefined' && day.driver != null ? day.driver.remark : "",
      AP: ap
    })
  },
  /* bindChangeDrive: function (e) {
     var thatData = this
     var tem = thatData.data.monthDatas
     var mindex = thatData.data.curent_monthindex
     var dindex = thatData.data.curent_dayindex
     var day = tem[mindex].data[dindex]
     var date = new Date(day.year, day.month - 1, day.day)
 
     var isby = !day.iscar
     tem[mindex].data[dindex].iscar = isby
     if (isby) {
       tem[mindex].data[dindex].ampm = "AP"
       var num = parseInt(thatData.data.index) + 1
       var driver = {
         ampm: "AP",
         name: thatData.data.drivername,
         dateday: util.formatNumber(day.day),
         datemonth: util.formatNumber(day.month),
         dateyear: day.year,
         seatnum: num,
         timepm: thatData.data.pmtime,
         timeam: thatData.data.amtime,
         remark: thatData.data.remarkinput,
         wxid: thatData.data.wxid
       }
       serverUtils.RegistDriver(
         {
           params: { jsonText: JSON.stringify(driver) },
           success: function (drs) {
             console.log("ddd")
             wx.showToast({
               title: '已提交到服务器',
               icon: 'success',
               duration: 2000
             })
           }
         }
       )
     }
     else {
       tem[mindex].data[dindex].ampm = "null"
       var ids = typeof (day.driver) != 'undefined' ? day.driver.ids : "null"
       if (ids != "null") {
         serverUtils.DelDriver(
           {
             params: { jsonDriverids: ids },
             success: function (drs) {
               console.log("ddd")
               wx.showToast({
                 title: '已提交到服务器',
                 icon: 'success',
                 duration: 1000
               })
             }
           }
         )
       }
     }
     var ap = iniAPinfo(tem[mindex].data[dindex].ampm)
     thatData.setData({
       monthDatas: tem,
       isdrive: isby,
       msg_car_info: isby ? "今天要开车哦~ ^_ ^小心驾驶" : date.getDay() == thatData.data.nocar + 1 ? "今天限行，不要开车哦~" : "今天你不用开车~",
       AP: ap
     })
   },*/
  bindApChange: function (e) {
    var thatData = this
    var apvalue = e.currentTarget.dataset.index
    var tem = thatData.data.monthDatas
    var mindex = thatData.data.curent_monthindex
    var dindex = thatData.data.curent_dayindex
    var day = tem[mindex].data[dindex]
    var date = new Date(day.year, day.month - 1, day.day)
    tem[mindex].data[dindex].ampm = apvalue
    if (apvalue == "NoCar") {
      tem[mindex].data[dindex].iscar = false

      var ids = typeof (day.driver) != 'undefined' && day.driver != null ? day.driver.ids : "null"
      console.log(ids)
      if (ids != "null") {
        day.driver = null;
        serverUtils.DelDriver(
          {
            params: { jsonDriverids:JSON.stringify( ids) },
            success: function (drs) {               
                wx.showToast({
                title: '已提交到服务器' + drs,
                icon: 'success',
                duration: 1000
              })
            }
          }
        )
      }
    }
    else {
      tem[mindex].data[dindex].iscar = true
      /* var num = parseInt(thatData.data.index) + 1
       var driver = {
         ampm: apvalue, name: thatData.data.drivername,
         dateday: util.formatNumber(day.day),
         datemonth: util.formatNumber(day.month),
         dateyear: day.year,
         seatnum: num,
         timepm: thatData.data.pmtime,
         timeam: thatData.data.amtime,
         remark: thatData.data.remarkinput,
         wxid: thatData.data.wxid
       }
       serverUtils.RegistDriver(
         {
           params: { jsonText: JSON.stringify(driver) },
           success: function (drs) {
             driver.ids = drs
             day.driver = driver
             tem[mindex].data[dindex] = day
             thatData.setData({
               monthDatas: tem
             })
             wx.showToast({
               title: '已提交到服务器',
               icon: 'success',
               duration: 1000,
             })
 
           }
 
         }
       )*/
    }
    var ap = iniAPinfo(apvalue)
    thatData.setData({
      monthDatas: tem,
      msg_car_info: apvalue != "NoCar" ? "今天要开车哦~ ^_ ^小心驾驶" : date.getDay() == thatData.data.nocar + 1 ? "今天限行，不要开车哦~" : "今天你不用开车~",
      AP: ap
    })
  },
  bindIndexChange: function (e) {
    var thatData = this
    thatData.setData({
      index: e.detail.value
    })
    /* var num = parseInt(e.detail.value) + 1
     var day = thatData.data.monthDatas[thatData.data.curent_monthindex].data[thatData.data.curent_dayindex]
     var driver = {
       ampm: day.ampm, name: thatData.data.drivername, dateday: util.formatNumber(day.day),
       datemonth: util.formatNumber(day.month),
       dateyear: day.year,
       seatnum: num,
       timepm: thatData.data.pmtime,
       timeam: thatData.data.amtime,
       remark: thatData.data.remarkinput,
       wxid: thatData.data.wxid
     }
     serverUtils.RegistDriver(
       {
         params: { jsonText: JSON.stringify(driver) },
         success: function (drs) {
           wx.showToast({
             title: '已提交到服务器',
             icon: 'success',
             duration: 500,
           })
 
         }
 
       }
     )*/
  },
  bindAmTimeChange: function (e) {
    var thatData = this
    thatData.setData({
      amtime: e.detail.value
    })
    /* var num = parseInt(thatData.data.index) + 1
     var day = thatData.data.monthDatas[thatData.data.curent_monthindex].data[thatData.data.curent_dayindex]
     var driver = {
       ampm: day.ampm,
       name: thatData.data.drivername,
       dateday: util.formatNumber(day.day),
       datemonth: util.formatNumber(day.month),
       dateyear: day.year, seatnum: num,
       timepm: thatData.data.pmtime,
       timeam: e.detail.value,
       remark: thatData.data.remarkinput,
       wxid: thatData.data.wxid
     }
     serverUtils.RegistDriver(
       {
         params: { jsonText: JSON.stringify(driver) },
         success: function (drs) {
           wx.showToast({
             title: '已提交到服务器',
             icon: 'success',
             duration: 500,
           })
 
         }
 
       }
     )*/
  },
  bindPmTimeChange: function (e) {
    var thatData = this
    thatData.setData({
      pmtime: e.detail.value
    })
    /*var num = parseInt(thatData.data.index) + 1
    var day = thatData.data.monthDatas[thatData.data.curent_monthindex].data[thatData.data.curent_dayindex]
    var driver = {
      ampm: day.ampm,
      name: thatData.data.drivername,
      dateday: util.formatNumber(day.day),
      datemonth: util.formatNumber(day.month),
      dateyear: day.year, seatnum: num,
      timepm: e.detail.value,
      timeam: thatData.data.amtime,
      remark: thatData.data.remarkinput,
      wxid: thatData.data.wxid
    }
    serverUtils.RegistDriver(
      {
        params: { jsonText: JSON.stringify(driver) },
        success: function (drs) {
          wx.showToast({
            title: '已提交到服务器',
            icon: 'success',
            duration: 500,
          })

        }

      }
    )*/
  },
  bindRemarkInput: function (e) {
    console.log('备注发送选择改变，携带值为', e.detail.value)
    this.setData({
      remarkinput: e.detail.value
    })
  },
  bindCmtclick: function (e) {
    var thatData = this
    var formid = e.detail.formId
    var num = parseInt(thatData.data.index) + 1
    var temp = thatData.data.monthDatas
    var day = temp[thatData.data.curent_monthindex].data[thatData.data.curent_dayindex]
    var driver = {
      ampm: day.ampm,
      name: thatData.data.drivername,
      dateday: util.formatNumber(day.day),
      datemonth: util.formatNumber(day.month),
      dateyear: day.year,
      seatnum: num,
      timepm: thatData.data.pmtime,
      timeam: thatData.data.amtime,
      remark: thatData.data.remarkinput,
      wxid: thatData.data.wxid,
      formid: formid
    }
    serverUtils.RegistDriver(
      {
        // params: { jsonText: JSON.stringify(driver) },
        params: { driver: driver },
        success: function (drs) {
          if (drs.errcode == 0) {
            driver.ids = drs.value
            day.driver = driver
           
            temp[thatData.data.curent_monthindex].data[thatData.data.curent_dayindex] = day
            wx.showToast({
              title: '已提交到服务器',
              icon: 'success',
              duration: 500,
            })
            thatData.setData({
              monthDatas: temp
            })
          }
          else {
            wx.showToast({
              title: '提交失败',
            })
          }
        }
      })
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
        title: '今日不开车',
      })
    }
  }
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
      params: { isme: JSON.stringify("true"), wxid: JSON.stringify(temp.wxid) },
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
                tmp[m].data[d].ampm = drs[n].ampm
                tmp[m].data[d].driver = drs[n]
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
function getTodayindex(days) {
  for (var i = 0; i < days.length; i++) {
    if (days[i].type == 1) {
      return i;
    }
  }
}
function iniAPinfo(ampm) {
  var AP = {};
  AP.isap = false;
  AP.isam = false;
  AP.ispm = false;
  AP.NoCar = false;
  switch (ampm) {
    case "AP":
      AP.isap = true;
      break;
    case "Am":
      AP.isam = true;
      break;
    case "Pm":
      AP.ispm = true;
      break;
    default:
      AP.NoCar = true;
      break;
  }
  return AP;
}
