# 精准定位系统 - 高级功能文档

## 🎯 问题背景

在原始实现中，如果文档包含多个相同的文本内容，系统只能高亮第一个匹配项，无法精确定位到用户真正想要的那个位置。例如：

```markdown
## 章节 A
这里提到了 Vue 3 框架...

## 章节 B  
这里也提到了 Vue 3 框架...

## 章节 C
这里又提到了 Vue 3 框架...
```

如果用户想高亮"章节 B"中的"Vue 3"，原始方案无法实现。

## 💡 解决方案

我们实现了一个**多级定位系统**，支持以下策略：

1. **章节定位（Section）**：指定文本所在的章节
2. **上下文匹配（Context）**：通过上下文片段精确匹配
3. **索引选择（Index）**：指定高亮第几个匹配项
4. **多项高亮**：同时显示所有匹配项，主目标更突出

## 📋 URL 参数详解

### 完整参数列表

| 参数 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| `doc` | String | ✅ 是 | 文档名称（不含扩展名） | `example` |
| `highlight` | String | ❌ 否 | 要高亮的文本内容 | `Vue 3` |
| `section` | String | ❌ 否 | 所属章节标题 | `前端开发` |
| `context` | String | ❌ 否 | 文本上下文（前后文） | `使用 Vue 3 作为` |
| `index` | Number | ❌ 否 | 第几个匹配项（从1开始） | `2` |

### 参数优先级

定位精度从高到低：

```
section + context > section > context > index > 无参数
```

## 🚀 使用示例

### 示例 1：基础高亮（无定位参数）

```
/markdown?doc=duplicate-test&highlight=Vue 3
```

**效果**：
- 高亮所有"Vue 3"
- 滚动到第一个匹配项
- 第一个匹配项使用主要高亮样式（深黄色 + 加粗 + 脉冲动画）
- 其他匹配项使用次要高亮样式（浅黄色 + 半透明）

### 示例 2：章节定位

```
/markdown?doc=duplicate-test&highlight=Vue 3&section=全栈开发
```

**效果**：
- 先滚动到"全栈开发"章节
- 在该章节范围内查找"Vue 3"
- 高亮该章节内的"Vue 3"

**优势**：避免混淆其他章节中的相同文本

### 示例 3：上下文匹配

```
/markdown?doc=duplicate-test&highlight=开发&context=后端开发负责处理
```

**效果**：
- 只匹配上下文包含"后端开发负责处理"的"开发"
- 精确定位到特定位置

**适用场景**：当目标文本非常普遍，但前后文独特时

### 示例 4：索引选择

```
/markdown?doc=duplicate-test&highlight=Vue 3&index=2
```

**效果**：
- 找到所有"Vue 3"
- 高亮第2个匹配项为主目标
- 滚动到第2个匹配项

### 示例 5：组合定位（最精确）

```
/markdown?doc=duplicate-test&highlight=性能优化&section=性能优化&context=前端性能优化
```

**效果**：
- 先定位到"性能优化"章节
- 在该章节内查找包含"前端性能优化"上下文的"性能优化"
- 实现最精确的定位

## 💻 代码使用示例

### Vue 组件中使用

```vue
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 基础用法
const viewBasic = () => {
  router.push({
    path: '/markdown',
    query: {
      doc: 'duplicate-test',
      highlight: 'Vue 3'
    }
  })
}

// 章节定位
const viewWithSection = () => {
  router.push({
    path: '/markdown',
    query: {
      doc: 'duplicate-test',
      highlight: 'Vue 3',
      section: '前端开发'
    }
  })
}

// 完整定位
const viewPrecise = () => {
  router.push({
    path: '/markdown',
    query: {
      doc: 'duplicate-test',
      highlight: '性能优化',
      section: '性能优化',
      context: '前端性能',
      index: 1
    }
  })
}
</script>

<template>
  <button @click="viewBasic">基础高亮</button>
  <button @click="viewWithSection">章节定位</button>
  <button @click="viewPrecise">精准定位</button>
</template>
```

### JavaScript 中使用

```javascript
// 构建 URL
const buildMarkdownUrl = (doc, highlight, options = {}) => {
  const params = new URLSearchParams({
    doc,
    ...(highlight && { highlight }),
    ...(options.section && { section: options.section }),
    ...(options.context && { context: options.context }),
    ...(options.index && { index: options.index })
  })
  
  return `/markdown?${params.toString()}`
}

// 使用示例
const url1 = buildMarkdownUrl('example', 'Vue 3')
// /markdown?doc=example&highlight=Vue+3

const url2 = buildMarkdownUrl('example', 'Vue 3', { 
  section: '前端开发',
  index: 2 
})
// /markdown?doc=example&highlight=Vue+3&section=前端开发&index=2
```

## 🎨 视觉效果

### 主要高亮（目标匹配项）

```css
/* 深黄色渐变背景 */
background: linear-gradient(120deg, #fef08a 0%, #fde047 100%);

/* 特点 */
- 加粗文字
- 脉冲动画
- 外发光效果
- 高对比度
```

### 次要高亮（其他匹配项）

```css
/* 浅黄色渐变背景 */
background: linear-gradient(120deg, #fde68a 0%, #fcd34d 100%);

/* 特点 */
- 半透明显示
- 较淡的背景
- 无动画
- 低对比度
```

### 视觉对比

```
主要目标：  [Vue 3]  ← 深色、加粗、动画
其他匹配：  [Vue 3]  ← 浅色、普通、静态
```

## 🔧 技术实现

### 1. 标题自动生成 ID

```javascript
// Markdown 渲染时自动为标题添加 ID
md.renderer.rules.heading_open = function (tokens, idx) {
  const content = tokens[idx + 1].content
  const id = content
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]/g, '')
  
  return `<h${level} id="${id}" class="heading-anchor">`
}
```

**效果**：
- "前端开发" → `id="前端开发"`
- "Vue 3 简介" → `id="vue-3-简介"`

### 2. 章节范围确定

```javascript
// 确定章节的范围（从该标题到下一个同级或更高级标题）
const sectionElement = document.getElementById(sectionId)
const sectionLevel = parseInt(sectionElement.tagName.charAt(1))

let nextSection = sectionElement.nextElementSibling
while (nextSection) {
  if (nextSection.tagName.match(/^H[1-6]$/)) {
    const nextLevel = parseInt(nextSection.tagName.charAt(1))
    if (nextLevel <= sectionLevel) break
  }
  nextSection = nextSection.nextElementSibling
}
```

### 3. 匹配算法

```javascript
const findAllMatches = (scope, searchText, context = '') => {
  const matches = []
  const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, null)

  let textNode
  while ((textNode = walker.nextNode())) {
    const text = textNode.textContent
    const lowerText = text.toLowerCase()
    const lowerSearch = searchText.toLowerCase()

    let startIndex = 0
    let index

    // 在同一个文本节点中查找所有匹配
    while ((index = lowerText.indexOf(lowerSearch, startIndex)) !== -1) {
      // 如果指定了上下文，检查是否匹配
      if (context) {
        const surroundingText = text.substring(
          Math.max(0, index - 50),
          index + searchText.length + 50
        ).toLowerCase()
        
        if (!surroundingText.includes(context.toLowerCase())) {
          startIndex = index + 1
          continue
        }
      }

      matches.push({
        node: textNode,
        offset: index,
        length: searchText.length,
        text: text.substring(index, index + searchText.length),
      })

      startIndex = index + 1
    }
  }

  return matches
}
```

## 📊 实际案例

### 案例 1：API 文档高亮

**场景**：在 API 文档中高亮特定接口的参数说明

```javascript
router.push({
  path: '/markdown',
  query: {
    doc: 'api-docs',
    highlight: 'token',
    section: '认证接口',
    context: 'Authorization header'
  }
})
```

### 案例 2：教学文档定位

**场景**：在教学文档中定位到第3个代码示例

```javascript
router.push({
  path: '/markdown',
  query: {
    doc: 'tutorial',
    highlight: '示例代码',
    section: '高级用法',
    index: 3
  }
})
```

### 案例 3：问题定位

**场景**：在问题文档中精确定位某个特定问题

```javascript
router.push({
  path: '/markdown',
  query: {
    doc: 'troubleshooting',
    highlight: '错误',
    section: '常见问题',
    context: '404 错误通常表示'
  }
})
```

## 🎯 最佳实践

### 1. 选择合适的定位策略

```javascript
// ✅ 好的做法：根据场景选择参数
// 场景 A：目标文本唯一或第一个就是目标
{ doc: 'example', highlight: 'ToastUI Editor' }

// 场景 B：目标在特定章节
{ doc: 'example', highlight: 'Vue 3', section: '技术架构' }

// 场景 C：目标文本很普遍，需要上下文
{ doc: 'example', highlight: '使用', context: '使用 Vite 作为' }

// 场景 D：明确知道是第N个
{ doc: 'example', highlight: '示例', index: 3 }

// ❌ 避免：过度使用参数
{ 
  doc: 'example', 
  highlight: 'Vue', 
  section: '技术架构',
  context: 'Vue 3 框架',
  index: 1 
}  // 太复杂了！
```

### 2. URL 编码注意事项

```javascript
// ✅ 好的做法：使用 URLSearchParams 自动编码
const params = new URLSearchParams({
  doc: 'example',
  highlight: '中文内容',
  section: '技术架构'
})

// ❌ 避免：手动拼接 URL（可能导致编码问题）
const url = `/markdown?doc=example&highlight=中文内容`
```

### 3. 用户体验优化

```vue
<!-- ✅ 好的做法：提供清晰的提示 -->
<button 
  @click="viewDocument('example', 'Vue 3', '前端开发')"
  :title="`在 "前端开发" 章节中高亮 "Vue 3"`"
>
  <span class="opacity-60">§</span> Vue 3
</button>

<!-- ❌ 避免：没有说明的按钮 -->
<button @click="viewDocument('example', 'Vue 3')">
  Vue 3
</button>
```

## 🔮 未来扩展

### 可能的改进方向

1. **正则表达式支持**
```
?highlight=Vue\s*[23]&regex=true
```

2. **多文本高亮**
```
?highlight=Vue 3,React,Angular
```

3. **高亮样式自定义**
```
?highlight=Vue 3&color=blue
```

4. **持久化书签**
```javascript
// 保存书签
const bookmark = {
  doc: 'example',
  highlight: 'Vue 3',
  section: '技术架构',
  timestamp: Date.now()
}
localStorage.setItem('bookmark_1', JSON.stringify(bookmark))
```

## 📝 测试清单

### 功能测试

- [ ] 基础高亮：`?doc=duplicate-test&highlight=Vue 3`
- [ ] 章节定位：`?doc=duplicate-test&highlight=Vue 3&section=前端开发`
- [ ] 上下文匹配：`?doc=duplicate-test&highlight=开发&context=后端开发`
- [ ] 索引选择：`?doc=duplicate-test&highlight=Vue 3&index=2`
- [ ] 组合定位：`?doc=duplicate-test&highlight=Vue 3&section=全栈开发&index=1`

### 边界测试

- [ ] 不存在的章节：`?section=不存在的章节`
- [ ] 不存在的文本：`?highlight=不存在的文本`
- [ ] 超出范围的索引：`?index=999`
- [ ] 特殊字符：`?highlight=<script>&context="test"`
- [ ] 超长上下文：`?context=很长很长的文本...`

### 性能测试

- [ ] 大文档（>10000行）
- [ ] 大量匹配项（>100个）
- [ ] 复杂 DOM 结构
- [ ] 移动端设备

## 📚 相关文档

- [基础使用指南](MARKDOWN_VIEWER_USAGE.md)
- [技术实现文档](MARKDOWN_VIEWER.md)
- [功能总结](FEATURE_SUMMARY.md)

## 🙏 总结

精准定位系统通过多级参数设计，完美解决了重复文本的定位问题：

1. **灵活性**：多种定位方式，适应不同场景
2. **精确性**：组合使用参数可以实现非常精确的定位
3. **易用性**：参数都是可选的，简单场景依然简单
4. **可扩展性**：设计预留了扩展空间

这个系统可以应用于各种文档场景，如 API 文档、教学材料、问题排查等，大大提升了文档的可引用性和分享便利性！

---

**更新时间**：2025-11-20  
**版本**：v2.0 - 精准定位系统

