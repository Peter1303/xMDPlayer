/*
 * Author : Peter1303
 * Date: 2020/8/8
 * Time: 11:54
 */

setTab();
initClipboard();

$('#menu-show').hide();
$('#menu-download').hide();
$('#menu-netease-divider').hide();

if (isMobile()) {
    $('#musicPlayer-name').addClass("music-title");
    //$('#playBtn').css('padding-right', '10px');
}

/**
 * 设置 Tab
 * @param {number} type 类型
 */
function setType(type) {
    neteaseInit(false);
    selectedType = type;
    //console.log('type: ' + typeList[type])
    changeType = true;
    get();
    var loc = window.location.href;
    window.location.href = loc.substring(0, loc.indexOf('#')) + '#' + tabs[type];
    showed = true;
    neteaseList = false;
    show(false);
    $('#music_list').empty();
    $('#netease-list').hide();
    $('#settings').hide();
}

//搜索被提交
$("#search").submit(function(e){
    if ($("#music_input").val() != '') {
        get();
    }
    return false;
});

/**
 * 获取数据
 */
function get() {
    if (loading) {
        return;
    }
    var input = $.trim($('#music_input').val());
    if (input === '') {
        return;
    }
    var isload = false;
    progressing(true);
    var ajax = function ajax(input, type, page) {
        $.ajax({
            type: 'POST',
            url: 'music.php',
            timeout: 20000,
            data: {
                types: 'search',
                count: 20,
                name: input,
                source: type,
                pages: page
            },
            dataType: 'json',
            beforeSend: function beforeSend() {
                isload = true;
                canLoad = false;
                if (page !== 1) {
                    progressing(true);
                }
            },
            success: function success(result) {
                canLoad = true;
                isload = false;
                progressing(false);
                //$('#music_input').attr('disabled', false);
                $('#music_list').empty();
                //console.log(result);
                if (result.length === 0) {
                    var err = '';
                    if (page === 1) {
                        err = '似乎搜不到';
                    } else {
                        err = '没有了';
                    }
                    snackbar(err);
                    return;
                }
                // 结果：数组
                //<li class="mdui-list-item mdui-ripple"><div class="mdui-list-item-content"><div class="mdui-list-item-title mdui-list-item-one-line">Multiline</div><div class="mdui-list-item-bk mdui-list-item-one-line">You</div></div></li>
                addToList(result, true);
                if (page === 1) {
                    playerList = result;
                    setValue(playerList[0]);
                    playingNeteaseList = false;
                } else {
                    playerList = playerList.concat(result);
                    $('#music_list').empty();
                    for(var i = 0; i < playerList.length; i ++){
                        var obj = playerList[i];
                        var n = obj.name;
                        var a = getArtist(obj.artist);
                        $('#music_list').append(
                            ('<li class="mdui-list-item mdui-ripple' + ((i === pos) ? ' playList-active' : '') + '" onclick="play(' + i + ', this)"><div class="mdui-list-item-content"><div class="mdui-list-item-title mdui-list-item-one-line">' + n + '</div><div class="mdui-list-item-test mdui-list-item-two-line">' + a + '</div></div></li>')
                        );
                    }
                }
                /*
                if (result.code === 200 && result.data) {
                    result.data.map(function(v) {
                        if (!v.title) v.title = '暂无';
                        if (!v.author) v.author = '暂无';
                        //if (!v.pic) v.pic = nopic;
                        if (!v.lrc) v.lrc = '[00:00.00] 暂无歌词';
                        if (!/\[00:(\d{2})\./.test(v.lrc)) {
                            v.lrc = '[00:00.00] 无效歌词';
                        }
                    });
                }
                */
            },
            error: function error(e, t) {
                if (page === 1) {
                    var err = '出了点小问题';
                    if (t === 'timeout') {
                        err = ' 请求超时了';
                    }
                    mdui.snackbar({
                        message:err
                    });
                } else {
                    mdui.snackbar({
                        message:'加载失败了'
                    });
                }
            },
            complete: function complete() {
                isload = false;
            }
        });
    };
    ajax(input, typeList[selectedType], page);
    $(window).scroll(function() {
        if (canLoad === false || showed) {
            return true; // 还没搜索过，不允许加载 || 正在显示歌词
        }
        // 当内容滚动到底部时加载新的内容
        if ($(this).scrollTop() + $(window).height() + 20 >= $(document).height() && $(this).scrollTop() > 20) {
            if (!canLoad) {
                return;
            }
            page ++;
            progressing(true);
            ajax(input, typeList[selectedType], page);
        }
    });
}

/**
 * 显示 歌词 | 列表
 * @param {boolean} from 直接点击 MENU
 */
function show(from) {
    if (!hasLyric && from) {
        snackbar('真的没有啊');
        return;
    }
    if (showed) { // 隐藏歌词
        $('#music-content-lyric').hide();
        $('#music-lyric-mobile').hide();
        console.log('neteaseList: ' + neteaseList);
        if (neteaseList) {
            $('#netease-list').show();
            $('#music-content').show();
        } else {
            console.log('tabID: ' + getID());
            if (getID() === tabs[neteaseTabIndex]) {
                console.log('tabID = neteaseTabIndex');
                $('#netease-list').show();
            } else {
                $('#netease-list').hide();
            }
            $('#music-content').show();
        }
        $('#music-lyric').text('显示歌词');
        $('#musicPlayer-lyric').show();
        showed = false;
        //console.log('neteaseList: ' + neteaseList);
    } else {
        $('#music-content-lyric').show();
        $('#music-lyric-mobile').hide();
        $('#netease-list').hide();
        $('#music-content').hide();
        $('#musicPlayer-lyric').hide();
        $('#music-lyric').text('显示列表');
        showed = true;
    }
}

/**
 * 处理菜单
 */
function setMenu () {
    if (isPlaying) {
        $('#menu-empty').hide();
    }
}

/**
 * 显示进度条
 * @param {boolean} value 设置后的状态
 */
function progressing(value) {
    loading = value;
    if (value) {
        $('#progressbar').show();
    } else {
        $('#progressbar').hide();
    }
}

/**
 * 显示 Snackbar
 * @param {string} msg 需要提示的信息
 */
function snackbar (msg) {
    mdui.snackbar({
        message: msg
    });
}

/**
 * 设置  Tab
 */
function setTab () {
    var loc = window.location.href;
    var vars = loc.split("#");
    if (vars.length !== 0) {
        var id = vars[1];
        console.log(id);
        for (var i = 0; i < tabs.length; i ++) {
            if (i === neteaseTabIndex) {
                neteaseInit(true);
            } else if (tabs[i] === id) {
                selectedType = i;
                setType(i);
                break;
            }
        }
    }
}

/**
 * 获取网站的主域名
 */
function getDomain() {
    var loc = window.location.href;
    var vars = loc.split("#");
    if (vars.length !== 0) {
        return vars[0];
    }
    return loc;
}

/**
 * 获取 Tab 的 id
 */
function getID() {
    var loc = window.location.href;
    var vars = loc.split("#");
    if (vars.length !== 0) {
        return vars[1];
    }
}

/**
 * 回到主页
 */
function toHome() {
    var home = getDomain() + '#' + getID();
    window.location.href = home;
    setTab();
}

/**
 * 显示设置
 */
function showSettings() {
    $('#settings').show();
    $('#music-content-lyric').hide();
    $('#music-lyric-mobile').hide();
    $('#netease-list').hide();
    $('#music-content').hide();
    $('#musicPlayer-lyric').hide();
    initCheckBox();
}

/**
 * 关于信息
 */
function showAbout() {
    mdui.dialog({
        title: '',
        content: ('版本：' + version + '<br>开源：<a href="https://github.com/Peter1303/xMDPlayer" target="_blank"> xMDPlayer</a><br>Optimized by Peter1303.<br>Copyright© 2020.'),
        buttons: [
            {
                text: '确认',
                onClick: function(inst){
                }
            }
        ]
    });
}

/**
 * 初始化 CheckBox
 */
function initCheckBox() {
    var e1 = $('#settings-list').find('input').eq(0);
    var b_e1 = getCookie('copy', true);
    setChecked(e1, b_e1);
}

/**
 * 设置 CheckBox 的状态
 * @param {number} index 第几个
 */
function onChecked(index) {
    var e = $('#settings-list').find('input').eq(index);
    var checked = trigger(e);
    if (index === 0) {
        setCookie('copy', checked);
    }
}

/**
 * 添加数据到列表里
 * @param {*} result 数据
 * @param {boolean} activated 是否处于播放状态
 */
function addToList (result, activated) {
    for (var i = 0; i < result.length; i ++){
        var obj = result[i];
        var n = obj.name;
        var a = getArtist(obj.artist);
        var ac = false;
        if (playingNeteaseList) {
            if (pos === i && n === $('#musicPlayer-name').text()) {
                ac = true;
            }
        } else {
            if (activated) {
                if (i === 0) {
                    ac = true;
                }
            }
        }
        $('#music_list').append(
            ('<li class="mdui-list-item mdui-ripple' + (ac ? ' playList-active' : '') +'" onclick="play(' + i + ', this)"><div class="mdui-list-item-content"><div class="mdui-list-item-title mdui-list-item-one-line">' + n + '</div><div class="mdui-list-item-test mdui-list-item-two-line">' + a + '</div></div></li>')
        );
    }
}

/**
 * 初始化复制
 */
function initClipboard () {
    var copy = getCookie('copy', true)
    console.log('copy: ' + copy)
    var text = copy ? (artist + ' - ' + song_name) : ''
    console.log(text)
    var clipboard = new ClipboardJS('#music_download', {
        text: function() {
            return text;
        }
    });
    clipboard.on('success', function(e) {
        snackbar('已复制歌曲命名');
    });
}
