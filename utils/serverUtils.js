
var urlpath = 'https://www.blockgis.net/'

function GetDrivers(requestHandler) {
  var params = requestHandler.params
  wx.request({
    url: urlpath +'happywork.asmx/getdrivers',
    method: 'GET',
    data: params,
    success: function (res) {
      // success   
      var drs = res.data.d
      /*
      if (!drs) return;
      var pre = params.isme.indexOf("true") >= 0 ? "提供" : "剩";
      for (var i = 0; i < drs.length; i++) {
        drs[i].seatnum = pre + drs[i].seatnum;
        drs[i].bookinfo = "";
        if (drs[i].isbook == 'true') {
          drs[i].bookinfo = "我已预订";
        }
        else if (drs[i].isdriver == 'true') {
          drs[i].bookinfo = "我是司机";
        }
      } */
      requestHandler.success(drs)
    }
  })
  return params;
}
function RegistDriver(requestHandler) {
  var params = requestHandler.params; 
  wx.request({
    url: urlpath +'happywork.asmx/registdriver',
    method: 'GET',
    data: params, 
    success: function (res) { 
      //console.log(res)
      requestHandler.success(res.data.d)
    },
    fail: function () {
      // fail  
    },
    complete: function () {
      // complete  
    }
  })
}
function DelDriver(requestHandler) {
  var params = requestHandler.params;
  wx.request({
    url: urlpath +'happywork.asmx/deletedriver',
    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
    data: params,
   // header: { "content-type": 'application/x-www-form-urlencoded' }, // 设置请求的 header  
    success: function (res) {
      requestHandler.success(res)
    },
    fail: function () {
      // fail  
    },
    complete: function () {
      // complete  
    }
  })
}
function BookCar(requestHandler) {
  var params = requestHandler.params;
  wx.request({
    url: urlpath +'happywork.asmx/bookcar',
    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
    data: params,
   // header: { "content-type": 'application/x-www-form-urlencoded' }, // 设置请求的 header  
    success: function (res) {      
      requestHandler.success(res.data.d);//小于10
    },
    fail: function () {
      // fail  
    },
    complete: function () {
      // complete  
    }
  })
}
function DeBookCar(requestHandler) {
  var params = requestHandler.params; 
  wx.request({
    url: urlpath +'happywork.asmx/cancelbookcar',
    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
    data: params,
    //header: { "content-type": 'application/x-www-form-urlencoded' }, // 设置请求的 header  
    success: function (res) {  
      
      requestHandler.success(res.data.d);//小于10

    },
    fail: function () {
      // fail  
    },
    complete: function () {
      // complete  
    }
  })
}
function GetBookInfo(requestHandler) {
  var params = requestHandler.params
  wx.request({
    url: urlpath +'happywork.asmx/getbookinf',
    method: 'GET',
    data: params,
    success: function (res) {
      // success   
      var urs = res.data.d
      if (!urs) return;
      requestHandler.success(urs)
    }
  })

};
function GetOnecarInfo(requestHandler) {
  var params = requestHandler.params
  wx.request({
    url: urlpath +'happywork.asmx/getonecar',
    method: 'GET',
    data: params,
    success: function (res) {
      // success   
      //console.log(res)
      var urs = res.data.d
      if (!urs) return;
      requestHandler.success(urs)
    }
  })

};
function Regist(requestHandler) {
  var params = requestHandler.params
  wx.request({
    url: urlpath +'happywork.asmx/regist',
    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
    data: params,
    //header: { usercode: logincode.code}, // 设置请求的 header  
    success: function (res) {   
     // console.log(res)  
      requestHandler.success(res.data.d.isreg)     
    }
  })
}
function ConfirmOnecarInfo(requestHandler) {
  var params = requestHandler.params
  wx.request({
    url: urlpath + 'happywork.asmx/confirmonecar',
    method: 'GET',
    data: params,
    success: function (res) {
      // success   
     // console.log(res)
      var urs = res.data.d
      if (!urs) return;
      requestHandler.success(urs)
    }
  })

};

module.exports = {
  GetDrivers: GetDrivers,
  DelDriver: DelDriver,
  RegistDriver: RegistDriver,
  BookCar: BookCar,
  DeBookCar: DeBookCar,
  GetBookInfo: GetBookInfo,
  GetOnecarInfo: GetOnecarInfo,
  Regist: Regist,
  ConfirmOnecarInfo:ConfirmOnecarInfo
}