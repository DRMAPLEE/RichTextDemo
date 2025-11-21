<template>
  <div class="markdown-view-page">
    <div class="header">
      <button @click="goBack" class="back-button">← 返回</button>
      <h1 class="document-title">{{ documentName }}</h1>
    </div>

    <div class="markdown-container">
      <div v-if="loading" class="loading-spinner">
        <div class="spinner"></div>
        <p>加载文档中...</p>
      </div>

      <div v-else-if="error" class="error-message">
        <div class="error-icon">⚠️</div>
        <h3>加载失败</h3>
        <p>{{ error }}</p>
      </div>

      <div v-else ref="contentRef" class="markdown-content" v-html="renderedHtml"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MarkdownIt from 'markdown-it'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'

// 导入常用的语言支持
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-markdown'

const route = useRoute()
const router = useRouter()

const contentRef = ref(null)
const loading = ref(true)
const error = ref(null)
const markdownContent = ref('')
const renderedHtml = ref('')

// 获取URL参数
const documentName = computed(() => route.query.doc || '未命名文档')
const highlightText = computed(() => route.query.highlight || '')
const sectionTitle = computed(() => route.query.section || '') // 所属章节标题
const contextText = computed(() => route.query.context || '') // 上下文文本
const matchIndex = computed(() => parseInt(route.query.index || '1')) // 第几个匹配项

// 初始化 Markdown 解析器（自动为标题添加ID）
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && Prism.languages[lang]) {
      try {
        return Prism.highlight(str, Prism.languages[lang], lang)
      } catch (__) {}
    }
    return ''
  },
})

// 为标题自动生成ID，用于章节定位
md.renderer.rules.heading_open = function (tokens, idx) {
  const token = tokens[idx]
  const level = token.tag
  const nextToken = tokens[idx + 1]
  const content = nextToken ? nextToken.content : ''

  // 生成ID：将标题文本转换为URL友好的ID
  const id = content
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]/g, '')

  return `<${level} id="${id}" class="heading-anchor">`
}

// 返回按钮
const goBack = () => {
  router.back()
}

// 加载markdown文档
const loadMarkdownDocument = async (docName) => {
  try {
    loading.value = true
    error.value = null

    // 这里需要根据实际项目结构调整文档路径
    // 假设markdown文档存放在 public/docs 目录下
    const response = await fetch(`/docs/${docName}.md`)

    if (!response.ok) {
      throw new Error(`无法加载文档: ${docName}`)
    }

    const content = await response.text()
    markdownContent.value = content

    // 将markdown转换为HTML
    renderedHtml.value = md.render(content)

    loading.value = false

    // 等待DOM更新后进行高亮和滚动
    await nextTick()

    if (highlightText.value) {
      highlightAndScroll()
    }
  } catch (err) {
    console.error('加载文档失败:', err)
    error.value = err.message || '加载文档时发生错误'
    loading.value = false
  }
}

// 高亮文本并滚动到对应位置（改进版：支持章节定位、上下文匹配、指定匹配项）
const highlightAndScroll = () => {
  if (!contentRef.value || !highlightText.value) return

  const searchText = highlightText.value.trim()
  if (!searchText) return

  // 步骤1: 确定搜索范围（如果指定了章节，则只在该章节内搜索）
  let searchScope = contentRef.value
  let sectionStartElement = null
  let sectionEndElement = null

  if (sectionTitle.value) {
    const sectionId = sectionTitle.value
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\u4e00-\u9fa5-]/g, '')

    const sectionElement = document.getElementById(sectionId)

    if (sectionElement) {
      console.log(`找到章节: "${sectionTitle.value}"`)

      // 获取该章节的范围（从该标题到下一个同级或更高级标题）
      const sectionLevel = parseInt(sectionElement.tagName.charAt(1))
      sectionStartElement = sectionElement
      sectionEndElement = null

      let nextElement = sectionElement.nextElementSibling
      while (nextElement) {
        if (nextElement.tagName && nextElement.tagName.match(/^H[1-6]$/)) {
          const nextLevel = parseInt(nextElement.tagName.charAt(1))
          if (nextLevel <= sectionLevel) {
            sectionEndElement = nextElement
            break
          }
        }
        nextElement = nextElement.nextElementSibling
      }

      console.log(
        `章节范围: 从 <${sectionStartElement.tagName}> 到`,
        sectionEndElement ? `<${sectionEndElement.tagName}>` : '文档末尾',
      )
    } else {
      console.warn(`未找到章节: ${sectionTitle.value}`)
    }
  }

  // 步骤2: 收集所有匹配项（传入章节范围）
  const matches = findAllMatches(
    searchScope,
    searchText,
    contextText.value,
    sectionStartElement,
    sectionEndElement,
  )

  if (matches.length === 0) {
    showNotice(`未找到 "${searchText}"`)
    return
  }

  // 步骤3: 选择要高亮的匹配项（基于index参数）
  const targetIndex = Math.min(Math.max(1, matchIndex.value), matches.length) - 1
  const targetMatch = matches[targetIndex]

  console.log(`找到 ${matches.length} 个匹配项，高亮第 ${targetIndex + 1} 个`)

  // 步骤4: 高亮目标匹配项（始终给主目标添加ID）
  highlightMatch(targetMatch, 'highlighted-content')

  // 步骤5: 高亮其他匹配项（使用不同样式）
  matches.forEach((match, index) => {
    if (index !== targetIndex) {
      highlightMatch(match, null, 'highlight-text-secondary')
    }
  })

  // 步骤6: 滚动到目标高亮位置（等待DOM更新）
  setTimeout(() => {
    const highlightedElement = document.getElementById('highlighted-content')
    if (highlightedElement) {
      highlightedElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })

      if (sectionTitle.value) {
        console.log(`已滚动到章节 "${sectionTitle.value}" 内的第 ${targetIndex + 1} 个匹配项`)
      }
    }
  }, 200)
}

// 查找所有匹配项（支持章节范围限制）
const findAllMatches = (
  scope,
  searchText,
  context = '',
  sectionStart = null,
  sectionEnd = null,
) => {
  const matches = []
  const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, null)

  let textNode
  while ((textNode = walker.nextNode())) {
    // 如果指定了章节范围，检查当前节点是否在范围内
    if (sectionStart) {
      let nodeElement = textNode.parentElement
      let inSection = false

      // 检查节点是否在章节范围内
      if (sectionEnd) {
        // 有明确的结束标记
        let currentElement = sectionStart
        while (currentElement && currentElement !== sectionEnd) {
          if (currentElement === nodeElement || currentElement.contains(nodeElement)) {
            inSection = true
            break
          }
          currentElement = currentElement.nextElementSibling
        }
      } else {
        // 没有结束标记，从章节开始到文档末尾
        let currentElement = sectionStart
        while (currentElement) {
          if (currentElement === nodeElement || currentElement.contains(nodeElement)) {
            inSection = true
            break
          }
          currentElement = currentElement.nextElementSibling
        }
      }

      if (!inSection) continue
    }

    const text = textNode.textContent
    const lowerText = text.toLowerCase()
    const lowerSearch = searchText.toLowerCase()

    let startIndex = 0
    let index

    // 在同一个文本节点中查找所有匹配
    while ((index = lowerText.indexOf(lowerSearch, startIndex)) !== -1) {
      // 如果指定了上下文，检查是否匹配
      if (context) {
        const lowerContext = context.toLowerCase()
        const surroundingText = text
          .substring(Math.max(0, index - 50), index + searchText.length + 50)
          .toLowerCase()

        if (!surroundingText.includes(lowerContext)) {
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

// 高亮单个匹配项
const highlightMatch = (match, id = null, className = 'highlight-text') => {
  const { node, offset, length, text } = match
  const parentElement = node.parentElement

  // 如果已经被高亮过，跳过
  if (parentElement.tagName === 'MARK') return

  const fullText = node.textContent
  const beforeText = fullText.substring(0, offset)
  const matchText = fullText.substring(offset, offset + length)
  const afterText = fullText.substring(offset + length)

  // 创建高亮元素
  const mark = document.createElement('mark')
  mark.className = className
  mark.textContent = matchText
  if (id) mark.id = id

  // 替换文本节点
  const fragment = document.createDocumentFragment()
  if (beforeText) fragment.appendChild(document.createTextNode(beforeText))
  fragment.appendChild(mark)
  if (afterText) fragment.appendChild(document.createTextNode(afterText))

  try {
    parentElement.replaceChild(fragment, node)
  } catch (e) {
    console.warn('高亮失败:', e)
  }
}

// 显示提示信息
const showNotice = (message, type = 'error') => {
  const notice = document.createElement('div')
  notice.className = type === 'error' ? 'search-notice' : 'search-notice-success'
  notice.textContent = message
  contentRef.value.insertBefore(notice, contentRef.value.firstChild)

  setTimeout(() => {
    notice.remove()
  }, 3000)
}

// 高亮所有匹配项（可选功能）
const highlightAllMatches = () => {
  if (!contentRef.value || !highlightText.value) return

  const searchText = highlightText.value.trim()
  if (!searchText) return

  const walker = document.createTreeWalker(contentRef.value, NodeFilter.SHOW_TEXT, null)

  const nodesToReplace = []
  let textNode

  // 收集所有需要替换的节点
  while ((textNode = walker.nextNode())) {
    const text = textNode.textContent
    const lowerText = text.toLowerCase()
    const lowerSearch = searchText.toLowerCase()

    if (lowerText.includes(lowerSearch)) {
      nodesToReplace.push(textNode)
    }
  }

  // 替换所有匹配的文本节点
  nodesToReplace.forEach((node, index) => {
    const text = node.textContent
    const regex = new RegExp(`(${escapeRegExp(searchText)})`, 'gi')
    const parts = text.split(regex)

    const fragment = document.createDocumentFragment()
    parts.forEach((part) => {
      if (part.toLowerCase() === searchText.toLowerCase()) {
        const mark = document.createElement('mark')
        mark.className = 'highlight-text'
        if (index === 0) {
          mark.id = 'highlighted-content' // 只给第一个匹配项设置ID
        }
        mark.textContent = part
        fragment.appendChild(mark)
      } else if (part) {
        fragment.appendChild(document.createTextNode(part))
      }
    })

    node.parentElement.replaceChild(fragment, node)
  })

  // 滚动到第一个匹配项
  setTimeout(() => {
    const firstHighlight = document.getElementById('highlighted-content')
    if (firstHighlight) {
      firstHighlight.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, 100)
}

// 转义正则表达式特殊字符
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// 组件挂载时加载文档
onMounted(() => {
  const docName = route.query.doc
  if (docName) {
    loadMarkdownDocument(docName)
  } else {
    error.value = '缺少文档参数'
    loading.value = false
  }
})
</script>

<style scoped>
.markdown-view-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.header {
  max-width: 900px;
  margin: 0 auto 30px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.back-button {
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(-3px);
}

.document-title {
  flex: 1;
  color: white;
  font-size: 2rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.markdown-container {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  min-height: 500px;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-spinner p {
  margin-top: 20px;
  color: #4a5568;
  font-size: 1.1rem;
}

.error-message {
  text-align: center;
  padding: 60px 20px;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.error-message h3 {
  color: #e53e3e;
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.error-message p {
  color: #4a5568;
  font-size: 1.1rem;
}

.markdown-content {
  color: #2d3748;
  line-height: 1.8;
  font-size: 1rem;
}

/* Markdown 样式 */
.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6) {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
  color: #1a202c;
}

.markdown-content :deep(h1) {
  font-size: 2em;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.3em;
}

.markdown-content :deep(h2) {
  font-size: 1.5em;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.3em;
}

.markdown-content :deep(h3) {
  font-size: 1.25em;
}

.markdown-content :deep(h4) {
  font-size: 1em;
}

.markdown-content :deep(p) {
  margin-bottom: 16px;
}

.markdown-content :deep(a) {
  color: #667eea;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.3s ease;
}

.markdown-content :deep(a:hover) {
  border-bottom-color: #667eea;
}

.markdown-content :deep(code) {
  background: #f7fafc;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
  color: #e53e3e;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}

.markdown-content :deep(pre) {
  background: #1d1f21;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 16px 0;
}

.markdown-content :deep(pre code) {
  background: none;
  padding: 0;
  color: #c5c8c6;
  font-size: 0.9em;
}

.markdown-content :deep(blockquote) {
  border-left: 4px solid #667eea;
  padding-left: 16px;
  margin: 16px 0;
  color: #4a5568;
  font-style: italic;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin-bottom: 16px;
  padding-left: 24px;
}

.markdown-content :deep(li) {
  margin-bottom: 8px;
}

.markdown-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 16px 0;
}

.markdown-content :deep(table th),
.markdown-content :deep(table td) {
  border: 1px solid #e2e8f0;
  padding: 8px 12px;
  text-align: left;
}

.markdown-content :deep(table th) {
  background: #f7fafc;
  font-weight: 600;
}

.markdown-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 16px 0;
}

.markdown-content :deep(hr) {
  border: none;
  border-top: 2px solid #e2e8f0;
  margin: 24px 0;
}

/* 高亮样式 - 主要目标 */
.markdown-content :deep(.highlight-text),
.markdown-content :deep(mark) {
  background: linear-gradient(120deg, #fef08a 0%, #fde047 100%);
  padding: 2px 4px;
  border-radius: 3px;
  animation: highlight-pulse 1.5s ease-in-out;
  box-shadow: 0 0 0 4px rgba(254, 240, 138, 0.3);
  font-weight: 600;
}

/* 次要高亮样式 - 其他匹配项 */
.markdown-content :deep(.highlight-text-secondary) {
  background: linear-gradient(120deg, #fde68a 0%, #fcd34d 100%);
  padding: 2px 4px;
  border-radius: 3px;
  opacity: 0.7;
  box-shadow: 0 0 0 2px rgba(252, 211, 77, 0.2);
}

@keyframes highlight-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 4px rgba(254, 240, 138, 0.3);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(254, 240, 138, 0.5);
  }
}

/* 搜索提示 - 错误 */
.markdown-content :deep(.search-notice) {
  background: #fed7d7;
  color: #c53030;
  padding: 12px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  animation: fadeOut 3s ease-in-out;
  border-left: 4px solid #e53e3e;
}

/* 搜索提示 - 成功 */
.markdown-content :deep(.search-notice-success) {
  background: #c6f6d5;
  color: #276749;
  padding: 12px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  animation: fadeOut 3s ease-in-out;
  border-left: 4px solid #48bb78;
}

@keyframes fadeOut {
  0%,
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .markdown-view-page {
    padding: 10px;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .document-title {
    font-size: 1.5rem;
  }

  .markdown-container {
    padding: 20px;
  }

  .markdown-content {
    font-size: 0.95rem;
  }
}
</style>
