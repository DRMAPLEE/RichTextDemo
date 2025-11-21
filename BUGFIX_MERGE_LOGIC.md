# Bug 修复：变更块合并逻辑

## 问题描述

用户报告了一个问题：连续的"删除"和"新增"操作被分成了两个独立的变更块，而不是合并为一个"修改"块。

### 问题示例

```
块 #2 (独立的删除块)
🔴 删除
for (let i = 0; i < items.length; i++
[接受此变更] [拒绝此变更]

块 #3 (独立的新增块)  
🟢 新增
// 使用现代化的遍历方法
for (const item of items
[接受此变更] [拒绝此变更]
```

**问题**：这应该是一个整体的修改块，只有一组操作按钮。

## 根本原因

### 原代码问题

```javascript
// ❌ 错误的实现
diffs.forEach(([operation, text]) => {
  if (operation === DiffMatchPatch.DIFF_DELETE) {
    // 问题1: indexOf 无法找到正确的索引（数组引用不同）
    const nextDiff = diffs[diffs.indexOf([operation, text]) + 1]
    
    if (nextDiff && nextDiff[0] === DiffMatchPatch.DIFF_INSERT) {
      // ... 处理修改块
      
      // 问题2: 在 forEach 中使用 splice 会导致跳过元素
      diffs.splice(diffs.indexOf([operation, text]) + 1, 1)
    }
  }
})
```

### 问题分析

1. **indexOf 失败**
   ```javascript
   const arr = [[1, 'a'], [2, 'b']]
   arr.indexOf([1, 'a'])  // -1 ❌ (因为是不同的对象引用)
   ```

2. **splice 在 forEach 中的问题**
   ```javascript
   [1, 2, 3, 4].forEach((item, i) => {
     if (item === 2) {
       arr.splice(i + 1, 1)  // 删除元素3
     }
   })
   // forEach 会跳过元素4，因为索引已经改变
   ```

3. **结果**：DELETE 后面的 INSERT 没有被正确识别和合并

## 解决方案

### 新代码实现

```javascript
// ✅ 正确的实现
for (let i = 0; i < diffs.length; i++) {
  const [operation, text] = diffs[i]
  
  if (operation === DiffMatchPatch.DIFF_DELETE) {
    // 解决方案1: 直接使用索引 i 访问下一个元素
    const nextDiff = diffs[i + 1]
    
    if (nextDiff && nextDiff[0] === DiffMatchPatch.DIFF_INSERT) {
      // 这是一个修改块（删除 + 插入）
      segments.push({
        type: 'change',
        oldText: text,
        newText: nextDiff[1],
        // ... 其他属性
      })
      
      // 解决方案2: 使用 i++ 跳过下一个 INSERT
      i++
    }
  }
}
```

### 关键改进

1. **使用 for 循环替代 forEach**
   - 可以直接访问和修改索引 i
   - 可以使用 `i++` 跳过已处理的元素

2. **直接使用索引访问**
   ```javascript
   const nextDiff = diffs[i + 1]  // ✅ 直接访问下一个元素
   ```

3. **正确跳过已处理的元素**
   ```javascript
   i++  // ✅ 跳过 INSERT，因为已经和 DELETE 合并处理了
   ```

## 修复效果

### 修复前
```
变更块 #2 (独立删除)
🔴 - 旧代码
[接受] [拒绝]

变更块 #3 (独立新增)
🟢 + 新代码
[接受] [拒绝]
```
❌ 两个独立的操作，用户需要分别处理

### 修复后
```
变更块 #2 (整体修改)
🔄 修改（删除旧内容 + 添加新内容作为整体操作）
🔴 - 旧代码
🟢 + 新代码
[接受此变更] [拒绝此变更]
```
✅ 一个整体操作，用户只需做一次决定

## 技术细节

### diff-match-patch 输出

```javascript
const diffs = dmp.diff_main(oldText, newText)
// 输出格式：
// [
//   [DIFF_EQUAL, "unchanged text"],
//   [DIFF_DELETE, "old code"],
//   [DIFF_INSERT, "new code"],  // 紧跟DELETE后面
//   [DIFF_EQUAL, "more unchanged"],
// ]
```

### 合并规则

- **DELETE + INSERT**（连续出现） → 合并为一个"修改"块
- **DELETE**（后面不是INSERT） → 独立的"删除"块
- **INSERT**（前面不是DELETE） → 独立的"新增"块

### 索引同步

确保三个地方使用相同的逻辑：
1. `calculateDiff()` - 生成 diffBlocks
2. `mergedSegments` - 生成显示用的 segments
3. `finalResult` - 计算最终结果

## 测试验证

### 测试用例1：连续的修改
```javascript
原文: for (let i = 0; i < n; i++)
新文: for (const item of items)
```
**期望**：一个修改块

### 测试用例2：独立删除
```javascript
原文: console.log("debug")
新文: (删除这行)
```
**期望**：一个删除块

### 测试用例3：独立新增
```javascript
原文: (空)
新文: // 新增注释
```
**期望**：一个新增块

### 测试用例4：多个连续修改
```javascript
原文: 
  let a = 1;
  let b = 2;
  
新文:
  const a = 1;
  const b = 2;
```
**期望**：两个独立的修改块（因为中间可能有 EQUAL）

## 影响范围

### 修改的函数
- ✅ `mergedSegments` computed - 显示逻辑
- ✅ `calculateDiff()` - diff 计算逻辑（已经是正确的）
- ✅ `finalResult` computed - 结果计算逻辑（已经是正确的）

### 用户体验改进
- ✅ 连续的删除+新增正确合并为一个操作
- ✅ 更符合用户的心智模型
- ✅ 减少需要处理的变更块数量
- ✅ 避免混淆和错误操作

## 总结

这次修复解决了变更块合并逻辑的核心问题，确保连续的 DELETE 和 INSERT 操作被正确识别为一个整体的"修改"操作，而不是两个独立的操作。

**关键点**：
- 🔧 使用 for 循环替代 forEach
- 🎯 直接使用索引访问元素
- ⏭️ 正确跳过已处理的元素
- 🔄 确保三个关键函数逻辑一致

---

修复日期：2025-11-21
问题类型：逻辑错误 / 数组操作问题
严重程度：高（影响核心功能）

