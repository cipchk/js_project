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
      "http://sms.wenfree.cn/public/?service=App.SmsNew.GetPhone" +
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
        "http://sms.wenfree.cn/public/?service=App.SmsNew.GetMessage" +
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
  //河北上传
  function Idfa_hb(ohter) {
    let postArr = {};
    postArr["name"] = appinfo.name;
    postArr["account"] = appinfo.imei;
    postArr["idfa"] = appinfo.oaid;
    postArr["phone"] = phone_num;
    postArr["ohter"] = ohter;
    postArr["password"] = rd_password;
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
          captchaMaxLength: 8,
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

  if (!requestScreenCapture()) {
    toast("请求截图失败");
    exit();
  }
  //数字键盘点击
  function nmbc(nmbk) {
    var nmbk = String(nmbk);
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
      log(yzms);
      click_(nmbkey_list[yzms][0], nmbkey_list[yzms][1]);
    }
  }
  //领英
  function main() {
    rd_names = rdnamne()    //随机姓名
    rd_password = myRand()
    var xianyang = 0;
    var homeUI = true;
    var phone_key = true;
    var sms_key = false;
    var regok_key = false;
    var dama_key = true;
    var timeLine = new Date().getTime();
    while (new Date().getTime() - timeLine < 3 * 60 * 1000) {
      xianyang++;
      log(timeLine - new Date().getTime());
      if (active(appinfo.bid, 4)) {
        if (jsclick("text", "立即加入", true, 2)) {
        } else if (jsclick("text", "立即免费加入领英！")) {
          phone_num = hb_getPhone();
          
          setText([0], rd_names);
          sleep(2000);
          setText([1], phone_num);
          sleep(2000);
          setText([2], rd_password);
          sleep(2000);
          jsclick("text", "同意并加入", true);
          phone_key = false;
          sms_key = true;
        } else if (ms({ desc: "Recaptcha 要求验证. 进行人机身份验证" })) {
          if (ms({ desc: "换一个新的验证码" })) {
            if (dama_key) {
              log("找到");
              captureScreen("/sdcard/screencapture.png");
              var src = images.read("/sdcard/screencapture.png");
              var clip = images.clip(src, 60, 170, 600, 960);
              images.save(clip, "/sdcard/yzm.png");
              var types = 1303;
              var sssimg = images.read("/sdcard/yzm.png");
              var img__ = getCode(sssimg, types);
              log(img__);
              img__ = img__.data.res.split("|");
              log(img__);
              for (var i = 0; i < img__.length; i++) {
                click(
                  Number(img__[i].split(",")[0]) + 60,
                  Number(img__[i].split(",")[1]) + 170
                );
              }
              click(444, 1030);
              dama_key = false;
            } else {
              click_(72, 1090);
              sleep(3000);
              dama_key = true;
            }
          } else if (ms({ desc: "缺少 noCAPTCHA 用户回复码或该码无效。" })) {
            return false;
          } else if (ms({ desc: "隐私权" })) {
            click(72, 168);
          }
        } else if (ms({ desc: "请输入发送到您手机的验证码。" })) {
          var sms_num = hb_getMessage();
          if (sms_num) {
            // toastLog(sms_num);
            sleep(3000);
            var ids = id("input__phone_verification_pin").findOne(200);
            if (ids) {
              click__(ids);
              sleep(3000);
              nmbc(sms_num);
              click(32, 678);
              sms_key = false;
              regok_key = true;
            }
          }
        } else if (
          regok_key &&
          jsclick(
            "id",
            "growth_onboarding_position_fragment_navigation_button_container"
          )
        ) {
          return true;
        }
        Tips();
        sleep(1000);
      }
    }
  }

  function myRand() {
    myrandS = "";
    for (var i = 0; i < 10; i++) {
      HexRan = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","A","B","C","D","E","F",
      ];
      HexRan = HexRan[random(0, 21)];
      myrandS = myrandS + HexRan;
    }
    return myrandS;
  }
  function rdnamne(){
    let xin = [
      "赵","钱","孙","李","周","吴","郑","王","冯","陈","褚","卫","蒋",
      "沈","韩","杨","朱","秦","尤","许","何","吕","施","张","孔","曹",
      "严","华","金","魏","陶","姜","戚","谢","邹","喻","柏","水","窦",
      "章","云","苏","潘","葛","奚","范","彭","郎","鲁","韦","昌","马",
      "苗","凤","花","方","俞","任","袁","柳","酆","鲍","史","唐","费",
      "廉","岑","薛","雷","贺","倪","汤","滕","殷","罗","毕","郝","邬",
      "安","常","乐","于","时","傅","皮","卞","齐","康","伍","余","元",
      "卜","顾","孟","平","黄","和","穆","萧","尹","姚","邵","湛","汪",
      "祁","毛","禹","狄","米","贝","明","臧","计","伏","成","戴","谈",
      "宋","茅","庞","熊","纪","舒","屈","项","祝","董","梁","杜","阮",
      "蓝","闵","席","季","麻","强","贾","路","娄","危","江","童","颜",
      "郭","梅","盛","林","刁","钟","徐","邱","骆","高","夏","蔡","田",
      "樊","胡","凌","霍","虞","万","支","柯","咎","管","卢","莫","经",
      "房","裘","缪","干","解","应","宗","宣","丁","贲","邓","郁","单",
      "杭","洪","包","诸","左","石","崔","吉","钮","龚","程","嵇","邢",
      "滑","裴","陆","荣","翁","荀","羊","於","惠","甄","魏","加","封",
      "芮","羿","储","靳","汲","邴","糜","松","井","段","富","巫","乌",
      "焦","巴","弓","牧","隗","山","谷","车","侯","宓","蓬","全","郗",
      "班","仰","秋","仲","伊","宫","宁","仇","栾","暴","甘","钭","厉",
      "戎","祖","武","符","刘","姜","詹","束","龙","叶","幸","司","韶",
      "郜","黎","蓟","薄","印","宿","白","怀","蒲","台","从","鄂","索",
      "咸","籍","赖","卓","蔺","屠","蒙","池","乔","阴","郁","胥","能",
      "苍","双",
    ]
    let ming = [
      "卫国","虹君","东亮","品阎","品妍","奕宣","品颜","浩宇","品闫",
      "韵澄","亚男","晓初","潆龙","桂英","浩然","浩均","琳","宇辰",
      "博雯","泽西","泺西","博西","淋西","洛西","乐惜","萌","若溪",
      "均泽","丽米","丽敏","若霖","筠达","多多","筠泽","珍多","真多",
      "佳仪","佳益","佳沂","佳艺","珈艺","唯","一唯","靖埕","丽红",
      "泊雯","亮","琼","姿言","征月","小琼","伟","坤","炜","品严",
      "品开","冉佳","发和","琨","玲","佳乐","畅","向春","玥娴","刚",
      "宇杰","海东","家驹","丽琴","博通","文贤","小琴","广通","丽琇",
      "诚","学豪","展成","展灰","灰展","展森","森展","展城","旭成",
      "成旭","旭","辉煌","展水","展翔","展翅","展吉","程","广燕",
      "珈萱","碎英","龙风","成祥","成龙","晨洋","一平","新建","玮",
      "凤英","晓聪","孝聪","骊嫒","王成","小美","振智","侃","晨",
      "元","晨安","昕怡","晨周","晨新","佳妍","晨曦","晨辉","晨晖",
      "晨徽","晨珲","拴提","晨智","晨志","晨治","晨昊","晨晞","晨炜",
      "晨显","晨踌","晨宝","晨郑","晨丰","晨灿","学森","晨陈","晨层",
      "晨彰","晨鞑","晨郦","晨传","晨岛","晨帝","康恒","晨只","恒康",
      "晨中","苏恒","康","恒苏","建江","臻","蓉蓉","玉珍","建农","冰蕾",
      "志强","泠含","宇韬","潇匀","泠伊","潇文","红燕","宗安","未来",
      "同妍","韦亘","亘盈","建亭","松泉","建","至慧","生","明莉","叶",
      "韦谖","是惠","则霖","永杰","淑清","宁","学超","太","丹","邢一",
      "薇亦","静","舜","建舜","敏燕","全","荣国","海燕","芸","奕芸",
      "钰蕊","映日","映月","诤","映星","邢进","科","靖","逸清","逸青",
      "鹏军","玺宇","丽娅","丽娜","明","泽麟","金宝","钰锟","玉玺",
      "金玺","力","泳文","雅","海帆","雅丽","睿睿","国民","忠彦",
      "噌","君","红艳","映","晟","成","盈","呈","乐","嘉忆","麦子",
      "小芊","钊","梓旭","新宇","兴宇","家宝","文芳","岚","祥俊",
      "庆","钰睿","雪儿","春","钰芮","锦","孝","航雨","兴良","凯平",
      "思先","思危","艳琼","燕群","育凤","锋","建禹","建帝","建刚",
      "建强","建成","建峰","建安","建城","建国","慧","良钗","玲莉",
      "雨霖","羿帆","智民","鹏辉","佳","军","少敏","佳涵","恩卓","文卓",
      "炬","炯炯","利炜","烊烊","伟烊","圣菊","光旭","文烨","宁烨",
      "袁烨","光明","斌","宁烽","晓烽","小烽","日烽","立烽","玥彤",
    ]
      xins = xin[rd(0,xin.length)]
      mings = ming[rd(0,xin.length)]
      return xins+mings
    }
  // 正式开始编代码
  var width = 720;
  var height = 1440;
  var width = device.width;
  var height = device.height;
  var phoneMode = device.brand;

  log([currentPackage(), currentActivity(), width, height]);
  var appinfo = {};
  appinfo.name = "领英310";
  shebeibianhao = "anzhuohb001";
  phone_imei = shebeibianhao
  phone_name = shebeibianhao
  appinfo.bid = "com.linkedin.android";
  appinfo.llq = "com.tencent.mtt";
  appinfo.gzbid = "com.deruhai.guangzi";
  appinfo.sbdsbid = "com.longene.setcardproperty";
  info = {};
  info.phone = "18128823268";
  info.api = "http://sms.wenfree.cn/public/";
  info.yzm = "";
  info.smsname = "";



  //后台获取任务
  function get_task() {
    url = "http://wenfree.cn/api/Public/tjj/?service=Tjj.gettask";
    postArr = {};
    postArr["phonename"] = "anzhuo3";
    postArr["imei"] = "hemayun3";
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
  //后台返回任务成功
  function back_pass(task_id, success) {
    url = "http://wenfree.cn/api/Public/tjj/?service=Tjj.backpass";
    postArr = {};
    postArr.task_id = task_id;
    postArr.success = success;
    log(jspost(url, postArr));
  }

  var all_Info = textMatches(/.*/).find();
  for (var i = 0; i < all_Info.length; i++) {
    var d = all_Info[i];
    log(i, d.id(), d.text(), d.depth());
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
  var all_Info = textMatches(/.*/).find();
  var all_Info = classNameMatches(/.*/).find();
  // var all_Info = idMatches(/.*/).find();
  for (var i = 0; i < all_Info.length; i++) {
    var d = all_Info[i];
    log(
      i,
      d.id(),
      d.text(),
      "desc:" + d.desc(),
      '"className":"' + d.className() + '"',
      "clickable->" + d.clickable(),
      "selected->" + selected(),
      "depth->" + d.depth(),
      d.bounds().centerX(),
      d.bounds().centerY()
    );
  }
  // sbdsJk()
  // getsbds()
  // console.show();


  while (true) {
    try {
      while (true) {
        if (false || hmip()) {
          TaskDate = get_task();
          if (TaskDate) {
            if (false || sbdsJk()) {
              // if (false || sbds()) {
              if (getsbds()) {
                if (main()) {
                  Idfa_hb("注册成功");
                  back_pass(TaskDate[0]["task_id"], "ok");
                }
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
