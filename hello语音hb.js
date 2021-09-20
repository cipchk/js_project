importClass(android.content.ContentResolver);
importClass(android.database.Cursor);
importClass(android.net.Uri);

//取短信function
function get_sms_by_time(name, timeline) {
  var smsUri = "content://sms/inbox";
  function xxxx(body, date) {
    var sms_arr = {};
    var cursor = context
      .getContentResolver()
      .query(
        Uri.parse(smsUri),
        ["body"],
        "body like ? and date > ?",
        ["%" + body + "%", date],
        "date desc"
      );
    if (cursor != null) {
      let i = 0;
      while (cursor.moveToNext()) {
        var sms_content = cursor.getString(cursor.getColumnIndex("body"));
        console.log("短信", sms_content);
        sms_arr[i] = sms_content;
        i++;
      }
    }
    // log(sms_arr);
    if (sms_arr[0]) {
      return sms_arr[0];
    } else {
      return false;
    }
  }
  if (!timeline) {
    timeline = 0;
  }
  return xxxx(name, timeline);
}
//post
function jspost(url, data) {
  var res = http.post(url, data);
  var data = res.body.string();
  if (data) {
    log(data);
    return data;
  }
}
// 获取接口数据
function getTask() {
  var url = "http://api.wenfree.cn/public/";
  let res = http.post(url, {
    s: "NewsImei.Imei",
    imei: device.getIMEI() || "13856d62514d48cba2467cbf8dcb5f46",
  });
  let json = {};
  try {
    let html = res.body.string();
    // log(html)
    json = JSON.parse(html);
    log(json);
    return json.data;
  } catch (err) {
    //在此处理错误
  }
}
// 获取流程记录
function getTaskRecord() {
  var url = "http://api.wenfree.cn/public/";
  let res = http.post(url, {
    s: "NewsImeiTaskData.Task",
    imei: device.getIMEI() || "13856d62514d48cba2467cbf8dcb5f46",
    appname: appinfo.name,
  });
  let json = {};
  try {
    let html = res.body.string();
    // log(html)
    json = JSON.parse(html);
    if (json.data) {
      info = json.data.task_data;
      info.id = json.data.id;
    }
  } catch (err) {
    //在此处理错误
  }
}
// 返回流程记录
function getTaskRecordUpdate(info) {
  let infoArr = {};
  infoArr["task_data"] = JSON.stringify(info);
  var url = "http://api.wenfree.cn/public/";
  let res = http.post(url, {
    s: "Index.update",
    id: info.id,
    table: "news_imei_data_task_record",
    arr: JSON.stringify(infoArr),
  });
  let json = {};
  try {
    let html = res.body.string();
    log(html);
  } catch (err) {
    //在此处理错误
  }
}
//任务回调
function callback_task(id, state) {
  var url = "http://api.wenfree.cn/public/";
  var arr = {};
  arr["id"] = id;
  arr["state"] = state;
  var postdata = {};
  postdata["s"] = "NewsRecordBack.Back";
  postdata["arr"] = JSON.stringify(arr);
  log(arr, postdata);
  log(jspost(url, postdata));
}
//读取本地数据
function getStorageData(name, key) {
  const storage = storages.create(name); //创建storage对象
  if (storage.contains(key)) {
    return storage.get(key);
  }
  //默认返回undefined
}
function app_info(name, data) {
  var url = "http://api.wenfree.cn/public/";
  var postdata = {};
  postdata["s"] = "App.NewsAppInfo.App_info";
  postdata["imei"] = device.getIMEI() || "13856d62514d48cba2467cbf8dcb5f46";
  postdata["app_name"] = name;
  postdata["app_info"] = JSON.stringify(data);
  log(jspost(url, postdata));
}
//基础函数
function active(pkg, n) {
  if (!n) {
    n = 5;
  }
  if (currentPackage() == pkg) {
    log("应用在前端");
    return true;
  } else {
    app.launch(pkg);
    sleep(1000 * n);
  }
}
//准备点击
function click_(x, y, sleeptime, txt) {
  if (!sleeptime) {
    sleeptime = 1;
  }
  if (txt) {
    log("准备点击->" + txt, "x:", x, "y:", y);
  } else {
    log("准备点击坐标->", "x:", x, "y:", y);
  }
  if (x > 0 && x < width && y > 0 && y < height) {
    click(x, y);
    sleep(sleeptime * 1000);
    return true;
  } else {
    log("坐标错误");
  }
}
//点击obj
function click__(objs, sleeptime, txt) {
  if (!sleeptime) {
    sleeptime == 1;
  }

  if (txt) {
    log("准备点击对象->" + txt);
  } else {
    log("点击未命名对象");
  }
  click_(objs.bounds().centerX(), objs.bounds().centerY(), sleeptime, txt);
}

//普通封装
function jjsclick(way, txt, clickKey, sleeptimes, height_) {
  sleeptimes = sleeptimes || 1; //当n没有传值时,设置n=1
  if (!height_) {
    height_ = height;
  } //没有设置高度则height = 1440
  if (!clickKey) {
    clickKey = true;
  } //如果没有设置点击项,设置为false

  var objs = false;
  if (way == "text") {
    objs = text(txt).findOne(200);
  } else if (way == "id") {
    objs = id(txt).findOne(200);
  } else if (way == "desc") {
    objs = desc(txt).findOne(200);
  }
  if (objs) {
    if (
      objs.bounds().centerX() < 0 ||
      objs.bounds().centerX() > width ||
      objs.bounds().centerY() < 0 ||
      objs.bounds().centerY() > height_
    ) {
    } else {
      if (clickKey) {
        log(
          "准备点击->",
          txt,
          "x:",
          objs.bounds().centerX(),
          "y:",
          objs.bounds().centerY()
        );
        click__(objs, sleeptimes, txt);
      } else {
        log("找到->", txt);
      }
      return true;
    }
  }
}
//普通封装
function jsclick(way, txt, clickKey, sleeptimes, height_) {
  sleeptimes = sleeptimes || 1; //当n没有传值时,设置n=1
  if (!height_) {
    height_ = height;
  } //没有设置高度则height = 1440
  clickKey = clickKey || false; //如果没有设置点击项,设置为false

  var objs = false;
  if (way == "text") {
    objs = text(txt).findOne(200);
  } else if (way == "id") {
    objs = id(txt).findOne(200);
  } else if (way == "desc") {
    objs = desc(txt).findOne(200);
  }
  if (objs) {
    if (
      objs.bounds().centerX() < 0 ||
      objs.bounds().centerX() > width ||
      objs.bounds().centerY() < 0 ||
      objs.bounds().centerY() > height_
    ) {
    } else {
      if (clickKey) {
        log(
          "准备点击->",
          txt,
          "x:",
          objs.bounds().centerX(),
          "y:",
          objs.bounds().centerY()
        );
        if (!clickTrue(objs, sleeptimes, txt)) {
          click__(objs, sleeptimes, txt);
        }
      } else {
        log("找到->", txt);
      }
      return true;
    }
  }
}
//强制点击
function bclick(way, txt, clickKey, sleeptimes, height_) {
  sleeptimes = sleeptimes || 1; //当n没有传值时,设置n=1
  if (!height_) {
    height_ = height;
  } //没有设置高度则height = 1440
  var obj = false;
  clickKey = clickKey || false; //如果没有设置点击项,设置为false
  if (way == "text") {
    obj = text(txt).findOne(200);
  } else if (way == "id") {
    obj = id(txt).findOne(200);
  } else if (way == "desc") {
    obj = desc(txt).findOne(200);
  }
  if (obj) {
    if (
      objs.bounds().centerX() < 0 ||
      objs.bounds().centerX() > width ||
      objs.bounds().centerY() < 0 ||
      objs.bounds().centerY() > height_
    ) {
      return false;
    }
    if (clickKey) {
      if (!clickTrue(obj, sleeptimes, txt)) {
        click__(obj, sleeptimes, txt);
      }
    } else {
      log("找到->", txt);
    }
    return true;
  }
}
//穿透点击
function clickTrue(obj, sleeptime, txt) {
  log("clickTrue", txt);
  if (!sleeptime) {
    sleeptime = 1;
  }
  let result = false;
  if (obj && obj.clickable()) {
    obj.click();
    result = true;
  } else {
    log("组件不能穿透");
    let obj_ = obj.parent();
    if (obj_ && obj_.clickable()) {
      obj_.click();
      log("父组件能穿透");
      result = true;
    } else {
      log("父组件不能穿透");
    }
  }

  if (result) {
    sleep(sleeptime * 1000);
  }
  return result;
}
//正则点击
function ms(obj, clicks, sleeptimes, height_, txts) {
  if (!sleeptimes) {
    sleeptimes = 1;
  }
  if (!height_) {
    height_ = height;
  } //没有设置高度则height = 1440
  var txt = "";
  for (let key in obj) {
    if (key == "textMatches") {
      eval("var matches = /" + obj[key] + "/");
      txt = txt + key + "(" + matches + ").";
    } else {
      txt = txt + key + '("' + obj[key] + '").';
    }
  }
  var txt = "let objs = " + txt + "findOne(200);";
  log(txt);
  eval(txt);
  log(objs);
  if (objs) {
    if (
      objs.bounds().centerX() < 0 ||
      objs.bounds().centerX() > width ||
      objs.bounds().centerY() < 0 ||
      objs.bounds().centerY() > height_
    ) {
      return false;
    }
    if (clicks) {
      if (!clickTrue(objs, sleeptimes, txts)) {
        click__(objs, sleeptimes, txts);
      }
    }
    return true;
  }
}
//随机数
function rd(min, max) {
  if (min <= max) {
    return random(min, max);
  } else {
    return random(max, min);
  }
}

//滑动函数
function moveTo(x, y, x1, y1, times) {
  Swipe(x, y, x1, y1, times);
  sleep(1000);
}
//新tips
function Tips() {
  log("查询弹窗");

  let appTips = [
    { text: "同意" },
    { text: "手机登录/注册" },
    { text: "同意授权" },
    { text: "同意并继续" },
    { text: "好" },
    { text: "取消" },
    { textMatches: "允许" },
    { textMatches: "跳过" },
    { text: "下一步" },
    { text: "确定" },
    { textMatches: "忽略" },
    { textMatches: "确认" },
    { textMatches: ".*关闭应用.*" },
    { text: "稍后再说" },
    { textMatches: ".*重新打开应用.*" },
    { text: "重新加载" },
    { text: "开启变美之旅" },
  ];

  for (let k in appTips) {
    if (ms(appTips[k], true, rd(1, 2))) {
    }
  }

  log("查询弹窗-end");
}

//河马ip
function hmip() {
  var result = shell("ipclient faa31f81bfea4124995972d5dc016b57 1", true);
  // console.show();
  // log(result);
  if (result.code == 0) {
    toast("vpn 执行成功");
    // return true
  } else {
    toast("vpn 执行失败！请到控制台查看错误信息");
  }

  var url = "http://idfaapi.wenfree.cn/?s=App.IP.GetInfo";
  var ips = jspost(url, {});
  if (ips) {
    ips = JSON.parse(ips);
    if (ips.ret == 200) {
      toastLog(ips.data.ip);
      return true;
    }
  }
}
//光之
function gz() {
  var timeLine = new Date().getTime();
  while (new Date().getTime() - timeLine < 5 * 60 * 1000) {
    if (active(appinfo.gzbid, 3)) {
      if (jsclick("text", "立即登录", true, rd(6, 10))) {
      } else if (jsclick("id", "vpnSwitch", true, rd(6, 10))) {
        return true;
      }
    }
    sleep(1000);
  }
}

//设备大师
function sbds() {
  let starMun = 0;
  let fix = false;
  var start = false;
  var timeLine = new Date().getTime();
  while (new Date().getTime() - timeLine < 4 * 60 * 1000) {
    starMun++;
    log(starMun);

    if (active(appinfo.sbdsbid, 8)) {
      if (jsclick("text", "修改设备", false, rd(2, 3))) {
        if (fix) {
          return true;
        }
        jsclick("text", "修改设备", true, rd(2, 3));
      } else if (jsclick("text", "设备属性设置", false, rd(2, 3))) {
        start = true;
        if (jjsclick("id", "brand", true, rd(2, 3))) {
          var phonelist = ["XIAOMI", "HUAWEI", "OPPO", "vivo"];
          ms({ text: phonelist[rd(0, 4)], depth: 4 }, true, rd(2, 3));
          jsclick("text", "下一步", true, 8);
        } else {
          back();
        }
      } else if (jsclick("text", "清理应用", false, rd(2, 3))) {
        jjsclick("text", appinfo.name, true, 1);

        if (jsclick("text", "立即清理", true, rd(10, 15))) {
          fix = true;
        }
      } else {
        back();
      }
    }
    sleep(2000);
  }
}
//接口调用设备大师
function sbdsJk() {
  active(appinfo.sbdsbid, 8);

  var result = shell("setphone", true);
  // console.show();
  log(result);
  if (result.code == 0) {
    toast("一键新机 执行成功");
  } else {
    toast("一键新机 执行失败！请到控制台查看错误信息");
  }

  var result = shell("pm clear " + appinfo.bid, true);
  log(result);
  if (result.code == 0) {
    toast("一键清理 执行成功");
  } else {
    toast("一键清理 执行失败！请到控制台查看错误信息");
  }

  shell(
    "am start -n  com.android.systemui/com.android.systemui.recents.RecentsActivity",
    true
  );
  sleep(3000);

  if (ms({ descMatches: "移除设备大师.*" }, true, 5)) {
    return true;
  }
}
//设备大师参数信息
function getsbds() {
  Tips();
  let fix = false;
  var start = false;
  var timeLine = new Date().getTime();
  sleep(5000);
  while (new Date().getTime() - timeLine < 2 * 60 * 1000) {
    if (active(appinfo.sbdsbid, 4)) {
      if (jsclick("text", "关闭应用")) {
      } else if (jsclick("text", "当前设备")) {
        log("设备信息界面");
        appinfo.imei = id("imei").findOne(100).text();
        appinfo.oaid = id("android_id").findOne(100).text();
        appinfo.device = id("phone_model").findOne(100).text();
        appinfo.brand = id("phone_brand").findOne(100).text();

        // console.show()
        log(appinfo);
        home();
        sleep(1000);
        return true;
      }
    }
  }
}

//用户Login
function getLogin() {
  let url =
    "http://uasea.cn/yhapi.ashx?act=login&ApiName=api_wenfree_q7m&PassWord=AaDd112211";
  let data = http.get(url);
  if (data) {
    data = data.body.string();
    log(data);
    data = data.split("|");
    token = data[1];
    log(token);
    return token;
  }
  toastLog("登录出错");
}
//云海
//取手机号
// function getPhone() {
//   token = getLogin();
//   iid = "9902";
//   let getArr = {};
//   let url =
//     "http://uasea.cn/yhapi.ashx?act=getPhone&token=" +
//     token +
//     "&iid=9902" +
//     "&mobile=";
//   let data = http.get(url);
//   if (data) {
//     data = data.body.string();
//     log(data);
//     data = data.split("|");
//     log(data[4]);
//     return data[4];
//   }
//   toastLog("取手机号出错");
// }
// //取短信
// function getMessage() {
//   iid = "9902";
//   let getArr = {};
//   let url =
//     "http://uasea.cn/yhapi.ashx?act=getPhoneCode&token=" +
//     token +
//     "&pid=9902" +
//     phone_num;
//   for (var i = 0; i < 25; i++) {
//     let data = http.get(url);
//     if (data) {
//       data = data.body.string();
//       log(data);
//       data = data.split("|");
//       if (data[1].length == 6) {
//         log("成功");
//         log(data[1]);
//         return data[1];
//       }
//       sleep(3000);
//     }
//   }
//   toastLog("取短信出错");
//   return false;
// }

//df
//用户Login
function getLogin() {
  let url =
    "http://api.do889.com:81/api/logins?username=yangmian1167&&password=yangmian121";
  let data = http.get(url);
  if (data) {
    data = data.body.string();
    data = JSON.parse(data);
    log(data);
    token = data.token;
    log(token);
    return token;
  }
  toastLog("登录出错");
}
//取手机号
function getPhone() {
  token = getLogin();
  iid = "77422";
  let getArr = {};
  let url =
    "http://api.do889.com:81/api/get_mobile?token=" +
    token +
    "&project_id=76907" +
    "&mobile=";
  let data = http.get(url);
  if (data) {
    data = data.body.string();
    data = JSON.parse(data);
    log(data);
    if (data.message == "ok") {
      data = data.mobile;
      log(data);
      return data;
    }
  }
  toastLog("取手机号出错");
}
//取短信
function getMessage() {
  iid = "77422";
  let getArr = {};
  let url =
    "http://api.do889.com:81/api/get_message?token=" +
    token +
    "&project_id=76907" +
    "&phone_num=" +
    phone_num;
  for (var i = 0; i < 25; i++) {
    let data = http.get(url);
    if (data) {
      data = data.body.string();
      data = JSON.parse(data);
      log(data);
      if (data.message == "ok") {
        if (data.code) {
          log("成功");
          data = data.code;
          log(data);
          return data;
        }
      }
      sleep(3000);
    }
  }
  toastLog("取短信出错");
  return false;
}

//hb服务器取号
function hb_getPhone() {
  RetStr = http.get(
    "http://sms.wenfree.cn/public/?service=App.Sms.GetPhone" +
      "&imei=" +
      phone_imei +
      "&phonename=" +
      phone_name
  );
  log(RetStr);
  RetStr = RetStr.body.string();
  RetStr = JSON.parse(RetStr);
  log(RetStr);
  if (RetStr) {
    if (RetStr.data.meg == "success") {
      data = RetStr.data.phone;
      log(data);
    } else {
      log(RetStr);
    }
    sleep(3000);
    return data;
  }
}
function hb_getMessage() {
  for (var i = 0; i < 25; i++) {
    RetStr = http.get(
      "http://sms.wenfree.cn/public/?service=App.Sms.GetMessage" +
        "&imei=" +
        phone_imei +
        "&phonename=" +
        phone_name
    );
    RetStr = RetStr.body.string();
    RetStr = JSON.parse(RetStr);
    log(RetStr);
    if (RetStr) {
      if (RetStr.data.meg == "success") {
        data = RetStr.data.sms;
        data = data.match(/\d{4,6}/);
        data = Number(data);
        if (isNaN(data)) {
          toastLog(data);
          log(data);
        } else {
          log(data);
          return data;
        }
      }
    }
    toastLog("第" + i + "次获取短信休息3秒");
    sleep(3000);
  }
  return false;
}

//上传
// function Idfa(ohter) {
//   let postArr = {};
//   postArr["name"] = appinfo.name;
//   postArr["account"] = appinfo.imei;
//   postArr["idfa"] = appinfo.oaid;
//   postArr["phone"] = phone_num;
//   postArr["ohter"] = ohter 
//   postArr["password"] = appinfo.brand;
//   let data = jspost(
//     "http://wenfree.cn/api/Public/idfa/?service=idfa.idfa",
//     postArr
//   );
// }
//河北上传
function Idfa_hb(account) {
  let postArr = {};
  postArr["name"] = appinfo.name;
  postArr["account"] = account
  postArr["idfa"] = appinfo.oaid;
  postArr["phone"] = phone_num;
  // postArr["ohter"] = ohter;
  postArr["password"] = appinfo.password;
  let data = jspost(
    "http://hb.wenfree.cn/api/Public/idfa/?service=idfa.idfa",
    postArr
  );
}

//联众图像识别函数
function getCode(img, types) {
  http.__okhttp__.setTimeout(3e4);
  var r = images.toBase64(img, (format = "png")),
    i = device.release,
    c = device.model,
    s = device.buildId;
  try {
    var n = http.postJson(
      "https://v2-api.jsdama.com/upload",
      {
        softwareId: 15026,
        softwareSecret: "jR6wwkyxPdTe0QKrw3yZ0wmQbglIEncyC8u4lNZ4",
        username: "ouwen000",
        password: "AaDd112211..",
        captchaData: r,
        captchaType: types,
        captchaMinLength: 1,
        captchaMaxLength: 4,
        workerTipsId: 0,
      },
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Linux; Android " +
            i +
            "; " +
            c +
            " Build/" +
            s +
            "; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 Mobile Safari/537.36",
        },
      }
    );
  } catch (e) {
    return {
      code: "-1",
      msg: "网络链接超时...",
      data: {},
    };
  }
  var d = n.body.json(),
    p = d.code,
    m = d.message;
  if ("10079009" == p)
    return {
      code: p,
      msg: m,
      data: {},
    };
  if ("10142006" == p)
    return {
      code: p,
      msg: m,
      data: {},
    };
  if ("10142004" == p)
    return {
      code: p,
      msg: m,
      data: {},
    };
  if ("10142005" == p)
    return {
      code: p,
      msg: m,
      data: {},
    };
  if ("10079006" == p)
    return {
      code: p,
      msg: m,
      data: {},
    };
  if ("0" == p) {
    return {
      code: p,
      msg: m,
      data: {
        res: d.data.recognition,
      },
    };
  }
  return d;
}

function Reportidfa() {
  let postArr = {};
  postArr["source"] = "anzhuo1";
  postArr["uid"] = "1000";
  postArr["appPackage"] = "com.youxiang.soyoungapp";
  postArr["imei"] = appinfo.imei;
  postArr["oaid"] = appinfo.oaid;
  postArr["device"] = appinfo.device;
  postArr["brand"] = appinfo.brand;
  postArr["ip"] = "";
  let data = jspost("http://td.wenfree.cn/?s=App.Std.Report", postArr);

  toastLog(data);
}

function Distinctidfa() {
  let postArr = {};
  postArr["source"] = "anzhuo1";
  postArr["uid"] = "1000";
  postArr["appPackage"] = "com.youxiang.soyoungapp";
  postArr["imei"] = appinfo.imei;
  postArr["oaid"] = appinfo.oaid;
  postArr["device"] = appinfo.device;
  postArr["brand"] = appinfo.brand;
  postArr["ip"] = "";
  let data = jspost("http://td.wenfree.cn/?s=App.Std.Distinct", postArr);
  if (data) {
    data = JSON.parse(data);
    if (data.data == "排重成功") {
      return true;
    }
  }
  log(data);
  toastLog("排重失败");
}
//数字键盘点击
function nmbc(nmbk) {
  const nmbkey_list = {
    0: [360, 1219],
    1: [196, 883],
    2: [363, 883],
    3: [523, 883],
    4: [196, 993],
    5: [363, 993],
    6: [523, 993],
    7: [196, 1106],
    8: [363, 1106],
    9: [523, 1106],
  };
  for (var i = 0; i < nmbk.length; i++) {
    let yzms = Number(nmbk[i]);
    click_(nmbkey_list[yzms][0], nmbkey_list[yzms][1]);
  }
}

function myRand() {
  myrandS = "";
  for (var i = 0; i < 15; i++) {
    HexRan = [
      "0","1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "A", "B", "C", "D", "E", "F",
    ];
    HexRan = HexRan[random(0, 21)];
    myrandS = myrandS + HexRan;
  }
  return myrandS;
}

function open_url() {
  app.openUrl("73mm.cc");
  sleep(8000);
  var timeLine = new Date().getTime();
  while (new Date().getTime() - timeLine < 1 * 60 * 1000) {
    log(timeLine - new Date().getTime());
    if (jsclick("text", "1", true, 2)) {
      sleep(5000);
    } else if (jsclick("text", "忽略", true, 2)) {
      return true;
    }
  }
}
//hello语音
function main() {
  var xianyang = 0;
  var homeUI = true;
  var phone_key = true;
  var sms_key = false;
  var regok_key = false;
  var huadong_key = true;
  var timeLine = new Date().getTime();
  shell(
    "am start -n  com.android.systemui/com.android.systemui.recents.RecentsActivity",
    true
  );
  sleep(3000);
  if (ms({ descMatches: "移除Hello语音.*" }, true, 5)) {
  }
  while (new Date().getTime() - timeLine < 3 * 60 * 1000) {
    xianyang++;
    log(timeLine - new Date().getTime());
    if (active(appinfo.bid, 4) || active("com.android.packageinstaller", 4)) {
      if (jsclick("text", "手机登录/注册", true, 2)) {
      } else if (jsclick("text", "请输入手机号")) {
        phone_num = hb_getPhone();
        click(568, 390);
        setText([0], phone_num);
        phone_key = false;
        sms_key = true;
        if (jsclick("id", "btn_login", true, 2)) {
        } else {
          jsclick("text", "登录/注册", true, 2);
        }
      } else if (jsclick("text", "输入6位验证码")) {
        sms_num = hb_getMessage();
        if (sms_num) {
          toastLog(sms_num);
          log(sms_num);
          setText(0, sms_num);
          sms_key = false;
        }
      } else if (ms({ desc: "请通过以下验证" })) {
        var yzm = desc("请通过以下验证").findOne(200);
        if (yzm) {
          var yz = yzm.bounds();
          log("找到");
          captureScreen("/sdcard/screencapture.png");
          var src = images.read("/sdcard/screencapture.png");
          var clip = images.clip(
            src,
            yz.left,
            yz.top,
            yz.right - yz.left,
            yz.bottom - yz.top
          );
          images.save(clip, "/sdcard/yzm.png");

          if (ms({ desc: "拖动滑块完成拼图" })) {
            if (huadong_key) {
              //滑动验证
              var types = 1318;
              var yz = yzm.bounds();
              var sssimg = images.read("/sdcard/yzm.png");
              var img__ = getCode(sssimg, types);
              log(img__);
              img__ = img__.data.res.split(",")[0];
              img__ = Number(img__);
              log(yz.left);
              log(img__);
              swipe(90, 800, img__ + yz.left - 10, 800, 1000);
              huadong_key = false;
            } else {
              click(98, 888);
            }
          } else if (ms({ desc: "请在下图依次点击：" })) {
            //文字验证
            sleep(5000);
            var types = 1303;
            var yz = yzm.bounds();
            var sssimg = images.read("/sdcard/yzm.png");
            var img__ = getCode(sssimg, types);
            log(img__);
            img__ = img__.data.res.split("|");
            log(yz.left);
            log(img__);
            for (var i = 0; i < img__.length; i++) {
              click(
                Number(img__[i].split(",")[0]) + yz.left,
                Number(img__[i].split(",")[1]) + yz.top
              );
            }
            sleep(1000);
            click(454, 981);
          }
        }
      } else if (jsclick("text", "密码登录")) {
        return false;
        
      } else if (jsclick("text", "去听好声音")) {
        nannv = random(0,1)
        if (nannv = 0){jsclick("text", "男生",true,2)
        }else if (nannv = 1){jsclick("text", "女生",true,2)
        } 
        jsclick("text", "去听好声音",true,2)
        regok_key = true;
      } else if (regok_key) {
        Idfa_hb("注册成功");
        return true;
      }
      Tips();
      sleep(1000);
    }
  }
}

function repw() {
  var xianyang = 0;
  var homeUI = true;
  var phone_key = true;
  var sms_key = false;
  var regok_key = false;
  var huadong_key = true;
  var timeLine = new Date().getTime();
  shell(
    "am start -n  com.android.systemui/com.android.systemui.recents.RecentsActivity",
    true
  );
  sleep(3000);
  if (ms({ descMatches: "移除Hello语音.*" }, true, 5)) {
  }
  while (new Date().getTime() - timeLine < 3 * 60 * 1000) {
    xianyang++;
    log(timeLine - new Date().getTime());
    if (active(appinfo.bid, 4) || active("com.android.packageinstaller", 4)) {
      if (jsclick("id", "fl_content",true,2)) {
      } else if (jsclick("id", "ib_close",true,2)) {
      } else if (jsclick("id", "closeDialog",true,2)) {
      } else if (jsclick("text", "礼物记录")) {
        click(626,48)
      } else if (jsclick("text", "新密码") && jsclick("text", "确认密码")) {
        setText(0,appinfo.password)
        setText(1,appinfo.password)
        sleep(2000)
        jsclick("text", "确认",true,2)
        regok_key = true
        
      }else if (regok_key) {
        Idfa_hb("改密成功");
        return true;
      }else if (jsclick("text", "设置密码",true,2)) {
      }else if (jsclick("text", "我的",true,2  )) {
      }
      Tips();
      sleep(1000);
    }
  }
}


function fudeng() {
  var xianyang = 0;
  var homeUI = true;
  var phone_key = true;
  var sms_key = false;
  var regok_key = false;
  var huadong_key = true;
  var timeLine = new Date().getTime();
  shell(
    "am start -n  com.android.systemui/com.android.systemui.recents.RecentsActivity",
    true
  );
  sleep(3000);
  if (ms({ descMatches: "移除Hello语音.*" }, true, 5)) {
  }
  while (new Date().getTime() - timeLine < 3 * 60 * 1000) {
    xianyang++;
    log(timeLine - new Date().getTime());
    if (active(appinfo.bid, 4) || active("com.android.packageinstaller", 4)) {
      if (jsclick("text", "手机登录/注册", true, 2)) {
      } else if (jsclick("text", "请输入手机号")) {
        click(568, 390);
        setText([0], fdphone);
        if (jsclick("id", "btn_login", true, 2)) {
        } else {
          jsclick("text", "登录/注册", true, 2);
        }
      } else if (jsclick("text", "输入6位验证码")) {
          return false
      } else if (ms({ desc: "请通过以下验证" })) {
        var yzm = desc("请通过以下验证").findOne(200);
        if (yzm) {
          var yz = yzm.bounds();
          log("找到");
          captureScreen("/sdcard/screencapture.png");
          var src = images.read("/sdcard/screencapture.png");
          var clip = images.clip(
            src,
            yz.left,
            yz.top,
            yz.right - yz.left,
            yz.bottom - yz.top
          );
          images.save(clip, "/sdcard/yzm.png");

          if (ms({ desc: "拖动滑块完成拼图" })) {
            if (huadong_key) {
              //滑动验证
              var types = 1318;
              var yz = yzm.bounds();
              var sssimg = images.read("/sdcard/yzm.png");
              var img__ = getCode(sssimg, types);
              log(img__);
              img__ = img__.data.res.split(",")[0];
              img__ = Number(img__);
              log(yz.left);
              log(img__);
              swipe(90, 800, img__ + yz.left - 10, 800, 1000);
              huadong_key = false;
            } else {
              click(98, 888);
            }
          } else if (ms({ desc: "请在下图依次点击：" })) {
            //文字验证
            sleep(5000);
            var types = 1303;
            var yz = yzm.bounds();
            var sssimg = images.read("/sdcard/yzm.png");
            var img__ = getCode(sssimg, types);
            log(img__);
            img__ = img__.data.res.split("|");
            log(yz.left);
            log(img__);
            for (var i = 0; i < img__.length; i++) {
              click(
                Number(img__[i].split(",")[0]) + yz.left,
                Number(img__[i].split(",")[1]) + yz.top
              );
            }
            sleep(1000);
            click(454, 981);
          }
        }
      } else if (jsclick("text", "密码登录")) {
        setText([0],fdpassword)
        sleep(2000)
        click(110,606)
      }else if (jsclick("text", "其他验证方式验证",true,2)) {
      }else if (jsclick("text", "其他信息验证",true,2)) {
      }else if (jsclick("text", "下一步")) {
        jsclick("id", "cb_all_not",true,2)
        jsclick("text", "以上都不是",true,2)
        jsclick("text", "下一步",true,2)
      }else if (jsclick("id", "ib_close",true,2)) {
      } else if (jsclick("id", "closeDialog",true,2)) {
      }else if (jsclick("id", "fl_content",true,2)) {
      }else if (jsclick("text", "首页") && jsclick("text", "我的")) {
        return true
      }
      Tips();
      sleep(1000);
    }
  }
}

//后台获取任务
function get_task() {
  url = "http://wenfree.cn/api/Public/tjj/?service=Tjj.gettask";
  postArr = {};
  postArr["phonename"] = fzphonename 
  postArr["imei"] = fzimei 
  var taskData = jspost(url, postArr);

  if (taskData != null) {
    taskData = JSON.parse(taskData);
    if (taskData["data"] == "新增手机" || taskData["data"] == "暂无任务") {
      toast("无任务-休息30秒");
      sleep(30000);
      return false;
    } else {
      return taskData["data"];
    }
  }
}
//后台返回任务成功
function back_pass(task_id, success) {
  url = "http://wenfree.cn/api/Public/tjj/?service=Tjj.backpass";
  postArr = {};
  postArr.task_id = task_id;
  postArr.success = success;
  log(jspost(url, postArr));
}


//获取指定日期数据,用于复登项目
function callbackinfo(){
  url = "http://ymapi.wenfree.cn/?s=App.Bhapi.Get";
  postArr = {};
  postArr["name"] =  w_name
  postArr["date"] =  w_appid
  var taskData = jspost(url, postArr);
  if (taskData != null) {
    taskData = JSON.parse(taskData);
    return taskData["data"]
  }else{
    log(taskData)
    return false
  }
}
//获取指定日期数据,用于复登项目完成后回调
function backcallbackinfo(){
  url = "http://ymapi.wenfree.cn/?s=App.Bhapi.Back";
  postArr = {};
  postArr["id"] = fdid
  var taskData = jspost(url, postArr);
  if (taskData != null) {
    taskData = JSON.parse(taskData);
    return taskData["data"]
  }else{
    log(taskData)
    return false
  }
}

events.on("exit", function () {
  console.hide();
});

// 正式开始编代码
var width = 720;
var height = 1440;
var width = device.width;
var height = device.height;
var phoneMode = device.brand;

log([currentPackage(), currentActivity(), width, height]);
var appinfo = {};
appinfo.name = "Hello语音";
shebeibianhao = "anzhuohb026"; //手机标识
phone_imei = shebeibianhao //手机标识
phone_name = shebeibianhao //手机标识
fzphonename = "anzhuo1"; //分组标识
fzimei = "hemayun1";//分组标识

appinfo.bid = "com.yy.huanju";
appinfo.llq = "com.tencent.mtt";
appinfo.gzbid = "com.deruhai.guangzi";
appinfo.sbdsbid = "com.longene.setcardproperty";
info = {};
info.phone = "18128823268";
info.password = "AaDd112211";
info.api = "http://sms.wenfree.cn/public/";
info.yzm = "";
info.smsname = "";

appinfo.imei = "";
appinfo.oaid = myRand();
appinfo.device = "";
appinfo.brand = "";
appinfo.password = "Aa112211";


if (!requestScreenCapture()) {
  toast("请求截图失败");
  exit();
}
// console.show();
regok = false;
sbdsJk()
while (true) {
  try {
    while (true) {
      if (false || hmip()) {
        var worklist = get_task();
        log(worklist)
        if (worklist) {
          w_name = worklist[0]["work"]
          w_adid = worklist[0]["adid"]
          w_appid = worklist[0]["appid"]
          w_appbid = worklist[0]["appbid"]
          w_keyword = worklist[0]["keyword"]
          if (regok) {
            if (false || sbdsJk()) {
              // if (false || sbds()) {
              if (getsbds()) {
                regok = false;
              }
            }
          }else if (w_adid == "复登") {
            fdwork = callbackinfo()
            log(fdwork)
            var fdid = fdwork["id"]
            var fdphone = fdwork["phone"]
            var fdpassword = fdwork["password"]
            var fdaccount = fdwork["account"]
            if (fdaccount == "改密成功"){
             if (fudeng()) {
              // backcallbackinfo()
              back_pass(worklist[0]["task_id"], "ok");
            }
            }else{ 
            }
            regok = true;
          }else if (main()) {
             repw()
            back_pass(worklist[0]["task_id"], "ok");
            regok = true;
          }
        }
      }
    }
  } catch (e) {
    toastLog(e);
    sleep(1000);
  }
}






