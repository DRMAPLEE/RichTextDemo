# 升级说明 - v2.0 精准定位系统

## 🎉 新增功能

### v2.0 主要改进

原有的简单高亮功能已升级为**精准定位系统**，完美解决了重复文本的定位问题。

## 🔄 变更内容

### 新增 URL 参数

| 参数 | 说明 | 示例 |
|------|------|------|
| `section` | 指定文本所在的章节标题 | `section=技术架构` |
| `context` | 提供文本上下文用于精确匹配 | `context=使用 Vue 3 作为` |
| `index` | 指定高亮第几个匹配项 | `index=2` |

### 新增视觉效果

- **主要高亮**：深黄色背景 + 加粗 + 脉冲动画
- **次要高亮**：浅黄色背景 + 半透明
- 同时显示所有匹配项，目标项更突出

### 自动标题锚点

所有 Markdown 标题自动生成 ID，支持章节定位：

```markdown
## 技术架构   →  <h2 id="技术架构">
### Vue 3 简介  →  <h3 id="vue-3-简介">
```

## ⚡ 向后兼容

**好消息：完全向后兼容！** 

原有的 URL 依然可以正常工作：

```bash
# v1.0 的 URL（依然有效）
/markdown?doc=example&highlight=Vue 3

# v2.0 的 URL（新功能）
/markdown?doc=example&highlight=Vue 3&section=技术架构
```

## 🚀 如何使用新功能

### 快速体验

访问首页，查看新增的测试文档：

```
http://localhost:5173
```

在"重复文本测试文档"中，点击不同的高亮标签，体验精准定位效果。

### 代码示例

```vue
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 旧方式（依然可用）
router.push({
  path: '/markdown',
  query: {
    doc: 'example',
    highlight: 'Vue 3'
  }
})

// 新方式（推荐）- 章节定位
router.push({
  path: '/markdown',
  query: {
    doc: 'example',
    highlight: 'Vue 3',
    section: '技术架构'  // 新增参数
  }
})
</script>
```

## 📖 实际场景

### 场景 1：区分重复文本

**问题**：文档中有3处提到"Vue 3"，如何定位到第2处？

**解决**：

```javascript
// 方法 A：使用章节定位
{ doc: 'example', highlight: 'Vue 3', section: '全栈开发' }

// 方法 B：使用索引
{ doc: 'example', highlight: 'Vue 3', index: 2 }

// 方法 C：使用上下文
{ doc: 'example', highlight: 'Vue 3', context: '全栈开发常用' }
```

### 场景 2：分享精确位置

**需求**：分享文档链接时，希望对方直接看到特定章节的特定内容

```bash
# 精确定位链接
http://localhost:5173/markdown?doc=example&highlight=ToastUI Editor&section=编辑器集成

# 对方打开链接后：
# 1. 自动滚动到"编辑器集成"章节
# 2. 高亮该章节内的"ToastUI Editor"
```

## 📁 新增文件

```
public/docs/duplicate-test.md    # 测试文档（包含重复文本）
ADVANCED_POSITIONING.md           # 详细技术文档
UPGRADE_NOTES.md                  # 本文件
```

## 🔧 迁移指南

### 无需迁移！

如果你已经在使用 v1.0 的功能，不需要做任何修改。

### 可选升级

如果想使用新功能，只需添加额外的参数：

```javascript
// 旧代码
const viewDoc = (doc, highlight) => {
  router.push({
    path: '/markdown',
    query: { doc, highlight }
  })
}

// 升级后（可选）
const viewDoc = (doc, highlight, section = '', context = '', index = 1) => {
  const query = { doc }
  if (highlight) query.highlight = highlight
  if (section) query.section = section
  if (context) query.context = context
  if (index > 1) query.index = index
  
  router.push({ path: '/markdown', query })
}
```

## 🎯 推荐用法

### 简单场景

如果文档中目标文本唯一或第一个就是目标，继续使用简单方式：

```javascript
{ doc: 'example', highlight: 'ToastUI Editor' }
```

### 复杂场景

如果文档中有重复文本，使用新参数：

```javascript
// 推荐：章节定位（最常用）
{ doc: 'example', highlight: 'Vue 3', section: '技术架构' }

// 或者：索引选择（简单明了）
{ doc: 'example', highlight: 'Vue 3', index: 2 }

// 或者：上下文匹配（最精确）
{ doc: 'example', highlight: 'Vue 3', context: '使用 Vue 3 作为核心' }
```

## 💡 提示

### 如何找到章节名称？

1. 打开文档源文件（.md）
2. 查找 `##` 开头的标题
3. 使用标题文本作为 `section` 参数

示例：
```markdown
## 技术架构        → section: "技术架构"
### 编辑器集成     → section: "编辑器集成"
## 最佳实践        → section: "最佳实践"
```

### 调试技巧

打开浏览器控制台，可以看到定位过程的日志：

```
在章节 "技术架构" 内搜索...
找到 3 个匹配项，高亮第 1 个
```

## 📚 学习资源

- **快速开始**：查看首页的示例
- **详细文档**：[ADVANCED_POSITIONING.md](ADVANCED_POSITIONING.md)
- **API 文档**：[MARKDOWN_VIEWER.md](MARKDOWN_VIEWER.md)

## 🎊 总结

v2.0 升级带来了强大的精准定位能力，同时保持了：

✅ 完全向后兼容  
✅ 简单场景依然简单  
✅ 复杂场景更加强大  
✅ 无需代码迁移  

立即体验新功能：`http://localhost:5173`

---

**版本**：v2.0  
**发布时间**：2025-11-20

