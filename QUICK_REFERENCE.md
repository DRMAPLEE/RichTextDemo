# 快速参考 - Markdown 文档精准定位

## 📖 URL 参数速查表

| 参数 | 必填 | 类型 | 说明 | 示例 |
|------|------|------|------|------|
| `doc` | ✅ | String | 文档名称 | `example` |
| `highlight` | ❌ | String | 高亮文本 | `Vue 3` |
| `section` | ❌ | String | 所属章节 | `技术架构` |
| `context` | ❌ | String | 上下文 | `使用 Vue 3` |
| `index` | ❌ | Number | 第N个（从1开始） | `2` |

## ⚡ 快速示例

### 基础用法

```bash
# 查看文档
/markdown?doc=example

# 高亮文本
/markdown?doc=example&highlight=Vue 3
```

### 精准定位

```bash
# 章节定位
/markdown?doc=example&highlight=Vue 3&section=技术架构

# 索引选择
/markdown?doc=example&highlight=Vue 3&index=2

# 上下文匹配
/markdown?doc=example&highlight=Vue 3&context=使用 Vue 3 作为

# 组合使用
/markdown?doc=example&highlight=Vue 3&section=技术架构&index=1
```

## 💻 代码片段

### Vue Router

```javascript
import { useRouter } from 'vue-router'

const router = useRouter()

// 基础
router.push({
  path: '/markdown',
  query: { doc: 'example', highlight: 'Vue 3' }
})

// 章节定位
router.push({
  path: '/markdown',
  query: { 
    doc: 'example', 
    highlight: 'Vue 3', 
    section: '技术架构' 
  }
})

// 完整定位
router.push({
  path: '/markdown',
  query: { 
    doc: 'example', 
    highlight: 'Vue 3',
    section: '技术架构',
    context: '核心框架',
    index: 1
  }
})
```

### 辅助函数

```javascript
// URL 构建器
const buildMarkdownUrl = (doc, highlight, options = {}) => {
  const params = new URLSearchParams({ doc })
  if (highlight) params.set('highlight', highlight)
  if (options.section) params.set('section', options.section)
  if (options.context) params.set('context', options.context)
  if (options.index) params.set('index', options.index)
  return `/markdown?${params}`
}

// 使用
const url = buildMarkdownUrl('example', 'Vue 3', { 
  section: '技术架构' 
})
```

## 🎯 选择策略

### 何时使用什么参数？

```
✅ 只有 highlight
   → 文本唯一或第一个就是目标

✅ highlight + section  
   → 文本在特定章节（最常用）

✅ highlight + index
   → 知道是第几个匹配项

✅ highlight + context
   → 文本很普遍，需要上下文

✅ 组合使用
   → 需要最精确的定位
```

## 🎨 视觉效果

```
主要高亮：[Vue 3] ← 深黄色、加粗、动画
次要高亮： Vue 3  ← 浅黄色、普通、静态
```

## 🔧 调试技巧

### 浏览器控制台

```javascript
// 查看定位日志
// 在章节 "技术架构" 内搜索...
// 找到 3 个匹配项，高亮第 1 个
```

### 测试 URL

```bash
# 测试文档
http://localhost:5173/markdown?doc=duplicate-test

# 测试章节定位
http://localhost:5173/markdown?doc=duplicate-test&highlight=Vue 3&section=前端开发

# 测试索引
http://localhost:5173/markdown?doc=duplicate-test&highlight=Vue 3&index=2
```

## 📋 常见问题

**Q: 章节名称如何确定？**  
A: 查看 .md 文件中的标题（`##` 开头），直接使用标题文本

**Q: 参数可以组合使用吗？**  
A: 可以！所有参数都可以自由组合

**Q: 向后兼容吗？**  
A: 完全兼容！新参数都是可选的

**Q: 找不到文本怎么办？**  
A: 会显示提示信息，检查拼写和大小写（搜索不区分大小写）

## 📚 文档链接

- 详细文档：[ADVANCED_POSITIONING.md](ADVANCED_POSITIONING.md)
- 升级说明：[UPGRADE_NOTES.md](UPGRADE_NOTES.md)
- 解决方案：[SOLUTION_SUMMARY.md](SOLUTION_SUMMARY.md)
- 使用指南：[MARKDOWN_VIEWER_USAGE.md](MARKDOWN_VIEWER_USAGE.md)

## 🚀 快速开始

```bash
# 1. 启动服务
pnpm dev

# 2. 访问首页
http://localhost:5173

# 3. 点击示例文档的高亮标签体验功能
```

---

**提示**：保存此文件作为快速参考！

