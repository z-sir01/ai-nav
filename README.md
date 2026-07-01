# AI Nav — 精选 AI 工具导航站

> 聚合展示优质 AI 工具，通过推广链接赚取佣金，零成本被动收入项目。

## 📂 项目结构

```
D:\ai-nav\
├── index.html      # 主页面
├── css/
│   └── style.css   # 全局样式（玻璃拟态 + 动画 + 响应式）
├── js/
│   ├── data.js     # AI 工具数据库（32 个工具，8 大分类）
│   ├── app.js      # 应用逻辑（搜索/筛选/收藏/排序/弹窗）
│   └── particles.js # 粒子背景特效
└── README.md       # 本文件
```

## 🚀 快速开始

直接双击 `index.html` 在浏览器中打开即可运行，无需安装任何依赖。

推荐使用 Chrome / Edge / Firefox 最新版本。

## ✨ 功能清单

| 功能 | 说明 |
|------|------|
| 分类筛选 | 8 大分类 + 全部，点击即筛 |
| 实时搜索 | 按名称、描述、标签搜索，高亮匹配词 |
| 收藏系统 | 星标收藏，localStorage 持久化 |
| 排序 | 按热度 / 评分 / 最新排序 |
| 详情弹窗 | 点击卡片查看完整介绍和功能列表 |
| 粒子背景 | Canvas 粒子动画，鼠标交互 |
| 响应式 | PC / 平板 / 手机三端自适应 |
| 数字动画 | 统计数字缓动计数效果 |

## 💰 赚钱指南

### 推广计划总览

本项目已内置 32 个 AI 工具的推广链接，其中 **18 个工具有官方推广计划**：

| 工具 | 佣金 | 平台 | 状态 |
|------|------|------|------|
| Midjourney | 30% 持续 | Impact | ✅ 已接入 |
| Suno | 30% 持续 | 自建 | ✅ 已接入 |
| Notion | 30% 持续 | PartnerStack | ✅ 已接入 |
| Jasper | 30% 持续 | PartnerStack | ✅ 已接入 |
| Copy.ai | 30% 持续 | PartnerStack | ✅ 已接入 |
| Runway | 20% 持续 | 自建 | ✅ 已接入 |
| DeepL | 20%-30% | Impact | ✅ 已接入 |
| Gamma | 20%-30% | PartnerStack | ✅ 已接入 |
| Cursor | $20 credits/人 | 自建 | ✅ 已接入 |
| GitHub Copilot | $100 credits/人 | 自建 | ✅ 已接入 |
| ElevenLabs | $5 credits/人 | 自建 | ✅ 已接入 |
| Tabnine | credits | 自建 | ✅ 已接入 |
| Pika | 50 credits/人 | 自建 | ✅ 已接入 |
| 通义千问 | 30% API 返佣 | 阿里云 | ✅ 已接入 |
| 文心一言 | 最高 30% | 百度千帆 | ✅ 已接入 |
| LiblibAI | 最高 30% | 自建 | ✅ 已接入 |
| Mem | 有推荐计划 | 自建 | ✅ 已接入 |
| ThoughtSpot | 有合作计划 | 自建 | ✅ 已接入 |

### 如何赚取佣金

1. **注册推广计划**：访问各工具的 affiliate 页面注册
2. **获取专属链接**：注册后会得到你的专属推广链接
3. **替换 data.js 中的 link**：把 `https://...?ref=ainav` 替换为你的专属链接
4. **部署上线**：把网站放到 GitHub Pages 或自有域名
5. **推广引流**：在社交媒体分享你的导航站链接

### 注册入口

| 平台 | 注册链接 |
|------|----------|
| PartnerStack | https://partnerstack.com/ |
| Impact | https://impact.com/ |
| Midjourney | https://midjourney.com/affiliates |
| Suno | https://partners.suno.com |
| Runway | https://runwayml.com/affiliates |
| Notion | https://partnerstack.com/partners/notion |
| Jasper | https://partnerstack.com/jasper |
| Copy.ai | https://partners.copy.ai/ |
| Gamma | https://gamma.app/partners |
| DeepL | https://impact.com/partner/deepl |
| Cursor | https://www.cursor.com/referral |
| ElevenLabs | https://elevenlabs.io/referral-program |
| 通义千问 | https://www.aliyun.com/activity/bailian/affiliate-program |
| 文心一言 | https://cloud.baidu.com/campaign/promotion/qianfan |
| LiblibAI | https://www.liblib.ai/creator-program |

### 无推广计划的工具

以下工具暂无官方推广计划，链接指向官网：
- ChatGPT / OpenAI、Claude、DALL-E、Sora、FLUX、Stable Diffusion
- Writer、Tableau CRM、Adobe Podcast、Jupyter

这些工具可以作为流量入口，吸引用户到你的导航站。

## 🛠️ 自定义指南

### 添加新工具

在 `js/data.js` 的 `AI_TOOLS` 数组中添加对象：

```javascript
{
  id: 33,
  name: '新工具名',
  nameEn: 'New Tool',
  category: 'chat',       // chat/image/code/write/video/audio/productivity/data
  icon: '🆕',
  rating: 4.5,
  desc: '简短描述',
  detail: '详细介绍...',
  features: ['功能1', '功能2', '功能3'],
  price: '免费',
  hot: 5000,
  date: '2026-07-01',
  link: 'https://example.com/?ref=YOUR_AFFILIATE_ID',
},
```

### 修改配色

在 `css/style.css` 的 `:root` 中修改变量：

```css
:root {
  --accent-blue: #4a9eff;      /* 主色调 */
  --accent-purple: #a855f7;    /* 辅色调 */
  --accent-pink: #ec4899;      /* 强调色 */
  --bg-primary: #0a0a1a;       /* 背景色 */
}
```

## 📱 浏览器兼容性

- ✅ Chrome 90+
- ✅ Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ⚠️ IE 不支持（已淘汰）

## 📄 License

MIT License — 自由使用、修改、分发。
