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
    return data;
  }
}

// 获取接口数据
function getTaskRecord() {
  var url = "http://api.wenfree.cn/public/";
  let res = http.post(url, {
    s: "NewsImeiTaskData.Task",
    imei: device.getIMEI(),
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
// 获取接口数据
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
// 获取接口数据
function getTask() {
  var url = "http://api.wenfree.cn/public/";
  let res = http.post(url, {
    s: "NewsImei.Imei",
    imei: device.getIMEI(),
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
  postdata["imei"] = device.getIMEI();
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
function jjsclick(way, txt, clickKey, sleeptime, height) {
  if (!sleeptime) {
    sleeptime = 1;
  } //当n没有传值时,设置n=1
  if (!height) {
    height = 2440;
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
      objs.bounds().centerY() > height
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
        click__(objs, sleeptime, txt);
      } else {
        log("找到->", txt);
      }
      return true;
    }
  }
}
//普通封装
function jsclick(way, txt, clickKey, sleeptime, height) {
  if (!sleeptime) {
    sleeptime = 1;
  } //当n没有传值时,设置n=1
  if (!height) {
    height = 1440;
  } //没有设置高度则height = 1440
  if (!clickKey) {
    clickKey = false;
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
      objs.bounds().centerY() > height
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
        if (!clickTrue(objs, sleeptime, txt)) {
          click__(objs, sleeptime, txt);
        }
      } else {
        log("找到->", txt);
      }
      return true;
    }
  }
}
//强制点击
function bclick(way, txt, clickKey, sleeptimes) {
  if (!sleeptimes) {
    sleeptimes = 1;
  } //当n没有传值时,设置n=1
  var obj = false;
  if (!clickKey) {
    clickKey = false;
  } //如果没有设置点击项,设置为false
  if (way == "text") {
    obj = text(txt).findOne(200);
  } else if (way == "id") {
    obj = id(txt).findOne(200);
  } else if (way == "desc") {
    obj = desc(txt).findOne(200);
  }
  if (obj) {
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
      let obj__ = obj.parent().parent();
      if (obj__ && obj__.clickable()) {
        obj__.click();
        log("父父组件能穿透");
        result = true;
      } else {
        log("父父组件不能穿透");
        let obj___ = obj.parent().parent().parent();
        if (obj___ && obj___.clickable()) {
          obj___.click();
          log("父父组件能穿透");
          result = true;
        } else {
          log("父父组件不能穿透");
        }
      }
    }
  }

  if (result) {
    sleep(sleeptime * 1000);
  }
  return result;
}
//正则点击
function ms(obj, clicks, sleeptimes, height) {
  if (!sleeptimes) {
    sleeptimes = 1;
  }
  if (!height) {
    height = 1440;
  }
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
      objs.bounds().centerY() > height
    ) {
      return false;
    }
    if (clicks) {
      if (!clickTrue(objs, sleeptimes)) {
        click__(objs, sleeptimes, txt);
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
//下载app
function download(appname) {
  var timeLine = new Date().getTime();
  while (new Date().getTime() - timeLine < 10 * 60 * 1000) {
    if (active("com.xiaomi.market", 5)) {
      var UI = currentActivity();
      log("UI", UI);
      switch (UI) {
        case "com.xiaomi.market.ui.MarketTabActivity":
          log("主界面");
          jsclick("id", "search_text_switcher", true, 2);
          setText(0, appname);
          break;
        case "com.xiaomi.market.ui.SearchActivityPhone":
          log("搜索页面");

          if (ms({ descMatches: appname + ".*图形.*" }, true, 3)) {
          } else if (ms({ textMatches: appname + ".*图形.*" }, true, 2)) {
          } else if (ms({ text: appname }, true, 2)) {
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
        default:
          back();
      }
    }
    Tips();
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
//滑动
function moveTo(x, y, x1, y1, times) {
  swipe(x, y, x1, y1, times);
  sleep(1000);
}

function Tips() {
  log("查询弹窗");
  var textTips = {};
  textTips["允许"] = "text";
  textTips["始终允许"] = "text";
  textTips["继续观看"] = "text";
  textTips["我知道了"] = "text";
  textTips["知道了"] = "text";
  textTips["我知道了，开始赚钱"] = "text";
  textTips["好的"] = "text";
  textTips["继续播放"] = "text";
  textTips["以后再说"] = "text";

  for (var k in textTips) {
    if (jsclick(textTips[k], k, true, 2)) {
      return false;
    }
  }
  log("查询弹窗-end");
  return true;
}

function regTips() {
  log("查询弹窗");
  var textTips = {};
  textTips["允许"] = "text";
  textTips["始终允许"] = "text";
  textTips["继续观看"] = "text";
  textTips["我知道了"] = "text";
  textTips["同意"] = "text";
  textTips["我知道了，开始赚钱"] = "text";
  textTips["好的"] = "text";
  textTips["继续播放"] = "text";
  textTips["以后再说"] = "text";

  for (var k in textTips) {
    if (jsclick(textTips[k], k, true, 2)) {
      return false;
    }
  }
  log("查询弹窗-end");
  return true;
}

// [500,1044,692,1238]
function eatTips() {
  var eat = text("吃饭补贴").findOne(100);
  if (eat) {
    var eatp = eat.parent();
    if (eatp) {
      var eatall = eatp.children();
      if (eatall) {
        if (eatall.length >= 3) {
          return jjsclick("text", "吃饭补贴", true, 2);
        }
      }
    }
  }
}

function main() {
  var taskkey = 0;
  var readtimes = 0;
  var movetoTimes = 0;
  var readKey = false;
  var searchKey = false;
  var 睡觉key = true;
  var 找任务次数 = 0;
  var 去领取 = 0;
  var 去搜索 = 0;
  var eat = true;
  var 去填写 = true;

  //控制是否卡住的参数
  var setp_ = null;
  var setp__ = null;
  var setp___ = 0;
  //整体轮数
  var tipslun = 0;
  //整体时间
  var timeLine = new Date().getTime();
  while (new Date().getTime() - timeLine < 8 * 60 * 1000) {
    var UI = currentActivity();
    log("UI", UI);

    if (active(appinfo.bid, 8)) {
      switch (UI) {
        case "com.ss.android.article.lite.activity.SplashActivity":
          log("主界面");
          setp_ = "主界面";
          //发现有金币的文章
          var ufcc = textMatches(/.*\ufffc.*/).findOne(100);
          if (ufcc) {
            click__(ufcc);
            sleep(rd(2000, 4000));
            var txt = className("android.widget.EditText").findOne(100);
            if (txt) {
              var txt = txt.text();
              txt = txt.substring(0, 4);
              var reg =
                "var title = textMatches(/" +
                txt +
                ".*/).className('android.widget.TextView').findOne(200);";
              eval(reg);
              if (title) {
                click__(title);
              } else {
                jsclick("text", "搜索", true, 2);
              }
              sleep(rd(1000, 5000));
              if (rd(1, 100) > 50) {
                moveTo(
                  width / 2,
                  height * 0.8,
                  width / 2,
                  height * 0.3,
                  random(1000, 2000)
                );
              }
              sleep(rd(1000, 5000));
            }
            break;
          }

          if (ms({ textMatches: "恭喜获得\\d+金币" }, false, 2)) {
            click_(360, 866);
            break;
          }

          if (ms({ textMatches: "去领\\d元现金" }, true, 2)) {
            break;
          }

          if (jsclick("text", "写评论...", false, 1)) {
            back();
            break;
          }

          var taskTime = text("任务").depth(10).findOne(100);
          if (taskTime) {
            taskkey++;
            if (taskkey > 2) {
              home();
              sleep(2000);
              click(width / 4, height - 20);
              sleep(2000);
              jsclick("id", "clearAnimView", true, 2);
              sleep(2000);
              taskkey = 0;
              break;
            }
            click__(taskTime);
            sleep(rd(3, 5) * 1000);
            if (jsclick("text", "看视频再领", true, 2)) {
            } else {
              click(596, 1083);
              sleep(2000);
              click((width * 1) / 2, (862 + 926) / 2);
            }
          } else {
            if (
              readKey &&
              jsclick("text", "我的", false, 1) &&
              jsclick("text", "首页", false, 1)
            ) {
              var home_selected = text("首页").selected(true).findOne(1000);
              if (home_selected) {
                moveTo(
                  width / 2,
                  height * 0.8,
                  width / 2,
                  height * 0.3,
                  random(200, 500)
                );
                if (rd(0, 100) > 50) {
                  moveTo(
                    width / 2,
                    height * 0.8,
                    width / 2,
                    height * 0.3,
                    random(500, 2000)
                  );
                }

                var titleTextArr = className("TextView").find();
                for (var i = 0; i < titleTextArr.length; i++) {
                  var d = titleTextArr[i];
                  log(i, d.id(), d.text(), d.text().length);
                  if (
                    i > 6 &&
                    d.text().length > 12 &&
                    d.bounds().centerY() > 300
                  ) {
                    log("文章标题");
                    clickTrue(d, rd(3, 5), "文章标题");
                    movetoTimes = 0;
                    break;
                  }
                }
              } else {
                jsclick("text", "首页", true, 2);
                jsclick("text", "首页", true, 2);
              }
            } else {
              if (ms({ textMatches: "看完视频再领" }, true, 5)) {
                break;
              }
              if (ms({ className: "android.app.Dialog" })) {
                home();
                sleep(2000);
                click(width / 4, height - 20);
                sleep(2000);
                jsclick("id", "clearAnimView", true, 2);
                sleep(2000);
                break;
              }

              var time = textMatches(/\d时\d+分\d+秒/).findOne(100);
              var 活动规则 = text("活动规则").findOne(100);
              if (
                (活动规则 && 活动规则.bounds().centerX() < 720) ||
                (time && time.bounds().centerX() < 720) ||
                jsclick("text", "开宝箱得金币", true, rd(3, 5))
              ) {
                log("任务界面");
                setp_ = "主界面-任务界面";
                moveTo(
                  width / 2,
                  height * 0.8,
                  width / 2,
                  height * 0.6,
                  random(1000, 2000)
                );

                if (eat && jjsclick("text", "吃饭补贴", true, 1)) {
                  eat = false;
                } else if (jjsclick("text", "去领取", true, 2)) {
                  睡觉key = false;
                } else if (jjsclick("text", "继续看", true, 20)) {
                  睡觉key = false;
                } else if (睡觉key && jjsclick("text", "睡觉赚钱", true, 2)) {
                  睡觉key = false;
                } else if (
                  info.phonekey &&
                  jjsclick("text", "去抽奖", true, 2)
                ) {
                  睡觉key = false;
                } else if (
                  去领取 < 2 &&
                  ms(
                    {
                      textMatches: "去领取.*",
                      className: "android.widget.Button",
                    },
                    true,
                    2
                  )
                ) {
                  if (
                    !ms(
                      {
                        textMatches: "去领取.*",
                        className: "android.widget.Button",
                      },
                      true,
                      2,
                      1050
                    )
                  ) {
                    moveTo(
                      width / 2,
                      height * 0.8,
                      width / 2,
                      height * 0.3,
                      random(1000, 2000)
                    );
                  }
                  ms(
                    {
                      textMatches: "去领取.*",
                      className: "android.widget.Button",
                    },
                    true,
                    2
                  );
                  去领取++;
                } else if (
                  去填写 &&
                  ms({ textMatches: "填写邀请.*" }, true, 2, 1000)
                ) {
                  去填写 = false;
                } else if (
                  去填写 &&
                  ms({ textMatches: "新用户.*" }, true, 2, 1000)
                ) {
                  去填写 = false;
                } else if (
                  去搜索 < 3 &&
                  ms({ textMatches: "去搜索.*" }, true, 2, 1000)
                ) {
                  去搜索++;
                  searchKey = true;
                } else if (ms({ textMatches: "去阅读.*" }, true, 2, 1100)) {
                  readKey = true;
                } else {
                  if (jsclick("text", "活动规则", false, 1, 1205)) {
                    return true;
                  }
                  moveTo(
                    width / 2,
                    height * 0.8,
                    width / 2,
                    height * 0.3,
                    random(1000, 2000)
                  );
                  找任务次数++;
                  if (找任务次数 > 8) {
                    readKey = true;
                  }
                }
              } else {
                var taskCenter = textMatches(/\d\d\:\d\d/).findOne(100);
                if (taskCenter) {
                  click__(taskCenter);
                } else {
                  back();
                  sleep(200);
                  back();
                }
              }
            }
          }

          break;
        case "com.ss.android.article.base.feature.detail2.view.NewDetailActivity":
          log(["readtimes", readtimes, "文章页面", "movetoTimes", movetoTimes]);
          setp_ = "文章页面";
          if (readKey && jsclick("text", "写评论…", false, 1)) {
            moveTo(
              width / 2,
              height * 0.8,
              width / 2,
              height * 0.3,
              random(300, 2000)
            );
            moveTo(
              width / 2,
              height * 0.8,
              width / 2,
              height * 0.3,
              random(300, 2000)
            );

            if (jsclick("text", "已显示全部评论")) {
              back();
            } else if (jsclick("text", "暂无评论，点击抢沙发")) {
              if (jsclick("text", "写评论…", true, rd(2, 3))) {
                setText(0, "非常支持");
                sleep(500);
                jsclick("text", "发布", true, 2);
                back();
              }
            }

            var commnet = text("回复").findOne(100);
            if (commnet && commnet.bounds().centerY() < 1400) {
              if (rd(0, 100) > 96) {
                if (jsclick("text", "写评论…", true, rd(2, 3))) {
                  setText(0, "非常支持");
                  sleep(500);
                  jsclick("text", "发布", true, 2);
                }
              }
              back();
              break;
            }

            var commnet = textMatches(/.*回复/).findOne(100);
            if (commnet && commnet.bounds().centerY() < 1200) {
              if (rd(0, 100) > 96) {
                if (jsclick("text", "写评论…", true, rd(2, 3))) {
                  setText(0, "非常支持");
                  sleep(500);
                  jsclick("text", "发布", true, 2);
                }
              }
              back();
              break;
            }

            movetoTimes++;
            if (movetoTimes > 20) {
              back();
            }
          } else {
            log("readKey", readKey, "可能没有找到[写评论…]");
            back();
          }
          break;
        case "com.android.bytedance.search.SearchActivity":
          log("搜索界面");
          setp_ = "搜索界面";
          if (searchKey) {
            var txt = textMatches(/.*「.*」.*/).findOne(100);
            if (txt) {
              var txt = txt.text();
              var txt = txt.replace(/.*「/, "");
              var txt = txt.replace(/」.*/, "");
              setText(0, txt);
            }

            jsclick("text", "搜索", true, rd(5, 10));
            if (rd(1, 100) > 50) {
              moveTo(
                width / 2,
                height * 0.8,
                width / 2,
                height * 0.3,
                random(1000, 2000)
              );
            }
            sleep(rd(1000, 5000));
            searchKey = false;
          } else {
            back();
          }
          break;
        case "com.ss.android.article.base.feature.detail2.view.NewVideoDetailActivity":
          log("视频文章");
          setp_ = "视频文章";
          back();
          break;
        case "com.bytedance.polaris.browser.PolarisBrowserActivity":
        case "com.bytedance.ug.sdk.luckycat.impl.browser.LuckyCatBrowserActivity":
          log("browser");
          setp_ = "browser";
          sleep(1200);
          if (ms({ text: "手机碎片" })) {
            while (ms({ textMatches: "今日剩\\d次" }, true, 2)) {
              jsclick("text", "知道了", true, 1);
            }
            info.phonekey = false;
            getTaskRecordUpdate(info);
            back();
            break;
          }

          var sleepTimes = textMatches(/已经睡了\d+小时\d+分钟了/).findOne(
            1000
          );
          if (sleepTimes) {
            var times = sleepTimes.text().replace("已经睡了", "");
            var times = times.replace(/小时\d+分钟了/, "");
            log(times);
            if (times >= 8) {
              jsclick("text", "我睡醒了", true, 2);
            } else {
              睡觉key = false;
            }
          }

          if (ms({ textMatches: "领取\\d+金币" }, true, 2)) {
          }

          jsclick("text", "我要睡了", true, 2);

          if (ms({ textMatches: "领取.*\\d+金币" }, true, 2)) {
          }

          if (jsclick("text", "邀请码", false, 1)) {
            var url = "http://api.wenfree.cn/public/";
            var postdata = {};
            postdata["s"] = "App.NewsAppInfoCode.AppGetCode";
            postdata["imei"] = device.getIMEI();
            postdata["app_name"] = appinfo.name;
            postdata["whos"] = "18128823268";
            var imeiinfo = jspost(url, postdata);
            if (imeiinfo) {
              imeiinfo = JSON.parse(imeiinfo);
              log(imeiinfo.data.code);
              setClip(imeiinfo.data.code);
              setText(0, imeiinfo.data.code);
              sleep(5000);
            }
            jsclick("text", "马上提交", true, rd(3, 5));
          }
          back();
          break;
        case "com.ss.android.excitingvideo.ExcitingVideoActivity":
          log("视频广告页面");
          setp_ = "视频广告页面";
          if (jsclick("text", "继续观看")) {
            let d = textMatches(/再看\d+秒，可领取\d+金币～/).findOne(200);
            if (d) {
              let dtimes = d.text().replace(/[^0-9，]/g, "");
              let timesArr = dtimes.split("，");
              jsclick("text", "继续观看", true, 1);
              sleep(timesArr[0] * 1000);
            }
          }
          jsclick("text", "关闭广告", true, 1);
          jsclick("text", "关闭试玩", true, 1);
          if (ms({ textMatches: "\\d+.*", depth: 6 })) {
          } else {
            jsclick("text", "关闭", true, 0.5);
          }
          break;
        default:
          setp_ = "其它";
          back();
      }
    }

    //读取当前界面信息
    toastLog(
      currentPackage() + "\n" + UI + "\nsetp_=" + setp_ + "setp___=" + setp___
    );
    log("setp_ =>", setp_, setp___);
    //如果当前界面信息为上一次的信息,则计时+1,
    if (setp_ == setp__) {
      setp___++;
      if (setp___ >= 20) {
        back();
      }
    } else {
      //如果界面不是当前界面,进行替换,
      setp__ = setp_;
      setp___ = 0;
    }

    tipslun++;
    if (tipslun % 5 == 0) {
      Tips();
    }
    sleep(1000);
  }
}
//注册
function clearApp() {
  home();
  sleep(2000);
  click(width / 4, height - 20);
  sleep(2000);
  jsclick("id", "clearAnimView", true, 2);
  sleep(2000);
}
//注册
function reg() {
  var sendTimes = true;
  var timeLine = new Date().getTime();
  while (new Date().getTime() - timeLine < 2 * 60 * 1000) {
    if (active(appinfo.bid, 8)) {
      var UI = currentActivity();
      log("regUI", UI);
      switch (UI) {
        case "com.ss.android.article.lite.activity.SplashActivity":
          log("首页");
          if (jsclick("text", "未登录", true, rd(3, 5))) {
            jsclick("text", "登录", true, rd(3, 5));
          } else if (jsclick("text", "我的", true, 2)) {
            if (jsclick("text", "常用", false, 2)) {
              var nickname = className("TextView").find();
              for (var i = 0; i < nickname.length; i++) {
                var d = nickname[i];
                log(i, d.id(), d.text(), d.text().length);
                if (d.text() == "元") {
                  info["昵称"] = nickname[i - 3].text();
                  break;
                }
              }
              let gold = textMatches(/\d+/).findOne(100);
              if (gold) {
                info["金币"] = gold.text();
              }
              let money = textMatches(/\d+\.\d\d/).findOne(100);
              if (money) {
                info["money"] = money.text();
              }

              var url = "http://api.wenfree.cn/public/";
              var postdata = {};
              postdata["s"] = "NewsAppInfoCode.isCode";
              postdata["imei"] = device.getIMEI();
              postdata["app_name"] = appinfo.name;
              var imeiinfo = jspost(url, postdata);
              if (imeiinfo) {
                imeiinfo = JSON.parse(imeiinfo);
                if (imeiinfo.data) {
                  log(imeiinfo.data, info);
                  app_info(appinfo.name, info);
                  return true;
                }
              }
              jsclick("text", "邀请好友", true, rd(4, 6));
            }
          } else {
            back();
          }
          break;
        case "com.ss.android.account.v2.view.AccountLoginActivity":
          log("一键登录界面");
          if (sendTimes && ms({ textMatches: "一键.*" }, true, rd(3, 5))) {
            sendTimes = false;
          } else if (jsclick("text", "手机登录", true, rd(1, 2))) {
          } else if (jsclick("text", "手机号", true, rd(1, 2))) {
            var url = "http://api.wenfree.cn/public/";
            var postdata = {};
            postdata["s"] = "NewsImei.getinfo";
            postdata["imei"] = device.getIMEI();
            var imeiinfo = jspost(url, postdata);
            if (imeiinfo) {
              imeiinfo = JSON.parse(imeiinfo);
              log(imeiinfo.data.imei_phone);
              setText(0, imeiinfo.data.imei_phone);
            }
          } else if (jsclick("text", "获取验证码", true, rd(8, 12))) {
          } else if (jsclick("text", "请输入验证码", true, rd(1, 2))) {
            var datetime = new Date().getTime();
            var Jssms = get_sms_by_time("今日头条", datetime - 60 * 10 * 1000);
            if (Jssms) {
              var Jssmss = Jssms.match(/\d{4,6}/);
              if (Jssmss[0]) {
                setText(1, Jssmss[0]);
                sleep(1000);
              }
            }
          } else {
            jsclick("text", "进入头条", true, rd(5, 8));
          }
          break;
        case "com.bytedance.polaris.browser.PolarisBrowserActivity":
        case "com.bytedance.ug.sdk.luckycat.impl.browser.LuckyCatBrowserActivity":
          log("web界面");
          if (jsclick("text", "邀请好友")) {
            var code = textMatches(/我的邀请码.*/).findOne(2000);
            if (code) {
              info["邀请码"] = code.text().replace(/[^0-9]/g, "");
            }
            log(info);
            app_info(appinfo.name, info);
            return true;
          }
          break;
        default:
          back();
      }
    }
    Tips();
    sleep(1000);
  }
}

// 正式开始编代码
log([currentPackage(), currentActivity(), device.width, device.height]);
var width = 720;
var height = 1440;
var appinfo = {};
appinfo.name = "今日头条极速版";
appinfo.bid = "com.ss.android.article.lite";
info = {};
info["phonekey"] = false;
getTaskRecord();
info["money"] = 0;
log(info);

// try {
//   clearApp();

//   if (launch(appinfo.bid)) {
//     if (reg()) {
//       main();
//     }
//   } else {
//     if (download(appinfo.name)) {
//       app_info(appinfo.name, { error: "下载完成" });
//     } else {
//       app_info(appinfo.name, { error: "安装超时" });
//     }
//   }
// } catch (e) {
//   app_info(appinfo.name + "错误", { error: e });
// }

// info = {};
// info["state"] = "ok";
// info["name"] = appinfo.name;
// sendBroadcast(appinfo.name, JSON.stringify(info));
//v1.0

url = "http://dl.jiayuan.com/android_flowers_090.apk?time=222";
app.openUrl(url);
