<template>
  <div class="diff-view-container">
    <!-- 头部工具栏 -->
    <div class="toolbar">
      <button @click="goBack" class="back-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            d="M19 12H5M12 19l-7-7 7-7"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        返回
      </button>

      <div class="toolbar-title">文本对比编辑器</div>

      <div class="toolbar-actions">
        <button
          v-if="allProcessed && hasChanges"
          @click="applyChangesAndContinue"
          class="action-btn apply-changes pulse"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M5 13l4 4L19 7"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          应用更改
        </button>
        <button @click="acceptAll" class="action-btn accept-all" :disabled="!hasChanges">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M20 6L9 17l-5-5"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          接受全部
        </button>
        <button @click="rejectAll" class="action-btn reject-all" :disabled="!hasChanges">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          拒绝全部
        </button>
        <button @click="resetDemo" class="action-btn reset">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path d="M3 21v-5h5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          重置示例
        </button>
        <button @click="copyResult" class="action-btn copy">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke-width="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke-width="2" />
          </svg>
          复制结果
        </button>
        <button
          @click="enableInlineEdit = !enableInlineEdit"
          class="action-btn toggle-edit"
          :class="{ active: enableInlineEdit }"
          :title="enableInlineEdit ? '禁用内联编辑' : '启用内联编辑'"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          {{ enableInlineEdit ? '✏️ 编辑中' : '🔒 只读' }}
        </button>
        <button
          @click="viewMode = viewMode === 'plain' ? 'markdown' : 'plain'"
          class="action-btn toggle-markdown"
          :class="{ active: isMarkdownMode }"
          :title="isMarkdownMode ? '切换到纯文本模式' : '切换到Markdown模式'"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M3 19V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2z"
              stroke-width="2"
            />
            <path d="M7 7v10M11 7v10M17 13l-3-3v6z" stroke-width="2" stroke-linecap="round" />
          </svg>
          {{ isMarkdownMode ? '📝 Markdown' : '📄 纯文本' }}
        </button>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="stats-bar" :class="{ 'all-processed': allProcessed && hasChanges }">
      <div class="stat-item">
        <span class="stat-label">变更块:</span>
        <span class="stat-value">{{ diffBlocks.length }}</span>
      </div>
      <div class="stat-item addition">
        <span class="stat-label">待处理:</span>
        <span class="stat-value">{{ pendingAcceptCount }}</span>
      </div>
      <div class="stat-item accepted">
        <span class="stat-label">已接受:</span>
        <span class="stat-value">{{ acceptedCount }}</span>
      </div>
      <div class="stat-item rejected">
        <span class="stat-label">已拒绝:</span>
        <span class="stat-value">{{ diffBlocks.length - acceptedCount }}</span>
      </div>
      <div v-if="allProcessed && hasChanges" class="completion-badge">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" stroke-width="2" />
          <path d="M9 12l2 2 4-4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>全部完成！点击"应用更改"按钮</span>
      </div>
    </div>

    <!-- 主编辑区 - 内联显示 -->
    <div class="main-content">
      <div class="inline-diff-editor">
        <div class="editor-header">
          <h3>文档对比视图（内联模式）</h3>
          <div class="header-info">
            <span class="info-badge" :class="{ 'markdown-mode': isMarkdownMode }">
              <span class="badge-icon">{{ isMarkdownMode ? '📝' : '📄' }}</span>
              {{ isMarkdownMode ? 'Markdown渲染模式' : '纯文本模式' }} - 在下方可以看到所有变更
            </span>
          </div>
        </div>

        <div class="diff-content" ref="diffContentRef">
          <!-- 完成状态提示 -->
          <div v-if="allProcessed && hasChanges" class="completion-overlay">
            <div class="completion-card">
              <div class="completion-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" stroke-width="2" />
                  <path
                    d="M9 12l2 2 4-4"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <h3>🎉 所有变更已处理完成！</h3>
              <p class="completion-message">
                你已经处理了全部 {{ diffBlocks.length }} 个变更块。
                <br />
                点击下方按钮应用最终结果并开始新一轮对比。
              </p>
              <div class="completion-stats">
                <div class="stat-box accepted">
                  <div class="stat-number">{{ acceptedCount }}</div>
                  <div class="stat-label">已接受</div>
                </div>
                <div class="stat-box rejected">
                  <div class="stat-number">{{ diffBlocks.length - acceptedCount }}</div>
                  <div class="stat-label">已拒绝</div>
                </div>
              </div>
              <button @click="applyChangesAndContinue" class="apply-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M5 13l4 4L19 7"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                应用更改并开始新一轮对比
              </button>
              <p class="completion-hint">
                💡 提示：应用后，最终结果将成为新的原始文本，你可以继续编辑和对比。
              </p>
            </div>
          </div>

          <template v-for="(segment, index) in mergedSegments" :key="index">
            <!-- 未变更的文本（可编辑） -->
            <div v-if="segment.type === 'equal'" class="text-segment equal editable-area">
              <pre
                v-if="!isMarkdownMode"
                :contenteditable="enableInlineEdit"
                @input="(e) => enableInlineEdit && onEditableChange(e, index)"
                @blur="() => enableInlineEdit && syncChangesToOriginal()"
                class="editable-content"
                :class="{ readonly: !enableInlineEdit }"
                spellcheck="false"
                >{{ segment.text }}</pre
              >
              <div
                v-else
                :contenteditable="enableInlineEdit"
                @input="(e) => enableInlineEdit && onEditableChange(e, index)"
                @blur="() => enableInlineEdit && syncChangesToOriginal()"
                class="editable-content markdown-content"
                :class="{ readonly: !enableInlineEdit }"
                v-html="renderMarkdown(segment.text)"
              ></div>
            </div>

            <!-- 变更块 - 内联显示 -->
            <span
              v-else
              class="inline-change"
              :class="{
                accepted: segment.accepted,
                rejected: segment.rejected,
                pending: !segment.accepted && !segment.rejected,
              }"
            >
              <!-- 删除的内容 -->
              <span v-if="segment.oldText" class="inline-deletion">
                <span v-if="!isMarkdownMode" class="deletion-text">{{ segment.oldText }}</span>
                <span
                  v-else
                  class="deletion-text markdown-content"
                  v-html="renderMarkdown(segment.oldText)"
                ></span>
              </span>
              <!-- 新增的内容 -->
              <span v-if="segment.newText" class="inline-addition editable-area">
                <span
                  v-if="!isMarkdownMode"
                  class="addition-text"
                  :contenteditable="enableInlineEdit"
                  @input="(e) => enableInlineEdit && onNewTextChange(e, segment.id)"
                  @blur="() => enableInlineEdit && syncChangesToNew()"
                  spellcheck="false"
                  >{{ segment.newText }}</span
                >
                <span
                  v-else
                  class="addition-text markdown-content"
                  :contenteditable="enableInlineEdit"
                  @input="(e) => enableInlineEdit && onNewTextChange(e, segment.id)"
                  @blur="() => enableInlineEdit && syncChangesToNew()"
                  v-html="renderMarkdown(segment.newText)"
                ></span>
              </span>
              <!-- 操作按钮 - 下方显示 -->
              <span class="inline-actions">
                <button
                  @click="acceptChange(segment.id)"
                  class="inline-btn accept"
                  :disabled="segment.accepted"
                  :class="{ active: segment.accepted }"
                  title="接受此变更"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span>{{ segment.accepted ? '已接受' : '接受' }}</span>
                </button>
                <button
                  @click="rejectChange(segment.id)"
                  class="inline-btn reject"
                  :disabled="segment.rejected"
                  :class="{ active: segment.rejected }"
                  title="拒绝此变更"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      d="M18 6L6 18M6 6l12 12"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span>{{ segment.rejected ? '已拒绝' : '拒绝' }}</span>
                </button>
              </span>
            </span>
          </template>
        </div>
      </div>

      <!-- 侧边栏：编辑区 -->
      <div class="sidebar-panel">
        <div class="panel-section">
          <div class="section-header">
            <h4>原始文本</h4>
            <div class="header-controls">
              <span class="editor-badge">✨ Markdown支持</span>
              <button @click="editOriginal = !editOriginal" class="toggle-btn">
                {{ editOriginal ? '🔓' : '🔒' }}
              </button>
            </div>
          </div>
          <div class="tiptap-wrapper">
            <editor-content :editor="originalTiptapEditor" class="tiptap-content" />
          </div>
        </div>

        <div class="panel-section">
          <div class="section-header">
            <h4>新文本</h4>
            <div class="header-controls">
              <span class="editor-badge">✨ Markdown支持</span>
              <button @click="editNew = !editNew" class="toggle-btn">
                {{ editNew ? '🔓' : '🔒' }}
              </button>
            </div>
          </div>
          <div class="tiptap-wrapper">
            <editor-content :editor="newTiptapEditor" class="tiptap-content" />
          </div>
        </div>

        <div class="panel-section result-section">
          <div class="section-header">
            <h4>最终结果</h4>
            <button @click="copyResult" class="copy-btn-small">复制</button>
          </div>
          <textarea
            :value="finalResult"
            readonly
            class="code-textarea result"
            placeholder="这里将显示应用更改后的结果..."
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import DiffMatchPatch from 'diff-match-patch'
import MarkdownIt from 'markdown-it'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'

const router = useRouter()
const dmp = new DiffMatchPatch()

// 初始化 Markdown 解析器
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
})

// 文本内容
const originalText = ref('')
const newText = ref('')

// Tiptap 编辑器实例（侧边栏）
const originalTiptapEditor = ref(null)
const newTiptapEditor = ref(null)

// 编辑状态
const editOriginal = ref(true)
const editNew = ref(true)
const enableInlineEdit = ref(true) // 是否启用内联编辑
const viewMode = ref('plain') // 视图模式：'plain' 或 'markdown'
const useTiptapSidebar = ref(true) // 是否在侧边栏使用 Tiptap

// 差异块（包含状态）
const diffBlocks = ref([])

// 示例文本（支持Markdown）
const demoOriginalText = `# 用户信息管理系统

这是一个简单的用户管理代码示例。

## 功能说明

该函数用于计算订单总价：

\`\`\`javascript
function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}
\`\`\`

## 用户数据结构

\`\`\`javascript
const user = {
  name: "张三",
  age: 25
};
\`\`\`

**注意**：当前版本不支持折扣功能。

## 日志输出

\`\`\`javascript
console.log("Hello World");
\`\`\`
`

const demoNewText = `# 用户信息管理系统

这是一个**改进版**的用户管理代码示例。

## 功能说明

该函数用于计算订单总价，现在支持折扣：

\`\`\`javascript
function calculateTotal(items, discount = 0) {
  let total = 0;
  // 使用现代化的遍历方法
  for (const item of items) {
    total += item.price * item.quantity;
  }
  // 应用折扣
  total = total * (1 - discount);
  return total;
}
\`\`\`

## 用户数据结构

\`\`\`javascript
const user = {
  name: "张三",
  age: 25,
  email: "zhangsan@example.com"
};
\`\`\`

**注意**：现在支持 *折扣功能* 和 *数量计算*。

## 日志输出

\`\`\`javascript
console.log("你好，世界！");
\`\`\`

### 更新日志
- ✅ 添加折扣参数
- ✅ 支持数量计算
- ✅ 使用现代化语法
`

// 统计信息
const pendingAcceptCount = computed(() => {
  return diffBlocks.value.filter((b) => !b.accepted && !b.rejected).length
})

const pendingRejectCount = computed(() => {
  return diffBlocks.value.filter((b) => !b.accepted && !b.rejected).length
})

const acceptedCount = computed(() => {
  return diffBlocks.value.filter((b) => b.accepted).length
})

// 检查是否所有变更都已处理
const allProcessed = computed(() => {
  if (diffBlocks.value.length === 0) return false
  return diffBlocks.value.every((b) => b.accepted || b.rejected)
})

// 检查是否有任何变更
const hasChanges = computed(() => {
  return diffBlocks.value.length > 0
})

// 渲染markdown
const renderMarkdown = (text) => {
  if (viewMode.value === 'markdown') {
    return md.render(text)
  }
  return text
}

// 是否为markdown模式
const isMarkdownMode = computed(() => viewMode.value === 'markdown')

// 合并的片段（用于渲染）
const mergedSegments = computed(() => {
  const segments = []
  let diffBlockIndex = 0

  const diffs = dmp.diff_main(originalText.value, newText.value)
  dmp.diff_cleanupSemantic(diffs)

  // 使用 for 循环以便正确处理索引和跳过
  for (let i = 0; i < diffs.length; i++) {
    const [operation, text] = diffs[i]

    if (operation === DiffMatchPatch.DIFF_EQUAL) {
      // 相同的文本
      segments.push({
        type: 'equal',
        text: text,
      })
    } else if (operation === DiffMatchPatch.DIFF_DELETE) {
      // 查找是否有对应的 INSERT
      const nextDiff = diffs[i + 1]
      if (nextDiff && nextDiff[0] === DiffMatchPatch.DIFF_INSERT) {
        // 这是一个修改（删除+插入）
        const block = diffBlocks.value[diffBlockIndex]
        segments.push({
          type: 'change',
          id: block?.id || `change-${diffBlockIndex}`,
          oldText: text,
          newText: nextDiff[1],
          accepted: block?.accepted || false,
          rejected: block?.rejected || false,
          displayIndex: diffBlockIndex + 1,
        })
        diffBlockIndex++
        i++ // 跳过下一个 INSERT，因为已经处理了
      } else {
        // 纯删除
        const block = diffBlocks.value[diffBlockIndex]
        segments.push({
          type: 'change',
          id: block?.id || `change-${diffBlockIndex}`,
          oldText: text,
          newText: '',
          accepted: block?.accepted || false,
          rejected: block?.rejected || false,
          displayIndex: diffBlockIndex + 1,
        })
        diffBlockIndex++
      }
    } else if (operation === DiffMatchPatch.DIFF_INSERT) {
      // 纯插入
      const block = diffBlocks.value[diffBlockIndex]
      segments.push({
        type: 'change',
        id: block?.id || `change-${diffBlockIndex}`,
        oldText: '',
        newText: text,
        accepted: block?.accepted || false,
        rejected: block?.rejected || false,
        displayIndex: diffBlockIndex + 1,
      })
      diffBlockIndex++
    }
  }

  return segments
})

// 计算最终结果
const finalResult = computed(() => {
  // 从原始文本开始
  let result = ''
  const diffs = dmp.diff_main(originalText.value, newText.value)
  dmp.diff_cleanupSemantic(diffs)

  let blockIndex = 0

  for (let i = 0; i < diffs.length; i++) {
    const [operation, text] = diffs[i]

    if (operation === DiffMatchPatch.DIFF_EQUAL) {
      // 未变更的文本直接添加
      result += text
    } else if (operation === DiffMatchPatch.DIFF_DELETE) {
      const nextDiff = diffs[i + 1]
      const block = diffBlocks.value[blockIndex]

      // 检查是否是修改块（DELETE + INSERT）
      if (nextDiff && nextDiff[0] === DiffMatchPatch.DIFF_INSERT) {
        // 这是一个修改块
        if (block && block.accepted && !block.rejected) {
          // 接受修改：删除旧的，添加新的
          result += nextDiff[1]
        } else {
          // 拒绝修改或未处理：保留旧的，不添加新的
          result += text
        }
        i++ // 跳过下一个 INSERT
        blockIndex++
      } else {
        // 纯删除块
        if (block && block.accepted && !block.rejected) {
          // 接受删除：不添加到结果中
        } else {
          // 拒绝删除或未处理：保留原文
          result += text
        }
        blockIndex++
      }
    } else if (operation === DiffMatchPatch.DIFF_INSERT) {
      // 纯插入块
      const block = diffBlocks.value[blockIndex]
      if (block && block.accepted && !block.rejected) {
        // 接受插入：添加新文本
        result += text
      }
      // 拒绝插入或未处理：不添加
      blockIndex++
    }
  }

  return result
})

// 初始化
onMounted(() => {
  originalText.value = demoOriginalText
  newText.value = demoNewText

  // 初始化 Tiptap 编辑器
  originalTiptapEditor.value = new Editor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Highlight,
    ],
    content: demoOriginalText,
    editable: editOriginal.value,
    onUpdate: ({ editor }) => {
      originalText.value = editor.getText()
      onTextChange()
    },
    editorProps: {
      attributes: {
        class: 'tiptap-editor',
        spellcheck: 'false',
      },
    },
  })

  newTiptapEditor.value = new Editor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Highlight,
    ],
    content: demoNewText,
    editable: editNew.value,
    onUpdate: ({ editor }) => {
      newText.value = editor.getText()
      onTextChange()
    },
    editorProps: {
      attributes: {
        class: 'tiptap-editor',
        spellcheck: 'false',
      },
    },
  })

  calculateDiff()
})

// 清理
onBeforeUnmount(() => {
  if (originalTiptapEditor.value) {
    originalTiptapEditor.value.destroy()
  }
  if (newTiptapEditor.value) {
    newTiptapEditor.value.destroy()
  }
})

// 存储可编辑段的变化
const editableSegments = ref(new Map())
const editableNewTexts = ref(new Map())

// 监听可编辑段的变化（未变更的文本）
const onEditableChange = (event, segmentIndex) => {
  // 在markdown模式下，需要从HTML中提取文本内容
  const newText = event.target.innerText || event.target.textContent
  editableSegments.value.set(segmentIndex, newText)
}

// 监听新增文本的变化
const onNewTextChange = (event, segmentId) => {
  const newText = event.target.innerText || event.target.textContent
  editableNewTexts.value.set(segmentId, newText)
}

// 同步可编辑段的变化到原始文本
const syncChangesToOriginal = () => {
  if (editableSegments.value.size === 0) return

  // 重建文本
  let newOriginalText = ''
  let segmentIdx = 0

  const diffs = dmp.diff_main(originalText.value, newText.value)
  dmp.diff_cleanupSemantic(diffs)

  for (let i = 0; i < diffs.length; i++) {
    const [operation, text] = diffs[i]

    if (operation === DiffMatchPatch.DIFF_EQUAL) {
      // 检查是否有编辑
      if (editableSegments.value.has(segmentIdx)) {
        newOriginalText += editableSegments.value.get(segmentIdx)
      } else {
        newOriginalText += text
      }
      segmentIdx++
    } else if (operation === DiffMatchPatch.DIFF_DELETE) {
      newOriginalText += text
      const nextDiff = diffs[i + 1]
      if (nextDiff && nextDiff[0] === DiffMatchPatch.DIFF_INSERT) {
        i++ // 跳过 INSERT
      }
    }
    // INSERT 不添加到原始文本
  }

  // 更新原始文本
  originalText.value = newOriginalText
  // 更新 Tiptap 编辑器
  if (originalTiptapEditor.value) {
    originalTiptapEditor.value.commands.setContent(newOriginalText)
  }
  // 清空编辑缓存
  editableSegments.value.clear()
  // 重新计算差异
  calculateDiff()
}

// 同步新增文本的变化到新文本
const syncChangesToNew = () => {
  if (editableNewTexts.value.size === 0) return

  // 重建新文本
  let rebuiltNewText = ''
  let blockIndex = 0

  const diffs = dmp.diff_main(originalText.value, newText.value)
  dmp.diff_cleanupSemantic(diffs)

  for (let i = 0; i < diffs.length; i++) {
    const [operation, text] = diffs[i]

    if (operation === DiffMatchPatch.DIFF_EQUAL) {
      rebuiltNewText += text
    } else if (operation === DiffMatchPatch.DIFF_DELETE) {
      const nextDiff = diffs[i + 1]
      if (nextDiff && nextDiff[0] === DiffMatchPatch.DIFF_INSERT) {
        // 修改块
        const block = diffBlocks.value[blockIndex]
        if (block && editableNewTexts.value.has(block.id)) {
          rebuiltNewText += editableNewTexts.value.get(block.id)
        } else {
          rebuiltNewText += nextDiff[1]
        }
        i++ // 跳过 INSERT
        blockIndex++
      } else {
        // 纯删除块，不添加到新文本
        blockIndex++
      }
    } else if (operation === DiffMatchPatch.DIFF_INSERT) {
      // 纯插入块
      const block = diffBlocks.value[blockIndex]
      if (block && editableNewTexts.value.has(block.id)) {
        rebuiltNewText += editableNewTexts.value.get(block.id)
      } else {
        rebuiltNewText += text
      }
      blockIndex++
    }
  }

  // 更新新文本
  newText.value = rebuiltNewText
  // 更新 Tiptap 编辑器
  if (newTiptapEditor.value) {
    newTiptapEditor.value.commands.setContent(rebuiltNewText)
  }
  // 清空编辑缓存
  editableNewTexts.value.clear()
  // 重新计算差异
  calculateDiff()
}

// 监听编辑状态变化
watch(editOriginal, (value) => {
  if (originalTiptapEditor.value) {
    originalTiptapEditor.value.setEditable(value)
  }
})

watch(editNew, (value) => {
  if (newTiptapEditor.value) {
    newTiptapEditor.value.setEditable(value)
  }
})

// 监听文本变化
const onTextChange = () => {
  calculateDiff()
}

// 计算差异
const calculateDiff = () => {
  const diffs = dmp.diff_main(originalText.value, newText.value)
  dmp.diff_cleanupSemantic(diffs)

  const blocks = []
  let blockId = 0

  for (let i = 0; i < diffs.length; i++) {
    const [operation, text] = diffs[i]

    if (operation === DiffMatchPatch.DIFF_DELETE) {
      // 查找对应的旧块以保留状态
      const oldBlock = diffBlocks.value[blockId]
      const nextDiff = diffs[i + 1]

      if (nextDiff && nextDiff[0] === DiffMatchPatch.DIFF_INSERT) {
        // 修改（删除+插入）
        blocks.push({
          id: `change-${blockId}`,
          type: 'modify',
          oldText: text,
          newText: nextDiff[1],
          accepted: oldBlock?.accepted || false,
          rejected: oldBlock?.rejected || false,
        })
        i++ // 跳过下一个 INSERT
      } else {
        // 纯删除
        blocks.push({
          id: `change-${blockId}`,
          type: 'delete',
          oldText: text,
          newText: '',
          accepted: oldBlock?.accepted || false,
          rejected: oldBlock?.rejected || false,
        })
      }
      blockId++
    } else if (operation === DiffMatchPatch.DIFF_INSERT) {
      // 纯插入
      const oldBlock = diffBlocks.value[blockId]
      blocks.push({
        id: `change-${blockId}`,
        type: 'insert',
        oldText: '',
        newText: text,
        accepted: oldBlock?.accepted || false,
        rejected: oldBlock?.rejected || false,
      })
      blockId++
    }
  }

  diffBlocks.value = blocks
}

// 接受单个更改
const acceptChange = (id) => {
  const block = diffBlocks.value.find((b) => b.id === id)
  if (block) {
    block.accepted = true
    block.rejected = false
  }
}

// 拒绝单个更改
const rejectChange = (id) => {
  const block = diffBlocks.value.find((b) => b.id === id)
  if (block) {
    block.rejected = true
    block.accepted = false
  }
}

// 接受全部
const acceptAll = () => {
  diffBlocks.value.forEach((block) => {
    block.accepted = true
    block.rejected = false
  })
}

// 拒绝全部
const rejectAll = () => {
  diffBlocks.value.forEach((block) => {
    block.rejected = true
    block.accepted = false
  })
}

// 重置示例
const resetDemo = () => {
  originalText.value = demoOriginalText
  newText.value = demoNewText

  // 更新 Tiptap 编辑器内容
  if (originalTiptapEditor.value) {
    originalTiptapEditor.value.commands.setContent(demoOriginalText)
  }
  if (newTiptapEditor.value) {
    newTiptapEditor.value.commands.setContent(demoNewText)
  }

  calculateDiff()

  // 重置所有状态
  diffBlocks.value.forEach((block) => {
    block.accepted = false
    block.rejected = false
  })
}

// 复制结果
const copyResult = async () => {
  try {
    await navigator.clipboard.writeText(finalResult.value)
    alert('已复制到剪贴板！')
  } catch (err) {
    console.error('复制失败:', err)
    alert('复制失败，请手动复制')
  }
}

// 应用最终结果并开始新一轮对比
const applyChangesAndContinue = () => {
  // 将最终结果设为新的原始文本和新文本
  const result = finalResult.value
  originalText.value = result
  newText.value = result

  // 更新 Tiptap 编辑器内容
  if (originalTiptapEditor.value) {
    originalTiptapEditor.value.commands.setContent(result)
  }
  if (newTiptapEditor.value) {
    newTiptapEditor.value.commands.setContent(result)
  }

  // 清空所有变更块
  diffBlocks.value = []

  // 滚动到顶部
  const diffContent = document.querySelector('.diff-content')
  if (diffContent) {
    diffContent.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// 返回
const goBack = () => {
  router.back()
}
</script>

<style scoped>
.diff-view-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background: #1e1e1e;
  color: #d4d4d4;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow: hidden;
}

/* 工具栏 */
.toolbar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1.5rem;
  background: #252526;
  border-bottom: 1px solid #3e3e42;
  flex-shrink: 0;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid #3e3e42;
  border-radius: 4px;
  color: #d4d4d4;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #2d2d30;
  border-color: #007acc;
}

.toolbar-title {
  font-size: 1.1rem;
  font-weight: 600;
  flex: 1;
}

.toolbar-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.accept-all {
  background: #0e6e0e;
  color: white;
}

.accept-all:hover {
  background: #0a550a;
}

.reject-all {
  background: #a1260d;
  color: white;
}

.reject-all:hover {
  background: #7d1d0a;
}

.reset {
  background: #3e3e42;
  color: #d4d4d4;
}

.reset:hover {
  background: #505050;
}

.copy {
  background: #0e639c;
  color: white;
}

.copy:hover {
  background: #1177bb;
}

.toggle-edit {
  background: #3e3e42;
  color: #d4d4d4;
  border: 2px solid transparent;
}

.toggle-edit:hover {
  background: #505050;
}

.toggle-edit.active {
  background: #4ec9b015;
  color: #4ec9b0;
  border-color: #4ec9b0;
}

.toggle-markdown {
  background: #3e3e42;
  color: #d4d4d4;
  border: 2px solid transparent;
}

.toggle-markdown:hover {
  background: #505050;
}

.toggle-markdown.active {
  background: #9cdcfe15;
  color: #9cdcfe;
  border-color: #9cdcfe;
}

.apply-changes {
  background: linear-gradient(135deg, #0e6e0e 0%, #0a550a 100%);
  color: white;
  border: 2px solid #4ec9b0;
}

.apply-changes:hover {
  background: linear-gradient(135deg, #0a550a 0%, #0e6e0e 100%);
  box-shadow: 0 0 20px rgba(78, 201, 176, 0.4);
}

.action-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pulse {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(78, 201, 176, 0.7);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(78, 201, 176, 0);
  }
}

/* 统计栏 */
.stats-bar {
  display: flex;
  gap: 2rem;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: #252526;
  border-bottom: 1px solid #3e3e42;
  flex-shrink: 0;
  transition: all 0.3s;
}

.stats-bar.all-processed {
  background: linear-gradient(90deg, #252526 0%, #0e6e0e15 100%);
  border-bottom-color: #4ec9b0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-label {
  color: #858585;
  font-size: 0.9rem;
}

.stat-value {
  font-weight: 600;
  font-size: 1rem;
}

.stat-item.addition .stat-value {
  color: #4ec9b0;
}

.stat-item.deletion .stat-value {
  color: #f48771;
}

.stat-item.accepted .stat-value {
  color: #4ec9b0;
}

.stat-item.rejected .stat-value {
  color: #858585;
}

.completion-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
  padding: 0.5rem 1rem;
  background: #0e6e0e;
  border-radius: 6px;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  animation: slideInRight 0.4s ease-out;
}

.completion-badge svg {
  flex-shrink: 0;
  stroke: #4ec9b0;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 主内容区 */
.main-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 0;
  flex: 1;
  overflow: hidden;
}

/* 内联编辑器 */
.inline-diff-editor {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #1e1e1e;
  border-right: 1px solid #3e3e42;
}

.editor-header {
  padding: 1rem 1.5rem;
  background: #2d2d30;
  border-bottom: 1px solid #3e3e42;
}

.editor-header h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #cccccc;
}

.header-info {
  display: flex;
  gap: 1rem;
}

.info-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.75rem;
  background: #264f78;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #9cdcfe;
}

.badge-icon {
  font-size: 1rem;
}

/* 差异内容 */
.diff-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  position: relative;
}

/* 完成状态覆盖层 */
.completion-overlay {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #0e6e0e20 0%, #0e639c20 100%);
  border-radius: 12px;
  border: 2px solid #0e6e0e;
  backdrop-filter: blur(10px);
  animation: slideIn 0.4s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.completion-card {
  text-align: center;
  max-width: 500px;
}

.completion-icon {
  display: inline-flex;
  margin-bottom: 1.5rem;
  color: #4ec9b0;
  animation: scaleIn 0.5s ease-out 0.2s both;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.completion-card h3 {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  color: #4ec9b0;
  font-weight: 600;
}

.completion-message {
  margin: 0 0 1.5rem 0;
  color: #cccccc;
  line-height: 1.6;
  font-family: 'Segoe UI', sans-serif;
}

.completion-stats {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.stat-box {
  flex: 1;
  max-width: 120px;
  padding: 1rem;
  background: #2d2d30;
  border-radius: 8px;
  border: 2px solid #3e3e42;
}

.stat-box.accepted {
  border-color: #0e6e0e;
  background: #0e6e0e15;
}

.stat-box.rejected {
  border-color: #666;
  background: #33333320;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.stat-box.accepted .stat-number {
  color: #4ec9b0;
}

.stat-box.rejected .stat-number {
  color: #858585;
}

.stat-label {
  font-size: 0.85rem;
  color: #858585;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.apply-button {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #0e6e0e 0%, #0a550a 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(14, 110, 14, 0.3);
  font-family: 'Segoe UI', sans-serif;
}

.apply-button:hover {
  background: linear-gradient(135deg, #0a550a 0%, #0e6e0e 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(14, 110, 14, 0.4);
}

.apply-button:active {
  transform: translateY(0);
}

.completion-hint {
  margin: 1rem 0 0 0;
  font-size: 0.85rem;
  color: #858585;
  font-family: 'Segoe UI', sans-serif;
}

.text-segment {
  margin: 0;
}

.text-segment pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  color: #d4d4d4;
}

/* 可编辑区域 */
.editable-area {
  position: relative;
}

.editable-area:hover {
  background: #ffffff03;
}

.editable-content {
  padding: 0.5rem 1rem;
  outline: none;
  cursor: text;
  transition: all 0.2s;
  min-height: 1.5em;
}

.editable-content:focus {
  outline: 2px solid #4ec9b040;
  outline-offset: 2px;
  border-radius: 2px;
}

.editable-content::selection {
  background: #4ec9b040;
}

.editable-content.readonly {
  cursor: default;
  opacity: 0.9;
}

/* 新增区域的可编辑内容 */
.addition .editable-content {
  cursor: text;
}

.addition .editable-content:focus {
  outline-color: #4ec9b080;
}

/* Markdown 内容样式 */
.markdown-content {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
}

.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6) {
  margin: 1em 0 0.5em 0;
  font-weight: 600;
  line-height: 1.3;
  color: #cccccc;
}

.markdown-content :deep(h1) {
  font-size: 2em;
  border-bottom: 2px solid #3e3e42;
  padding-bottom: 0.3em;
}

.markdown-content :deep(h2) {
  font-size: 1.5em;
  border-bottom: 1px solid #3e3e42;
  padding-bottom: 0.3em;
}

.markdown-content :deep(h3) {
  font-size: 1.25em;
}

.markdown-content :deep(p) {
  margin: 0.5em 0;
}

.markdown-content :deep(code) {
  background: #2d2d30;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.9em;
  color: #4ec9b0;
}

.markdown-content :deep(pre) {
  background: #2d2d30;
  padding: 1em;
  border-radius: 6px;
  overflow-x: auto;
  margin: 1em 0;
}

.markdown-content :deep(pre code) {
  background: transparent;
  padding: 0;
  color: #d4d4d4;
}

.markdown-content :deep(blockquote) {
  border-left: 4px solid #4ec9b0;
  margin: 1em 0;
  padding-left: 1em;
  color: #858585;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin: 0.5em 0;
  padding-left: 2em;
}

.markdown-content :deep(li) {
  margin: 0.25em 0;
}

.markdown-content :deep(a) {
  color: #4ec9b0;
  text-decoration: none;
}

.markdown-content :deep(a:hover) {
  text-decoration: underline;
}

.markdown-content :deep(strong) {
  font-weight: 600;
  color: #cccccc;
}

.markdown-content :deep(em) {
  font-style: italic;
  color: #9cdcfe;
}

.markdown-content :deep(hr) {
  border: none;
  border-top: 1px solid #3e3e42;
  margin: 2em 0;
}

.markdown-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  border: 1px solid #3e3e42;
  padding: 0.5em;
  text-align: left;
}

.markdown-content :deep(th) {
  background: #2d2d30;
  font-weight: 600;
}

.markdown-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin: 1em 0;
}

.info-badge.markdown-mode {
  background: #9cdcfe15;
  color: #9cdcfe;
}

/* Tiptap 编辑器样式 */
.tiptap-wrapper {
  flex: 1;
  overflow-y: auto;
  background: #1e1e1e;
}

.tiptap-content {
  height: 100%;
}

.tiptap-content :deep(.tiptap-editor) {
  padding: 1rem;
  min-height: 100%;
  outline: none;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #d4d4d4;
}

.tiptap-content :deep(.tiptap-editor p) {
  margin: 0.5em 0;
}

.tiptap-content :deep(.tiptap-editor h1),
.tiptap-content :deep(.tiptap-editor h2),
.tiptap-content :deep(.tiptap-editor h3),
.tiptap-content :deep(.tiptap-editor h4),
.tiptap-content :deep(.tiptap-editor h5),
.tiptap-content :deep(.tiptap-editor h6) {
  margin: 1.5em 0 0.5em 0;
  font-weight: 600;
  line-height: 1.3;
  color: #cccccc;
}

.tiptap-content :deep(.tiptap-editor h1) {
  font-size: 2em;
  border-bottom: 2px solid #3e3e42;
  padding-bottom: 0.3em;
}

.tiptap-content :deep(.tiptap-editor h2) {
  font-size: 1.5em;
  border-bottom: 1px solid #3e3e42;
  padding-bottom: 0.3em;
}

.tiptap-content :deep(.tiptap-editor h3) {
  font-size: 1.25em;
}

.tiptap-content :deep(.tiptap-editor h4) {
  font-size: 1.1em;
}

.tiptap-content :deep(.tiptap-editor code) {
  background: #2d2d30;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.9em;
  color: #4ec9b0;
}

.tiptap-content :deep(.tiptap-editor pre) {
  background: #2d2d30;
  padding: 1em;
  border-radius: 6px;
  overflow-x: auto;
  margin: 1em 0;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}

.tiptap-content :deep(.tiptap-editor pre code) {
  background: transparent;
  padding: 0;
  color: #d4d4d4;
}

.tiptap-content :deep(.tiptap-editor blockquote) {
  border-left: 4px solid #4ec9b0;
  margin: 1em 0;
  padding-left: 1em;
  color: #858585;
}

.tiptap-content :deep(.tiptap-editor ul),
.tiptap-content :deep(.tiptap-editor ol) {
  margin: 0.5em 0;
  padding-left: 2em;
}

.tiptap-content :deep(.tiptap-editor li) {
  margin: 0.25em 0;
}

.tiptap-content :deep(.tiptap-editor a) {
  color: #4ec9b0;
  text-decoration: none;
}

.tiptap-content :deep(.tiptap-editor a:hover) {
  text-decoration: underline;
}

.tiptap-content :deep(.tiptap-editor strong) {
  font-weight: 600;
  color: #cccccc;
}

.tiptap-content :deep(.tiptap-editor em) {
  font-style: italic;
  color: #9cdcfe;
}

.tiptap-content :deep(.tiptap-editor hr) {
  border: none;
  border-top: 1px solid #3e3e42;
  margin: 2em 0;
}

/* Markdown 快捷输入提示 */
.tiptap-content :deep(.tiptap-editor)::before {
  content: '💡 支持Markdown快捷输入：# 标题，**粗体**，*斜体*，- 列表，> 引用，```代码块';
  display: block;
  padding: 0.5rem;
  background: #264f78;
  color: #9cdcfe;
  font-size: 0.8rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-family: 'Segoe UI', sans-serif;
}

.tiptap-content :deep(.tiptap-editor:focus)::before {
  display: none;
}

/* 内联变更 */
.inline-change {
  display: inline-block;
  position: relative;
  transition: all 0.2s;
  vertical-align: baseline;
  margin: 0.25rem 0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background: #1e1e1e50;
}

.inline-change.accepted {
  opacity: 0.8;
  background: #0e6e0e15;
}

.inline-change.rejected {
  opacity: 0.4;
  background: #33333320;
}

/* 内联删除 */
.inline-deletion {
  display: inline;
}

.deletion-text {
  background: #5a1a1a;
  padding: 0.1em 0.2em;
  border-radius: 2px;
  text-decoration: line-through;
  text-decoration-color: #f48771;
  text-decoration-thickness: 2px;
  cursor: not-allowed;
  user-select: none;
}

/* 内联新增 */
.inline-addition {
  display: inline;
}

.addition-text {
  background: #1a4d1a;
  padding: 0.1em 0.2em;
  border-radius: 2px;
  cursor: text;
}

.addition-text:focus {
  outline: 2px solid #4ec9b080;
  outline-offset: 1px;
}

/* 内联操作按钮 */
.inline-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px solid #3e3e42;
  justify-content: flex-start;
  opacity: 0;
  transition: opacity 0.2s;
}

.inline-change:hover .inline-actions {
  opacity: 1;
}

/* 始终显示按钮（可选） */
.inline-actions {
  opacity: 1;
}

.inline-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border: 1px solid #3e3e42;
  border-radius: 4px;
  background: #2d2d30;
  color: #d4d4d4;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 90px;
}

.inline-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.inline-btn.accept {
  border-color: #4ec9b0;
  color: #4ec9b0;
}

.inline-btn.accept:hover:not(:disabled) {
  background: #0e6e0e;
  color: white;
  border-color: #0e6e0e;
}

.inline-btn.accept.active {
  background: #0e6e0e;
  color: white;
  border-color: #0e6e0e;
  opacity: 0.7;
}

.inline-btn.reject {
  border-color: #f48771;
  color: #f48771;
}

.inline-btn.reject:hover:not(:disabled) {
  background: #a1260d;
  color: white;
  border-color: #a1260d;
}

.inline-btn.reject.active {
  background: #a1260d;
  color: white;
  border-color: #a1260d;
  opacity: 0.7;
}

.inline-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.inline-btn svg {
  width: 14px;
  height: 14px;
}

/* 侧边栏 */
.sidebar-panel {
  display: flex;
  flex-direction: column;
  gap: 0;
  background: #252526;
  overflow-y: auto;
}

.panel-section {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #3e3e42;
  min-height: 200px;
}

.panel-section.result-section {
  flex: 1;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #2d2d30;
  border-bottom: 1px solid #3e3e42;
}

.section-header h4 {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #cccccc;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.editor-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: #4ec9b015;
  color: #4ec9b0;
  border-radius: 3px;
  font-weight: 500;
}

.toggle-btn {
  padding: 0.25rem 0.5rem;
  background: transparent;
  border: 1px solid #3e3e42;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.toggle-btn:hover {
  background: #3e3e42;
}

.copy-btn-small {
  padding: 0.25rem 0.75rem;
  background: #0e639c;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.copy-btn-small:hover {
  background: #1177bb;
}

.code-textarea {
  flex: 1;
  padding: 1rem;
  background: #1e1e1e;
  border: none;
  color: #d4d4d4;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  resize: none;
  outline: none;
}

.code-textarea:read-only {
  opacity: 0.7;
  cursor: not-allowed;
}

.code-textarea.result {
  background: #252526;
}

/* 滚动条 */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: #1e1e1e;
}

::-webkit-scrollbar-thumb {
  background: #424242;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #4e4e4e;
}
</style>
