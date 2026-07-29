# AGENTS.md

## 产品定位

这是一个只为一名 5 岁孩子服务的自然拼读网页工具。孩子以中文为母语，在新加坡幼儿园开始接触英语，认识字母，但尚未系统掌握字母音和单词含义。

产品的核心不是“完成课程”，而是让孩子愿意听、愿意尝试、愿意反复点。保持温和、简单、可无限重来，不加入考试压力、输赢、排行榜、金币、签到、广告、商城、聊天、账号或注册。

## 当前功能

- 主页按字母顺序展示 a–z，26 个字母均可自由选择。
- 每个字母有 6 个常用词，显示图形提示、英文、中文含义。
- 字母页并排显示大写和小写；单词中的目标字母以课程颜色突出。
- 固定离线音频支持字母音、单词音和跟读提示。
- “听单词找图片”在同一字母的 6 个词中随机选 3 个。
- “听声音找字母”只使用当前设备上已经听过的字母，并随机改变位置。
- 简单拼读词根据孩子已经听过的字母自动出现，目前包括 at、mat、sat、sit、pin、pan、tap、nap、cat、can。
- `phonics-visited` LocalStorage 项记录当前设备上听过的字母。它表示“接触过”，不表示“掌握”。
- PWA manifest 和 Service Worker 支持添加到 iPad 主屏幕及离线缓存。

## 内容与教学约束

- 学习内容的制作顺序可以参考合成自然拼读的组合价值，例如优先 s、a、t、i、p、n，以便尽早拼出简单词；但这只是内容规划顺序，不是孩子的访问门槛。
- 默认教授字母最常见、最容易用于初始拼读的声音。
- q 作为 `qu` 的 /kw/ 声音处理，q 单词中的 `qu` 一起高亮。
- x 主要通过 box、fox、six 等词尾 /ks/ 呈现。
- 新增单词时优先考虑：5 岁孩子常见、含义容易用图表达、发音清楚、中文翻译短。
- 每个字母维持少量词条；不要为了“完整”无限增加内容。
- 不加入 IPA 或音标。这里的目标是自然拼读，不是音标教学。

## 技术结构

- Vite + React + TypeScript，纯前端静态网页。
- 入口：`index.html` 与 `src/main.tsx`。
- 主要产品代码：`app/page.tsx`。
- 样式：`app/globals.css`。
- 静态资源与 PWA：`public/`。
- 单词音频：`public/audio/words/`。
- 字母纯音：`public/audio/letters/`。
- 构建输出：`dist/`，不提交仓库。
- 自动检查：`tests/static-build.test.mjs`。

不要引入服务器、数据库、用户认证或第三方在线运行依赖，除非产品需求明确改变。设备本地偏好和学习痕迹继续使用 LocalStorage。

## 音频维护

`scripts/generate-audio.sh` 使用 macOS `say` 的 Daniel 英式英语声音生成单词，再用 ffmpeg 转为 MP3。

现代 macOS 语音可能把旧式 PHON 控制指令当作文字读出，因此不要恢复 `[[inpt PHON]]` 方案。当前字母纯音通过截取示例单词的起始音生成；x 从 box 的结尾截取。

修改单词后：

1. 同步更新 `app/page.tsx` 和 `scripts/generate-audio.sh`。
2. 重新生成音频。
3. 抽听字母纯音，特别检查是否带字母名称、控制指令或多余的 schwa。
4. 增加 `AUDIO_VERSION`，同时更新 `public/sw.js` 的缓存版本，避免设备继续播放旧缓存。
5. 运行构建和测试。

## 发布方式

- GitHub 仓库：`tangyiwen11/little-phonics-dictionary`
- 默认分支：`main`
- GitHub Actions 工作流：`.github/workflows/deploy-pages.yml`
- 工作流构建 `dist/` 并发布到 GitHub Pages。
- 公开地址预期为 `https://tangyiwen11.github.io/little-phonics-dictionary/`。

发布前必须运行：

```bash
npm run build
npm test
```

项目发布后，公开 GitHub Pages 链接是孩子 iPad 的主要入口，不使用需要登录的预览链接。
