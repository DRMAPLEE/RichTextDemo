# ToastUI 富文本编辑器

这是一个基于 [ToastUI Editor 3.2.2](https://nhn.github.io/tui.editor/latest/) 的现代化富文本编辑器，支持 WYSIWYG 和 Markdown 两种编辑模式。

## ✨ 主要特性

### 核心编辑功能

- 🎯 **双模式编辑**: 支持 WYSIWYG（所见即所得）和 Markdown 模式
- 🎨 **丰富格式**: 文本格式化、标题、列表、表格、图片、链接等
- 💻 **代码高亮**: 支持多种编程语言的语法高亮
- 🌈 **颜色语法**: 支持文本颜色设置
- 📊 **实时统计**: 显示字符数和行数统计
- 🔍 **全屏模式**: 支持全屏编辑体验
- 📤 **内容导出**: 支持导出 Markdown 格式
- ⌨️ **快捷键**: 支持常用编辑快捷键
- 📱 **响应式设计**: 适配各种屏幕尺寸

### 🆕 Markdown 文档查看器 v2.0（新功能）

- 📚 **文档渲染**: 自动加载并渲染 Markdown 文档为 HTML
- 🎯 **精准定位**: 支持章节定位、上下文匹配、索引选择
- ✨ **智能高亮**: 自动高亮指定文本，支持重复文本区分
- 🎨 **双重高亮**: 主目标突出显示，其他匹配项次要显示
- 🔗 **URL 参数**: 通过 URL 参数控制文档加载和文本高亮
- 📍 **自动滚动**: 高亮后自动滚动到目标位置
- 💡 **用户友好**: 优雅的动画效果和错误提示

## 🚀 快速开始

### 安装依赖

```bash
npm install
# 或
pnpm install
```

### 启动开发服务器

```bash
npm run dev
# 或
pnpm dev
```

访问 `http://localhost:5173` 查看应用

### 构建生产版本

```bash
npm run build
# 或
pnpm build
```

## 📖 Markdown 文档查看器使用

### 基础用法

```bash
# 查看文档
http://localhost:5173/markdown?doc=example

# 高亮文本
http://localhost:5173/markdown?doc=example&highlight=Vue 3
```

### 精准定位（v2.0 新功能）

```bash
# 章节定位 - 定位到特定章节中的文本
http://localhost:5173/markdown?doc=example&highlight=Vue 3&section=技术架构

# 索引选择 - 高亮第2个匹配项
http://localhost:5173/markdown?doc=example&highlight=Vue 3&index=2

# 上下文匹配 - 通过上下文精确定位
http://localhost:5173/markdown?doc=example&highlight=Vue 3&context=作为核心框架

# 组合使用 - 最精确的定位
http://localhost:5173/markdown?doc=example&highlight=Vue 3&section=技术架构&index=1
```

### URL 参数说明

| 参数 | 必填 | 说明 | 示例 |
|------|------|------|------|
| `doc` | ✅ | 文档名称（不含 .md） | `example` |
| `highlight` | ❌ | 要高亮的文本 | `Vue 3` |
| `section` | ❌ | 所属章节标题 | `技术架构` |
| `context` | ❌ | 文本上下文 | `作为核心框架` |
| `index` | ❌ | 第N个匹配项 | `2` |

### 在代码中使用

```javascript
import { useRouter } from 'vue-router'

const router = useRouter()

// 章节定位
router.push({
  path: '/markdown',
  query: {
    doc: 'example',
    highlight: 'Vue 3',
    section: '技术架构'
  }
})
```

详细文档：
- [快速参考](QUICK_REFERENCE.md) - 参数速查表
- [高级定位](ADVANCED_POSITIONING.md) - 完整技术文档
- [升级说明](UPGRADE_NOTES.md) - v2.0 新功能说明
- [解决方案](SOLUTION_SUMMARY.md) - 设计思路和实现

## 🛠️ 技术栈

- **Vue 3**: 现代化的前端框架
- **ToastUI Editor 3.2.2**: 强大的富文本编辑器
- **Tailwind CSS**: 实用优先的 CSS 框架
- **Vite**: 快速的构建工具
- **Prism.js**: 代码语法高亮

## 📋 功能详解

### 编辑器配置

编辑器使用了 ToastUI Editor 的完整配置选项：

```javascript
const editor = new Editor({
  el: document.querySelector('#editor'),
  height: '600px',
  initialValue: initialContent,
  initialEditType: 'wysiwyg',
  previewStyle: 'vertical',
  useCommandShortcut: true,
  usageStatistics: false,
  hideModeSwitch: false,
  // ... 更多配置
})
```

### 支持的插件

- **代码语法高亮**: 使用 Prism.js 提供代码高亮
- **颜色语法**: 支持文本颜色设置
- **表格插件**: 完整的表格编辑功能
- **图片插件**: 支持图片插入和管理

### 工具栏功能

- 📝 **文本格式**: 粗体、斜体、删除线
- 🏷️ **标题**: H1-H6 标题样式
- 📋 **列表**: 有序、无序、任务列表
- 📊 **表格**: 创建和编辑表格
- 🖼️ **媒体**: 插入图片和链接
- 💻 **代码**: 行内代码和代码块
- 🔍 **工具**: 全屏模式、模式切换

### 快捷键支持

- `Ctrl+B`: 粗体
- `Ctrl+I`: 斜体
- `Ctrl+K`: 插入链接
- `Ctrl+Shift+K`: 插入代码块
- `Ctrl+Z`: 撤销
- `Ctrl+Y`: 重做

## 🎮 使用方法

### 基本操作

1. **编辑内容**: 直接在编辑器中输入和编辑文本
2. **格式化文本**: 使用工具栏按钮或快捷键格式化文本
3. **插入元素**: 使用工具栏插入表格、图片、链接等
4. **切换模式**: 点击"切换模式"按钮在 WYSIWYG 和 Markdown 间切换

### 高级功能

1. **全屏编辑**: 点击"全屏模式"按钮进入全屏编辑
2. **内容导出**: 点击"导出Markdown"按钮导出内容
3. **内容统计**: 实时查看字符数和行数统计
4. **示例内容**: 点击"插入示例"按钮插入预设内容

## 🔧 自定义配置

### 修改编辑器配置

在 `src/components/RichTextEditor.vue` 文件中修改 `initEditor` 函数：

```javascript
const initEditor = () => {
  editor.value = new Editor({
    // 修改高度
    height: '800px',

    // 修改初始内容
    initialValue: '您的初始内容',

    // 修改工具栏项目
    toolbarItems: [
      'heading',
      'bold',
      'italic',
      // ... 更多项目
    ],

    // 修改代码块语言
    codeBlockLanguages: [
      'javascript',
      'python',
      // ... 更多语言
    ],
  })
}
```

### 添加新插件

1. 安装插件包
2. 导入插件
3. 在配置中添加插件

```javascript
import customPlugin from '@toast-ui/editor-plugin-custom'

// 在配置中添加
plugins: [
  [codeSyntaxHighlight, { highlighter: 'Prism' }],
  [colorSyntax],
  [customPlugin, { options: 'value' }],
]
```

## 📱 响应式设计

编辑器完全响应式，支持各种屏幕尺寸：

- **桌面端**: 完整功能展示
- **平板端**: 优化布局和触摸体验
- **移动端**: 简化界面，保持核心功能

## 🐛 常见问题

### Q: 代码高亮不工作？

A: 确保已安装 `prismjs` 依赖，并正确配置插件

### Q: 图片无法上传？

A: 需要配置图片上传服务，当前版本支持本地图片插入

### Q: 如何保存内容？

A: 使用 `getContent()` 方法获取内容，然后保存到后端或本地存储

### Q: 支持哪些浏览器？

A: 支持现代浏览器，包括 Chrome、Firefox、Safari、Edge

## 📄 许可证

本项目基于 MIT 许可证开源。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📁 项目结构

```
richtext/
├── src/
│   ├── components/
│   │   └── RichTextEditor.vue      # 富文本编辑器组件
│   ├── views/
│   │   ├── HomeView.vue             # 首页
│   │   ├── DemoView.vue             # 演示页面
│   │   ├── AboutView.vue            # 关于页面
│   │   └── MarkdownView.vue         # Markdown 查看器（新）
│   └── router/
│       └── index.js                 # 路由配置
├── public/
│   └── docs/                        # Markdown 文档目录
│       ├── example.md               # 示例文档
│       ├── getting-started.md       # 快速开始
│       └── duplicate-test.md        # 测试文档
├── QUICK_REFERENCE.md               # 快速参考
├── ADVANCED_POSITIONING.md          # 高级定位文档
├── UPGRADE_NOTES.md                 # 升级说明
└── SOLUTION_SUMMARY.md              # 解决方案总结
```

## 📚 相关链接

### 官方文档

- [ToastUI Editor 官方文档](https://nhn.github.io/tui.editor/latest/)
- [Vue 3 官方文档](https://vuejs.org/)
- [Tailwind CSS 官方文档](https://tailwindcss.com/)
- [Prism.js 官方文档](https://prismjs.com/)

### 项目文档

- [快速参考](QUICK_REFERENCE.md) - Markdown 查看器参数速查
- [高级定位](ADVANCED_POSITIONING.md) - 精准定位系统详解
- [升级说明](UPGRADE_NOTES.md) - v2.0 功能升级说明
- [解决方案](SOLUTION_SUMMARY.md) - 重复文本定位解决方案
- [使用指南](MARKDOWN_VIEWER_USAGE.md) - Markdown 查看器使用指南
- [技术文档](MARKDOWN_VIEWER.md) - 技术实现详解

---

🎉 享受使用 ToastUI 富文本编辑器的愉快体验！

**版本**: v2.0 - 精准定位系统  
**更新时间**: 2025-11-20
