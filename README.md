# AI图片生成器

基于 React + TypeScript + Vite + Tailwind CSS 开发的AI图片生成工具，使用智谱AI API。

## 功能特性

- 🎨 支持多种图片风格（写实、卡通、动漫、油画、水彩）
- 📏 多种图片尺寸选择
- 🔄 AI提示词优化
- 📱 移动端适配
- 💾 生成历史记录
- ⚡ 懒加载优化

## 技术栈

- React 18
- TypeScript
- Vite
- Tailwind CSS
- 智谱AI API

## 开发环境设置

### 1. 安装依赖

```bash
npm install
```

### 2. 环境配置

复制 `.env.example` 文件为 `.env`：

```bash
cp .env.example .env
```

在 `.env` 文件中配置你的智谱AI API密钥：

```
VITE_ZHIPU_API_KEY=your_zhipu_api_key_here
```

#### 获取智谱AI API密钥

1. 访问 [智谱AI开放平台](https://open.bigmodel.cn/)
2. 注册并登录账户
3. 进入控制台 -> API密钥 -> 创建密钥
4. 复制密钥到 `.env` 文件中

#### API密钥格式示例
```
VITE_ZHIPU_API_KEY=xxxxxxxx.xxxxxxx.xxxxxxx
```

### 3. 启动开发服务器

```bash
npm run dev
```

## 项目结构

```
src/
├── components/          # React组件
│   ├── Header.tsx      # 页面头部
│   ├── ImageGenerator.tsx  # 图片生成器
│   └── HistorySidebar.tsx  # 历史记录侧边栏
├── contexts/           # React Context
│   └── ImageContext.tsx  # 图片状态管理
├── locales/            # 国际化文件
│   ├── index.ts
│   └── zh-CN.ts
├── services/           # API服务
│   └── zhipuApi.ts    # 智谱AI API服务
├── App.tsx            # 主应用组件
├── main.tsx           # 应用入口
└── index.css          # 全局样式
```

## 构建和部署

```bash
# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 开发规范

- 使用函数式组件 + Hooks
- 使用 Tailwind CSS 编写样式
- 组件要可复用
- 代码要有注释
- 网站的文本统一管理，方便之后拓展i18n
- 每次功能开发完成后需要进行自测

## 注意事项

- 保持设计简洁，不要过度设计
- 性能优化：图片使用懒加载
- 确保所有链接可点击
- 确保移动端适配
