/**
 * Created by liuzhen on 2016/10/18.
 */
function init(){
    var v = $("#audio");
    var play = $(".play");
    var prev = $(".prev");
    var next = $(".next");

    var progress = $(".progress");
    var progress_now = $(".progress .now");
    var progress_col = $(".progress .dot");

    var endtime = $(".endtime");
    var nowtime = $(".nowtime");
    var listobj = $(".listobj");

    var autoplay = $(".autoplay");

    /* --------------------- */
    var stop = $(".stop");
    var voladd = $(".voladd");
    var volminus = $(".volminus");
    var muted = $(".muted");
    var single = $(".single");
    var download = $(".download");
    var speed = $("#speed");
    // var listmode = $(".listmode");
    // var random = $(".random");


    var vol = $(".vol");
    var vol_now = $(".vol .now");
    var vol_col = $(".vol .dot");
    var poster = $("#poster");


    /**
     * 设置当前状态
     */
    speed.value = localStorage.speed;
    v.playbackRate = localStorage.speed;
    autoplay.checked = /^true$/.test(localStorage.autoplay);
    var nowAlbumIndex = localStorage.nowAlbumIndex;
    var playindex = localStorage.playindex;
    v.currentTime = localStorage.progress;
    v.volume = localStorage.vol;
    v.muted = /^true$/.test(localStorage.muted);



    if(autoplay.checked){
        v.play();
    }



    // var randomlist = [];
    var playmode = "paused";// 播放状态

    //var mode = "list";// 顺序模式

    var coldown = false;
    var voldown = false;



    var progress_bar_width = parseFloat(window.getComputedStyle(progress,null).getPropertyValue("width"));
    var vol_bar_width = parseFloat(window.getComputedStyle(vol,null).getPropertyValue("width"));

    /**
     * 通用函数
     */
    function viewlist(){
        var albumName = "<h2>播放列表：" + nowList.albumName + "(" + nowList.albumSong.length + ")" + "</h2>";
        var ol_text = "<ul>";
        for(var i = 0;i < nowList.albumSong.length;i++){
            var musicName = nowList.albumSong[i].musicName;
            var musicSinger = nowList.albumSong[i].musicSinger;

            ol_text += "<li data-index='" + i + "'>" +
                musicName +
                "<span> - " + musicSinger + "</span>" +
                "</li>";
        }
        listobj.innerHTML = albumName + ol_text + "</ul>";
    }
    poster.src = baseurl + nowList.albumSong[0].poster;
    function toplay(){
        v.src = baseurl + nowList.albumSong[playindex].musicLink;
    }
    /**
     * 播放状态更新
     */
    viewlist();
    /* 播放时 */
    v.addEventListener("play",function(){
        playmode = "playing";
        play.innerHTML = "<i class='fa fa-pause'></i>";
        poster.className = "playanimate";
    },false);
    /* 暂停时 */
    v.addEventListener("pause",function(){
        playmode = "paused";
        play.innerHTML = "<i class='fa fa-play'></i>";
        poster.className = "";
    },false);
    /* 播放完后 */
    v.addEventListener("ended",function(){
        if(mode === "random"){
            var toindex = Math.floor(list.length * Math.random());
            toplay(toindex);
        }else{
            prev.click();
        }
    },false);
    /* 播放时长改变时，可以理解为切歌 */
    v.addEventListener("durationchange",function(){
        viewlist();
        download.href = v.currentSrc;
        //应该把转化后的字符转化为汉字
        download.download = v.currentSrc.replace(/.*\//g,"");

        var allsecond = parseInt(v.duration);
        endtime.innerHTML = parseInt(allsecond/60) + ":" + (allsecond%60 >= 10?allsecond%60:"0"+allsecond%60);

        if(playmode === "playing"){
            v.play();
        }
        progress_now.style.width = 0;
        progress_col.style.left = 0;
        $(".listobj li",true)[playindex].className = "now";
        poster.src = baseurl + nowList.albumSong[playindex].poster;
        $(".musicname").innerHTML = nowList.albumSong[playindex].musicName;
        $(".musicsinger").innerHTML = nowList.albumSong[playindex].musicSinger;
        $(".bg").style.background = "url(" + baseurl + nowList.albumSong[playindex].poster + ")";
    },false);
    /* 改变音量时 */
    v.addEventListener("volumechange",function(){
        vol_now.style.width = v.volume * 100 + "%";
        vol_col.style.left = v.volume * 100 + "%";
        console.log(vol.className);
        if(v.muted){
            vol.className = "vol mutedmode";
            $(".muted i").className = "fa fa-volume-off";
        }else{
            vol.className = "vol";
            $(".muted i").className = "fa fa-volume-up";
        }
    },false);
    /* 当手动更改播放进度时，用来监控进度条可能会卡 */
    v.addEventListener("seeked",function(){
        //console.log(v.currentTime);
    },false);
    /* 资源错误 */
    v.addEventListener("stalled",function(){
        console.log("资源错误");
    },false);
    /* 播放位置改变 */
    v.addEventListener("timeupdate",function(){
        var width = (v.currentTime / v.duration) * 100 + "%";
        progress_now.style.width = width;
        progress_col.style.left = width;
        var second = parseInt(v.currentTime);
        nowtime.innerHTML = parseInt(second/60) + ":" + (second%60 >= 10?second%60:"0"+second%60);

    },false);
    /* 出错时 */
    v.addEventListener("error",function(){
        console.log("出错");
    },false);
    /**
     * 用户操作
     */
    play.addEventListener("click",function(){
        if(playmode == "paused"){
            v.play();
        }else{
            v.pause();
        }
    },false);
    stop.addEventListener("click",function(){
        v.currentTime = 0;
        v.pause();
    },false);
    next.addEventListener("click",function(){
        playindex = (++playindex) % nowList.albumSong.length;
        toplay();
    },false);
    prev.addEventListener("click",function(){
        if(playindex === 0) playindex = nowList.albumSong.length;
        --playindex;
        toplay();
    },false);
    listobj.addEventListener("click",function(event){
        playindex =parseFloat(event.target.attributes["data-index"].value);
        $(".mask").click();
        toplay();
    },false);

    voladd.addEventListener("click",function(){
        if(v.volume < 0.9){
            v.volume = v.volume + 0.1;
        }else{
            v.volume = 1;
        }
    },false);
    volminus.addEventListener("click",function(){
        if(v.volume > 0.1){
            v.volume = v.volume - 0.1;
        }else{
            v.volume = 0;
        }
    },false);
    muted.addEventListener("click",function(){
        v.muted = !v.muted;
    },false);

    progress.addEventListener("mousedown",function(event){
        coldown = true;
        var width = (event.clientX - this.offsetLeft) / progress_bar_width;
        v.currentTime = width * v.duration;
    },false);
    vol.addEventListener("mousedown",function(event){
        voldown = true;
        var width = (event.clientX - this.offsetLeft) / vol_bar_width;
        v.volume = width;
    },false);
    $(".list").addEventListener("click",function(event){
        $(".mask").className = $(".mask").className + " fadein";
        $(".listobj").className = $(".listobj").className + " popbottom";
    },false);
    $(".mask").addEventListener("click",function(event){
        $(".mask").className = $(".mask").className.replace("fadein","");
        $(".listobj").className = $(".listobj").className.replace("popbottom","");

    },false);
    document.addEventListener("mouseup",function(event){
        coldown = false;
        voldown = false;
    },false);
    document.addEventListener("mousemove",function(event){
        var event = event ? event: window.event;
        if(coldown){
            var width = event.clientX - progress.offsetLeft;
            if(width >= 0&&width < progress_bar_width){
                v.currentTime = width * v.duration / progress_bar_width;

            }
        }
        if(voldown){
            var width = event.clientX - vol.offsetLeft;
            if(width >= 0&&width < vol_bar_width){
                v.volume = width / vol_bar_width;
            }
        }
    },true);



    // single.addEventListener("click",function(){
    //     mode = "single";
    //     v.loop=true;
    //     $(".palymode").innerText = "Single loop";
    // },false);
    // listmode.addEventListener("click",function(){
    //     mode = "list";
    //     v.loop=false;
    //     $(".palymode").innerText = "List loop";
    // },false);
    // random.addEventListener("click",function(){
    //     mode = "random";
    //     v.loop=false;
    //     $(".palymode").innerText = "Random";
    // },false);
    speed.addEventListener("change",function(){
        v.playbackRate = this.value;//defaultPlaybackRate默认播放速度
    },false);
    /**
     * 键盘事件
     */
    document.addEventListener("keydown",function(event){
        //console.log(event.keyCode);
        if(event.keyCode === 32){// 空格暂停
            event.preventDefault();
            play.click();
        }
    },false)
    /**
     * 本地存储
     */
    window.addEventListener("beforeunload",function(event){
        /**
         * 加载完成后以是否自动播放为标准，无关关闭前播放状态（是否暂停或播放）
         * 个性签名
         * 上次播放时间
         */
        localStorage.speed = speed.value;// 速度
        //localStorage.listmode = listmode;// 播放模式
        localStorage.autoplay = autoplay.checked;// 自动播放
        localStorage.nowlist = nowList.albumName;// 当前列表
        localStorage.playindex = playindex;// 当前曲目
        console.log(v.currentTime);
        localStorage.progress = v.currentTime;// 当前播放进度
        localStorage.vol = v.volume;// 音量
        localStorage.muted = v.muted;// 是否静音

    },false)
}

function $(obj,boolean){
    if(boolean){
        return document.querySelectorAll(obj);
    }else{
        return document.querySelector(obj);
    }
}
/**
 * AJAX请求和处理Json
 */
if(!localStorage.speed){
    localStorage.speed = 1;// 速度
    //localStorage.listmode = listmode;// 播放模式
    localStorage.autoplay = false;// 自动播放
    localStorage.nowAlbumIndex = 0;// 当前列表
    localStorage.playindex = 0;// 当前曲目
    localStorage.progress = 0;// 当前播放进度
    localStorage.vol = 0.5;// 音量
    localStorage.muted = false;// 是否静音
}

var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = getXMLHttpData;
xmlhttp.open("get", "resource/package.json", true);
xmlhttp.send(null);
function getXMLHttpData(){
    if(xmlhttp.readyState === 4){
        if(xmlhttp.status === 0 || xmlhttp.status === 200){
            var jsonObj = JSON.parse(xmlhttp.responseText);
            baseurl = jsonObj.urlbase;
            var songData = jsonObj.songData;
            nowList = songData[localStorage.nowAlbumIndex];
            console.log(songData);
            console.log(nowList);
            init();
        }else{
            alert("XMLHTTP error，请刷新浏览器");
        }
    }
}
