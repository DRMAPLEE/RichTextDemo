# ToastUI 富文本编辑器使用说明

## 🚀 快速开始

### 1. 启动项目

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 2. 访问应用

- **主页**: http://localhost:5173/ - 包含基础编辑器演示
- **完整演示**: http://localhost:5173/demo - 包含所有功能展示

## 📝 编辑器功能

### 基础编辑功能

- **文本格式化**: 粗体、斜体、下划线、删除线
- **标题**: H1-H6 标题样式
- **列表**: 有序列表、无序列表、任务列表
- **表格**: 创建和编辑表格
- **媒体**: 插入图片和链接
- **代码**: 行内代码和代码块
- **引用**: 块引用和水平分割线

### 高级功能

- **WYSIWYG 模式**: 所见即所得编辑
- **Markdown 模式**: 支持 Markdown 语法
- **全屏编辑**: 沉浸式编辑体验
- **代码高亮**: 支持多种编程语言
- **实时预览**: 编辑内容实时显示

## 🎯 使用方法

### 基本使用

```vue
<template>
  <RichTextEditor />
</template>

<script setup>
import RichTextEditor from '@/components/RichTextEditor.vue'
</script>
```

### 获取编辑器内容

```javascript
// 获取 HTML 内容
const htmlContent = editor.getHTML()

// 获取 Markdown 内容
const markdownContent = editor.getMarkdown()
```

### 设置编辑器内容

```javascript
// 设置 HTML 内容
editor.setHTML('<h1>新内容</h1>')

// 设置 Markdown 内容
editor.setMarkdown('# 新内容')
```

### 切换编辑模式

```javascript
// 切换到 Markdown 模式
editor.changeMode('markdown')

// 切换到 WYSIWYG 模式
editor.changeMode('wysiwyg')
```

## ⚙️ 配置选项

### 编辑器配置

```javascript
const editor = new Editor({
  el: editorRef.value,
  height: '500px', // 编辑器高度
  initialEditType: 'wysiwyg', // 初始编辑模式
  previewStyle: 'vertical', // 预览样式
  initialValue: '<h1>初始内容</h1>', // 初始内容
  plugins: [
    // 插件配置
    [codeSyntaxHighlight, { highlighter: 'Prism' }],
    [colorSyntax],
  ],
  toolbarItems: [
    // 工具栏项目
    'heading',
    'bold',
    'italic',
    'strike',
    'divider',
    'hr',
    'quote',
    'ul',
    'ol',
    'task',
    'indent',
    'outdent',
    'table',
    'image',
    'link',
    'code',
    'codeblock',
    'fullScreen',
  ],
})
```

### 工具栏项目说明

| 项目         | 功能     | 说明            |
| ------------ | -------- | --------------- |
| `heading`    | 标题     | 设置 H1-H6 标题 |
| `bold`       | 粗体     | 文本加粗        |
| `italic`     | 斜体     | 文本斜体        |
| `strike`     | 删除线   | 文本删除线      |
| `hr`         | 分割线   | 插入水平分割线  |
| `quote`      | 引用     | 插入块引用      |
| `ul`         | 无序列表 | 创建无序列表    |
| `ol`         | 有序列表 | 创建有序列表    |
| `task`       | 任务列表 | 创建任务列表    |
| `indent`     | 缩进     | 增加缩进        |
| `outdent`    | 减少缩进 | 减少缩进        |
| `table`      | 表格     | 插入表格        |
| `image`      | 图片     | 插入图片        |
| `link`       | 链接     | 插入链接        |
| `code`       | 行内代码 | 插入行内代码    |
| `codeblock`  | 代码块   | 插入代码块      |
| `fullScreen` | 全屏     | 全屏编辑模式    |

## 🔌 插件系统

### 已集成插件

1. **代码语法高亮插件**
   - 使用 Prism.js 提供语法高亮
   - 支持多种编程语言
   - 自动检测语言类型

2. **颜色语法插件**
   - 支持文本颜色设置
   - 支持背景色设置
   - 提供颜色选择器

### 添加新插件

```javascript
import customPlugin from './custom-plugin'

const editor = new Editor({
  // ... 其他配置
  plugins: [
    [codeSyntaxHighlight, { highlighter: 'Prism' }],
    [colorSyntax],
    [customPlugin, { options: 'value' }], // 添加自定义插件
  ],
})
```

## 🎨 自定义样式

### 修改编辑器样式

```css
/* 自定义工具栏样式 */
.toastui-editor-toolbar {
  background: #f8f9fa;
  border-bottom: 2px solid #e9ecef;
}

/* 自定义编辑器容器样式 */
.toastui-editor-main {
  font-family: 'Your Font', sans-serif;
}

/* 自定义预览区域样式 */
.toastui-editor-contents {
  font-size: 16px;
  line-height: 1.6;
}
```

### 响应式设计

编辑器已内置响应式设计，支持：

- 移动端适配
- 平板端优化
- 桌面端完整功能

## 📱 移动端支持

### 触摸操作

- 支持触摸手势
- 移动端友好的工具栏
- 响应式布局

### 性能优化

- 懒加载插件
- 按需渲染
- 内存管理

## 🚨 常见问题

### Q: 编辑器无法加载？

A: 检查是否正确安装了依赖，确保 `@toast-ui/editor` 已安装

### Q: 代码高亮不工作？

A: 确保已安装 `prismjs` 依赖，并正确配置插件

### Q: 图片上传失败？

A: 检查图片格式和大小，支持 JPG、PNG、GIF 等格式

### Q: 如何保存内容？

A: 使用 `editor.getHTML()` 或 `editor.getMarkdown()` 获取内容，然后保存到后端

## 🔧 开发调试

### 控制台调试

```javascript
// 在浏览器控制台中调试编辑器
const editor = document.querySelector('.toastui-editor').__vue__

// 获取当前内容
console.log(editor.getHTML())

// 设置内容
editor.setHTML('<h1>测试内容</h1>')
```

### 事件监听

```javascript
// 监听内容变化
editor.on('change', () => {
  console.log('内容已更改')
})

// 监听模式切换
editor.on('changeMode', (mode) => {
  console.log('编辑模式已切换为:', mode)
})
```

## 📚 更多资源

- [ToastUI Editor 官方文档](https://ui.toast.com/tui-editor)
- [Vue 3 官方文档](https://vuejs.org/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [项目 GitHub 仓库](https://github.com/your-repo/richtext)

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件
