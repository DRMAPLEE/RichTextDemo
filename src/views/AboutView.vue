<template>
  <div class="max-w-4xl mx-auto">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">关于我们</h1>
      <p class="text-xl text-gray-600">了解这个项目的技术栈和特性</p>
    </div>

    <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
      <h2 class="text-2xl font-semibold text-gray-900 mb-6">技术栈</h2>
      <div class="grid md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="flex items-center space-x-3">
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            <span class="text-gray-700">Vue 3 - 渐进式JavaScript框架</span>
          </div>
          <div class="flex items-center space-x-3">
            <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span class="text-gray-700">Vue Router - 官方路由管理器</span>
          </div>
          <div class="flex items-center space-x-3">
            <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span class="text-gray-700">Pinia - 状态管理库</span>
          </div>
        </div>
        <div class="space-y-4">
          <div class="flex items-center space-x-3">
            <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span class="text-gray-700">Tailwind CSS - 实用优先的CSS框架</span>
          </div>
          <div class="flex items-center space-x-3">
            <div class="w-3 h-3 bg-red-500 rounded-full"></div>
            <span class="text-gray-700">Vite - 快速的前端构建工具</span>
          </div>
          <div class="flex items-center space-x-3">
            <div class="w-3 h-3 bg-indigo-500 rounded-full"></div>
            <span class="text-gray-700">ESLint + Prettier - 代码质量工具</span>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-8">
      <h2 class="text-2xl font-semibold text-gray-900 mb-4">项目特性</h2>
      <ul class="space-y-3 text-gray-700">
        <li class="flex items-start space-x-3">
          <svg
            class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          <span>现代化的组件架构和组合式API</span>
        </li>
        <li class="flex items-start space-x-3">
          <svg
            class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          <span>响应式设计和移动端优化</span>
        </li>
        <li class="flex items-start space-x-3">
          <svg
            class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          <span>完整的开发工具链和热重载</span>
        </li>
        <li class="flex items-start space-x-3">
          <svg
            class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          <span>TypeScript支持和类型安全</span>
        </li>
      </ul>
    </div>
  </div>
</template>
