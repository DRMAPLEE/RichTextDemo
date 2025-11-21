# Vue 3 富文本编辑器项目文档

欢迎来到 Vue 3 富文本编辑器项目！这是一个功能强大的现代化富文本编辑解决方案。

## 项目简介

本项目基于 **Vue 3** 和 **ToastUI Editor** 构建，提供了完整的富文本编辑功能。项目采用了最新的前端技术栈，包括 Vite、Tailwind CSS 和 Pinia 状态管理。

### 主要特性

我们的编辑器提供了以下核心功能：

1. **所见即所得编辑**：实时预览编辑效果
2. **Markdown 支持**：完整的 Markdown 语法支持
3. **代码高亮**：支持多种编程语言的语法高亮
4. **表格编辑**：强大的表格创建和编辑功能
5. **图片上传**：支持拖拽上传和粘贴上传
6. **导出功能**：支持导出为 PDF、Word 等格式

## 技术架构

### 前端框架

项目使用 Vue 3 作为核心框架，采用 Composition API 编写组件。这使得代码更加模块化和可维护。

```javascript
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const editor = ref(null)

    onMounted(() => {
      // 初始化编辑器
      console.log('Editor initialized')
    })

    return { editor }
  },
}
```

### 编辑器集成

我们集成了 ToastUI Editor 作为核心编辑组件。ToastUI Editor 是一个功能强大且高度可定制的编辑器。

```typescript
import Editor from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css'

const editor = new Editor({
  el: document.querySelector('#editor'),
  height: '500px',
  initialEditType: 'markdown',
  previewStyle: 'vertical',
})
```

## 安装和使用

### 环境要求

- Node.js 20.19.0 或更高版本
- pnpm 包管理器

### 安装步骤

1. 克隆项目仓库
2. 安装依赖包
3. 启动开发服务器

```bash
# 克隆仓库
git clone https://github.com/your-repo/richtext.git

# 进入项目目录
cd richtext

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 功能详解

### 文本格式化

编辑器支持丰富的文本格式化选项，包括：

- **粗体文本**：使用 `**文本**` 或 Ctrl+B
- _斜体文本_：使用 `*文本*` 或 Ctrl+I
- ~~删除线~~：使用 `~~文本~~`
- `行内代码`：使用反引号

### 列表和引用

支持多种列表类型：

#### 无序列表

- 项目一
- 项目二
  - 子项目 2.1
  - 子项目 2.2
- 项目三

#### 有序列表

1. 第一步
2. 第二步
3. 第三步

#### 引用块

> 这是一段引用文本。引用块非常适合用来强调重要的信息或引用他人的话语。
>
> 可以包含多个段落。

### 表格功能

编辑器提供了强大的表格支持：

| 功能       | 描述                 | 状态      |
| ---------- | -------------------- | --------- |
| 创建表格   | 快速创建和格式化表格 | ✅ 完成   |
| 合并单元格 | 支持单元格合并操作   | ✅ 完成   |
| 样式设置   | 自定义表格样式       | ✅ 完成   |
| 导出表格   | 导出为多种格式       | 🚧 进行中 |

### 代码块

支持多种编程语言的语法高亮：

```python
def calculate_sum(numbers):
    """计算数字列表的总和"""
    total = 0
    for num in numbers:
        total += num
    return total

# 使用示例
numbers = [1, 2, 3, 4, 5]
result = calculate_sum(numbers)
print(f"总和: {result}")
```

```css
/* 样式示例 */
.markdown-content {
  font-size: 16px;
  line-height: 1.8;
  color: #2d3748;
}

.highlight-text {
  background: linear-gradient(120deg, #fef08a 0%, #fde047 100%);
  padding: 2px 4px;
  border-radius: 3px;
}
```

## 配置说明

### Vite 配置

项目使用 Vite 作为构建工具，配置文件位于 `vite.config.js`：

```javascript
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
```

### Tailwind CSS 配置

样式系统基于 Tailwind CSS v4，提供了现代化的设计系统。

## 高级功能

### 插件系统

编辑器支持插件扩展，可以轻松添加新功能：

- 代码语法高亮插件
- 颜色选择器插件
- 图表生成插件
- 自定义工具栏插件

### 自定义主题

支持自定义编辑器主题，可以根据项目需求调整外观：

1. 创建主题配置文件
2. 定义颜色方案
3. 应用到编辑器实例

## 最佳实践

### 性能优化

为了获得最佳性能，建议：

1. 使用路由懒加载
2. 合理使用组件缓存
3. 优化图片资源
4. 启用代码分割

### 安全考虑

在处理用户输入时，注意：

- 对 HTML 内容进行清理
- 防止 XSS 攻击
- 验证上传文件类型
- 限制文件大小

## 故障排除

### 常见问题

**问题 1**：编辑器无法初始化

解决方案：检查是否正确导入了 CSS 样式文件。

**问题 2**：代码高亮不工作

解决方案：确保已安装并导入了 Prism.js 相关语言包。

**问题 3**：图片上传失败

解决方案：检查后端 API 配置和文件大小限制。

## 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目仓库
2. 创建功能分支
3. 提交代码更改
4. 发起 Pull Request

## 更新日志

### v1.0.0 (2025-11-20)

- 🎉 初始版本发布
- ✨ 实现基础编辑功能
- ✨ 添加 Markdown 支持
- ✨ 集成代码高亮
- 🐛 修复若干已知问题

## 许可证

本项目采用 MIT 许可证。详见 LICENSE 文件。

## 联系方式

如有问题或建议，请通过以下方式联系：

- 邮箱：support@example.com
- GitHub Issues：[项目地址](https://github.com/your-repo/richtext)
- 文档网站：[在线文档](https://docs.example.com)

---

感谢使用我们的富文本编辑器！希望它能帮助您构建出色的内容编辑体验。
