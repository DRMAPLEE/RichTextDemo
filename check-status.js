#!/usr/bin/env node

/**
 * ToastUI 富文本编辑器项目状态检查脚本
 * 用于验证项目的各个组件和功能是否正常
 */

import fs from 'fs'

console.log('🔍 ToastUI 富文本编辑器项目状态检查\n')

// 检查项目结构
console.log('📁 项目结构检查:')
const requiredFiles = [
  'src/components/RichTextEditor.vue',
  'src/views/HomeView.vue',
  'src/views/DemoView.vue',
  'src/router/index.js',
  'src/assets/main.css',
  'package.json',
  'README.md',
  'USAGE.md',
  'PROJECT_SUMMARY.md',
]

let structureOk = true
requiredFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`)
  } else {
    console.log(`  ❌ ${file} - 缺失`)
    structureOk = false
  }
})

// 检查依赖
console.log('\n📦 依赖检查:')
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  const requiredDeps = [
    '@toast-ui/editor',
    '@toast-ui/editor-plugin-code-syntax-highlight',
    '@toast-ui/editor-plugin-color-syntax',
    'prismjs',
    'vue',
    'vue-router',
  ]

  requiredDeps.forEach((dep) => {
    if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
      console.log(`  ✅ ${dep}`)
    } else {
      console.log(`  ❌ ${dep} - 缺失`)
    }
  })
} catch {
  console.log('  ❌ 无法读取 package.json')
  structureOk = false
}

// 检查构建状态
console.log('\n🏗️ 构建状态检查:')
if (fs.existsSync('dist')) {
  const distFiles = fs.readdirSync('dist')
  if (distFiles.length > 0) {
    console.log('  ✅ 构建目录存在，包含构建文件')
    console.log(`     文件数量: ${distFiles.length}`)
  } else {
    console.log('  ⚠️ 构建目录存在但为空')
  }
} else {
  console.log('  ⚠️ 构建目录不存在，请运行 pnpm build')
}

// 检查开发服务器
console.log('\n🚀 开发服务器状态:')
console.log('  请手动检查: http://localhost:5175')
console.log('  演示页面: http://localhost:5175/demo')

// 总结
console.log('\n📊 检查总结:')
if (structureOk) {
  console.log('  🎉 项目结构完整，所有必需文件都存在')
} else {
  console.log('  ⚠️ 项目结构存在问题，请检查缺失的文件')
}

console.log('\n💡 下一步操作:')
console.log('  1. 启动开发服务器: pnpm dev')
console.log('  2. 访问主页: http://localhost:5175')
console.log('  3. 访问演示页面: http://localhost:5175/demo')
console.log('  4. 构建生产版本: pnpm build')
console.log('  5. 预览构建结果: pnpm preview')

console.log('\n🔗 相关文档:')
console.log('  - README.md: 项目介绍')
console.log('  - USAGE.md: 使用指南')
console.log('  - PROJECT_SUMMARY.md: 项目总结')
