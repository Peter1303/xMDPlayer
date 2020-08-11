/*
 * Author : Peter1303
 * Date: 2020/8/8
 * Time: 11:54
 */

/**
 * 可设置手机版靠左歌词显示
 */

var lyricArea = $("#lyric"); // 歌词显示容器
var lyric;
var tlyric;
var lastLyric = -1;
var hasTranslation = false;

/**
 * 初始化歌词
 * @param {string|string} str 原歌词
 * @param {string} tstr 翻译
 */
function showLyric(str, tstr) {
    var obj = parseLyric(str, tstr);
    lyric = obj[0]; // 解析获取到的歌词
    if (hasTranslation) {
        tlyric = obj[1]; // 解析获取到的翻译歌词
    }
    console.log('hasTranslation: ' + hasTranslation)
    lyricArea.html(''); // 清空歌词区域的内容
    lyricArea.scrollTop(0); // 滚动到顶部
    lastLyric = -1;
    // 显示全部歌词
    var i = 0;
    for (var k in lyric) {
        var txt = lyric[k];
        if (!txt) {
            txt = "&nbsp;";
        }
        lyricArea.append($("<li data-no='" + i + "' class='lrc-item'>" + txt + "</li>"));
        if (hasTranslation) {
            if (tlyric.hasOwnProperty(k)) {
                lyricArea.append($("<li data-no='" + i + "' class='lrc-item'>" + tlyric[k] + "</li>"));
            }
        }
        i++;
    }
}

/**
 * 解析歌词
 * 这一函数来自 https://github.com/TivonJJ/html5-music-player
 * @param {string} lrc 歌词
 * @param {string} tlrc 翻译
 */
function parseLyric (lrc, tlrc) {
    if (lrc === '') {
        hasTranslation = false;
        hasLyric = false;
        return [{0: '没有歌词哦'}, {}];
    } else {
        hasLyric = true;
    }
    hasTranslation = tlrc !== null && tlrc !== '';
    var lyrics = lrc.split("\n");
    if (hasTranslation) {
        var tlyrics = tlrc.split("\n");
    }
    var lrcObj = {};
    var tlrcObj = {};
    for (var i = 0; i < lyrics.length; i++) {
        var lyric = decodeURIComponent(lyrics[i]);
        var tlyric;
        if (hasTranslation) {
            tlyric = decodeURIComponent(tlyrics[i]);
        }
        var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
        var timeRegExpArr = lyric.match(timeReg);
        var TtimeRegExpArr;
        if (hasTranslation) {
            TtimeRegExpArr = tlyric.match(timeReg);
        }
        if (!timeRegExpArr) {
            continue;
        }
        if (hasTranslation) {
            if (!TtimeRegExpArr) {
                continue;
            }
        }
        var clause = lyric.replace(timeReg,'');
        var Tclause;
        if (hasTranslation) {
            Tclause = tlyric.replace(timeReg,'');
        }
        for (var k = 0, h = timeRegExpArr.length; k < h; k++) {
            var t = timeRegExpArr[k];
            var min = Number(String(t.match(/\[\d*/i)).slice(1)),
                sec = Number(String(t.match(/\:\d*/i)).slice(1));
            var time = min * 60 + sec;
            lrcObj[time] = clause;
        }
        if (hasTranslation) {
            for (var k = 0, h = TtimeRegExpArr.length; k < h; k++) {
                var t = timeRegExpArr[k];
                var min = Number(String(t.match(/\[\d*/i)).slice(1)),
                    sec = Number(String(t.match(/\:\d*/i)).slice(1));
                var time = min * 60 + sec;
                tlrcObj[time] = Tclause;
            }
        }
    }
    console.log('isMobile: ' + isMobile())
    //console.log(tlrcObj)
    //console.log(lrcObj);
    return [lrcObj, tlrcObj];
}

/**
 * 滚动歌词到指定句
 * @param {number|string} t 当前播放时间（单位：秒）
 */
function scrollLyric (t) {
    if (lyric === '') {
        return false;
    }
    var time = parseInt(t); // 时间取整
    //console.log(time);
    if (lyric === undefined || lyric[time] === undefined) {
        //console.log('当前时间点没有歌词');
        return false; // 当前时间点没有歌词
    }
    if (lastLyric === time) {
        return true;  // 歌词没发生改变
    }
    if (isMobile()) {
        if (!showed) {
            $('#musicPlayer-detail').text(lyric[time]);
        } else {
            $('#musicPlayer-detail').text(artist);
        }
    } else {
        $('#musicPlayer-lyric').text(lyric[time]);
    }
    var i = 0; // 获取当前歌词是在第几行
    for (var k in lyric){
        if(k == time) {
            break;
        }
        i ++;
    }
    lastLyric = time; // 记录方便下次使用
    $('.lrc-item').css('color', '#4C4C4C');
    $(".lplaying").removeClass("lplaying"); // 移除其余句子的正在播放样式
    $(".lrc-item[data-no='" + i + "']").addClass("lplaying"); // 加上正在播放样式
    $(".lplaying").css('color', accentColor);
    var scroll = (lyricArea.children().height() * i * (hasTranslation ? 2 : 1)) - ($(".lyric").height() / 2) + (hasTranslation ? 350 : 320);
    lyricArea.stop().animate({scrollTop: scroll}, 700);  // 平滑滚动到当前歌词位置
}

/**
 * 强制刷新当前时间点的歌词
 * @param {number|string} t 当前播放时间（单位：秒）
 */
function refreshLyric(t) {
    if (lyric === '') {
        return false;
    }
    var time = parseInt(t); // 时间取整
    var i = 0;
    for (var k in lyric) {
        if(k >= time) {
            break;
        }
        i = k; // 记录上一句的
    }
    scrollLyric(i);
}
