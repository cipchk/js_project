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
    { textMatches: "允许" },
    { textMatches: "跳过" },
    { text: "下一步" },
    { text: "确定" },
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

  var result = shell("pm clear com.youxiang.soyoungapp", true);
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

//取手机号
function getPhone() {
  let postArr = {};
  postArr["s"] = "App.SmsWenfree.GetPhone";
  let data = jspost(info.api, postArr);
  if (data) {
    data = JSON.parse(data);
    let url = data["data"]["url"];
    info.smsname = data["data"]["name"];
    let res = http.get(url);
    res = res.body.string();
    log("res", res);

    postArr["s"] = "SmsWenfree.MakeGetPhone";
    postArr["name"] = info.smsname;
    postArr["arr"] = res;
    let datas = jspost(info.api, postArr);
    if (datas) {
      log(datas);
      datas = JSON.parse(datas);
      if (datas.data) {
        info.phone = datas.data;
        return true;
      }
    }
  }
  toastLog("取手机号出错");
}
//取短信
function getMessage() {
  let postArr = {};
  postArr["s"] = "App.SmsWenfree.GetSms";
  postArr["name"] = info.smsname;
  postArr["phone"] = info.phone;
  let data = jspost(info.api, postArr);
  if (data) {
    data = JSON.parse(data);
    let url = data["data"]["url"];
    let res = http.get(url);
    res = res.body.string();
    log(res);
    if (res.length > 6) {
      log("准备上传");
      postArr["s"] = "SmsWenfree.MakeGetSms";
      postArr["name"] = info.smsname;
      postArr["arr"] = res;
      let datas = jspost(info.api, postArr);
      if (datas) {
        datas = JSON.parse(datas);
        log(datas);
        if (datas.data) {
          info.yzm = datas.data;
          return true;
        }
      }
    }
  }
  toastLog("取手短信出错");
}
//取短信
function Idfa() {
  let postArr = {};
  postArr["service"] = "Idfa.idfa";
  postArr["name"] = appinfo.name;
  postArr["password"] = info.password;
  postArr["idfa"] = info.phone;
  let data = jspost("http://hb.wenfree.cn/api/Public/idfa/", postArr);
}

var all_Info = textMatches(/.*/).find();
for (var i = 0; i < all_Info.length; i++) {
  var d = all_Info[i];
  log(i, d.id(), d.text(), d.depth());
}

/**
 * 联众图像识别函数
 * @param {string} username 联众图像识别账号
 * @param {string} password 联众图像识别密码
 * @param {object} img 识别图片
 */

/**
 * 敬告使用者
 *
 * 联众识图网站SDK页面提供的接口、实例文件均为第三方开发，非联众识图开发，因技术原因，联众识图平台未进行代码审查，亦不能确定代码的功能作用，请接入的开发者审查代码后调用。如实例中包含恶意代码或针对某网站、软件的攻击行为，请联系联众识图平台删除链接。
 *
 * 联众识别平台仅为残障人士以及有需要的个人和企业提供图像识别和图像识别分类服务，联众平台仅仅被动接受开发者传入的图像返回图像中的文字或结果信息，不参与破解，不为恶意软件提供帮助，不针对任何网站或个人。
 * 请勿利用联众识别做违反国家法律法规的行为，否则强制停止使用，不予退费，联众将依法向有关部门递交您的个人资料！
 * 违法软件是指的是包括但不限于以下用途的软件：
 * 1、破解、入侵系统，或正常登录但超越授权范围获取信息。
 * 2、赌博
 * 3、薅羊毛
 * 4、批量登录、批量注册、批量支付
 * 5、游戏外挂、游戏辅助
 * 6、超越访问频率限制
 * 7、批量盗取公民个人信息，获取手机号、身份证等隐私信息
 *
 */

function getCode(img) {
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
        captchaType: 1001,
        captchaMinLength: 4,
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

//e充电
function main() {
  var xianyang = 0;
  var homeUI = true;
  var timeLine = new Date().getTime();
  while (new Date().getTime() - timeLine < 7 * 60 * 1000) {
    xianyang++;
    log(timeLine - new Date().getTime());

    if (active(appinfo.bid, 4)) {
      var click__ = ["社区", "首页"];

      // jsclick("text", click[rd(0, 1)], true, 15);
      if (jsclick("id", "imgClose", true, 2)) {
      }
      var UI = currentActivity();
      log("UI", UI);
      switch (UI) {
        case "com.soyoung.module_main.ui.MainActivity":
          log("主界面");
          if (jsclick("id", "imgClose", true, 2)) {
          } else if (className("android.widget.Image").depth(16).findOne(100)) {
            sleep(3000);
            click(388, 1063);
          } else if (
            className("android.widget.FrameLayout").depth(1).findOne(100)
          ) {
            sleep(3000);
            click(10, 1230);
          }
          break;
        case "com.soyoung.module_login.activity.WelcomeActivity":
          log("登录界面");
          shell(
            "am start -n  com.android.systemui/com.android.systemui.recents.RecentsActivity",
            true
          );
          sleep(3000);
          ms({ descMatches: "移除新氧医美.*" }, true, 5);
          break;
        case "com.soyoung.module_login.activity.NewLoginActivity":
          log("登录界面");
          shell(
            "am start -n  com.android.systemui/com.android.systemui.recents.RecentsActivity",
            true
          );
          sleep(3000);
          ms({ descMatches: "移除新氧医美.*" }, true, 5);
          break;
      }
    }

    Tips();
    sleep(1000);
  }
}
function daohang() {
  var xianyang = 0;
  var mainokKEY = false;
  var homeUI = true;
  var click__ = ["社区", "首页"];
  var click_ = [
    "面部轮廓",
    "皮肤管理",
    "鼻部",
    "眼部",
    "植发养发",
    "口腔齿科",
    "激光脱毛",
    "胸部",
    "除皱瘦脸",
    "美体塑形",
  ];
  var timeLine = new Date().getTime();
  while (new Date().getTime() - timeLine < 60 * 1000) {
    xianyang++;
    log(timeLine - new Date().getTime());
    if (active(appinfo.bid, 4)) {
      // jsclick("text", click[rd(0, 1)], true, 15);
      if (jsclick("id", "imgClose", true, 2)) {
      }
      var UI = currentActivity();
      log("UI", UI);
      switch (UI) {
        case "com.soyoung.module_main.ui.MainActivity":
          log("主界面");
          if (mainokKEY) {
            return true;
          }
          if (jsclick("text", click_[rd(0, 10)], true, 2)) {
            sleep(4000);
            back();
            sleep(4000);
            // for (var i = 0; i < 12; i++) {
            //   swipe(355, 887, 365, 623, 1200);
            //   sleep(1000);
            // }
            if (jsclick("text", click_[rd(0, 10)], true, 2)) {
              sleep(4000);
              back();
              sleep(3000);
              return true;
            }
          }
          break;
        // case "com.soyoung.module_login.activity.WelcomeActivity":
        //   sleep(3000);
        //   back();
        //   mainokKEY = true;
        //   break;
        // case "com.soyoung.module_login.activity.NewLoginActivity":
        //   sleep(3000);
        //   back();
        //   mainokKEY = true;
        //   break;
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
appinfo.name = "新氧医美";
appinfo.bid = "com.youxiang.soyoungapp";
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

events.on("exit", function () {
  console.hide();
});

while (true) {
  try {
    while (true) {
      if (false || hmip()) {
        let newphone_times = 0;
        while (newphone_times < 10) {
          newphone_times++;
          if (false || sbdsJk()) {
            // if (false || sbds()) {
            if (getsbds()) {
              // if (Distinctidfa()) {
              main();
              //     daohang();
              // //     Reportidfa();
              //   }
            }
          }
        }
      }
    }
  } catch (e) {
    toastLog(e);
    sleep(1000);
  }
}
