/*
 * Author : Peter1303
 * Date: 2020/8/8
 * Time: 11:52
 */

/**
 * TODO
 * 下载或分享无版权音乐时给出提示
 * 自定义列表
 * 网易云榜单
 * 下一首会跳过几首
 * 随机播放等
 * 网易云热评
 * auto 主题未完善
 */

var audio = $("audio")[0];
var checkLoading;
var timeSecond = 1;
// 获取进度条
var playInterval;
function getDuration() {
    $("#changeProgress").fadeIn(3800);
    playInterval = setInterval(function () {
        var widthDuration = audio.currentTime / audio.duration * 100;
        //$(".mini-progress").css("width", widthDuration);
        $(".mini-progress").val(widthDuration);
        mdui.updateSliders();
        if (widthDuration == "100") {
            //console.log(playerList);
            playNext();
            //playBtn();
        }
    }, 1000);
}
/**
 * 快进快退
 */
function changeProgress() {
    $("#playBtn").hide();
    $("#play-spinner").fadeIn();
    audio.currentTime = $(".mini-progress").val() / 100 * audio.duration;
    refreshLyric(audio.currentTime);
    if (audio.paused) {
        playBtn();
    }
    setTimeout(function(){
        $("#play-spinner").hide();
        $("#playBtn").fadeIn();

    },2000);
}
/**
 * 播放暂停
 */
function playBtn() {
    if (audio.paused) {
        // 暂停>播放
        $("#playBtn").html("&#xe036;");
        audio.play();
        if ($("audio")[0].paused) {
            $("#playBtn").html("&#xe039;");
        }
        getDuration();
    } else {
        // 播放>暂停
        $("#playBtn").html("&#xe039;");
        audio.pause();
        clearInterval(playInterval);
    }
}

var setValue = function setValue(item) {
    //var id = item.id;
    var name = item.name;
    var artists = item.artist; // 数组
    //var album = item.album;
    var pic_id = '', picUrl = '';
    if (item.hasOwnProperty('pic_id')) {
        pic_id = item.pic_id;
    } else if (item.hasOwnProperty('picUrl')) {
        picUrl = item.picUrl;
    }
    var url_id = item.url_id;
    var lyric_id = item.lyric_id;
    getSongUrl(url_id);
    getPic(pic_id, picUrl, (picUrl !== ''));
    getLyric(lyric_id);
    song_name = name;
    artist = getArtist(artists);
    $('#musicPlayer-name').text(song_name);
    $('#musicPlayer-detail').text(artist);
    $('#music_download').attr('download', song_name + '.mp3');
    $('#music_download-pic').attr('download', song_name + '.jpg');
    $('#menu-download').show();
    $('#menu-show').show();
    $('#menu-netease-divider').show();
    isPlaying = true;
};

/**
 * 拼接歌手
 * @param {any} artists 歌手数组
 */
function getArtist(artists) {
    var temp = '';
    for (var i = 0; i < artists.length; i ++) {
        if (i === 0) {
            temp = artists[i];
        } else {
            temp += '/' + artists[i];
        }
    }
    return temp;
}

/**
 * 获取歌曲链接
 * @param {string} id 歌曲ID
 */
function getSongUrl(id) {
    $.ajax({
        type: 'POST',
        url: 'music.php',
        timeout: 20000,
        data: {
            types: 'url',
            source: typeList[selectedType],
            id: id
        },
        dataType: 'json',
        beforeSend: function beforeSend() {
        },
        success: function success(result) {
            //console.log(result)
            song_url = result.url;
            if (song_url === '') {
                $('#music_download').hide();
            } else {
                $('#music_download').show();
            }
            // 遇到错误播放下一首歌
            if(song_url === "err") {
                audioErr(); // 调用错误处理函数
                return false;
            }
            $('#music_download').attr('href', song_url);
            if (audio.src === song_url && audio.paused) { //点击列表时若是当前歌曲 且 暂停状态 => 播放
                playBtn();
            } else if (audio.src === song_url && !audio.paused) { //点击列表时若是当前歌曲 且 播放状态 => return false;
                $("#changeProgress").show();
                return false;
            } else {  //点击列表时若不是当前歌曲 => 切换成当前点击的歌
                $("#play-spinner").show();
                $("#playBtn").hide();
                try {
                    timerStop();
                    timerStart();
                    audio.src = song_url;
                    audio.ondurationchange = function () {
                        $("#play-spinner").hide();
                        $("#playBtn").fadeIn();
                        playBtn();
                        $("#player-wrapper").slideDown(200);
                    };
                } catch(e) {
                    console.log('play error: ' + e);
                    audioErr(); // 调用错误处理函数
                    return false;
                }
            }
        },
        error: function error(e, t) {
        },
        complete: function complete() {
        }
    });
}

/**
 * 获取图片
 * @param {string} id 图片 ID
 * @param {*} picUrl 如果是网易云歌单的直接使用现成的链接
 * @param {boolean} load 直接加载链接
 */
function getPic(id, picUrl, load) {
    if (load) {
        if (picUrl === '') {
            console.log('loading pic by url, but the url is empty');
            $('#musicPlayer-icon').attr('src', emptyPic);
        } else {
            console.log('loading pic by url, url: ' + picUrl);
            $('#music_download-pic').attr('href', picUrl);
            $('#musicPlayer-icon').attr('src', picUrl);
        }
    } else {
        console.log('getting pic by id, id: ' + id);
        $.ajax({
            type: 'POST',
            url: 'music.php',
            timeout: 20000,
            data: {
                types: 'pic',
                source: typeList[selectedType],
                id: id
            },
            dataType: 'json',
            beforeSend: function beforeSend() {
            },
            success: function success(result) {
                //console.log(result)
                pic = result.url;
                console.log('pic url: : ' + pic);
                if (pic === '') {
                    $('#musicPlayer-icon').attr('src', emptyPic);
                } else {
                    $('#musicPlayer-icon').attr('src', pic);
                    $('#music_download-pic').attr('href', pic);
                }
            },
            error: function error(e, t) {
            },
            complete: function complete() {
            }
        });
    }
}

/**
 * 获取歌词
 * @param {string} id 歌词id
 */
function getLyric(id) {
    $.ajax({
        type: 'POST',
        url: 'music.php',
        timeout: 20000,
        data: {
            types: 'lyric',
            source: typeList[selectedType],
            id: id
        },
        dataType: 'json',
        beforeSend: function beforeSend() {
        },
        success: function success(result) {
            //console.log(result)
            lyric_string = result.lyric;
            showLyric(lyric_string, result.tlyric);
        },
        error: function error(e, t) {
        },
        complete: function complete() {
        }
    });
}

/**
 * 获取网易云用户的歌单
 * @param {number} i 第几个
 * @param {any} e 元素
 */
function play(i, e) {
    if (pos !== i || changeType) {
        $(".music-ul li").removeClass("playList-active");
        $(e).addClass("playList-active");
        setValue(playerList[i]);
        pos = i;
        changeType = false;
    }
}

/**
 * 下一首
 */
function playNext() {
    audio.pause();
    $(".mini-progress").val(0);
    if (pos + 1 < playerList.length) {
        //console.log(playerList[pos + 1]);
        play(pos + 1, $(".music-ul li").eq(pos + 1));
    } else {
        play(0, $(".music-ul li").eq(0));
    }
}

/**
 * 播放错误
 */
function audioErr() {
    playErrorCount ++;
    var errorTip = ['这首播不了', '这首也播不了', '这首还是播不了', '怎么回事', '难道都不行'];
    if (playErrorCount >= 10) {
        snackbar('似乎播不了了');
        audio.pause();
        return;
    } else if (playErrorCount < errorTip.length) {
        snackbar(errorTip[(playErrorCount - 1)]);
    }
    playNext(); // 切换下一首歌
}

/**
 * 定时检查播放
 */
function timer () {
    console.log(timeSecond);
    if (timeSecond === 5) {
        checkLoading = window.clearInterval(checkLoading);
        try {
            audio.buffered.end(0);
            if (playErrorCount !== 0) {
                snackbar('终于正常了');
            }
            playErrorCount = 0;
            console.log('load normal');
            return;
        } catch (e) {
            audioErr();
            console.error('load error');
        }
    }
    timeSecond ++;
}

/**
 * 开始计时
 */
function timerStart () {
    checkLoading = self.setInterval("timer()",1000);
}

/**
 * 停止计时
 */
function timerStop () {
    timeSecond = 1;
    checkLoading = window.clearInterval(checkLoading);
}

audio.ontimeupdate = function() { // audio时间改变事件
    var currentTime = audio.currentTime;
    //console.log(currentTime);
    refreshLyric(currentTime);
};

/*
var audio = new Audio('');
audio.play();
audio.ontimeupdate = () => {
    audio.readyState == 4 && console.warn('正在缓冲：' + Math.round(audio.buffered.end(0) / audio.duration * 100) + '%');
}
 */