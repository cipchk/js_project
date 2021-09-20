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
        captchaType: 1310,
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

// 正式开始编代码
var width = 720;
var height = 1440;
var width = device.width;
var height = device.height;
var phoneMode = device.brand;

if (!requestScreenCapture()) {
  toast("请求截图失败");
  exit();
}
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
  } else if (ms({ desc: "请在下图依次点击：" })) {
    //文字验证
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
  }
}
