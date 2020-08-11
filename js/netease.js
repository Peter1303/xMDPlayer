/*
 * Author : Peter1303
 * Date: 2020/8/8
 * Time: 13:8
 */

var logging = false;
var uid;
var userName;
var musicList = [];

/**
 * 初始化网易云歌单
 * @param {boolean} val 是否切换到网易云歌单状态
 */
function neteaseInit(val) {
   if (val) {
       //console.log('un: ' + getData('userName'));
       initUser();
       showed = true;
       neteaseList = false;
       canLoad = false;
       show(false);
       var loc = window.location.href;
       window.location.href = loc.substring(0, loc.indexOf('#')) + '#' + tabs[neteaseTabIndex];
       $('#music_list').empty();
       $('#music_input').val('');
       $('#music-input').hide();
       $('#netease-list').show();
       if (!isPlaying) {
           $('#music_download-pic').attr('href', '');
           $('#music_download').attr('href', '');
       }
       $('#menu-netease').show();
       $('#settings').hide();
   } else {
       $('#netease-list').hide();
       $('#music-input').show();
       $('#menu-netease').hide();
       if (!isPlaying) {
           $('#menu').hide();
       } else {
           $('#menu').show();
       }
   }
}

/**
 * 初始化网易云歌单用户
 */
function initUser() {
    if (getData('userName') === '' || getData('userName') === null) {
        $('#netease-logout').hide();
        $('#netease-login').text('登录网易云');
        $('#netease-loginTip').show();
        snackbar('请登录');
    } else {
        $('#netease-logout').show();
        $('#netease-login').text('刷新歌单');
        $('#netease-loginTip').hide();
        var list = getData('userList');
        if (list) {
            $('#netease-list').empty();
            musicList = [];
            musicList.push.apply(musicList, list);
            //console.log(musicList);
            for (var i = 0; i < musicList.length; i ++) {
                addSheet(i, musicList[i].name, musicList[i].cover);
            }
        }
    }
}

/**
 * 登录
 */
function neteaseLogin() {
    if ($('#netease-login').text() === '登录网易云') {
        mdui.prompt('您的网易云 UID',
            function (value) {
                if (isNaN(value)) {
                    snackbar('不是这个');
                    return false;
                } else if (value.trim() === '') {
                    snackbar('UID 呢');
                    return false;
                }
                ajaxUserList(value);
            },
            function (value) {
            }
        );
    } else {
        ajaxUserList(getData('uid'));
    }
}

/**
 * 退出
 */
function neteaseLogout() {
    if (logging) {
        snackbar('正在登陆中');
        return;
    }
    save('userName', '');
    save('uid', '');
    initUser();
}

/**
 * 提示如何获取
 */
function neteaseUID() {
    mdui.dialog({
        title: '',
        content: '首先电脑打开网易云音乐官网 <a href="http://music.163.com/" target="_blank">http://music.163.com</a><br>' +
            '然后点击页面右上角的“登录”，登录您的账号<br>' +
            '点击您的头像，再点击“我的主页”<br>' +
            '此时<span style="color:red">浏览器地址栏 </span> <span style="color: green">home?id=</span> 后面的<span style="color:red">数字</span>就是您的网易云 UID' +
            '若为手机可用 App 打开个人主页，点击“分享”<br>' +
            '分享的链接里含有 UID 与上同理',
        buttons: [
            {
                text: '取消'
            },
            {
                text: '确认',
                onClick: function(inst){
                }
            }
        ]
    });
}

/**
 * 获取网易云用户的歌单
 * @param {string|any} value UID
 */
function ajaxUserList(value) {
    logging = true;
    progressing(true);
    $.ajax({
        type: 'POST',
        url: 'music.php',
        timeout: 20000,
        data: {
            types: 'userlist',
            uid: value
        },
        dataType: 'jsonp',
        beforeSend: function beforeSend() {
        },
        success: function success(result) {
            logging = false;
            console.log(result)
            if (result.code === "-1" || result.code === 400) {
                snackbar('也许是 UID 输入有误');
                progressing(false);
                return false;
            }
            if (result.playlist.length === 0 || typeof(result.playlist.length) === "undefined") {
                snackbar('没找到歌单');
                progressing(false);
                return false;
            }
            var tempList, userList = [];
            uid = value; // 记录已同步用户 uid
            userName = result.playlist[0].creator.nickname; // 第一个列表(喜欢列表)的创建者即用户昵称
            // 记录登录用户
            save('uid', uid);
            save('userName', userName);
            initUser();
            progressing(false);
            musicList = [];
            $('#netease-list').empty();
            for (var i = 0; i < result.playlist.length; i++) {
                // 获取歌单信息
                var isAuthor = result.playlist[i].creator.userId === value;
                tempList = {
                    id: result.playlist[i].id, // 列表的网易云 id
                    name: result.playlist[i].name, // 列表名字
                    cover: result.playlist[i].coverImgUrl + "?param=200y200", // 列表封面
                    creatorID: uid, // 列表创建者id
                    creatorName: result.playlist[i].creator.nickname, // 列表创建者名字
                    creatorAvatar: result.playlist[i].creator.avatarUrl, // 列表创建者头像
                    isAuthor: isAuthor,
                    item: []
                };
                // 存储并显示播放列表
                addSheet(musicList.push(tempList) - 1, tempList.name, tempList.cover);
                userList.push(tempList);
                //console.log(tempList);
            }
            save('userList', userList);
        },
        error: function error(e, t) {
        },
        complete: function complete() {
        }
    });
}

/**
 * 添加一个歌单
 * @param {number|string} num 编号、歌单名字、歌单封面
 * @param {*} name
 * @param {string} cover
 */
function addSheet(num, name, cover) {
    var netease_list = $('#netease-list');
    if (cover === '') {
        cover = emptyPic;
    }
    netease_list.append('<a href="javascript:void(0)" onclick="getNeteaseList(' + num + ')"><div class="mdui-col"><div class="mdui-grid-tile"><img src="' + cover + '"/><div class="mdui-grid-tile-actions"><div class="mdui-grid-tile-text"><div class="mdui-grid-tile-title">' + name + '</div></div></div></div></div></a>');
}

/**
 * 播放网易云歌单
 * @param {number} num 第几个
 */
function getNeteaseList(num) {
    neteaseList = true;
    var data = musicList[num];
    //console.log(data);
    var listId = data.id;
    progressing(true);
    $.ajax({
        type: 'POST',
        url: 'music.php',
        timeout: 20000,
        data: {
            types: 'playlist',
            source: typeList[selectedType],
            id: listId
        },
        dataType: 'json',
        beforeSend: function beforeSend() {
        },
        success: function success(result) {
            //console.log(result)
            var playlist = result.playlist;
            var tracks = playlist.tracks;
            var temp = [];
            for (var i = 0; i < tracks.length; i ++) {
                var name = tracks[i].name;
                var id = tracks[i].id;
                var artist = tracks[i].ar[0].name;
                var picUrl = tracks[i].al.picUrl;
                var newData = [];
                newData['name'] = name;
                newData['artist'] = [artist];
                newData['picUrl'] = picUrl;
                newData['url_id'] = id;
                newData['lyric_id'] = id;
                temp.push(newData);
            }
            playerList = temp;
            $('#music_list').empty();
            addToList(playerList, false);
            $('#music_list').show();
            $('#netease-list').hide();
            progressing(false);
            canLoad = false;
            changeType = true;
            playingNeteaseList = true;
        },
        error: function error(e, t) {
        },
        complete: function complete() {
        }
    });
}