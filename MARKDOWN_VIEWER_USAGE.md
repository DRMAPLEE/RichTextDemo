# Markdown 文档查看器 - 快速使用指南

## 🎯 功能说明

新增的 Markdown 文档查看器可以：
- 根据 URL 参数加载指定的 Markdown 文档
- 自动高亮指定的文本内容
- 平滑滚动到高亮位置
- 支持代码语法高亮

## 🚀 快速开始

### 1. 启动开发服务器

```bash
pnpm dev
```

### 2. 访问首页

打开浏览器访问：`http://localhost:5173`

在首页找到"📚 Markdown 文档查看器"部分

### 3. 体验功能

#### 方式一：通过首页链接

1. 在文档列表中选择一个文档
2. 点击高亮标签（如"技术架构"、"快捷键"等）
3. 系统自动跳转并高亮对应文本

#### 方式二：直接访问 URL

在浏览器地址栏输入：

```
# 查看文档（不高亮）
http://localhost:5173/markdown?doc=example

# 查看文档并高亮文本
http://localhost:5173/markdown?doc=example&highlight=技术架构

# 其他示例
http://localhost:5173/markdown?doc=getting-started&highlight=快捷键
http://localhost:5173/markdown?doc=test&highlight=Vue 3
```

## 📝 URL 参数说明

| 参数 | 说明 | 示例 |
|------|------|------|
| `doc` | 文档名称（必填） | `example`、`getting-started`、`test` |
| `highlight` | 要高亮的文本（可选） | `技术架构`、`Vue 3`、`代码示例` |

## 📁 可用的示例文档

系统已预置以下文档：

1. **example.md** - Vue 3 富文本编辑器项目文档
   - 完整的项目文档
   - 包含代码示例和表格
   - 推荐高亮：`技术架构`、`ToastUI Editor`、`最佳实践`

2. **getting-started.md** - 快速开始指南
   - 安装和使用说明
   - 包含快捷键表格
   - 推荐高亮：`快捷键`、`安装`、`基本操作`

3. **test.md** - 测试文档
   - 简单的测试文档
   - 推荐高亮：`Vue 3`、`文本高亮`、`代码示例`

## ✨ 特色功能

### 1. 智能文本搜索
- 不区分大小写
- 自动定位第一个匹配项
- 保留原文本的大小写

### 2. 高亮动画效果
- 黄色渐变高亮背景
- 脉冲动画效果
- 平滑滚动过渡

### 3. 代码语法高亮
支持多种编程语言：
- JavaScript/TypeScript
- Python
- Java
- CSS
- JSON
- Bash
- 等等...

### 4. 响应式设计
- 适配移动端和桌面端
- 优雅的 UI 设计
- 流畅的交互体验

## 🔧 添加自己的文档

### 步骤：

1. 在 `/public/docs/` 目录下创建新的 `.md` 文件

```bash
touch public/docs/my-document.md
```

2. 编写 Markdown 内容

```markdown
# 我的文档

这是我的文档内容...
```

3. 访问文档

```
http://localhost:5173/markdown?doc=my-document
```

4. （可选）在首页添加链接

编辑 `src/views/HomeView.vue`，在 `documents` 数组中添加：

```javascript
{
  name: 'my-document',
  title: '我的文档标题',
  description: '文档描述',
  highlights: ['关键词1', '关键词2']
}
```

## 💡 使用技巧

### 技巧 1：分享带高亮的链接

复制 URL 分享给其他人，他们打开后会自动看到高亮的内容：

```
http://localhost:5173/markdown?doc=example&highlight=技术架构
```

### 技巧 2：在代码中跳转

```javascript
// 在 Vue 组件中
import { useRouter } from 'vue-router'

const router = useRouter()

const goToDoc = () => {
  router.push({
    path: '/markdown',
    query: {
      doc: 'example',
      highlight: '技术架构'
    }
  })
}
```

### 技巧 3：高亮多个词的部分

虽然当前版本只高亮第一个匹配项，但你可以指定更具体的文本片段：

```
# 高亮整个短语
?doc=example&highlight=Vue 3 组合式 API
```

## 🐛 常见问题

### Q: 为什么文档加载失败？
A: 检查文档是否存在于 `/public/docs/` 目录，且文件名正确。

### Q: 为什么高亮不工作？
A: 确保要高亮的文本在文档中确实存在，注意不区分大小写。

### Q: 如何高亮中文？
A: 直接在 URL 中使用中文即可，浏览器会自动编码。

### Q: 支持哪些 Markdown 语法？
A: 支持标准 Markdown 语法，包括标题、列表、代码块、表格、引用等。

## 📞 技术支持

如遇到问题，请查看：
- 浏览器控制台的错误信息
- `/MARKDOWN_VIEWER.md` 详细技术文档
- 项目的 README 文件

---

**祝使用愉快！** 🎉

