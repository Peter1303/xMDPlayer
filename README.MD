# xMDPlayer
==================================================
一个可以在线听网易云音乐、QQ音乐、酷狗音乐的音乐播放器，还可以让你听自己的网易云歌单哦！

A player that can make you listen to music online including Netease music, QQ music, Kugou Music.What's more, you can listen to your own Netease music list!

Created by  [mengkunsoft](https://github.com/mengkunsoft/MKOnlineMusicPlayer)

Optimized by [Peter1303](https://pdev.top)

介绍(Introduction)
------------
xMDPlayer 基于 `Meting` 的在线音乐播放器，有音乐搜索、播放、下载、歌词同步显示、个人网易云音乐播放列表同步等功能。

前端界面使用 `MDUI` 来开发，`Material Design` 风格。

> 本项目仅为学习前端的练手之作，请勿用作商业用途，请勿利用本项目下载盗版歌曲资源，否则后果自负！

本程序结合(This program combines with the secondary development of) <https://github.com/mengkunsoft/MKOnlineMusicPlayer> 二次开发

演示
--------

**在线演示** [https://pdev.top/music/#neteaseList](https://pdev.top/music/#neteaseList)

![主界面](https://s1.ax1x.com/2020/08/10/aHumOs.png)
![侧滑菜单](https://s1.ax1x.com/2020/08/10/aHuumn.png)
![](https://s1.ax1x.com/2020/08/10/aHuMT0.png)
![](https://s1.ax1x.com/2020/08/10/aHuKwq.png)
![](https://s1.ax1x.com/2020/08/10/aHulkV.png)
![](https://s1.ax1x.com/2020/08/10/aHu1YT.png)
![](https://s1.ax1x.com/2020/08/10/aHua01.png)
![](https://s1.ax1x.com/2020/08/10/aHu3fU.png)
![](https://s1.ax1x.com/2020/08/10/aHuGpF.png)
![](https://s1.ax1x.com/2020/08/10/aHuY6J.png)
![](https://s1.ax1x.com/2020/08/10/aHuJl4.png)
![](https://s1.ax1x.com/2020/08/10/aHutX9.png)
![](https://s1.ax1x.com/2020/08/10/aHuUmR.png)
![](https://s1.ax1x.com/2020/08/10/aHuZlQ.png)
![](https://s1.ax1x.com/2020/08/10/aHueyj.png)
![](https://s1.ax1x.com/2020/08/10/aHuW7t.png)
![](https://s1.ax1x.com/2020/08/10/aHu4tf.png)
![](https://s1.ax1x.com/2020/08/10/aHuhAP.png)

更新(Update)
--------

  * 全面使用 Material Design
  * 可以设置主题 (Able to change the player's theme)
 
要求(Requirements)
------------

  * Directory Lister 需要 PHP 5.4+ (requires PHP 5.4+ to work properly)
  * curl_exec 搜索音乐 (Search music)
  * file_get_contents 获取音乐数据 (Get music data)
  * json_decode 解析数据 (Decode data)
  * hex2bin 解析数据 (Decode data)
  * openssl_encrypt 解析数据 (Decode data)
  
结构(Structure)
------------

``` bash
├─ js
│   ├ functions.js
│   ├ js.js
│   ├ lyric.js
│   ├ netease.js
│   ├ player.js
│   └ theme.js
├─ css
│   └ css.css
├ index.php
├ music.php
└ Meting.php
```

致谢
------------

#### 特别感谢 `@metowolf`、`网易云音乐`、`QQ音乐`、`虾米`、`酷狗`、`百度音乐`

#### 采用的开源模块
- **Jquery**：js主流开发框架 [http://jquery.com/](http://jquery.com/)
- **Meting**：一个高效的多平台音乐 API 框架 [https://github.com/metowolf/Meting](https://github.com/metowolf/Meting)

TODO
------------

  * 下载或分享无版权音乐时给出提示
  * 自定义列表
  * 网易云榜单

联系(Contact Me)
------------

邮件联系(Contact me) [peter13034@outlook.com](mailto:peter13034@outlook.com)

License
-------

xMDPlayer is distributed under the terms of the
[GNU Affero General Public License v3.0](https://github.com/Mrs4s/go-cqhttp/blob/master/LICENSE).

Copyright 2020 [PDEV](https://pdev.top/)
