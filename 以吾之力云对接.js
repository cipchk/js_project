

importClass(android.content.ContentResolver);
importClass(android.database.Cursor);
importClass(android.net.Uri);

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
        return data;
    }
}
// 获取接口数据
function getTask() {
    var url = 'http://api.wenfree.cn/public/';
    let res = http.post(url, {
        "s": "NewsImei.Imei",
        "imei": device.getIMEI()
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
//任务回调
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
    postdata["imei"]= device.getIMEI();
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
function jjsclick(way,txt,clickKey,sleeptime,height){
    if(!sleeptime){sleeptime=1};//当n没有传值时,设置n=1
    if(!height){height = 2440 };//没有设置高度则height = 1440
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
        if ( objs.bounds().centerX() < 0 || objs.bounds().centerX()> width || objs.bounds().centerY() < 0 || objs.bounds().centerY() > height ){

        }else{
            if ( clickKey ){
                log('准备点击->',txt,"x:",objs.bounds().centerX(),"y:",objs.bounds().centerY());
                click__(objs,sleeptime,txt);
            }else{
                log("找到->",txt);
            }
            return true;
        }
    }
}
//普通封装
function jsclick(way,txt,clickKey,sleeptime,height){
    if(!sleeptime){sleeptime=1};//当n没有传值时,设置n=1
    if(!height){height = 1440 };//没有设置高度则height = 1440
    if(!clickKey){clickKey=false}; //如果没有设置点击项,设置为false

    var objs = false;
    if (way == "text"){
        objs = text(txt).findOne(200);
    }else if(way == "id"){
        objs = id(txt).findOne(200);
    }else if(way == "desc"){
        objs = desc(txt).findOne(200);
    }
    if(objs){
        if ( objs.bounds().centerX() < 0 || objs.bounds().centerX()> width || objs.bounds().centerY() < 0 || objs.bounds().centerY() > height ){

        }else{
            if ( clickKey ){
                log('准备点击->',txt,"x:",objs.bounds().centerX(),"y:",objs.bounds().centerY());
                if (! clickTrue(objs,sleeptime,txt) ){
                    click__(objs,sleeptime,txt);
                }
            }else{
                log("找到->",txt);
            }
            return true;
        }
    }
}
//强制点击
function bclick(way,txt,clickKey,sleeptimes,height){
    if(!sleeptimes){sleeptimes=1};//当n没有传值时,设置n=1
    if(!height){height = 1440 };//没有设置高度则height = 1440
    var obj = false;
    if(!clickKey){clickKey=false}; //如果没有设置点击项,设置为false
    if (way == "text"){
        obj = text(txt).findOne(200);
    }else if(way == "id"){
        obj = id(txt).findOne(200);
    }else if(way == "desc"){
        obj = desc(txt).findOne(200);
    }
    if(obj){
        if ( objs.bounds().centerX() < 0 || objs.bounds().centerX()> width || objs.bounds().centerY() < 0 || objs.bounds().centerY() > height ){
            return false
        }
        if ( clickKey ){
            if (! clickTrue(obj,sleeptimes,txt)){
                click__(obj,sleeptimes,txt);
            }
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
            let obj__ = obj.parent().parent();
            if ( obj__ && obj__.clickable() ){
                obj__.click();
                log('父父组件能穿透')
                result = true
            }else{
                log('父父组件不能穿透');
                let obj___ = obj.parent().parent().parent();
                if ( obj___ && obj___.clickable() ){
                    obj___.click();
                    log('父父组件能穿透');
                    result = true
                }else{
                    log('父父组件不能穿透');
                }
            }
        }
    }

    if ( result ) { sleep(sleeptime * 1000) }
    return result;
}
//正则点击
function ms(obj,clicks,sleeptimes,height,txts){
    if (!sleeptimes) { sleeptimes = 1}
    if(!height){height = 1440 };//没有设置高度则height = 1440
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
        if ( objs.bounds().centerX() < 0 || objs.bounds().centerX()> width || objs.bounds().centerY() < 0 || objs.bounds().centerY() > height ){
            return false
        }
        if (clicks){
            if (! clickTrue(objs,sleeptimes,txts)){
                click__(objs,sleeptimes,txts);
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

    var timeLine = new Date().getTime()
    while ( new Date().getTime() - timeLine < 10 * 60 * 1000 ) {
        if ( active( "com.xiaomi.market" , 5)  ){
            var UI = currentActivity();
            log('UI',UI)
            switch(UI){
                case 'com.xiaomi.market.ui.MarketTabActivity':
                    log('主界面');
                    jsclick('id','search_text_switcher',true,2);
                    setText(0,appname);
                    break;
                case 'com.xiaomi.market.ui.SearchActivityPhone':
                    log('搜索页面');
       
                    if ( ms({"descMatches": appname +".*图形.*" },true,3)  ){

                    }else if( ms({"textMatches":appname +".*图形.*"},true,2) ){

                    }else if( ms({ "text":appname },true,2) ){

                    }

                    break;
                case 'com.xiaomi.market.ui.detail.AppDetailActivityInner':
                    log('app详情页面');
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
//滑动函数
function moveTo(x,y,x1,y1,times){
    swipe(x,y,x1,y1,times);
    sleep(1000);
}
//新tips
function Tips(){
    log("查询弹窗");

    let appTips = [

        {"textMatches":"我知道了"},
        {"textMatches":"知道了"},
        {"desc":"图标","depth":4},
        {"textMatches":"跳过"},
        {"textMatches":"知道了"},
        {"textMatches":"允许"},
        {"textMatches":"同.*意"},
        {"textMatches":".*重新.*"},
        {"textMatches":".*关闭应用.*"},
        {"textMatches":"取消"},
        {"text":"立即更新"},
    ]

    for( let k in appTips ){
        if (ms( appTips[k],true,rd(1,2) ) ){

        }
    }

    log('查询弹窗-end')
}

//河马ip
function hmip(){
    var result = shell("ipclient faa31f81bfea4124995972d5dc016b57 1", true);
    // console.show();
    // log(result);
    if(result.code == 0){
      toast("执行成功");
      return true
    }else{
      toast("执行失败！请到控制台查看错误信息");
    }
}
//光之
function gz(){

    var timeLine = new Date().getTime()
    while ( new Date().getTime() - timeLine < 5 * 60 * 1000 ) {

        if ( active( appinfo.gzbid , 3)  ){

            if ( jsclick("text","立即登录",true,rd(6,10) )   ){

            }else if (   jsclick("id","vpnSwitch",true,rd(6,10) ) ){

                return true
            }

        }

        sleep(1000);
    }
}

//设备大师
function sbds(){
    let fix = false
    var start = false
    var timeLine = new Date().getTime()
    while ( new Date().getTime() - timeLine < 5 * 60 * 1000 ) {

        if ( active( appinfo.sbdsbid , 5)  ){

            if (fix && jsclick("text","修改设备",false,rd(2,3) )){
                return true
            }else
            if ( jsclick("text","修改设备",true,rd(2,3) )   ){
                start = true;
            }else if ( start && jsclick("id","brand",true,rd(2,3) ) ){

                var phonelist = [ "XIAOMI","HUAWEI","SAMSUNG","HONOR","vivo"]
                if ( ms({"text":phonelist[rd(0,4)],"depth":4},true,rd(1,2)) ) {
                    jsclick("text","下一步",true,rd(2,3))
                }else{
                    jsclick("id","back",true,rd(2,3))
                }
                
            }else if( start && jsclick("text","立即清理",false,rd(2,3)) ){
                jsclick("text","以吾之力",true,1)
                jsclick("text","QQ浏览器",true,1)

                if ( jsclick("text","立即清理",true,rd(10,15)) ){
                    fix = true
                }
            }else{
                jsclick("id","back",true,rd(2,3))
            }
        }
        sleep(1000);
    }
}

//打开浏览器
function urlzc(){

    // app.openUrl("https://api.wooyouedu.com/activity/invitation2020/share?invitationCode=E83A2U");
    // sleep(5000);

    var wait = 0;
    var send = true;
    var timeLine = new Date().getTime()
    while ( new Date().getTime() - timeLine < 3 * 60 * 1000 ) {

        if ( active( appinfo.llq , 3)  ){

            if ( ms({"textMatches":"该手机号已被注册"} )){
                jsclick("text","关闭页面提示信息",true,1)
                if ( getPhone() ){
                    setText(0,info.phone);
                    setText(2,info.password);
                    send = true
                }
            }else if ( jsclick("text","请输入您的手机号",true,rd(2,3)) ){
                if ( getPhone() ){
                    setText(0,info.phone);
                    setText(2,info.password);
                }
            }else if ( send && jsclick("text","获取验证码",true,rd(5,8)) ){
                send = false;
            }else if ( jsclick("text","输入验证码",true,rd(3,4)) ){

                wait++;
                if ( wait%8 ==  0){
                    send = true
                }

                let phone = className("android.widget.EditText").findOne(200);
                if ( phone ){
                    // info.phone = phone.text();
                    log(  phone.text()  )
                }

                if ( getMessage() ){
                    setText(1,info.yzm);
                }else{
                    sleep(1000*5);
                }

            }else if (  jsclick("text","注册并免费领取",true,rd(3,5) )){
                return true;
            }else if (  jsclick("text","以吾之力") ){
                return true;
            }else if (  jsclick("text","首页") ){
                app.openUrl("https://api.wooyouedu.com/activity/invitation2020/share?invitationCode=E83A2U");
                sleep(5000);
            }else{
                jsclick("text","关闭页面提示信息",true,1)
            }
        
        }
        sleep(1000);
        Tips();
    }
}


//以吾之力
function main(){

    var timeLine = new Date().getTime()
    while ( new Date().getTime() - timeLine < 5 * 60 * 1000 ) {


        if ( active( appinfo.bid , 8)  ){
            var UI = currentActivity();
            log('UI',UI)
            switch(UI){
                case 'com.wooyouedu.usemypower.MainActivity':
                    log('主界面');
                    if ( jsclick("text","账号密码登录")  ){
                        setText(1,info.phone);
                        setText(2,info.password);
                        sleep(500);
                        ms({"textMatches":"登.*录"},true,rd(2,3))
                    }else
                    if (   jsclick("text","密码登录",true )  ) {

                    }else if( jsclick("text","首页")  ){
                        jsclick("text","我的",true,rd(2,6))
                        jsclick("text","学习",true,rd(2,6))
                        sleep(1000*rd(3,5));
                        Idfa();
                        return true
                    }
                    break;
                default:
                    log('other');
                    back();
            }
        }
   
        Tips();
        sleep(1000);
    }
}

//取手机号
function getPhone(){
    let postArr = {};
    postArr['s']="App.SmsWenfree.GetPhone";
    let data = jspost(info.api,postArr);
    if (data){
        data = JSON.parse(data);
        let url = data['data']['url'];
        info.smsname = data['data']['name'];
        let res = http.get(url);
        res = res.body.string();
        log("res",res)

        postArr['s']="SmsWenfree.MakeGetPhone";
        postArr['name']=info.smsname;
        postArr['arr']=res;
        let datas = jspost(info.api,postArr);
        if ( datas ){
            log(datas)
            datas = JSON.parse(datas);
            if ( datas.data ){
                info.phone = datas.data;
                return true;
            }
        }
    }
    toastLog("取手机号出错");
}
//取短信
function getMessage(){
    let postArr = {};
    postArr['s']="App.SmsWenfree.GetSms";
    postArr['name']=info.smsname;
    postArr['phone']=info.phone;
    let data = jspost(info.api,postArr);
    if (data){
        data = JSON.parse(data);
        let url = data['data']['url'];
        let res = http.get(url);
        res = res.body.string();
        log(res)
        if ( res.length > 6){
            log("准备上传");
            postArr['s']="SmsWenfree.MakeGetSms";
            postArr['name']=info.smsname;
            postArr['arr']=res;
            let datas = jspost(info.api,postArr);
            if ( datas ){
                datas = JSON.parse(datas);
                log(datas)
                if ( datas.data ){
                    info.yzm = datas.data;
                    return true;
                }
            }
        }

    }
    toastLog("取手短信出错");
}
//取短信
function Idfa(){
    let postArr = {};
    postArr['service'] = 'Idfa.idfa';
    postArr['name'] = appinfo.name;
    postArr['password'] = info.password;
    postArr['idfa'] = info.phone;
    let data = jspost("http://wenfree.cn/api/Public/idfa/",postArr);
}

var all_Info = textMatches(/.*/).find();
for (var i = 0;i<all_Info.length;i++){
    var d = all_Info[i];
    log(i,d.id(),d.text(),d.depth())
}

// 正式开始编代码
log([currentPackage(),currentActivity(),device.width,device.height]);
var width = 720;
var height = 1440;
var appinfo = {}
appinfo.name = "以吾之力";
appinfo.bid = "com.wooyouedu.usemypower";
appinfo.llq = "com.tencent.mtt";
appinfo.gzbid = "com.deruhai.guangzi";
appinfo.sbdsbid = "com.longene.setcardproperty";
info ={};
info.phone = '18128823268';
info.password = 'AaDd112211';
info.api = 'http://sms.wenfree.cn/public/'
info.yzm = '';
info.smsname = '';



while (true) {
    try{
        while  (true) {
            if ( hmip()){
                if ( sbds() ){
                    if ( urlzc()  ){
                        main();
                    }
                }
            }
        }
    
    }catch(e){
        toastLog(e);
        sleep(1000);
    }
}













