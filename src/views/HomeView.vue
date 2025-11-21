<script setup>
import RichTextEditor from '@/components/RichTextEditor.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToDemo = () => {
  router.push('/demo')
}

const goToDiff = () => {
  router.push('/diff')
}

const scrollToEditor = () => {
  const editor = document.querySelector('.rich-text-editor')
  if (editor) {
    editor.scrollIntoView({ behavior: 'smooth' })
  }
}

// 文档列表（增强版：支持章节定位）
const documents = [
  {
    name: 'example',
    title: 'Vue 3 富文本编辑器项目文档',
    description: '完整的项目文档，包含技术架构、功能详解等',
    highlights: [
      { text: '技术架构', section: '技术架构' },
      { text: 'ToastUI Editor', section: '编辑器集成' },
      { text: '代码高亮', section: '代码块' },
      { text: '最佳实践', section: '最佳实践' },
    ],
  },
  {
    name: 'getting-started',
    title: '快速开始指南',
    description: '快速上手指南，帮助您开始使用编辑器',
    highlights: [
      { text: '安装', section: '第一步：安装' },
      { text: '快捷键', section: '基本操作' },
      { text: '基本操作', section: '第三步：开始编辑' },
    ],
  },
  {
    name: 'duplicate-test',
    title: '重复文本测试文档',
    description: '测试精准定位功能，包含多个重复的关键词',
    highlights: [
      { text: 'Vue 3', section: '前端开发' },
      { text: 'Vue 3', section: '全栈开发' },
      { text: '最佳实践', section: '最佳实践' },
      { text: '性能优化', section: '性能优化' },
    ],
  },
]

// 增强的文档查看函数，支持章节定位、上下文、指定匹配项
const viewDocument = (docName, highlight = '', section = '', context = '', index = 1) => {
  const query = {
    doc: docName,
  }

  if (highlight) query.highlight = highlight
  if (section) query.section = section
  if (context) query.context = context
  if (index > 1) query.index = index

  router.push({
    path: '/markdown',
    query,
  })
}
</script>

<template>
  <div class="space-y-8">
    <!-- Hero Section -->
    <div class="text-center py-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        ToastUI <span class="text-indigo-600">富文本编辑器</span>
      </h1>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto">
        基于ToastUI Editor的WYSIWYG富文本编辑器，支持所见即所得编辑
      </p>
      <div class="mt-8 flex gap-4 justify-center">
        <button
          @click="goToDemo"
          class="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200"
        >
          查看完整演示
        </button>
      </div>
    </div>

    <!-- 编辑器状态信息 -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h2 class="text-xl font-semibold text-blue-800 mb-4">ℹ️ 编辑器信息</h2>
      <p class="text-blue-700 mb-4">
        当前使用的是 ToastUI Editor 3.2.2 版本，支持 WYSIWYG 和 Markdown 两种编辑模式。
      </p>
      <div class="text-sm text-blue-600">
        <p>• 如果编辑器初始化失败，请刷新页面重试</p>
        <p>• 支持快捷键：Ctrl+B (粗体)、Ctrl+I (斜体)、Ctrl+K (链接)</p>
        <p>• 可以在 WYSIWYG 和 Markdown 模式间自由切换</p>
      </div>
    </div>

    <!-- Rich Text Editor -->
    <div class="bg-white rounded-lg shadow-lg p-6">
      <RichTextEditor />
    </div>

    <!-- Features Grid -->
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
        <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
          <svg
            class="w-6 h-6 text-indigo-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            ></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">WYSIWYG编辑</h3>
        <p class="text-gray-600">所见即所得的编辑体验，实时预览编辑效果</p>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M15 7l3 3m0 0l-3 3m3-3H9"
            ></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">丰富功能</h3>
        <p class="text-gray-600">支持文本格式化、表格、图片、链接、代码高亮等功能</p>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">易于集成</h3>
        <p class="text-gray-600">基于Vue 3组件化设计，轻松集成到现有项目中</p>
      </div>

      <div 
        @click="goToDiff"
        class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer border-2 border-purple-200 hover:border-purple-400"
      >
        <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            ></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">文本对比 🆕</h3>
        <p class="text-gray-600">类似 Cursor 的文本对比功能，可接受或拒绝更改块</p>
        <div class="mt-4 text-purple-600 font-medium text-sm">
          点击体验 →
        </div>
      </div>
    </div>

    <!-- 文档查看功能展示 -->
    <div class="bg-white rounded-lg shadow-lg p-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span>📚</span>
        <span>Markdown 文档查看器</span>
      </h2>
      <p class="text-gray-600 mb-6">
        支持加载 Markdown 文档并高亮指定文本内容。点击下方链接体验文档查看和文本高亮功能。
      </p>

      <div class="grid md:grid-cols-2 gap-6">
        <div
          v-for="doc in documents"
          :key="doc.name"
          class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300"
        >
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ doc.title }}</h3>
          <p class="text-gray-600 text-sm mb-4">{{ doc.description }}</p>

          <div class="mb-4">
            <p class="text-xs text-gray-500 mb-2">🎯 精准定位（点击标签跳转到指定章节并高亮）：</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="(highlight, idx) in doc.highlights"
                :key="idx"
                @click="viewDocument(doc.name, highlight.text, highlight.section)"
                class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs hover:bg-yellow-200 transition-colors flex items-center gap-1"
                :title="`在「${highlight.section}」章节中高亮「${highlight.text}」`"
              >
                <span class="opacity-60">§</span>
                <span>{{ highlight.text }}</span>
              </button>
            </div>
          </div>

          <button
            @click="viewDocument(doc.name)"
            class="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
          >
            查看完整文档
          </button>
        </div>
      </div>

      <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p class="text-sm text-blue-800 mb-3">
          <strong>💡 新特性：精准定位系统</strong>
        </p>
        <ul class="text-sm text-blue-700 space-y-1 ml-4">
          <li>✓ <strong>章节定位</strong>：自动定位到指定章节，避免重复文本的混淆</li>
          <li>✓ <strong>多项高亮</strong>：同时显示所有匹配项，主要目标高亮更明显</li>
          <li>✓ <strong>上下文匹配</strong>：通过上下文更精确地定位文本</li>
          <li>✓ <strong>索引选择</strong>：指定高亮第几个匹配项</li>
        </ul>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg p-8 text-center text-white">
      <h2 class="text-2xl font-bold mb-4">开始使用富文本编辑器</h2>
      <p class="text-indigo-100 mb-6">体验强大的文本编辑功能，提升内容创作效率</p>
      <div class="flex gap-4 justify-center">
        <button
          class="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
          @click="scrollToEditor"
        >
          开始编辑
        </button>
        <button
          @click="goToDemo"
          class="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors duration-200"
        >
          完整演示
        </button>
      </div>
    </div>
  </div>
</template>
