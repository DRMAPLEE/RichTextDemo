# 内联 Diff 模式 - 文本流式显示

## 🎯 设计理念

**变更应该融入文本流中，保持文本的自然可读性**

类似于 Word 的修订模式，在文本中直接显示删除和新增，而不是将它们分割成独立的块。

## ✨ 核心特性

### 1. **内联显示**
变更不再另起一行，而是直接嵌入在文本流中：

```
这是一段普通文本，其中有[被删除的内容][新增的内容]，然后继续是普通文本。
```

### 2. **保持可读性**
- 删除的内容：红色背景 + 删除线
- 新增的内容：绿色背景
- 普通文本：正常显示
- 整体文本保持连贯

### 3. **悬浮操作按钮**
鼠标悬停在变更上时，显示小巧的操作按钮：
```
[删除的][新增的] [✓] [✗]
                  ↑  ↑
               接受 拒绝
```

## 🎨 视觉效果

### 示例文本流

```
这是一段文档的开头。

我们要计算总价，使用for (let i = 0; i < items.length; i++)for (const item of items)遍历数组。

这里继续是正常的文本内容。
```

在上面的例子中：
- 红色删除线：`for (let i = 0; i < items.length; i++)`
- 绿色背景：`for (const item of items)`
- 两者紧密相连，显示在同一行文本中

### 类似 Word 修订模式

```
原文: "这是一个重要的功能"
修改: "这是一个非常重要的功能"

显示效果:
这是一个[重要][非常重要]的功能
        ↑红底删除线
             ↑绿底
```

## 🎯 用户体验

### 阅读体验
```
✅ 文本流畅连贯
✅ 变更一目了然
✅ 上下文清晰
✅ 类似熟悉的文档修订模式
```

### 操作体验
```
鼠标移到变更上
    ↓
小按钮浮现
    ↓
点击 ✓ 接受 或 ✗ 拒绝
    ↓
立即应用
```

## 📋 对比效果

### 之前的块状显示
```
╔═══════════════════════════════╗
║ 🔄 修改（删除旧内容+添加...） ║
║───────────────────────────────║
║ 🔴 删除                       ║
║ for (let i = 0; i < ...)      ║
║───────────────────────────────║
║ 🟢 新增                       ║
║ for (const item of ...)       ║
║───────────────────────────────║
║ [接受此变更] [拒绝此变更]      ║
╚═══════════════════════════════╝
```
❌ 占用大量垂直空间  
❌ 打断文本阅读  
❌ 需要上下对照  

### 现在的内联显示
```
我们使用for (let i = 0; i < items.length; i++)for (const item of items) [✓][✗]遍历数组。
        ↑红底删除线                    ↑绿底                    ↑悬浮按钮
```
✅ 紧凑简洁  
✅ 文本连贯  
✅ 直接对比  
✅ 自然流畅  

## 🎨 样式设计

### 删除内容
```css
background: #5a1a1a;           /* 深红色背景 */
text-decoration: line-through; /* 删除线 */
text-decoration-color: #f48771; /* 红色删除线 */
padding: 0.1em 0.2em;          /* 小内边距 */
border-radius: 2px;            /* 圆角 */
cursor: not-allowed;           /* 禁止光标 */
user-select: none;             /* 不可选中 */
```

### 新增内容
```css
background: #1a4d1a;           /* 深绿色背景 */
padding: 0.1em 0.2em;          /* 小内边距 */
border-radius: 2px;            /* 圆角 */
cursor: text;                  /* 文本光标 */
/* 可编辑 */
```

### 操作按钮
```css
width: 20px;
height: 20px;
opacity: 0;                    /* 默认隐藏 */
transition: opacity 0.2s;

/* 悬停时显示 */
.inline-change:hover .inline-actions {
  opacity: 1;
}
```

## 🔄 实际应用场景

### 场景 1：代码审查
```javascript
原文: function calculate(items) {
修改: function calculate(items, discount = 0) {

内联显示:
function calculate(items, discount = 0)[✓][✗]) {
                    ↑绿底新增参数     ↑操作按钮
```

### 场景 2：文档修订
```markdown
原文: 这是一个重要的功能说明
修改: 这是一个非常重要的功能说明

内联显示:
这是一个[重要][非常重要][✓][✗]的功能说明
        ↑红删除线 ↑绿背景
```

### 场景 3：长文本对比
```
用户可以在一段连贯的文本中，清晰看到所有修改：

Lorem ipsum dolor sit amet, [consectetur][adipiscing] elit. 
Sed do eiusmod [tempor][magna] incididunt ut labore et dolore 
magna aliqua.

而不是被分成多个独立的块，打断阅读流程。
```

## 💡 交互细节

### 悬停效果
```
默认状态: 变更显示，按钮隐藏
    ↓
鼠标悬停: 按钮淡入显示
    ↓
鼠标移开: 按钮淡出隐藏
```

### 点击反馈
```
点击 ✓ 接受:
  - 按钮变绿色填充
  - 整体变更变半透明
  - 表示已处理

点击 ✗ 拒绝:
  - 按钮变红色填充
  - 整体变更变淡
  - 表示已拒绝
```

### 编辑体验
```
新增内容（绿色背景）:
  - 可以直接点击编辑
  - 聚焦时显示青绿色outline
  - 失焦自动保存

删除内容（红色背景）:
  - 不可编辑
  - 光标变为禁止图标
  - 无法选中文本
```

## 🎯 优势总结

### 空间效率
- **之前**: 每个变更占用多行，包括标题、内容、按钮
- **现在**: 变更直接嵌入文本，按钮悬浮显示

### 阅读体验
- **之前**: 需要上下滚动，来回对照
- **现在**: 一行内看到对比，连贯阅读

### 认知负担
- **之前**: 独立的块，需要理解结构
- **现在**: 类似熟悉的文档修订，直观理解

### 操作效率
- **之前**: 大按钮，占用空间
- **现在**: 小按钮悬浮，需要时显示

## 🔧 技术实现

### HTML 结构
```html
<span class="inline-change">
  <span class="inline-deletion">
    <span class="deletion-text">旧文本</span>
  </span>
  <span class="inline-addition">
    <span class="addition-text" contenteditable>新文本</span>
  </span>
  <span class="inline-actions">
    <button class="inline-btn accept">✓</button>
    <button class="inline-btn reject">✗</button>
  </span>
</span>
```

### 关键 CSS
```css
.inline-change {
  display: inline;  /* 内联显示，融入文本流 */
}

.deletion-text,
.addition-text {
  display: inline;  /* 保持内联 */
  padding: 0.1em 0.2em;  /* 小内边距 */
}

.inline-actions {
  display: inline-flex;
  opacity: 0;  /* 默认隐藏 */
  vertical-align: middle;  /* 垂直居中对齐 */
}
```

## 🎨 动画效果

### 按钮显隐
```css
transition: opacity 0.2s;

/* 平滑淡入淡出 */
```

### 按钮缩放
```css
:hover {
  transform: scale(1.1);
}

/* 悬停时轻微放大 */
```

### 状态变化
```css
.accepted {
  opacity: 0.8;
}

.rejected {
  opacity: 0.4;
}

/* 已处理的变更降低不透明度 */
```

## 📝 使用建议

### 最佳实践
1. **先阅读全文**：从头到尾阅读，了解所有变更
2. **逐个处理**：按顺序接受或拒绝变更
3. **保持流畅**：利用悬浮按钮快速操作
4. **实时编辑**：发现需要调整的地方直接编辑

### 适用场景
- ✅ 文档修订审查
- ✅ 代码变更审查
- ✅ 文案优化对比
- ✅ 翻译修改审查
- ✅ 任何需要保持文本连贯性的场景

### 不适用场景
- ❌ 大规模代码重构（结构变化太大）
- ❌ 多文件对比（单文件更合适）
- ❌ 二进制文件对比

## 🚀 未来增强

可能的改进方向：
- [ ] 键盘快捷键（J/K 导航，Y/N 接受/拒绝）
- [ ] 批量选择（Shift + 点击）
- [ ] 颜色主题自定义
- [ ] 变更统计浮窗
- [ ] 导出修订记录

---

**总结**：内联 Diff 模式让文本对比变得自然流畅，就像在阅读一份带有修订标记的文档，而不是在查看代码diff工具。✨

