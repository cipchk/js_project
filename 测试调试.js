importClass(android.content.ContentResolver);
importClass(android.database.Cursor);
importClass(android.net.Uri);

function open_img() {
  var thread = threads.start(function () {
    while (true) {
      if (click("立即开始")) {
        log("立即开始");
      }
      sleep(1000);
    }
  });
  requestScreenCapture();
  sleep(1000 * 5);
  thread.interrupt();
  log("open end");
}
// open_img()

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
} //下载app
function download(appname) {
  var timeLine = new Date().getTime();
  while (new Date().getTime() - timeLine < 10 * 60 * 1000) {
    var storePid = "com.xiaomi.market";
    var phoneMode = device.brand;
    if (phoneMode == "Coolpad") {
      storePid = "com.qiku.cloudfolder";
    }

    if (active(storePid, 5)) {
      var UI = currentActivity();
      log("UI", UI);
      switch (UI) {
        case "com.xiaomi.market.ui.MarketTabActivity":
          log("主界面");
          jsclick("id", "search_text_switcher", true, 2);
          setText(0, appname);
          sleep(2000);

          if (ms({ descMatches: appname + ".*", id: "app_icon" }, true, 2)) {
          } else if (
            ms({ textMatches: appname, id: "display_name" }, true, 2)
          ) {
          } else if (
            ms({ textMatches: appname + ".*", id: "display_name" }, true, 2)
          ) {
          } else if (ms({ text: appname + "图形" }, true, 2)) {
          } else if (ms({ desc: appname + "图形" }, true, 2)) {
          } else if (ms({ text: appname }, true, 2)) {
          }
          break;
        case "com.xiaomi.market.ui.SearchActivityPhone":
          log("搜索页面");

          if (ms({ descMatches: appname + ".*", id: "app_icon" }, true, 2)) {
          } else if (
            ms({ textMatches: appname, id: "display_name" }, true, 2)
          ) {
          } else if (
            ms({ textMatches: appname + ".*", id: "display_name" }, true, 2)
          ) {
          } else if (ms({ text: appname + "图形" }, true, 2)) {
          } else if (ms({ desc: appname + "图形" }, true, 2)) {
          } else if (ms({ text: appname }, true, 2)) {
          }
          break;
        case "com.xiaomi.market.ui.AppDetailActivityInner":
          log("app详情页面");
          if (
            ms(
              { id: "J_detailInstallBtn", depth: 11, textMatches: "打开" },
              false,
              4
            )
          ) {
            return true;
          } else if (
            ms(
              {
                className: "android.widget.EditText",
                depth: 11,
                textMatches: "安装.*|升级|继续",
              },
              true,
              4
            )
          ) {
          } else if (
            ms(
              {
                className: "android.widget.EditText",
                depth: 11,
                textMatches: "暂停|安装中",
              },
              false,
              4
            )
          ) {
            toastLog("暂停或安装中");
          }
          break;
        case "com.xiaomi.market.ui.detail.AppDetailActivityInner":
          log("app详情页面");
          var detail_download = id("detail_download").findOne(500);
          if (detail_download) {
            var detail_download_text = detail_download.desc();

            if (detail_download_text == "打开") {
              log("下载完成");
              return true;
            } else if (detail_download_text == "安装中") {
              log("安装中");
              toast("安装中");
            } else if (
              detail_download_text.search("安装") == 0 ||
              detail_download_text == "升级" ||
              detail_download_text == "继续"
            ) {
              click__(detail_download);
              sleep(3000);
              jsclick("text", "立即下载", true, rd(2, 3));
            } else if (detail_download_text.search("%") == 0) {
              log("正在下载中");
              toast("正在下载中,会下载10分钟左右");
              sleep(1000);
            } else {
              log(detail_download_text);
            }
          }
          break;
        case "com.qiku.cloudfolder.ui.activity.main.MainActivity":
          log("CoolPa 主界面");
          jsclick("id", "text_main_search_word", true, rd(2, 3));
          break;
        case "com.qiku.cloudfolder.ui.activity.search.AppSearchActivity":
          log("准备搜索");
          setText(0, appname);
          jsclick("id", "search_app", true, 8);

          ms({ textMatches: appname, id: "vertical_app_name" }, true, 3);

          break;
        case "com.qiku.cloudfolder.ui.activity.details.AppDetailsActivity":
          log("app详情页面");

          var state = id("details_app_download_progress").findOne(200);
          if (state) {
            let txt = state.text();
            if (txt == "等待中" || txt == "下载中") {
            } else if (txt == "已暂停" || txt == "安装" || txt == "升级") {
              click__(state, 3, state.text());
            } else if (txt == "打开") {
              return true;
            }

            toastLog(txt);
          }
          break;
        default:
          back();
      }
    }

    sleep(1000);
  }
}
//发广播
function sendBroadcast(appName, data) {
  var mapObject = {
    appName: appName,
    data: data,
  };
  app.sendBroadcast({
    packageName: "com.flow.factory",
    className: "com.flow.factory.broadcast.TaskBroadCast",
    extras: mapObject,
  });
}
//滑动函数
function moveTo(x, y, x1, y1, times) {
  swipe(x, y, x1, y1, times);
  sleep(1000);
}
//新tips
function Tips() {
  log("查询弹窗");

  let appTips = [
    { text: "同意" },
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

//设备大师
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

//上传
function Idfa(ohter) {
  let postArr = {};
  postArr["name"] = appinfo.name;
  postArr["account"] = appinfo.imei;
  postArr["idfa"] = appinfo.oaid;
  postArr["phone"] = phone_num;
  postArr["ohter"] = ohter || "";
  postArr["password"] = appinfo.brand;
  let data = jspost(
    "http://wenfree.cn/api/Public/idfa/?service=idfa.idfa",
    postArr
  );
}

function getimgs() {
  sleep(1000);
  captureScreen("/sdcard/screencapture.png");
  var src = images.read("/sdcard/screencapture.png");
  log(width, device.height, src.getWidth(), src.getHeight());
  var clip = images.clip(src, 740, 148, (692 - 536) / 2, (344 - 266) / 2);
  // var clip = images.clip(src, 840,133, (692-536)/2,(344-266)/2 );         //真机
  images.save(clip, "/sdcard/yzm.png");
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

//扯淡联盟
function main() {
  var xianyang = 0;
  var homeUI = true;
  var phone_key = true;
  var sms_key = false;
  var regok_key = false;
  var timeLine = new Date().getTime();
  while (new Date().getTime() - timeLine < 3 * 60 * 1000) {
    xianyang++;
    log(timeLine - new Date().getTime());

    if (active(appinfo.bid, 4)) {
      if (jsclick("id", "imgClose", true, 2)) {
      }
      var UI = currentActivity();
      log("UI", UI);
      switch (UI) {
        case "com.ch.myframe.ui.activity.MainActivity":
          log("主界面");
          if (regok_key) {
            Idfa("注册成功");
            return true;
          }
        case "com.ch.myframe.ui.activity.login.LoginActivity":
          log("注册界面");
          if (phone_key) {
            if (jsclick("id", "et_phone", true, 2)) {
              if (phone_key) {
                phone_num = getPhone();
                setText([0], phone_num);
                phone_key = false;
                sms_key = true;
              }
            }
          } else if (sms_key) {
            {
              if (jsclick("text", "获取验证码", true, 2)) {
              } else {
                sms_num = getMessage();
                if (sms_num) {
                  jsclick("text", "请输入验证码");
                  setText([1], sms_num);
                  sms_key = false;
                  regok_key = true;
                }
              }
            }
          } else {
            jsclick("text", "登录/注册", true, 2);
          }
          break;
        case "com.soyoung.module_login.activity.NewLoginActivity":
          break;
      }
    }

    Tips();
    sleep(1000);
  }
}

function yuedu() {
  var xianyang = 0;
  var homeUI = true;
  var phone_key = true;
  var sms_key = true;
  var regok_key = false;
  var timeLine = new Date().getTime();
  while (new Date().getTime() - timeLine < 2 * 60 * 1000) {
    xianyang++;
    log(timeLine - new Date().getTime());

    if (active(appinfo.bid, 4)) {
      if (jsclick("id", "imgClose", true, 2)) {
      }
      var UI = currentActivity();
      log("UI", UI);
      switch (UI) {
        case "com.yyhd.joke.streamapp.main.MainActivity":
          log("推荐界面");
          if (jsclick("text", "首页", true, 2)) {
          } else if (jsclick("id", "iv_anim")) {
            moveTo(400, 1008, 399, 516, 300);
            moveTo(400, 1008, 399, 516, 300);
            moveTo(400, 1008, 399, 516, 300);
            click(516, 300);
          }
          break;
      }
    }

    Tips();
    sleep(1000);
  }
}
// 正式开始编代码
var width = 720;
var height = 1440;
var width = device.width;
var height = device.height;
var phoneMode = device.brand;

log([currentPackage(), currentActivity(), width, height]);
var appinfo = {};
appinfo.name = "爱浪";
appinfo.bid = "com.wserve.woalalang";
appinfo.llq = "com.tencent.mtt";
appinfo.gzbid = "com.deruhai.guangzi";
appinfo.sbdsbid = "com.longene.setcardproperty";
info = {};
info.phone = "18128823268";
info.password = "AaDd112211";
info.api = "http://sms.wenfree.cn/public/";
info.yzm = "";
info.smsname = "";

// sbdsJk()
// getsbds()
// console.show();
function get_task() {
  url = "http://wenfree.cn/api/Public/tjj/?service=Tjj.gettask";
  postArr = {};
  postArr["phonename"] = "anzhuo1";
  postArr["imei"] = "hemayun1";
  taskData = jspost(url, postArr);

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

function back_pass(task_id, success) {
  url = "http://wenfree.cn/api/Public/tjj/?service=Tjj.backpass";
  postArr = {};
  postArr.task_id = task_id;
  postArr.success = success;
  log(jspost(url, postArr));
}

events.on("exit", function () {
  console.hide();
});

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

// while (true) {
//   try {
//     while (true) {
//       if (false || hmip()) {
//         TaskDate = get_task();
//         if (TaskDate) {
//           if (false || sbdsJk()) {
//             if (false || sbds()) {
//             if (getsbds()) {
//               if (open_url()) {
//                 if (main()) {
//                   yuedu();
//                   Idfa("激活成功");
//                 }
//                 back_pass(TaskDate[0]["task_id"], "ok");
//               }
//             }
//           }
//         }
//       }
//     }
//   } catch (e) {
//     toastLog(e);
//     sleep(1000);
//   }
// }

// function myRand() {
//   myrandS = "";
//   for (var i = 0; i < 15; i++) {
//     HexRan = [
//       "0",
//       "1",
//       "2",
//       "3",
//       "4",
//       "5",
//       "6",
//       "7",
//       "8",
//       "9",
//       "a",
//       "b",
//       "c",
//       "d",
//       "e",
//       "f",
//       "A",
//       "B",
//       "C",
//       "D",
//       "E",
//       "F",
//     ];
//     HexRan = HexRan[random(0, 21)];
//     myrandS = myrandS + HexRan;
//   }
//   return myrandS;
// }

// var all_Info = classNameMatches(/.*/).find();
// for (var i = 0; i < all_Info.length; i++) {
//   var d = all_Info[i];
//   log(i, d.id(), d.text(), d.depth());
// }

// function nmbc(nmbk) {
//   var nmbk = String(nmbk);
//   log(nmbk);
//   const nmbkey_list = {
//     0: [360, 1219],
//     1: [196, 883],
//     2: [363, 883],
//     3: [523, 883],
//     4: [196, 993],
//     5: [363, 993],
//     6: [523, 993],
//     7: [196, 1106],
//     8: [363, 1106],
//     9: [523, 1106],
//   };
//   for (var i = 0; i < nmbk.length; i++) {
//     let yzms = Number(nmbk[i]);
//     log(yzms);
//     click_(nmbkey_list[yzms][0], nmbkey_list[yzms][1]);
//   }
// }
// var yzm_ = 123456;
// var ids = id("input__phone_verification_pin").findOne(200);
// if (ids) {
//   click__(ids);
// }
// nmbc(yzm_);


// rdnamne()
// log(rdnamne())

// sleep(5000)
// moveTo(234,313,445,331,200)
// jjsclick("id", "isagree", true, rd(2, 3))
// setText([0],"aaaaaaaaaa")
// setText([1],"aaaaaaaaaa")
// setText([2],"aaaaaaaaaa")
// setText([3],"aaaaaaaaaa")
// setText([4],"aaaaaaaaaa")
// setText([5],"aaaaaaaaaa")
// setText([6],"aaaaaaaaaa")

// jsclick("text", "      ",true,2)


// app.openUrl("https://passport.qpgame.com/user/register.aspx")


// jieguo = id("isagree").checked(false).findOne(200)
// if (jieguo){
//   click__(jieguo)
// }


// if (jsclick("text", "请按住滑块，拖动到最右边")) {
//   moveTo(234,313,445,331,200)
// } 

function getLogin() {
  let url =
    "http://www.yhcgx.com:81/login?username=yangmian1167&password=yangmian121";
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
  iid = "18156";
  let getArr = {};
  let url =
    "http://www.yhcgx.com:81/getphone?token=" +
    token +
    "&id=18156"
  let data = http.get(url);
  if (data) {
    data = data.body.string();
    data = JSON.parse(data);
    log(data);
    if (data.msg == "success") {
      data = data.phone;
      log(data);
      return data;
    }
  }
  toastLog("取手机号出错");
}
//取短信
function getMessage() {
  iid = "18156";
  let getArr = {};
  let url =
    "http://www.yhcgx.com:81/getmessage?token=" +
    token +
    "&id=18156" +
    "&phone=" +
    phone_num;
  for (var i = 0; i < 25; i++) {
    let data = http.get(url);
    if (data) {
      data = data.body.string();
      data = JSON.parse(data);
      log(data);
      if (data) {
        if (data.code == "0") {
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

//获取ip
function get_ip() {
  let url =
    "http://pv.sohu.com/cityjson?ie=utf-8";
  let data = http.get(url);
  if (data) {
    data = data.body.string();
    log(data);
    data = data.split("=")[1];
    data = data.split(";")[0];
    ip = JSON.parse(data)["cip"]
    log(ip);
    return ip;
  }
  toastLog("未能获取IP");
}
//光子vpn
function gzvpn() {
  while (true) {
    if (active("com.deruhai.guangzi"),4) {
      if ( jsclick("text","切换节点",true)){
        sleep(5000)
        if (get_ip()) {
          return true
        }else {
          toastLog("获取ip失败")
        }
      }
      sleep(2000)
    }
  } 
}
//抹机王一键新机
function mjw() {
  while (true) {
    if (active("com.yztc.studio.plugin"),4) {
      if ( jsclick("text","一键抹机/一键新机",true)){
      }else if ( jsclick("text","任务结束-点击返回",true)){
        return true
      }
      sleep(2000)
    }
  } 
}


function get_task() {
  url = "http://wenfree.cn/api/Public/tjj/?service=Tjj.gettask";
  postArr = {};
  postArr["phonename"] = "anzhuo1";
  postArr["imei"] = "hemayun1";
  taskData = jspost(url, postArr);

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

function back_pass(task_id, success) {
  url = "http://wenfree.cn/api/Public/tjj/?service=Tjj.backpass";
  postArr = {};
  postArr.task_id = task_id;
  postArr.success = success;
  log(jspost(url, postArr));
}

events.on("exit", function () {
  console.hide();
});

// while (true) {
//   try {
//     while (true) {
//       if (true || hmip()) {
//         TaskDate = get_task();
//         if (TaskDate) {
//           for (let k in TaskDate) {
//             if (true || sbdsJk()) {

//               back_pass(TaskDate[k]["task_id"], "ok");
//                 sleep(5000);
                    
              
//             }
//           }
//        }
//       }
//     }
//   } catch (e) {
//     toastLog(e);
//     sleep(1000);
//   }
// }


console.show();
//设备大师备份
function sbdsJkbf() {
  active(appinfo.sbdsbid, 8);

  var result = shell("setphone backup  " + appinfo.bid, true);
  log(result);
  if (result.code == 0) {
    toast("一键备份 执行成功");
    log("一键备份 执行成功");
    nameid = result.result
  } else {
    toast("一键备份 执行失败！请到控制台查看错误信息");
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
//设备大师恢复备份
function sbdsJkhf(backid) {
  active(appinfo.sbdsbid, 8);

  var result = shell("setphone restore  " + backid, true);
  log(result);
  if (result.code == 0) {
    toast("一键恢复 执行成功");
    log("一键恢复 执行成功");
    nameid = result.result
  } else {
    toast("一键恢复 执行失败！请到控制台查看错误信息");
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
appinfo.bid = "com.jindong.app.mall"

//设备大师指定参数
function sbdsJkzd(id) {
  active(appinfo.sbdsbid, 8);

  var result = shell("setphone -a "+id, true);
  log(result);
  if (result.code == 0) {
    toast("一键指定 执行成功");
    log("一键指定 执行成功");
    nameid = result.result
  } else {
    toast("一键指定 执行失败！请到控制台查看错误信息");
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

function getid() {
  let url =
    "https://adx-bid.jm-ssp.cn/dpapi?sid=2020790";
  let data = http.get(url);
  if (data) {
    data = data.body.string();
    data = JSON.parse(data);
    log(data);
    id_ = data.data.request_info.device.android_id;
    clickurl_ = data.data.response_info.seatbid[0].bid[0].click_url
    unique_id = data.data.request_info.id
    log(id_);
    log(clickurl_);
    log(unique_id)
    return true
  }
  toastLog("登录出错");
}
// id = "dea5c76e63768285"
// sbdsJkzd(id)
getid()






