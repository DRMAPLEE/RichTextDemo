# Markdown 文档查看器功能说明

## 功能概述

本项目新增了一个 Markdown 文档查看和文本高亮功能。用户可以通过 URL 参数指定要查看的文档名称和需要高亮的文本内容，系统会自动加载对应的 Markdown 文档、转换为 HTML 并高亮显示指定的文本。

## 功能特性

### 核心功能

1. **动态文档加载**：根据 URL 参数动态加载 Markdown 文档
2. **Markdown 渲染**：使用 markdown-it 将 Markdown 转换为 HTML
3. **代码语法高亮**：集成 Prism.js 提供代码块语法高亮
4. **文本搜索高亮**：自动搜索并高亮指定的文本内容
5. **智能滚动**：高亮后自动滚动到文本位置
6. **响应式设计**：支持各种屏幕尺寸

### 视觉效果

- 渐变背景设计
- 平滑动画效果
- 高亮文本带脉冲动画
- 现代化的 Markdown 样式

## 使用方法

### 1. URL 参数说明

访问路径：`/markdown`

支持的 URL 参数：

| 参数        | 类型   | 必填 | 说明                          |
| ----------- | ------ | ---- | ----------------------------- |
| `doc`       | String | 是   | 文档名称（不包含 .md 扩展名） |
| `highlight` | String | 否   | 需要高亮的文本内容            |

### 2. 访问示例

#### 示例 1：查看完整文档

```
http://localhost:5173/markdown?doc=example
```

这将加载 `/public/docs/example.md` 文档并显示完整内容。

#### 示例 2：查看文档并高亮文本

```
http://localhost:5173/markdown?doc=example&highlight=技术架构
```

这将加载文档并高亮显示所有"技术架构"文本，并自动滚动到第一个匹配项。

#### 示例 3：高亮英文文本

```
http://localhost:5173/markdown?doc=getting-started&highlight=快捷键
```

### 3. 通过代码调用

在 Vue 组件中使用：

```javascript
import { useRouter } from 'vue-router'

const router = useRouter()

// 跳转到文档页面
const viewDocument = (docName, highlightText = '') => {
  router.push({
    path: '/markdown',
    query: {
      doc: docName,
      highlight: highlightText,
    },
  })
}

// 使用示例
viewDocument('example', '技术架构')
```

### 4. 在首页使用

访问项目首页 (`http://localhost:5173`)，在"Markdown 文档查看器"部分：

1. 点击高亮标签可以直接查看文档并高亮对应文本
2. 点击"查看完整文档"按钮可以查看完整内容

## 文档管理

### 文档存放位置

Markdown 文档应存放在：

```
/public/docs/
```

### 添加新文档

1. 在 `/public/docs/` 目录下创建新的 `.md` 文件
2. 文档名称应使用小写字母和连字符（例如：`my-document.md`）
3. 使用标准 Markdown 语法编写内容

### 示例文档结构

```
public/
  └── docs/
      ├── example.md
      ├── getting-started.md
      └── your-document.md
```

## 技术实现

### 核心技术栈

- **Vue 3**：使用 Composition API
- **Vue Router**：处理路由和参数
- **markdown-it**：Markdown 到 HTML 转换
- **Prism.js**：代码语法高亮
- **TreeWalker API**：文本节点遍历和搜索

### 文本高亮算法

1. 使用 `TreeWalker` 遍历 DOM 树的所有文本节点
2. 在文本节点中搜索目标文本（不区分大小写）
3. 找到匹配项后创建 `<mark>` 元素包裹文本
4. 为第一个匹配项添加 ID 用于滚动定位
5. 使用 `scrollIntoView` 平滑滚动到目标位置

### 支持的 Prism.js 语言

默认支持以下编程语言的语法高亮：

- JavaScript / TypeScript
- JSX / TSX
- Python
- Java
- CSS
- JSON
- Bash
- Markdown

## 自定义配置

### 修改文档路径

如果需要修改文档存放路径，编辑 `MarkdownView.vue`：

```javascript
// 修改这一行
const response = await fetch(`/docs/${docName}.md`)

// 改为你的路径
const response = await fetch(`/your-path/${docName}.md`)
```

### 自定义高亮样式

修改 `MarkdownView.vue` 中的 CSS：

```css
.markdown-content :deep(.highlight-text),
.markdown-content :deep(mark) {
  background: linear-gradient(120deg, #fef08a 0%, #fde047 100%);
  padding: 2px 4px;
  border-radius: 3px;
  /* 添加你的自定义样式 */
}
```

### 添加更多语言支持

在 `MarkdownView.vue` 中导入更多 Prism.js 语言：

```javascript
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-rust'
import 'prismjs/components/prism-php'
// 更多语言...
```

## 注意事项

1. **文档名称**：确保 URL 参数中的文档名称与实际文件名匹配（不包含扩展名）
2. **文本搜索**：高亮搜索不区分大小写，但会保留原文本的大小写
3. **特殊字符**：如果高亮文本包含特殊字符，URL 会自动编码
4. **性能**：对于超大文档（>1MB），加载和渲染可能需要一些时间
5. **浏览器兼容性**：使用了现代浏览器 API，建议使用最新版本的浏览器

## 故障排查

### 问题 1：文档加载失败

**可能原因**：

- 文档文件不存在
- 文件路径不正确
- 文件权限问题

**解决方案**：

- 检查文档是否存在于 `/public/docs/` 目录
- 确认文档名称正确（区分大小写）
- 查看浏览器控制台的错误信息

### 问题 2：高亮不工作

**可能原因**：

- 目标文本在文档中不存在
- 文本被代码块或特殊元素包含

**解决方案**：

- 确认要高亮的文本在文档中确实存在
- 检查浏览器控制台的警告信息
- 尝试高亮更短或更精确的文本

### 问题 3：代码高亮不显示

**可能原因**：

- Prism.js 未正确加载
- 语言包未导入

**解决方案**：

- 检查 Prism.js CSS 是否加载
- 确认相关语言包已导入
- 查看浏览器控制台错误

## 扩展功能建议

### 可以添加的功能

1. **搜索栏**：添加文档内搜索功能
2. **目录导航**：自动生成文档目录
3. **多个高亮**：支持高亮多个不同的文本
4. **高亮颜色**：允许用户选择高亮颜色
5. **打印功能**：支持打印文档
6. **分享链接**：生成带参数的分享链接
7. **文档历史**：记录最近查看的文档

### 与后端集成

如果需要从后端 API 加载文档：

```javascript
const loadMarkdownDocument = async (docName) => {
  try {
    // 从 API 加载
    const response = await fetch(`/api/documents/${docName}`)
    const data = await response.json()
    markdownContent.value = data.content

    // 渲染 Markdown
    renderedHtml.value = md.render(data.content)
  } catch (err) {
    console.error('加载失败:', err)
  }
}
```

## 总结

Markdown 文档查看器提供了一个强大且灵活的文档展示解决方案。通过 URL 参数控制文档加载和文本高亮，使得文档分享和引用变得非常方便。

如有问题或建议，欢迎提出 Issue 或 Pull Request！
