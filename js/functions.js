/*
 * Author : Peter1303
 * Date: 2020/8/8
 * Time: 8:2
 */

var version = 'v1.1 Beta 200822';

//判断访问终端
var browser = {
    versions: function () {
        var u = navigator.userAgent, app = navigator.appVersion;
        return {
            trident: u.indexOf('Trident') > -1, // IE内核
            presto: u.indexOf('Presto') > -1, // opera内核
            webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, // 火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, // 是否iPad
            webApp: u.indexOf('Safari') == -1, // 是否web应该程序，没有头部与底部
            weixin: u.indexOf('MicroMessenger') > -1, // 是否微信 （2015-01-22新增）
            qq: u.match(/\sQQ/i) == " qq" // 是否QQ
        };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
};

function isMobile() {
    // 判断是否为移动端
    return browser.versions.mobile || browser.versions.android || browser.versions.ios;
}

function isIOS() {
    return browser.versions.ios;
}

function getSongUrl(url, id, type) {
    var newUrl = '';
    newUrl = url;
    /*
    if (type === "netease") {
        if (url === "") {
            newUrl = "https://music.163.com/song/media/outer/url?id=" + music.id + ".mp3";
        } else {
            newUrl = url.replace(/m7c.music./g, "m7.music.");
            newUrl = url.replace(/m8c.music./g, "m8.music.");
        }
    } else if (type === "baidu") { // 解决百度音乐防盗链
        newUrl = url.replace(/http:\/\/zhangmenshiting.qianqian.com/g, "https://gss0.bdstatic.com/y0s1hSulBw92lNKgpU_Z2jR7b2w6buu");
    } else {
        newUrl = url;
    }
     */
    return newUrl;
}

function trigger(e) {
    var element = $(e);
    var status = element.val();
    if (status === 'on') {
        element.val('off');
        element.prop('checked', false);
    } else {
        element.val('on');
        element.prop('checked', true);
    }
    console.log($(e).val());
    return $(e).val() === 'on';
}

/**
 * 设置开关状态
 * @param {*} e
 * @param {string|any} value
 */
function setChecked(e, value) {
    var element = $(e);
    if (value === false) {
        element.val('off');
        element.prop('checked', false);
    } else {
        element.val('on');
        element.prop('checked', true);
    }
}

/**
 * 设置 cookie
 * @param {string} key
 * @param {boolean|string} value
 */
function setCookie(key, value) {
    $.cookie(key, value);
}

/**
 * 获取 cookie
 * @param {string} key
 */
function getCookie(key) {
    $.cookie(key);
}

/**
 * 获取默认 cookie
 * @param {string} key 键
 * @param {boolean|string} d_val 默认返回值
 */
function getCookie(key, d_val) {
    var val = $.cookie(key);
    if (val === undefined || val === null) {
        return d_val;
    } else {
        return val === 'true';
    }
}

/**
 * 本地存储信息
 * @param {string} key 键值、数据
 * @param {*} data
 */
function save (key, data) {
    key = 'xMDPlayer_' + key; // 添加前缀，防止串用
    data = JSON.stringify(data);
    // 存储，IE6~7 不支持HTML5本地存储
    if (window.localStorage) {
        localStorage.setItem(key, data);
    }
}

/**
 * 读取本地存储信息
 * @param {string} key 键值
 */
function getData (key) {
    if (!window.localStorage) {
        return '';
    }
    key = 'xMDPlayer_' + key;
    return JSON.parse(localStorage.getItem(key));
}
