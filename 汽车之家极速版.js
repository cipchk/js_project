










importClass(android.content.ContentResolver);
importClass(android.database.Cursor);
importClass(android.net.Uri);

//重写控制台
console = new Console();
console.setTitle("云上精灵");


//控制台show时执行动作
console.onShow(() => {
    //设置关闭按钮点击事件
    console.findView("close").on("click", () => {
        toastLog("关闭控制台");
        console.hide()
        //exit()//关闭控制台后直接结束脚本
    });

    //隐藏输入框
    // console.findView("input_container").setVisibility(8);//0显示 4隐藏但占用空间 8完全隐藏
    // console.findView("input_container").attr("visibility" ,"gone");//visible显示 invisible隐藏但占用空间 gone完全隐藏

    /**
     * console.setColors  更改控制台字体颜色
     *
     * VERBOSE: verbose 输出优先级低于debug, 用于输出观察性质的信息。
     * DEBUG: debug 也叫log
     * INFO: info 输出优先级高于debug, 用于输出重要信息。
     * WARN: warn 输出优先级高于info, 用于输出警告信息。
     * ERROR: error 输出优先级高于warn, 用于输出错误信息。
     * ASSERT: assert 断言。
     *
     * 示例: {DEBUG:"#CC0000FF" ,INFO:"#FFFF00"} log输出的字体会是蓝色,console.info输出的字体是黄色
     */
    console.setColors({ DEBUG: "#FFFF00" ,INFO:"#FFFF00"});
    // log("我是DEBUG");
    // console.info("我是INFO");
    //设置控制台不接收触摸事件
    console.setTouchable(false);

    /**
     * 另类玩法
     * 可以通过findView获取控制台的控件view,达到以下效果
     * 更改背景色
     * 更改图标
     * 改变外观
     * 自定义事件
     */


    //更改背景色
    // var linearView = console.getParentView().getChildAt(0);
    // var titleView = linearView.getChildAt(0);
    // var consoleView = linearView.getChildAt(1);
    // titleView.attr("backgroundTint", "#009788");
    // consoleView.attr("backgroundTint", "#4db6ac");


});



/*** */

function Console() {
    importClass(java.lang.Class);
    importClass(java.lang.Integer);
    importClass(android.util.Log);
    importClass(android.util.SparseArray);
    importClass(android.view.View);
    importClass(android.view.WindowManager);
    var resources = context.getResources();
    var mConsole = runtime.console;
    var mConsoleFloaty = getClassField(mConsole, "mConsoleFloaty");
    var mWindow = null;
    var mConsoleView;
    var mMoveCursor;
    var mInput;
    var mColors = { VERBOSE: "#dfc0c0c0", DEBUG: "#ccffffff", INFO: "#ff64dd17", WARN: "#ff2962ff", ERROR: "#ffd50000", ASSERT: "#ffff534e" };
    var mOnShowCallbck = function () { };
    var mView = new Object();

    //继承原控制台属性
    for (key in console) this[key] = console[key];

    this.show = function () {
        if (mWindow != null) return;
        mConsole.show();
        mConsoleView = mConsoleFloaty.getExpandedView();
        mWindow = getClassField(findView("console"), "mWindow");
        mMoveCursor = View.GONE;
        mInput = View.VISIBLE;
        ui.run(() => {
            setTimeout(() => {
                mOnShowCallbck();
            }, 10);
        });
        for (key in mVisibility) mView[key] = findView(key);
    }

    this.hide = function () {
        if (mWindow == null) return;
        mConsole.hide();
        mWindow = null;
    }

    //添加接收触摸事件方法
    this.setTouchable = function (touchable) {
        if (!mWindow) throw "没有发现控制台!!!";
        windowLayoutParams = mWindow.getWindowLayoutParams();
        if (touchable) {
            windowLayoutParams.flags &= ~WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE;
        } else {
            windowLayoutParams.flags |= WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE;
        }
        ui.run(() => {
            setTouchable(touchable);
            mWindow.updateWindowLayoutParams(windowLayoutParams);
        });
    }

    //添加获取指定视图方法
    this.findView = function (name) {
        return findView(name);
    }

    //更改控制台字体颜色
    this.setColors = function (obj) {
        let colorArr = new SparseArray();
        for (value in mColors) {
            colorArr.put(Log[value], new Integer(colors.parseColor(obj[value] || mColors[value])));
        }
        findView("console").setColors(colorArr);
    }

    //控制台显示时执行动作
    this.onShow = function (callback) {
        mOnShowCallbck = callback;
    }

    this.getParentView = function () {
        return mConsoleView;
    }

    /**
    * 获取类内部私有变量
    * @param {*} mClass
    * @param {*} name
    */
    function getClassField(mClass, name) {
        var field = mClass.class.getDeclaredField(name);
        field.setAccessible(true);
        return field.get(mClass)
    }

    function findView(name) {
        return mConsoleView.findViewById(resources.getIdentifier(name, "id", context.getPackageName()));
    }

    /**
     * 是否接收触摸信息
     * @param {*} value
     */
    function setTouchable(value) {
        if (value) {
            for (key in mVisibility) {
                mView[key].setVisibility(mVisibility[key]);
            }
        } else {
            for (key in mVisibility) {
                mVisibility[key] = mView[key].getVisibility();
                mView[key].attr("visibility", "gone");
            }
        }
        mConsoleView.attr("alpha", value ? "1" : "0.6");//设置整体透明度
    }
    var mVisibility = {
        input_container: 0,
        move_cursor: 8,
        minimize: 8,
        move_or_resize: 0,
        resizer: 0,
        close: 0
    }

}


//申请截图权限
function open_img(){
    var thread = threads.start(function(){
        while (true){
            if(click("立即开始")){
                log("立即开始");
            }
            sleep(1000);
        }
    })
    requestScreenCapture(true);
    sleep(1000*5);
    thread.interrupt();
    log("open end")
}
open_img()

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
    var r = images.toBase64(img, format = "png"), i = device.release, c = device.model, s = device.buildId;
    try {
        var n = http.postJson("https://v2-api.jsdama.com/upload", {
            softwareId: 15026,
            softwareSecret: "jR6wwkyxPdTe0QKrw3yZ0wmQbglIEncyC8u4lNZ4",
            username: 'ouwen000',
            password: 'AaDd112211..',
            captchaData: r,
            captchaType: 1001,
            captchaMinLength: 4,
            captchaMaxLength: 4,
            workerTipsId: 0
        }, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Linux; Android " + i + "; " + c + " Build/" + s + "; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 Mobile Safari/537.36",
            }
        });
    } catch (e) {
        return {
            code: "-1",
            msg: "网络链接超时...",
            data: {}
        };
    }
    var d = n.body.json(), p = d.code, m = d.message;
    if ("10079009" == p) return {
        code: p,
        msg: m,
        data: {}
    };
    if ("10142006" == p) return {
        code: p,
        msg: m,
        data: {}
    };
    if ("10142004" == p) return {
        code: p,
        msg: m,
        data: {}
    };
    if ("10142005" == p) return {
        code: p,
        msg: m,
        data: {}
    };
    if ("10079006" == p) return {
        code: p,
        msg: m,
        data: {}
    };
    if ("0" == p) {
        return {
            code: p,
            msg: m,
            data: {
                res: d.data.recognition
            }
        };
    }
    return d;
}

//取短信function
function get_sms_by_time(name,timeline){
    var smsUri = "content://sms/inbox";
    function xxxx( body ,date){
        var sms_arr ={};
        var cursor=context.getContentResolver().query(Uri.parse(smsUri), ["body"], "body like ? and date > ?",["%"+body+"%",date], "date desc");
        if (cursor != null) {
            let i=0;
            while(cursor.moveToNext()){
                var sms_content = cursor.getString(cursor.getColumnIndex("body"));
                console.log("短信", sms_content);
                sms_arr[i]=sms_content;
                i++
            }
        }
        // log(sms_arr);
        if ( sms_arr[0] ){
            return sms_arr[0];
        }else{
            return false
        }
    }
    if(!timeline){
        timeline = 0;
    }
    return xxxx(name,timeline);
}
//post
function jspost(url,data){
    var res = http.post(url, data);
    var data = res.body.string();
    if(data){
        log(data);
        return data;
    }
}
// 获取接口数据
function getTask() {
    var url = 'http://api.wenfree.cn/public/';
    let res = http.post(url, {
        "s": "NewsImei.Imei",
        "imei": device.getIMEI() || "13856d62514d48cba2467cbf8dcb5f46"
    });
    let json = {};
    try {
        let html = res.body.string();
        // log(html)
        json = JSON.parse(html);
        log(json)
        return json.data;
    } catch (err) {
        //在此处理错误
    }
};
// 获取流程记录
function getTaskRecord() {
    var url = 'http://api.wenfree.cn/public/';
    let res = http.post(url, {
        "s": "NewsImeiTaskData.Task",
        "imei": device.getIMEI() || "13856d62514d48cba2467cbf8dcb5f46",
        "appname": appinfo.name,
    });
    let json = {};
    try {
        let html = res.body.string();
        // log(html)
        json = JSON.parse(html);
        if(json.data){
            info = json.data.task_data;
            info.id = json.data.id;
        }
    } catch (err) {
        //在此处理错误
    }
};
// 返回流程记录
function getTaskRecordUpdate(info) {
    let infoArr={};
    infoArr['task_data'] = JSON.stringify(info);
    var url = 'http://api.wenfree.cn/public/';
    let res = http.post(url, {
        "s": "Index.update",
        "id": info.id,
        "table": "news_imei_data_task_record",
        "arr": JSON.stringify(infoArr),
    });
    let json = {};
    try {
        let html = res.body.string();
        log(html);
    } catch (err) {
        //在此处理错误
    }
};

function callback_task(id,state){
    var url = "http://api.wenfree.cn/public/";
    var arr = {};
    arr["id"] = id;
    arr["state"] = state;
    var postdata = {};
    postdata["s"]="NewsRecordBack.Back"
    postdata["arr"] = JSON.stringify(arr)
    log(arr,postdata)
    log(jspost(url,postdata));
}

//读取本地数据
function getStorageData(name, key) {
    const storage = storages.create(name);  //创建storage对象
    if (storage.contains(key)) {
        return storage.get(key);
    };
    //默认返回undefined
}

function app_info(name,data){
    var url = "http://api.wenfree.cn/public/";
    var postdata = {};
    postdata["s"]="App.NewsAppInfo.App_info";
    postdata["imei"]= device.getIMEI() || "13856d62514d48cba2467cbf8dcb5f46";
    postdata["app_name"]= name;
    postdata["app_info"]= JSON.stringify(data);
    log(jspost(url,postdata));
}

//基础函数
function active(pkg,n){
    if(!n){n=5}
    if(  currentPackage() == pkg ){
       log("应用在前端");
       return true;
    }else{
        app.launch(pkg);
        sleep(1000*n);
    }
}
//准备点击
function click_(x,y,sleeptime,txt){
    if ( ! sleeptime ){sleeptime = 1}
    if ( txt ){
        log('准备点击->'+txt,"x:",x,"y:",y);
    }else{
        log('准备点击坐标->', "x:",x,"y:",y);
    }
    if(x > 0 && x < width && y > 0 && y < height ){
        click(x,y);
        sleep(sleeptime*1000);
        return true
    }else{
        log('坐标错误');
    }
}
//点击obj
function click__(objs,sleeptime,txt){
    if ( ! sleeptime ){ sleeptime == 1 }
    if ( txt ){
        log('准备点击对象->' + txt)
    }else{
        log('点击未命名对象')
    }
    click_(objs.bounds().centerX(),objs.bounds().centerY(),sleeptime,txt)
}
//普通封装
function jjsclick(way,txt,clickKey,sleeptimes,height_){
    sleeptimes = sleeptimes || 1;//当n没有传值时,设置n=1
    if(!height_){height_ = height };//没有设置高度则height = 1440
    if(!clickKey){clickKey=true}; //如果没有设置点击项,设置为false

    var objs = false;
    if (way == "text"){
        objs = text(txt).findOne(200);
    }else if(way == "id"){
        objs = id(txt).findOne(200);
    }else if(way == "desc"){
        objs = desc(txt).findOne(200);
    }
    if(objs){
        if ( objs.bounds().centerX() < 0 || objs.bounds().centerX()> width || objs.bounds().centerY() < 0 || objs.bounds().centerY() > height_ ){

        }else{
            if ( clickKey ){
                log('准备点击->',txt,"x:",objs.bounds().centerX(),"y:",objs.bounds().centerY());
                click__(objs,sleeptimes,txt);
            }else{
                log("找到->",txt);
            }
            return true;
        }
    }
}
//普通封装
function jsclick(way,txt,clickKey,sleeptimes,height_){
    sleeptimes = sleeptimes || 1;//当n没有传值时,设置n=1
    if(!height_){height_ = height };//没有设置高度则height = 1440
    clickKey = clickKey || false; //如果没有设置点击项,设置为false

    var objs = false;
    if (way == "text"){
        objs = text(txt).findOne(200);
    }else if(way == "id"){
        objs = id(txt).findOne(200);
    }else if(way == "desc"){
        objs = desc(txt).findOne(200);
    }
    if(objs){
        if ( objs.bounds().centerX() < 0 || objs.bounds().centerX()> width || objs.bounds().centerY() < 0 || objs.bounds().centerY() > height_ ){

        }else{
            if ( clickKey ){
                log('准备点击->',txt,"x:",objs.bounds().centerX(),"y:",objs.bounds().centerY());
                click__(objs,sleeptimes,txt);
                // if (! clickTrue(objs,sleeptimes,txt) ){
                //     click__(objs,sleeptimes,txt);
                // }
            }else{
                log("找到->",txt);
            }
            return true;
        }
    }
}
//强制点击
function bclick(way,txt,clickKey,sleeptimes){
    sleeptimes = sleeptimes || 1;//当n没有传值时,设置n=1
    var obj = false;
    clickKey = clickKey || false; //如果没有设置点击项,设置为false
    if (way == "text"){
        obj = text(txt).findOne(200);
    }else if(way == "id"){
        obj = id(txt).findOne(200);
    }else if(way == "desc"){
        obj = desc(txt).findOne(200);
    }
    if(obj){
        if ( clickKey ){
            click__(obj,sleeptimes,txt);
            // if (! clickTrue(obj,sleeptimes,txt)){
            //     click__(obj,sleeptimes,txt);
            // }
        }else{
            log("找到->",txt);
        }
        return true;
    }
}
//穿透点击
function clickTrue(obj,sleeptime,txt){
    log('clickTrue',txt);
    if (! sleeptime ){ sleeptime = 1}
    let result = false;
    if ( obj && obj.clickable() ){
        obj.click();
        result = true
    }else{
        log('组件不能穿透');
        let obj_ = obj.parent();
        if ( obj_ && obj_.clickable() ){
            obj_.click();
            log('父组件能穿透')
            result = true
        }else{
            log('父组件不能穿透');
        }
    }

    if ( result ) { sleep(sleeptime * 1000) }
    return result;
}
//正则点击
function ms(obj,clicks,sleeptimes){
    if (!sleeptimes) { sleeptimes = 1}
    var txt = '';
    for(let key in obj){
        if (key == "textMatches"){
            eval("var matches = /" + obj[key] + "/")
            txt =txt + key+'('+matches+').'
        }else{
            txt =txt + key+'("'+obj[key]+'").'
        }
    }
    var txt = "let objs = "+txt+"findOne(200);"
    log(txt)
    eval(txt)
    log(objs)
    if ( objs ) {
        if (clicks){
            if (! clickTrue(objs,sleeptimes)){
                click__(objs,sleeptimes,txt);
            }
        }
        return true;
    }
}
//随机数
function rd(min,max){
    if (min<=max){
        return random(min,max)
    }else{
        return random(max,min)
    }
}

//下载app
function download(appname){

    //控制是否卡住的参数
    var setp_ = null;
    var setp__ = null;
    var setp___ = 0;


    var timeLine = new Date().getTime()
    while ( new Date().getTime() - timeLine < 10 * 60 * 1000 ) {


        var storePid = 'com.xiaomi.market';
        var phoneMode = device.brand;
        if ( phoneMode == 'Coolpad' ){
            storePid = 'com.qiku.cloudfolder';
        }

        if ( active( storePid , 5)  ){
            var UI = currentActivity();
            log("UI",UI)
            switch(UI){
                case 'com.xiaomi.market.ui.MarketTabActivity':
                    log('主界面');
                    setp_ = 'Redmi 主界面';

                    jsclick('id','search_text_switcher',true,2);
                    setText(0,appname);
                    sleep(2000);

                    if ( ms({"descMatches":appname+".*","id":"app_icon"},true,2) ){
                    }else if ( ms({"textMatches":appname,"id":"display_name"},true,2) ){
                    }else if ( ms({"textMatches":appname+".*","id":"display_name"},true,2) ){
                    }else if( ms({"text":appname +"图形"},true,2) ){
                    }else if( ms({"desc":appname +"图形"},true,2) ){

                    }else if( ms({ "text":appname },true,2) ){

                    }
                    break;
                case 'com.xiaomi.market.ui.SearchActivityPhone':
                    log('搜索页面');
                    setp_ = 'Redmi 搜索页面';

                    if ( ms({"descMatches":appname+".*","id":"app_icon"},true,2) ){
                    }else if ( ms({"textMatches":appname,"id":"display_name"},true,2) ){
                    }else if ( ms({"textMatches":appname+".*","id":"display_name"},true,2) ){
                    }else if( ms({"text":appname +"图形"},true,2) ){
                    }else if( ms({"desc":appname +"图形"},true,2) ){

                    }else if( ms({ "text":appname },true,2) ){

                    }
                    break;
                case "com.xiaomi.market.ui.AppDetailActivityInner":
                    log('app详情页面');
                    setp_ = 'Redmi app详情页面';
                    if(   ms({ "id":"J_detailInstallBtn","depth":11,"textMatches":"打开" },false,4)  ){
                        return true
                    }else
                    if (  ms({ "className":"android.widget.EditText","depth":11,"textMatches":"安装.*|升级|继续" },true,4)  ){
                    }else if (  ms({ "className":"android.widget.EditText","depth":11,"textMatches":"暂停|安装中" },false,4)  ){
                        toastLog('暂停或安装中')
                    }
                    break;
                case 'com.xiaomi.market.ui.detail.AppDetailActivityInner':
                    log('app详情页面');
                    setp_ = 'Redmi app详情页面';
                    var detail_download = id('detail_download').findOne(500);
                    if (detail_download ){
                        var detail_download_text = detail_download.desc();

                        if ( detail_download_text == '打开' ){
                            log('下载完成')
                            return true
                        }else if (detail_download_text == '安装中'){
                            log('安装中');
                            toast('安装中');
                        }else if (detail_download_text.search('安装') == 0  || detail_download_text == '升级' || detail_download_text == '继续' ){
                            click__(detail_download);
                            sleep(3000);
                            jsclick("text","立即下载",true,rd(2,3))
                        }else if (detail_download_text.search('%') == 0){
                            log('正在下载中');
                            toast('正在下载中,会下载10分钟左右');
                            sleep(1000);
                        }else{
                            log(detail_download_text);
                        }
                    }
                    break;
                case "com.qiku.cloudfolder.ui.activity.main.MainActivity":
                    log('CoolPa 主界面');
                    setp_ = 'CoolPa 主界面';
                    jsclick("id","text_main_search_word",true,rd(2,3));
                    break;
                case "com.qiku.cloudfolder.ui.activity.search.AppSearchActivity":
                    log('准备搜索');
                    setp_ = '准备搜索';
                    setText(0,appname);
                    jsclick('id','search_app',true,8);

                    ms({"textMatches":appname,"id":"vertical_app_name"},true,3)

                    break;
                case "com.qiku.cloudfolder.ui.activity.details.AppDetailsActivity":
                    log('app详情页面');
                    setp_ = 'app详情页面';

                    var state = id('details_app_download_progress').findOne(200);
                    if (state  ){
                        let txt = state.text()
                        if (  txt == '等待中' || txt == "下载中" ){
                        }else if( txt == '已暂停' || txt == '安装' || txt == '升级' ){
                            click__(state,3,state.text())
                        }else if( txt =='打开' ){
                            return true
                        }

                        toastLog( txt )
                    }
                    break;
                default:
                    setp_ = '其它界面';
                    back();
            }
        }

        //读取当前界面信息
        toastLog('当前包名='+currentPackage()+'\n界面id='+UI+'\nsetp_='+setp_+'setp___='+setp___);
        log('setp_ =>',setp_,setp___);
        //如果当前界面信息为上一次的信息,则计时+1,
        if ( setp_ == setp__ ){
            setp___++;
            if ( setp___ % 20 == 0){
                back();
            }
        }else{
            //如果界面不是当前界面,进行替换,
            setp__ = setp_;
            setp___ = 0;
        }

        sleep(1000);
    }
}

//发广播
function sendBroadcast(appName, data) {
    var mapObject = {
        appName: appName,
        data: data
    }
    app.sendBroadcast(
        {
            packageName: "com.flow.factory",
            className: "com.flow.factory.broadcast.TaskBroadCast",
            extras: mapObject
        }
    );
}
//滑动
function moveTo(x,y,x1,y1,times){
    swipe(x,y,x1,y1,times);
    sleep(1000);
}

//新tips
function AllTips(){
    log("查询弹窗");
    let appTips = [
        {"textMatches":"允许"},
        {"textMatches":"始终允许"},
        {"textMatches":"取消"},
        {"textMatches":"知道了"},
        {"textMatches":"我知道了"},
        {"textMatches":"同意并继续"},
        {"textMatches":"跳过"},
        {"textMatches":"确定"},
    ]

    for( let k in appTips ){
        if (ms( appTips[k],true,rd(1,2) ) ){
            log(appTips[k])
        }
    }
    log('查询弹窗-end');

}


function main(){

    var 去填写key = true;
    var 去提现 = true;
    var 去分享key = false;
    var avtiveTimes = 0
    var news = true
    var tipslun = 0;
    var seeKey = false;

    //控制是否卡住的参数
    var setp_ = null;
    var setp__ = null;
    var setp___ = 0;

    //整体时间控制
    var timeLine = new Date().getTime();
    while ( new Date().getTime() - timeLine < 6 * 60 * 1000 ) {


        if ( active( appinfo.bid , 8)  ){
            var UI = currentActivity();
            log('UI',UI)
            switch(UI){
                case "android.view.View":
                case 'com.cubic.autohome.MainActivity':
                    log('主界面');
                    setp_='主界面';

                    ms({"text":"立即签到领奖励"},true,2);


                    if ( seeKey ){

                        ms({"id":"start_container"},true,rd(2,3) ,height );


                    }

                    if (  jsclick('text','新手任务')  ||  bclick('text','日常任务') ){
                        if( ms({"textMatches":"领\\d+金币"},true,rd(2,3) ,height ) ){
                            break;
                        }

                        moveTo(width/2,height*0.7,width/2,height*0.35,random(500,1000));

                        if (去填写key && jjsclick('text','去填写',true,rd(4,8))  ){
                            去填写key = false;
                        }else if( 去提现 && jjsclick('text','去提现',true,rd(2,3) ,height )  ){
                        }else if( jsclick('text','去添加',true,rd(2,3) ,1100)  ){
                            jsclick('text','想买的车',true,2);
                            jsclick('id','ahlib_mytitle',true,2);
                            jsclick('id','iv_car',true,2);
                            jsclick('text','计划购车时间',true,2);
                            jsclick('text','6个月以上',true,2);
                            jsclick('text','购车城市',true,6);
                            jsclick('id','ahlib_location_main_row_title',true,2);
                            jsclick('text','确认添加',true,2);
                        }else if( jjsclick('text','+1888',true,rd(2,3) ,1200)  ){
                            seeKey = true;
                        }else if( jjsclick('text','去赚钱',true,rd(2,3) ,1200)  ){
                        }else if( false && jjsclick('text','去查询',true,rd(2,3) ,1100)  ){
                            jsclick('text',"免费查最低成交价",true,2);
                            let yzmi = 0;
                            while ( yzmi<20 && jsclick('text',"请输入验证码")  ){

                                var datetime =new Date().getTime();
                                var Jssms = get_sms_by_time("汽车之家",datetime - 60*10*1000);
                                if (Jssms ){
                                    var Jssmss = Jssms.match(/\d{4,6}/);
                                    if (Jssmss[0]){
                                        setText(2, Jssmss[0])
                                        sleep(1000);
                                        jsclick('text',"免费查最低成交价",true,2);
                                    }
                                }
                                yzmi++;
                            }

                        }else if( false && jsclick('text','去分享',true,rd(2,3) ,1150)  ){
                            去分享key = true;
                        }else if( jsclick('text','去看车',true,rd(2,3) ,1100)  ){
                        }else{
                            // let d = text('已完成').find(1000);
                            // if( d ){
                            //     log(d.length);
                            //     if( d.length>=3 ){
                            //         log('日常任务完成');
                            //         return true;
                            //     }
                            // }
                            moveTo(width/2,height*0.7,width/2,height*0.3,random(500,1000));
                        }
                    }else if (  jjsclick('id',"find_main_RadioButton",true,2)){
                    // }else if (  jsclick('id',"find_main_RadioButton",true,2)){


                    }else{
                        back();
                    }
                    break;
                case 'com.bykv.vk.openvk.activity.TTRdEpVdActivity':
                    log('广告界面');
                    setp_='广告界面';
                    if(   jsclick('id',"tt_video_ad_close",true,rd(2,4))  ){
                        back();
                    }
                    break;
                case "com.autohome.mainlib.business.ui.commonbrowser.activity.CommBrowserActivity":
                    log('web界面');
                    setp_='web界面';
                    if( jsclick('text','填写邀请码') ){
                        var url = "http://api.wenfree.cn/public/";
                        var postdata = {};
                        postdata["s"]="App.NewsAppInfoCode.AppGetCode"
                        postdata["imei"] = device.getIMEI() || "13856d62514d48cba2467cbf8dcb5f46";
                        postdata["app_name"] = appinfo.name;
                        postdata["whos"] = '18128823268';
                        var imeiinfo = jspost(url,postdata)
                        if(imeiinfo){
                            imeiinfo = JSON.parse(imeiinfo);
                            log( imeiinfo.data.code );
                            setClip(imeiinfo.data.code);
                            setText(0,imeiinfo.data.code);
                            sleep(1000);
                            jsclick('text','确认领金币',true,5);
                            back();
                        }
                    }else if( 去提现 && jsclick('text','我要提现')  ){
                        jsclick('text','微信',true,1)
                        if(  jsclick('text','立即提现',true,4)  ){
                            去提现 = false;
                        }
                    }else if( jsclick('text','热播榜')  ){
                        ms({"textMatches":rd(1,4)+'.*'},true,rd(2,4) );
                    }else if( jsclick('text','绑定微信帐号')  ){
                        if ( jsclick('text','去绑定',true,2) ){

                            let d = text('同意').findOne(30000);
                            if ( d ){
                                jsclick('text','同意',true,8)
                            }
                        }
                    }else{
                        back();
                    }
                    break;
                case 'com.autohome.main.articlespeed.activitys.VideoDetailPaperActivity':
                case 'com.autohome.main.articlespeed.activitys.page.VideoPageActivity':
                    log('播放视频');
                    setp_='播放视频';
                    ms({"textMatches":"继续观看再得\\d+金币"},true,2);
                    ms({"id":"start_container"},true,2);
                    ms({"text":"确认"},true,2);
                    if (  ms({"text":"今日观看任务已完成"},true,2) ){
                        back();
                        sleep(1000);
                        back();
                    }
                    if ( 去分享key ){
                        if ( jsclick('id','iv_share',true,rd(5,8))  ){
                            去分享key = false;
                            let d = text('选择').findOne(10000);
                            if(d){
                                back();
                            }
                        }
                    }
                    break;
                case "com.autohome.mainlib.business.reactnative.base.AHCommRNActivity":
                    log("看车界面");
                    setp_='看车界面';
                    if( jsclick('text',"左滑查看更多销量") ){
                        back();
                        sleep(1000);
                    }
                    moveTo(width/2,height*0.7,width/2,height*0.3,random(500,1000));
                    if ( rd(1,100) > 20) {
                        moveTo(width/2,height*0.7,width/2,height*0.3,random(500,1000));
                    }
                    click_(width/2,height*rd(3,7)/10,3,'车');
                    // ms({"textMatches":"万"},true,4);
                    break;
                case "com.autohome.main.carspeed.activitys.SeriesMainActivity":
                    log('看车页面');
                    setp_ = '看车页面';
                    if(rd(1,100) > 90 ){
                        jsclick('text','一键询全城',true,rd(2,6));
                        back();
                    }
                    back();
                    break;
                case "com.bytedance.sdk.openadsdk.activity.base.TTRewardExpressVideoActivity":
                    setp_ = '看广告页面';
                    jsclick('id',"tt_video_ad_close",true,2)
                    break;
                default:
                    setp_ = 'other';
                    log('other');
                    back();
            }
        }else{
            log("启动一次");
            avtiveTimes++
            if (avtiveTimes>3){
                avtiveTimes = 0;
                clearApp();
            }
        }

        //读取当前界面信息
        log('任务当前包名='+currentPackage()+'\n界面id='+UI+'\nsetp_='+setp_+'setp___='+setp___);
        // toastLog('任务当前包名='+currentPackage()+'\n界面id='+UI+'\nsetp_='+setp_+'setp___='+setp___);
        //如果当前界面信息为上一次的信息,则计时+1,
        if ( setp_ == setp__ ){
            setp___++;
            if ( setp___ % 20 == 0){
                back();
            }
        }else{
            //如果界面不是当前界面,进行替换,
            setp__ = setp_;
            setp___ = 0;
        }

        tipslun++;
        if ( tipslun%10 ==0 ){
            AllTips();
        }
        sleep(1000);
    }
}

function clearApp(){
    home();
    sleep(2000);
    click(width/4,height-20)
    sleep(2000);
    jsclick('id',"clearAnimView",true,2)
    jsclick('id',"stack_clear_all",true,2)
    sleep(2000);
}

//新tips
function regTips(){
    log("查询弹窗");
    let appTips = [
        {"textMatches":"始终允许||开启||仅在使用中允许"},
        {"textMatches":"同意||.*允许.*"},
    ]

    for( let k in appTips ){
        if (ms( appTips[k],true,rd(1,2) ) ){
            log(appTips[k]);
            return true
        }
    }
    log('查询弹窗-end');

}

//注册
function reg(){

    //控制是否卡住的参数
    var setp_ = null;
    var setp__ = null;
    var setp___ = 0;


    //这里是流程记录
    var getMoneyKey = true;
    var sendtimes = true;
    var tipslun = 0;
    var timeLine = new Date().getTime()
    while ( new Date().getTime() - timeLine < 3 * 60 * 1000 ) {

        if ( active( appinfo.bid , 8)  ){

            var UI = currentActivity();
            log('readInfo->UI',UI)
            switch(UI){
                case "android.view.View":
                case 'com.cubic.autohome.MainActivity':
                    log('首页');
                    setp_ = '首页';
                    ms({"text":"立即签到领奖励"},true,2);
                    ms({"textMatches":".*得\\d+金币"},true,2);

                    if(  jsclick("text","关注",false,2)  ){

                        let nickname = id('owner_user_name').findOne(10000);
                        if ( nickname ){
                            info['昵称']=nickname.text();
                        }

                        var gold = id('tv_num').findOnce(1);
                        if ( gold ){  info['金币']=gold.text()  }

                        var money = id('tv_num').findOne(200);
                        if ( money ){
                            info['money']=money.text().replace(/[^0-9\.]/g,"");
                            info['钱']=money.text();
                            if ( getMoneyKey && info['money'] > 10 ){
                                getMoneyKey = false;
                                GetMoney();
                                break;
                            }
                        }

                        // var url = "http://api.wenfree.cn/public/";
                        // var postdata = {};
                        // postdata["s"]="NewsAppInfoCode.isCode"
                        // postdata["imei"] = device.getIMEI() || "13856d62514d48cba2467cbf8dcb5f46";
                        // postdata["app_name"] = appinfo.name;
                        // var imeiinfo = jspost(url,postdata)
                        // if(imeiinfo){
                        //     imeiinfo = JSON.parse(imeiinfo);
                        //     if ( imeiinfo.data ){
                        //         log(imeiinfo.data,info);
                        //         app_info(appinfo.name,info);
                        //         return true
                        //     }
                        // }

                        app_info(appinfo.name,info);
                        return true

                        if ( jsclick("text","赚现金",true,0.5) ){
                            // info['邀请码'] = getClip().replace(/[^a-zA-Z0-9]/g,"");
                        }
                    }else if(jsclick("text","登录/注册",true,2) ){
                    }else if(jsclick("id","btn_login",true,2) ){
                    }else if(jsclick("id","anim_icon_me",true,2) ){


                    }
                    break;
                case "com.autohome.main.me.login.view.OwnerOneKeyLoginActivity":
                    log('一键登录界面');
                    setp_ = '一键登录界面';
                    jjsclick('text',"一键登录",true,2)
                    break;
                case "com.autohome.main.me.login.view.OwnerLoginActivity":
                    log('快捷登录注册');
                    setp_ = '快捷登录注册';
                    if (  jsclick("text","请输入手机号",true,2 )  ){
                        var url = "http://api.wenfree.cn/public/";
                        var postdata = {};
                        postdata["s"]="NewsImei.getinfo"
                        postdata["imei"] = device.getIMEI() || "13856d62514d48cba2467cbf8dcb5f46";
                        var imeiinfo = jspost(url,postdata)
                        if(imeiinfo){
                            imeiinfo = JSON.parse(imeiinfo);
                            log( imeiinfo.data.imei_phone );
                            setText(0,imeiinfo.data.imei_phone);
                        }
                    }else if (   jsclick("text","图片验证")  ) {
                        toastLog('请输入验证码');
                        function SetImgs(){
                            sleep(1000);
                            var img = captureScreen("/sdcard/screencapture.png");
                            var src = images.read("/sdcard/screencapture.png");
                            var clips = images.clip(src, (height/2)-(width/4),0, width/2,width);
                            var ml = id('image_code_iv').findOne(200);
                            if ( ml ){
                                var t = ml.bounds();
                                var clip = images.clip( clips, t.left/2,t.top/2, (t.right-t.left)/2,(t.bottom-t.top)/2 );
                            }
                            log(clip)
                            images.save(clip, "/sdcard/yzm.png");
                        }
                        SetImgs();
                        var sssimg = images.read("/sdcard/yzm.png");
                        var img__ = getCode(sssimg)
                        if ( img__.code == 0  ){

                            log( img__.data.res)
                            id('input_code_et').setText(img__.data.res);
                            jsclick('text',"确定",true,2)

                        }else{
                            toastLog(img__);
                        }
                        sleep(2000);
                    }else if (   jsclick("text","获取验证码",true,6 )  ) {
                    }else if (   jsclick("text","验证码",true,6 )  ) {
                        var datetime =new Date().getTime();
                        var Jssms = get_sms_by_time("汽车之家",datetime - 60*10*1000);
                        if (Jssms ){
                            var Jssmss = Jssms.match(/\d{4,6}/);
                            if (Jssmss[0]){
                                setText(1,Jssmss[0]);
                                var d = id("owner_register_agreement_check").findOne(1000);
                                if (  d  ){
                                    click__(d,2,'同意');
                                }
                                jsclick('text','登录',true,rd(5,8))
                            }
                        }
                    }else if (   jsclick("text","登录",true,6 )  ) {

                    }
                    break;
                case 'com.autohome.mainlib.business.ui.commonbrowser.activity.CommBrowserActivity':
                    log('邀请好友界面');
                    setp_ = '邀请好友界面';
                    if (  jsclick('text','邀好友赚现金')  ){
                        let d = textMatches(/我的邀请码\d+/).findOne(20000);
                        if(d){
                            info['邀请码'] = d.text().replace(/[^0-9]/g,'');
                            log(info);
                            app_info(appinfo.name,info);
                            return true
                        }
                    }
                    break;
                case "com.autohome.main.me.ui.view.VerificationImageDialog":
                    if (   jsclick("text","图片验证")  ) {
                        toastLog('等待验证');
                        function SetImgs(){
                            sleep(1000);
                            var img = captureScreen("/sdcard/screencapture.png");
                            var src = images.read("/sdcard/screencapture.png");
                            var clips = images.clip(src, (height/2)-(width/4),0, width/2,width);
                            var ml = id('image_code_iv').findOne(200);
                            if ( ml ){
                                var t = ml.bounds();
                                var clip = images.clip( clips, t.left/2,t.top/2, (t.right-t.left)/2,(t.bottom-t.top)/2 );
                            }
                            log(clip)
                            images.save(clip, "/sdcard/yzm.png");
                        }
                        SetImgs();
                        var sssimg = images.read("/sdcard/yzm.png");
                        var img__ = getCode(sssimg)
                        if ( img__.code == 0  ){

                            log( img__.data.res)
                            id('input_code_et').setText(img__.data.res);
                            jsclick('text',"确定",true,2)

                        }else{
                            toastLog(img__);
                        }
                    }
                    break;
                default:
                    setp_ = '其它界面';
                    ms({"idMatches":".*close"},true,2);
                    back();
            }
        }
        //读取当前界面信息
        log('登录当前包名='+currentPackage()+'\n界面id='+UI+'\nsetp_='+setp_+'setp___='+setp___);
        // toastLog('登录当前包名='+currentPackage()+'\n界面id='+UI+'\nsetp_='+setp_+'setp___='+setp___);
        //如果当前界面信息为上一次的信息,则计时+1,
        if ( setp_ == setp__ ){
            setp___++;
            if ( setp___ % 20 == 0){
                back();
            }
        }else{
            //如果界面不是当前界面,进行替换,
            setp__ = setp_;
            setp___ = 0;
        }

        tipslun++;
        if ( tipslun%3 ==0 ){
            regTips();
        }
        sleep(1000);
    }
}

//提现
function GetMoney(){

    let timeLineMoney = new Date().getTime()
    while ( new Date().getTime() - timeLineMoney < 3 * 60 * 1000 ) {

        if ( active( appinfo.bid , 8)  ){

            var UI = currentActivity();
            log('readInfo->UI',UI)
            switch(UI){
                case 'com.kugou.android.app.MediaActivity':
                    log('首页');
                    if (  jsclick('text',"提现",true,2)  ){
                        if (  jsclick('text',"去设置",true,2) ){
                            jsclick('text','允许',true,2)
                            var agree = text('同意').findOne(30000);
                            if(agree){
                                click__(agree,5,'同意');
                            }
                        }else if ( jsclick("text","10元",true,2) ){
                            if(jsclick("text","确认提现",true,2) ){
                                return true;
                            }
                        }
                    }else
                    if(jsclick('text',"赚钱",true,2)){

                        if (   jsclick("text","提现",true,rd(2,5))  ){

                        }

                    }else{
                        back();
                    }
                    break;
                default:
                    back();
            }
        }
        Tips();
        sleep(500);
    }
}



// 正式开始编代码
var width = 720;
var height = 1440;
var width = device.width;
var height = device.height;
var phoneMode = device.brand;

log([currentPackage(),currentActivity(),width,height]);
var appinfo = {}
appinfo.name = "汽车之家极速版";
appinfo.bid = "com.autohome.speed";
info ={}
// getTaskRecord();
info['money'] = 0;

// console.show();
try{

    if ( (phoneMode == "Redmi" || phoneMode == "Xiaomi") && info.update ){
        download(appinfo.name);
        info.update = false;
        getTaskRecordUpdate(info)
    }

    clearApp();

    if (  launch(appinfo.bid)  ){
        if ( reg() ) {
            main();
        }
    }else{
        if ( (phoneMode == "Redmi" || phoneMode == "Xiaomi") && download(appinfo.name)  ){
            app_info( appinfo.name,{'error':'下载完成'});
        }else{
            app_info( appinfo.name,{'error':'安装超时'});
        }
    }

}catch(e){
    app_info( appinfo.name+'错误',{'error':e});
}

info ={};
info['state'] = 'ok';
info['name'] = appinfo.name;
console.hide();
toastLog('即将发广播');
// sendBroadcast(appinfo.name,JSON.stringify(info));
if ( launch( "com.flow.factory") ){
    sendBroadcast(appinfo.name,JSON.stringify(info));
}else{
    app.taskFinish(app.intent(info));
}
//汽车之家极速版,不注册
//移动网络

















































