# 大连，真是一次美妙的旅行 · DALIAN

一个在浏览器里播放的动效视频（不是 mp4）：用 [script-to-motion](https://github.com/kstost/script-to-motion) 制作，
HTML + CSS + SVG + GSAP 时间轴，逐帧对齐旁白时间轴。**在线观看：https://dogebi.github.io/DALIAN/**

## 怎么播放

页面渲染完成后**会自己播放**（在窗口内），不需要点击任何按钮。

- 想全屏看：按 `F` 或 `Enter`（浏览器规定全屏必须由按键触发）。
- 想带字幕看：按 `C`（本片没有音轨，字幕就是唯一的朗读轨）。
- 录制视频时用 `index.html?noautoplay` 打开：会停在第 0 帧等你，按 Space（窗口内播放）或 Enter（全屏播放）开始。
- 快捷键：Space 播放/暂停 · ←/→ 0.5 秒（Shift 5 秒）· Shift+> / Shift+< 变速 · `C` 字幕 · `F` 全屏 · `R` 重播 · `D` 调试条。

## 内容（15 句 / 11 个镜头 / 65 秒，16:9 1920×1080）

开场 → 辽东半岛最南端（手绘地图） → 不冻港 → 745 万人 / 1,900 公里海岸线 / 260 多个岛屿 →
星海广场「星之海」 → 一百多年的有轨电车 → 俄罗斯风情街「远东的巴黎」 → 旅顺老港 →
海鲜餐桌（鲍鱼·海胆·扇贝） → 金石滩的夏与冬（地平线擦除转场） → 从首尔 1 个半小时 → 结尾卡。

视觉母题是**一条地平线**：它在每一场变成不同的东西——海平线、海岸线、数字下的横线、电车轨道、
檐口线、盘沿、划分夏冬的擦除线、航线，最后成为标题的下划线。

## 结构

```
index.html            场景（11 个 section.scene）
css/style.css         美术方向（色彩、字号、版式）
css/fonts.css         字体 @font-face（由 add_font.mjs 生成）
js/scenes.js          时间轴（全部动画都挂在 GSAP 主时间轴上，可拖动定位）
js/art/coast.js       手绘辽东半岛地图
js/art/tram.js        有轨电车
js/art/street.js      俄罗斯风情街立面
js/cues.js            由 tts.mjs 生成的句子时间
js/player.js          播放器运行时
vendor/gsap/          GSAP 3.15.0（原样使用）
fonts/                字体（SIL OFL 1.1，见下）
audio/narration.mp3   无声（没有旁白；给出 Fish Audio 音色 ID 与密钥即可配上中文配音）
```

## 原创性与许可

- 画面里的地图、电车、街景、海味、图标、图形与文案全部为本片在代码里绘制／撰写，没有使用任何
  网络素材、图标集、图片或模板；没有用户提供的外部素材。
- 字体：**SIL OFL 1.1** — Noto Sans SC（正文／标题）、Noto Serif SC（衬线标题）、Pretendard（数字／拉丁）、
  D2Coding（等宽标签）、Noto Sans KR（韩文回退）。许可文件随字体一起放在 `fonts/` 中。
- GSAP 3.15.0 按 GSAP 标准「免费使用」许可原样分发，`vendor/gsap/` 内附许可声明。

## 校验

`check` / `smoke` / `check_fonts` / `snapshot`（真实 Chromium 截图）／`--seekcheck`（可重复性）／`--perf`
全部通过；帧内无文字重叠与裁切，「屏幕安全区」内无文字越界。
