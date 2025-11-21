# 文本对比逻辑说明

## 核心原则

在文本对比中，**每个变更块是一个原子操作**，不能部分接受或部分拒绝。

## 变更块类型

### 1. 纯删除块
```
- 旧内容
```
- **接受** = 删除这段内容
- **拒绝** = 保留这段内容

### 2. 纯新增块
```
+ 新内容
```
- **接受** = 添加这段内容
- **拒绝** = 不添加这段内容

### 3. 修改块（删除 + 新增）⭐
```
- 旧内容
+ 新内容
```
**这是一个整体操作，不能拆分！**

- **接受** = 删除旧内容 **并且** 添加新内容（作为一个原子操作）
- **拒绝** = 保留旧内容 **并且** 不添加新内容

❌ **不允许**：
- 只删除不添加
- 只添加不删除
- 部分接受/拒绝

## 为什么不能拆分？

### 语义完整性
修改块表示的是"将 A 改为 B"这样一个完整的语义变更：

```javascript
// 示例：函数参数修改
- function calculate(a, b) {
+ function calculate(items, discount) {
```

如果允许拆分：
- 只删除：`function calculate() {` - 错误！参数丢失
- 只添加：`function calculate(a, b, items, discount) {` - 错误！参数混乱

### 逻辑一致性
diff 算法识别出的修改块是基于语义相似性的：

```javascript
// 旧版本
for (let i = 0; i < items.length; i++) {
  total += items[i].price;
}

// 新版本
for (const item of items) {
  total += item.price * item.quantity;
}
```

这是一个"循环方式的改变"，应该整体接受或拒绝，而不是混合使用。

## 实现细节

### 最终结果计算逻辑

```javascript
// 伪代码
for each diff in diffs:
  if diff is EQUAL:
    result += text
    
  else if diff is DELETE:
    next = peek next diff
    
    if next is INSERT:  // 这是一个修改块
      if accepted:
        result += next.text  // 添加新的
        // 不添加旧的（即删除）
      else:
        result += text  // 保留旧的
        // 不添加新的
      skip next INSERT
      
    else:  // 纯删除块
      if accepted:
        // 不添加到结果（即删除）
      else:
        result += text  // 保留
        
  else if diff is INSERT:  // 纯插入块
    if accepted:
      result += text  // 添加
    else:
      // 不添加
```

### UI 提示

为了让用户清楚理解这一点，我们提供了：

1. **视觉提示**：修改块顶部显示蓝色提示条
   ```
   🔄 修改（删除旧内容 + 添加新内容作为整体操作）
   ```

2. **鼠标悬停提示**：
   - 接受按钮：`接受此修改：删除旧内容并添加新内容`
   - 拒绝按钮：`拒绝此修改：保留旧内容`

3. **状态反馈**：
   - 接受后：整个块变为绿色，显示"✓ 已接受"
   - 拒绝后：整个块变灰，显示"✗ 已拒绝"

## 示例场景

### 场景 1：参数重命名
```javascript
- function getUserData(userId) {
+ function getUserData(id) {
```

✅ **接受**：函数签名变为 `function getUserData(id)`  
✅ **拒绝**：函数签名保持 `function getUserData(userId)`  
❌ **不可能**：混合两个参数名

### 场景 2：循环方式改变
```javascript
- for (let i = 0; i < arr.length; i++) {
+ for (const item of arr) {
```

✅ **接受**：使用现代的 for...of 循环  
✅ **拒绝**：保持传统的 for 循环  
❌ **不可能**：混合两种循环语法

### 场景 3：变量类型改变
```javascript
- let count = 0;
+ const count = 0;
```

✅ **接受**：使用 const  
✅ **拒绝**：保持 let  
❌ **不可能**：同时有 let 和 const

## 最佳实践

### 审查变更时
1. 完整阅读修改块的旧内容和新内容
2. 理解这个修改的完整意图
3. 决定整体接受或拒绝
4. 不要期望"只要一部分"

### 如果需要部分修改
如果你发现只想接受修改的一部分：

**方案 1：手动编辑**
1. 拒绝此修改
2. 在侧边栏手动编辑原始文本或新文本
3. 重新生成差异

**方案 2：分步接受**
1. 接受整个修改
2. 在最终结果中手动调整
3. 将调整后的结果作为新的原始文本

## 技术背景

这个设计基于 Google 的 diff-match-patch 算法，该算法：
- 识别语义相关的变更
- 将连续的删除和插入合并为修改块
- 优化差异表示的可读性

通过维护变更块的原子性，我们确保：
- ✅ 结果始终是有效的代码/文本
- ✅ 不会产生语法错误
- ✅ 语义清晰，易于理解
- ✅ 符合用户的心智模型

---

**记住**：修改块 = 删除 + 新增作为**一个不可分割的整体**！

