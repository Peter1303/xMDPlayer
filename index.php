<?php
/**
 * Author : Peter1303
 * Date: 2020/8/7
 * Time: 2:30
 */

?>
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width,height=device-height,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="referrer" content="no-referrer" />

    <title>音乐神器</title>

    <meta name="description" content="Peter1303">

    <link crossorigin="anonymous" href="https://lib.baomitu.com/mdui/0.4.3/css/mdui.css" rel="stylesheet">
    <link crossorigin="anonymous" href="https://lib.baomitu.com/mdui/0.4.3/css/mdui.min.css" rel="stylesheet">
    <link href="css/css.css" rel="stylesheet">

    <script crossorigin="anonymous" src="https://lib.baomitu.com/mdui/0.4.3/js/mdui.min.js"></script>
    <script crossorigin="anonymous" src="https://lib.baomitu.com/jquery/3.4.1/jquery.min.js"></script>
    <script src="//cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.min.js"></script>
    <script crossorigin="anonymous" integrity="sha384-8CYhPwYlLELodlcQV713V9ZikA3DlCVaXFDpjHfP8Z36gpddf/Vrt47XmKDsCttu" src="https://lib.baomitu.com/clipboard.js/2.0.4/clipboard.min.js"></script>

</head>
<body class="mdui-appbar-with-toolbar mdui-appbar-with-tab mdui-theme-layout-auto">
<div class="mdui-appbar mdui-appbar-fixed mdui-color-theme">
    <div class="mdui-toolbar mdui-color-theme">
        <span class="mdui-btn mdui-btn-icon mdui-ripple mdui-ripple-white" mdui-drawer="{target: '#main-drawer', swipe: true ,overlay:true}"><i class="mdui-icon material-icons">menu</i></span>
        <span class="mdui-typo-headline app-title">音乐神器</span>
        <div class="mdui-toolbar-spacer"></div>
        <button mdui-menu="{target: '#menu'}" class="mdui-btn mdui-btn-icon"><i class="mdui-icon material-icons">more_vert</i></button>
        <ul class="mdui-menu" id="menu">
            <div id="menu-show">
                <li class="mdui-menu-item">
                    <a class="mdui-ripple" onclick="show(true)" id="music-lyric">显示歌词</a>
                </li>
            </div>
            <div id="menu-netease" style="display: none">
                <li class="mdui-divider" id="menu-netease-divider"></li>
                <li class="mdui-menu-item">
                    <a class="mdui-ripple" id="netease-login" onclick="neteaseLogin()">登录网易云</a>
                    <a class="mdui-ripple" id="netease-logout" onclick="neteaseLogout()">退出登录</a>
                    <a class="mdui-ripple" id="netease-loginTip" onclick="neteaseUID()">获取网易云 UID</a>
                </li>
            </div>
            <div id="menu-download">
                <li class="mdui-divider"></li>
                <li class="mdui-menu-item">
                    <a class="mdui-ripple" id="music_download" target="_blank">下载歌曲</a>
                    <a class="mdui-ripple" id="music_download-pic" target="_blank">下载封面</a>
                </li>
            </div>
        </ul>
    </div>
    <div class="mdui-tab mdui-color-theme" mdui-tab>
        <a href="#netease" class="mdui-ripple mdui-ripple-white" onclick="setType(0)">网易</a>
        <a href="#tencent" class="mdui-ripple mdui-ripple-white" onclick="setType(1)">腾讯</a>
        <a href="#kugou" class="mdui-ripple mdui-ripple-white" onclick="setType(2)">酷狗</a>
        <a href="#neteaseList" class="mdui-ripple mdui-ripple-white" onclick="neteaseInit(true)">网易歌单</a>
    </div>
</div>
<!-- 内容 -->
<div class="mdui-progress" id="progressbar" style="position: fixed; z-index:0;">
    <div class="mdui-progress-indeterminate mdui-color-theme-accent" id="progress-indeterminate"></div>
</div>
<div class="mdui-container-fluid" style="padding-bottom: 50px">
    <div id="netease"></div>
    <div id="tencent"></div>
    <div id="kugou"></div>
    <div id="neteaseList"></div>
    <div id="settings" style="display: none">
        <ul class="mdui-list" id="settings-list">
            <li class="mdui-list-item mdui-ripple" onclick="onChecked(0)">
                <i class="mdui-list-item-icon mdui-icon material-icons">content_copy</i>
                <div class="mdui-list-item-content">下载时复制歌曲命名</div>
                <label class="mdui-switch">
                    <input type="checkbox" checked id="settings-copy" onclick="onChecked(0)"/>
                    <i class="mdui-switch-icon"></i>
                </label>
            </li>
        </ul>
    </div>
    <div id="music-content">
        <form id="search">
            <div class="mdui-textfield mdui-textfield-floating-label" id="music-input">
                <label class="mdui-textfield-label">请输入</label>
                <input class="mdui-textfield-input" type="text" id="music_input"/>
            </div>
        </form>
        <ul class="mdui-list music-ul" id="music_list" style="padding-top: 4%">
        </ul>
    </div>
    <div class="lyric" id="music-content-lyric" style="display: none">
        <ul id="lyric"></ul>
        <!--<p class="no-lyric" id="no-lyric" style="display: none">没有歌词哦</p>-->
    </div>
    <div class="mdui-row-xs-3 mdui-row-sm-5 mdui-row-md-5 mdui-row-lg-6 mdui-row-xl-7 mdui-grid-list" id="netease-list">
    </div>
    <div id="player-wrapper" class="mdui-list" style="position:fixed;bottom:0;left:0;right:0;padding:0;background-color:white;z-index:5000;display: none">
        <div id="wrapper-main" class="mdui-list-item" style="padding:0 10px;">
            <label id="changeProgress" class="mdui-slider" style="position:absolute;top:0;left:0;right:0;height:3px;">
                <input onchange="changeProgress()" class="mini-progress" type="range" value="0" step="1" min="0" max="100" />
            </label>
            <div class="mdui-list-item-avatar">
                <img id="musicPlayer-icon"/>
            </div>
            <div style="margin-left: 8px;" class="mdui-list-item-content music-list-item">
                <p id="musicPlayer-name" class="mdui-text-color-theme-text"></p>
                <p style="width:250px" class="mdui-text-truncate mdui-text-color-theme-secondary" id="musicPlayer-detail"></p>
            </div>
            <p id="musicPlayer-lyric" style="padding-right: 15px" class="mdui-text-color-theme-text"></p>
            <i onclick="playBtn()" id="playBtn" class="mdui-ripple mdui-icon material-icons playBtn">&#xe039;</i>
            <div id="play-spinner" style="display:none;margin:5px;" class="mdui-spinner mdui-spinner-colorful"></div>
        </div>
    </div>
    <audio autoplay="autoplay" controls="controls" style='display:none;'></audio>
    <div class="mdui-dialog" id="dialog-theme">
        <div class="mdui-dialog-title">设置主题</div>
        <div class="mdui-dialog-content">

            <p class="mdui-typo-title">主题色</p>
            <div class="mdui-row-xs-1 mdui-row-sm-2 mdui-row-md-3">
                <div class="mdui-col">
                    <label class="mdui-radio mdui-m-b-1">
                        <input type="radio" name="theme-layout" value="auto" checked="">
                        <i class="mdui-radio-icon"></i>
                        Auto
                    </label>
                </div>
                <div class="mdui-col">
                    <label class="mdui-radio mdui-m-b-1">
                        <input type="radio" name="theme-layout" value="light">
                        <i class="mdui-radio-icon"></i>
                        Light
                    </label>
                </div>
                <div class="mdui-col">
                    <label class="mdui-radio mdui-m-b-1">
                        <input type="radio" name="theme-layout" value="dark">
                        <i class="mdui-radio-icon"></i>
                        Dark
                    </label>
                </div>
            </div>

            <p class="mdui-typo-title mdui-text-color-theme">主色</p>
            <form class="mdui-row-xs-1 mdui-row-sm-2 mdui-row-md-3">
                <div class="mdui-col mdui-text-color-amber">
                    <label class="mdui-radio mdui-m-b-1">
                        <input type="radio" name="theme-primary" value="amber">
                        <i class="mdui-radio-icon"></i>
                        Amber
                    </label>
                </div>
                <div class="mdui-col mdui-text-color-blue">
                    <label class="mdui-radio mdui-m-b-1">
                        <input type="radio" name="theme-primary" value="blue">
                        <i class="mdui-radio-icon"></i>
                        Blue
                    </label>
                </div>
                <div class="mdui-col mdui-text-color-blue-grey">
                    <label class="mdui-radio mdui-m-b-1">
                        <input type="radio" name="theme-primary" value="blue-grey">
                        <i class="mdui-radio-icon"></i>
                        Blue Grey
                    </label>
                </div>
                <div class="mdui-col mdui-text-color-brown">
                    <label class="mdui-radio mdui-m-b-1">
                        <input type="radio" name="theme-primary" value="brown">
                        <i class="mdui-radio-icon"></i>
                        Brown
                    </label>
                </div>
                <div class="mdui-col mdui-text-color-cyan">
                    <label class="mdui-radio mdui-m-b-1">
                        <input type="radio" name="theme-primary" value="cyan">
                        <i class="mdui-radio-icon"></i>
                        Cyan
                    </label>
                </div>
                <div class="mdui-col mdui-text-color-deep-orange">
                    <label class="mdui-radio mdui-m-b-1">
                        <input type="radio" name="theme-primary" value="deep-orange">
                        <i class="mdui-radio-icon"></i>
                        Deep Orange
                    </label>
                </div>
                <div class="mdui-col mdui-text-color-deep-purple">
                    <label class="mdui-radio mdui-m-b-1">
                        <input type="radio" name="theme-primary" value="deep-purple">
                        <i class="mdui-radio-icon"></i>
                        Deep Purple
                    </label>
                </div>
                <div class="mdui-col mdui-text-color-green">
                    <label class="mdui-radio mdui-m-b-1">
                        <input type="radio" name="theme-primary" value="green">
                        <i class="mdui-radio-icon"></i>
                        Green
                    </label>
                </div>
                <div class="mdui-col mdui-text-color-grey">
                    <label class="mdui-radio mdui-m-b-1">
                        <input type="radio" name="theme-primary" value="grey">
                        <i class="mdui-radio-icon"></i>
                        Grey
                    </label>
                </div>
                <div class="mdui-col mdui-text-color-indigo">
                    <label class="mdui-radio mdui-m-b-1">
                        <input type="radio" name="theme-primary" value="indigo" checked="">
                        <i class="mdui-radio-icon"></i>
                        Indigo
                    </label>
                </div>
                <div class="mdui-col mdui-text-color-light-blue">
                    <label class="mdui-radio mdui-m-b-1">
                        <input type="radio" name="theme-primary" value="light-blue">
                        <i class="mdui-radio-icon"></i>
                        Light Blue
                    </label>
                </div>
                <div class="mdui-col mdui-text-color-light-green">
                    <label class="mdui-radio mdui-m-b-1">
                        <input type="radio" name="theme-primary" value="light-green">
                        <i class="mdui-radio-icon"></i>
                        Light Green
                    </label>
                </div>
                <div class="mdui-col mdui-text-color-lime">
                    <label class="mdui-radio mdui-m-b-1">
                        <input type="radio" name="theme-primary" value="lime">
                        <i class="mdui-radio-icon"></i>
                        Lime
                    </label>
                </div>
                <div class="mdui-col mdui-text-color-orange">
                    <label class="mdui-radio mdui-m-b-1">
                        <input type="radio" name="theme-primary" value="orange">
                        <i class="mdui-radio-icon"></i>
                        Orange
                    </label>
                </div>
                <div class="mdui-col mdui-text-color-pink">
                    <label class="mdui-radio mdui-m-b-1">
                        <input type="radio" name="theme-primary" value="pink">
                        <i class="mdui-radio-icon"></i>
                        Pink
                    </label>
                </div>
                <div class="mdui-col mdui-text-color-purple">
                    <label class="mdui-radio mdui-m-b-1">
                        <input type="radio" name="theme-primary" value="purple">
                        <i class="mdui-radio-icon"></i>
                        Purple
                    </label>
                </div>
                <div class="mdui-col mdui-text-color-red">
                    <label class="mdui-radio mdui-m-b-1">
                        <input type="radio" name="theme-primary" value="red">
                        <i class="mdui-radio-icon"></i>
                        Red
                    </label>
                </div>
                <div class="mdui-col mdui-text-color-teal">
                    <label class="mdui-radio mdui-m-b-1">
                        <input type="radio" name="theme-primary" value="teal">
                        <i class="mdui-radio-icon"></i>
                        Teal
                    </label>
                </div>
                <div class="mdui-col mdui-text-color-yellow">
                    <label class="mdui-radio mdui-m-b-1">
                        <input type="radio" name="theme-primary" value="yellow">
                        <i class="mdui-radio-icon"></i>
                        Yellow
                    </label>
                </div>
            </form>

            <p class="mdui-typo-title mdui-text-color-theme-accent">强调色</p>
            <form class="mdui-row-xs-1 mdui-row-sm-2 mdui-row-md-3">
                <div class="mdui-col mdui-text-color-amber">
                    <label class="mdui-radio mdui-m-b-1">
                        <input type="radio" name="theme-accent" value="amber">
                        <i class="mdui-radio-icon"></i>
                        Amber
                    </label>
                </div>
                <div class="mdui-col mdui-text-color-blue">
                    <label class="mdui-radio mdui-m-b-1">
                        <input type="radio" name="theme-accent" value="blue">
                        <i class="mdui-radio-icon"></i>
                        Blue
                    </label>
                </div>
                <div class="mdui-col mdui-text-color-cyan">
                    <label class="mdui-radio mdui-m-b-1">
                        <input type="radio" name="theme-accent" value="cyan">
                        <i class="mdui-radio-icon"></i>
                        Cyan
                    </label>
                </div>
                <div class="mdui-col mdui-text-color-deep-orange">
                    <label class="mdui-radio mdui-m-b-1">
                        <input type="radio" name="theme-accent" value="deep-orange">
                        <i class="mdui-radio-icon"></i>
                        Deep Orange
                    </label>
                </div>
                <div class="mdui-col mdui-text-color-deep-purple">
                    <label class="mdui-radio mdui-m-b-1">
                        <input type="radio" name="theme-accent" value="deep-purple">
                        <i class="mdui-radio-icon"></i>
                        Deep Purple
                    </label>
                </div>
                <div class="mdui-col mdui-text-color-green">
                    <label class="mdui-radio mdui-m-b-1">
                        <input type="radio" name="theme-accent" value="green">
                        <i class="mdui-radio-icon"></i>
                        Green
                    </label>
                </div>
                <div class="mdui-col mdui-text-color-indigo">
                    <label class="mdui-radio mdui-m-b-1">
                        <input type="radio" name="theme-accent" value="indigo">
                        <i class="mdui-radio-icon"></i>
                        Indigo
                    </label>
                </div>
                <div class="mdui-col mdui-text-color-light-blue">
                    <label class="mdui-radio mdui-m-b-1">
                        <input type="radio" name="theme-accent" value="light-blue">
                        <i class="mdui-radio-icon"></i>
                        Light Blue
                    </label>
                </div>
                <div class="mdui-col mdui-text-color-light-green">
                    <label class="mdui-radio mdui-m-b-1">
                        <input type="radio" name="theme-accent" value="light-green">
                        <i class="mdui-radio-icon"></i>
                        Light Green
                    </label>
                </div>
                <div class="mdui-col mdui-text-color-lime">
                    <label class="mdui-radio mdui-m-b-1">
                        <input type="radio" name="theme-accent" value="lime">
                        <i class="mdui-radio-icon"></i>
                        Lime
                    </label>
                </div>
                <div class="mdui-col mdui-text-color-orange">
                    <label class="mdui-radio mdui-m-b-1">
                        <input type="radio" name="theme-accent" value="orange">
                        <i class="mdui-radio-icon"></i>
                        Orange
                    </label>
                </div>
                <div class="mdui-col mdui-text-color-pink">
                    <label class="mdui-radio mdui-m-b-1">
                        <input type="radio" name="theme-accent" value="pink" checked="">
                        <i class="mdui-radio-icon"></i>
                        Pink
                    </label>
                </div>
                <div class="mdui-col mdui-text-color-purple">
                    <label class="mdui-radio mdui-m-b-1">
                        <input type="radio" name="theme-accent" value="purple">
                        <i class="mdui-radio-icon"></i>
                        Purple
                    </label>
                </div>
                <div class="mdui-col mdui-text-color-red">
                    <label class="mdui-radio mdui-m-b-1">
                        <input type="radio" name="theme-accent" value="red">
                        <i class="mdui-radio-icon"></i>
                        Red
                    </label>
                </div>
                <div class="mdui-col mdui-text-color-teal">
                    <label class="mdui-radio mdui-m-b-1">
                        <input type="radio" name="theme-accent" value="teal">
                        <i class="mdui-radio-icon"></i>
                        Teal
                    </label>
                </div>
                <div class="mdui-col mdui-text-color-yellow">
                    <label class="mdui-radio mdui-m-b-1">
                        <input type="radio" name="theme-accent" value="yellow">
                        <i class="mdui-radio-icon"></i>
                        Yellow
                    </label>
                </div>
            </form>

        </div>
        <div class="mdui-divider"></div>
        <div class="mdui-dialog-actions">
            <button class="mdui-btn mdui-ripple mdui-float-left" mdui-dialog-cancel="">恢复默认主题</button>
            <button class="mdui-btn mdui-ripple" mdui-dialog-confirm="">确定</button>
        </div>
    </div>
</div>
<div class="mdui-drawer mdui-drawer-full-height mdui-drawer-close" id="main-drawer">
    <div class="mdui-list" mdui-collapse="{accordion: true}" style="margin-bottom: 76px;">
        <ul class="mdui-list font" mdui-drawer-close>
            <a href="javascript:toHome()">
                <li class="mdui-list-item mdui-ripple">
                    <i class="mdui-list-item-icon mdui-icon material-icons">music_note</i>
                    <div class="mdui-list-item-content">播放</div>
                </li>
            </a>
            <li class="mdui-subheader">偏好</li>
            <a href="javascript:showSettings()">
                <li class="mdui-list-item mdui-ripple">
                    <i class="mdui-list-item-icon mdui-icon material-icons">settings</i>
                    <div class="mdui-list-item-content">设置</div>
                </li>
            </a>
            <a href="javascript:void(0)" mdui-dialog="{target: '#dialog-theme'}">
                <li class="mdui-list-item mdui-ripple">
                    <i class="mdui-list-item-icon mdui-icon material-icons">color_lens</i>
                    <div class="mdui-list-item-content">主题</div>
                </li>
            </a>
            <li class="mdui-subheader">其他</li>
            <a href="../">
                <li class="mdui-list-item mdui-ripple">
                    <i class="mdui-list-item-icon mdui-icon material-icons">home</i>
                    <div class="mdui-list-item-content">主页</div>
                </li>
            </a>
            <a onclick="showAbout()">
                <li class="mdui-list-item mdui-ripple">
                    <i class="mdui-list-item-icon mdui-icon material-icons">insert_emoticon</i>
                    <div class="mdui-list-item-content">关于</div>
                </li>
            </a>
        </ul>
    </div>
</div>

<script>
    var typeList = ['netease', 'tencent', 'kugou'];
    var tabs = ['netease', 'tencent', 'kugou', 'neteaseList'];
    var emptyPic = 'https://s1.ax1x.com/2020/08/08/aImJHS.png';
    var neteaseTabIndex = tabs.length - 1;
    var selectedType = 0;
    var song_url = '';
    var pic = '';
    var song_name = '';
    var artist = '';
    var lyric_string = '';
    var playerList = [];
    var pos = 0;
    var page = 1;
    var playErrorCount = 0;
    var loading = false;
    var canLoad = false;
    var showed = false;
    var changeType = false;
    var isPlaying = false;
    var neteaseList = false;
    var playingNeteaseList = false;
    var hasLyric = true;

    console.log(' __                                       __              \n' +
        '/  \\  _  |_ .  _  . _   _  _|   |_       |__)  _ |_  _  _ \n' +
        '\\__/ |_) |_ | ||| | /_ (- (_|   |_) \\/   |    (- |_ (- |  \n' +
        '     |                              /                     ');
    console.info('本项目基于作者 mengkun(https://mkblog.cn)二次开发\n歌曲来源于各大音乐平台\nGithub：https://github.com/mengkunsoft/MKOnlineMusicPlayer');
</script>
<script src="js/functions.js"></script>
<script src="js/netease.js"></script>
<script src="js/js.js"></script>
<script src="js/player.js"></script>
<script src="js/lyric.js"></script>
<script src="js/theme.js"></script>
<script>
    progressing(false);
</script>
</body>
</html>
