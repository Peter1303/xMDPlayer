/*
 * Author : Peter1303
 * Date: 2020/8/9
 * Time: 8:12
 */

var DEFAULT_PRIMARY = 'indigo';
var DEFAULT_ACCENT = 'pink';
var DEFAULT_LAYOUT = 'auto';

var colorName = [
    'amber',
    'blue',
    'cyan',
    'deep-orange',
    'deep-purple',
    'green',
    'indigo',
    'light-blue',
    'light-green',
    'lime',
    'orange',
    'pink',
    'purple',
    'red',
    'teal',
    'yellow'
];
var color = [
    '#FFD740',
    '#448AFF',
    '#18FFFF',
    '#FF6E40',
    '#E040FB',
    '#69F0AE',
    '#536DFE',
    '#448AFF',
    '#69F0AE',
    '#EEFF41',
    '#FFAB40',
    '#FF4081',
    '#E040FB',
    '#FF5252',
    '#64FFDA',
    '#FFFF00',
];
var accentColor;
var layoutColor;
/**
 * 设置主题
 */
var $document = $(document);
var primary;
var accent;
var layout;
//console.log('pr: ' + primary + ', ac: ' + accent + ', la: ' + layout);

/**
 * 初始化主题
 * @param {{layout: (string), accent: (string), primary: (string)}} theme
 */
function setTheme (theme) {
    if (typeof theme.primary === 'undefined') {
        theme.primary = false;
    }
    if (typeof theme.accent === 'undefined') {
        theme.accent = false;
    }
    if (typeof theme.layout === 'undefined') {
        theme.layout = false;
    }

    var i, len;
    var $body = $('body');

    var classStr = $body.attr('class');
    var classs = classStr.split(' ');

    // 设置主色
    if (theme.primary !== false) {
        for (i = 0, len = classs.length; i < len; i++) {
            if (classs[i].indexOf('mdui-theme-primary-') === 0) {
                $body.removeClass(classs[i])
            }
        }
        $body.addClass('mdui-theme-primary-' + theme.primary);
        setCookie('theme-primary', theme.primary);
        $('input[name="theme-primary"][value="' + theme.primary + '"]').prop('checked', true);
    }

    // 设置强调色
    if (theme.accent !== false) {
        for (i = 0, len = classs.length; i < len; i++) {
            if (classs[i].indexOf('mdui-theme-accent-') === 0) {
                $body.removeClass(classs[i]);
            }
        }
        $body.addClass('mdui-theme-accent-' + theme.accent);
        setCookie('theme-accent', theme.accent);
        $('input[name="theme-accent"][value="' + theme.accent + '"]').prop('checked', true);
    }

    // 设置主题色
    if (theme.layout !== false) {
        for (i = 0, len = classs.length; i < len; i++) {
            if (classs[i].indexOf('mdui-theme-layout-') === 0) {
                $body.removeClass(classs[i]);
            }
        }
        $body.addClass('mdui-theme-layout-' + theme.layout);
        setCookie('theme-layout', theme.layout);
        $('input[name="theme-layout"][value="' + theme.layout + '"]').prop('checked', true);
    }
}

function initTheme () {
    primary = $.cookie('theme-primary');
    accent = $.cookie('theme-accent');
    layout = $.cookie('theme-layout');
    for (var i = 0; i < color.length; i ++) {
        if (accent === colorName[i]) {
            accentColor = color[i];
            $(".playBtn").css('cssText', 'color:' + color[i] + '!important;');
            $('.playList-active::before').css('cssText', 'background-color: ' + color[i] + '!important;');
        }
    }
    var l;
    var lm = ['light', 'dark'];
    if (isNight()) {
        l = lm[1];
    } else {
        l = lm[0];
    }
    if (layout !== undefined) {
        if (layout === lm[0]) {
            l = lm[0];
        } else if (layout === lm[1]) {
            l = lm[1];
        }
    }
    setTheme({
        primary: (primary === undefined ? DEFAULT_PRIMARY : primary),
        accent: (accent === undefined ? DEFAULT_ACCENT : accent),
        layout: l
    });
    layoutColor = getLayoutColor();
    //$('head').append('<style>.no-lyric {color: ' + accentColor + '}</style>');
    $('head').append('<style>.playList-active::before {background-color: ' + accentColor + '!important;' + '}</style>');
    $('head').append('<style>.music-list-item {background-color: ' + layoutColor + '!important;' + '}</style>');
    $('#wrapper-main').css('background-color', layoutColor);
    if (l === lm[0]) {
        $('#main-drawer').removeClass('mdui-color-black');
        $('#main-drawer').addClass('mdui-color-white');
    } else {
        $('#main-drawer').removeClass('mdui-color-white');
        $('#main-drawer').addClass('mdui-color-black');
    }
}

/**
 * 获取主要的颜色
 */
function getLayoutColor () {
    var co = ['#FFFFFF', '#212121'];
    if (layout === 'dark') {
        return co[1];
    } else if (layout === 'light') {
        return co[0];
    } else {
        return isNight() ? co[1] : co[0]
    }
}

function isNight () {
    var now = new Date(), hour = now.getHours();
    /*
    理论上：
    <6 凌晨
    <9 早上
    <14 上午
    <12 中午
    <17 下午
    <19 傍晚
    <22 晚上
    23-5 夜里
     */
    return ((19 < hour) || (hour < 6));
}

// 切换主色
$document.on('change', 'input[name="theme-primary"]', function () {
    setTheme({
        primary: $(this).val()
    });
    initTheme();
});

// 切换强调色
$document.on('change', 'input[name="theme-accent"]', function () {
    setTheme({
        accent: $(this).val()
    });
    initTheme();
});

// 切换主题色
$document.on('change', 'input[name="theme-layout"]', function () {
    setTheme({
        layout: $(this).val()
    });
    initTheme();
});

// 恢复默认主题
$document.on('cancel.mdui.dialog', '#dialog-theme', function () {
    setTheme({
        primary: DEFAULT_PRIMARY,
        accent: DEFAULT_ACCENT,
        layout: DEFAULT_LAYOUT
    });
    initTheme();
});

initTheme();