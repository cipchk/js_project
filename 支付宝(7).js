


var f = {
    init:function() {
        log("程序初始化")
    },
    //post
    post : function(url,data){
        var res = http.post(url, data);
        var data = res.body.string();
        if(data){
            // log(data);
            return data;
        }
    },
    //get
    get : function(url){
        var res = http.get(url);
        var data = res.body.string();
        if(data){
            return data;
        }
    },
    //读取本地数据
    getLocal:function ( name, key) {
        const storage = storages.create(name);  //创建storage对象
        if (storage.contains(key)) {
            return storage.get(key);
        };
        //默认返回undefined
    },
    //基础函数
    active:function(pkg,n){
        if(!n){n=5}
        if(  currentPackage() == pkg ){
            log("应用在前端");
            return true;
        }else{
            log("启动一次应用");
            app.launch(pkg);
            sleep(1000*n);
        }
    },
    //准备点击
    click:function (x,y,sleeptime,name){
        if ( ! sleeptime ){sleeptime = 1}
        if ( name ){
            log('准备点击->'+name,"x:",x,"y:",y);
        }else{
            log('准备点击坐标->', "x:",x,"y:",y);
        }
        if( x > 0 && x < device.width && y > 0 && y < device.height ){
            click(x,y);
            sleep(sleeptime*1000);
            return true
        }else{
            log('坐标错误');
        }
    },
    //点击obj
    clickObj:function (obj,sleeptime,name){
        if ( ! sleeptime ){ sleeptime == 1 } 
        log(  name ? ("准备点击对象->" + name) : "点击未命名对象" )
        return f.click(obj.bounds().centerX(),obj.bounds().centerY(),sleeptime,name)
    },
    //穿透点击
    clickTrue:function(obj,sleeptime,name,lun){
        sleeptime ? sleeptime : 1
        let result = false;
        lun ? lun : 3
        for (let i=0;i<lun;i++){
            if (  obj && obj.clickable() ){
                obj.click();
                log(  name ? ("准备穿透点击对象->" + name) : "准备穿透点击未命名对象" )
                result = true
                break
            }
            obj = obj.parent()
        }
        if ( result ) { sleep(sleeptime * 1000) }
        return result
    },
    //正则点击
    ms:function (obj,clicks,sleeptimes,name,findtime,lun){
        if (!sleeptimes) { sleeptimes = 1}
        if (!findtime) { findtime = 200}

        var txt = '';
        for(let key in obj){
            if ( key.search("Matches") > 0 ){
                eval("var matches = /" + obj[key] + "/")
                txt = txt + key+'('+matches+').'
            }else{
                txt = txt + key+'("'+obj[key]+'").'
            }
        }
        var txt = "let objs = "+txt+"findOne("+findtime+");"
        eval(txt)
        if ( objs ) {
            log(txt,objs)
            if ( clicks ){
                if (! f.clickTrue( objs,sleeptimes,name,lun )){
                    f.clickObj( objs,sleeptimes,name );
                }
            }
            return true;
        }
    },
    rd:function (min,max){
        if (min<=max){
            return random(min,max)
        }else{
            return random(max,min)
        }
    }
}
f.init()


//从对方服务器取数
function getPhoneNumber() {
    let url = "http://alipay.wenfree.cn/?s=App.DgetAliypayPhone.GetPhone"
    let phonedata = f.get(url)

    if ( phonedata ){
        phonedata = JSON.parse(phonedata)
        if (  phonedata.data.msg  ){
            info['phone'] = phonedata.data.data.phone
            info['cpid'] = phonedata.data.data.cpid
            info['product'] = phonedata.data.data.product
            info['linkid'] = phonedata.data.data.linkid
            info['status'] = phonedata.data.data.status
            info['extra'] = phonedata.data.data.extra
            return true
        }
    } 
}

function getBackNumber( product ) {
    let url = "http://219.150.218.201:8092/suppUp/noRegPhone?cpid=" + info.cpid + "&product="+ product +"&phone="+info.phone+"&linkid="+info.linkid+"&extra="+info.extra
    console.log( url )
    console.log( f.get(url) )
}

//构建我方数据
function post_api_wenfree(params) {
    let url = "https://api.wenfree.cn"
    return f.post(url,params)
}

function updatePhone(phone) {
    var pasrams = {
        s:"App.Index.Update",
        table:"d_alipay_account_phone",
        arr:JSON.stringify({phone:phone}),
    }
    return post_api_wenfree(pasrams)
}


function getPhone() {
    let url = "https://api.wenfree.cn"
    const params = {
        s:"App.DgetAliypayPhone.GetPhone"
    }
    let phonedata = f.post(url,params)
    if ( phonedata ){
        phonedata = JSON.parse(phonedata)
        if (  phonedata.data.msg  ){
            info['phone'] = phonedata.data.data.phone
            info['id'] = phonedata.data.data.id
            return true
        }
    } 
}


function CheckPhone(product) {
    let url = "http://alipay.wenfree.cn"
    const params = info.payInfo
    params['s'] = "App.DgetAliypayCheck.CheckPhone"
    params['phone'] = info.phone
    params['product'] = product
    params['y_product'] = info.product
    params['cpid'] = info['cpid']
    params['linkid'] = info['linkid']
    params['status'] = info['status']
    params['extra'] = info['extra']

    log( params )
    log( f.post(url,params) ) 
}


function backPhone() {
    let url = "https://api.wenfree.cn"
    let params = {}
    params['s'] = "App.Index.Update"
    params['id'] = info.id
    params['table'] = 'd_alipay_account_phone'
    params['arr'] = JSON.stringify({todo:"done"})
    let phonedata = f.post(url,params)
}







// f.ms( {"text":"支付宝"},true,2,'支付宝' )
// f.ms( {"text":"朋友"},true )
// f.ms( {"desc":"通讯录"},true )


var width = device.width;
var height = device.height;
var phoneMode = device.brand;
log([currentPackage(),currentActivity(),width,height]);


function printAll() {
    // var all_Info = textMatches(/.*/).find();
    var all_Info = classNameMatches(/.*/).find();
    // var all_Info = idMatches(/.*/).find();
    for (var i = 0;i<all_Info.length;i++){
        var d = all_Info[i];
        log(i,d.id(),d.text(),"desc:"+d.desc(),'"className":"'+d.className()+'"',
        "clickable->"+d.clickable(),'selected->'+selected(),"depth->"+d.depth(),
        d.bounds().centerX(),d.bounds().centerY())
    }
}



function checkPay() {
    let checkPayI = 0
    var searchKey = false
    //启动一次app
    f.active(info.bid,5)

    while ( checkPayI < 100 ){
        checkPayI++

        if(f.ms( { "id":"com.alipay.mobile.antui:id/search_input_box" },true )){
        }else if( f.ms({"textMatches":"该手机号对应.*"} ) && f.ms({"text":info.phone,"id":"user_account"},true,2)  ){
            
        }else if(  f.ms({"id":"com.alipay.mobile.antui:id/ensure"},true,2) && searchKey  ) {
            info.payInfo.verified = '不存在'
            return "不存在"
        }else if(f.ms( { "id":"com.alipay.mobile.ui:id/social_search_normal_input" } )){
            setText( 0,info.phone  )
            sleep(1000);
            f.ms({"id":"com.alipay.mobile.contactsapp:id/search_icon_view"},true,3 )
            searchKey = true
            
            if (  f.ms({"id":"com.alipay.mobile.antui:id/ensure"} )  ){
                info.payInfo.verified = '不存在'
                return "不存在"
            }
            f.ms({"text":"显示更多"},true,1 )
            
            
            var alipay_nickname = id("com.alipay.android.phone.wallet.profileapp:id/tv_name").findOne(2000)
            if ( alipay_nickname ){
                info.payInfo.alipay_nickname = alipay_nickname.text()
            }

            var alipay = id("tv_right").findOne(2000)
            if ( alipay ){
                info.payInfo.alipay = alipay.text()
            }

            var real_name = id("tv_right").text('***').findOne(2000)
            if ( real_name ){
                info.payInfo.real_name = real_name.desc()
            }

            if ( f.ms({"desc":"未实名"})  ){
                info.payInfo.verified = '未实名'
                return "未实名"
            }

            if (   f.ms({"desc":"未认证"})  ){
                info.payInfo.verified = '未认证'
                return "未认证"
            }

            if ( f.ms({"descMatches":".*已实名"}) ||  f.ms({"descMatches":".*已认证"})  ){
                info.payInfo.verified = '已实名'
            }
  
            var area = id("tv_right").depth(9).findOne(2000)
            if ( area ){
                info.payInfo.area = area.text()
            }

            var constellation = textMatches(".*座").id("tv_right").findOne(2000)
            if ( constellation ){
                info.payInfo.constellation = constellation.text()
            }

            log( info )
            return 'pass'

            
            f.ms({"text":"转账"},true,3 )
            if ( f.ms({"text":"确认转账"},false,1,'确认转账',500 )  ||  f.ms({"text":"转账金额"},false,1,'转账金额',500 ) ){
                sleep(1000)
                return true
            }

        }else if(  f.ms( {"text":"朋友"},true )  ||  f.ms( {"text":"消息"},true )  ){
            f.ms( {"desc":"通讯录"},true ) 
            f.ms( {"text":"新的朋友"},true ) 
        }else{
            console.log('back----')
            if ( ! f.ms({"desc":"返回"},true,2,'返回') ){  back()  }
            sleep(2000);
        }

        console.log('----')
    }

}

var info = {}
info.bid = 'com.eg.android.AlipayGphone'
printAll()



while ( true ){
    try{
        info.payInfo = {}
        if ( getPhoneNumber() ){
            log( info )
            var checkreuslt =  checkPay()
            if ( checkreuslt == "不存在"  ) {
                CheckPhone(10)
                if ( info.product == 10 ){
                    getBackNumber(10)
                }
            }else
            if ( checkreuslt == "未实名" ) {
                CheckPhone(8)
                if( info.product == 8 ){
                    getBackNumber(8)
                }
            }else
            if( checkreuslt == "未认证"  ){
                CheckPhone(2)
            }else{
                CheckPhone(1)
            }
            sleep(f.rd(10,20)*1000)
        }else{
            log('暂无数据')
            home();
        }
        
    }catch(e){
        log(e)
    }
    sleep(f.rd(2,3)*1000)
}







