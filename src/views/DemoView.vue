<template>
  <div class="demo-page">
    <div class="hero-section">
      <h1 class="hero-title">ToastUI 富文本编辑器演示</h1>
      <p class="hero-subtitle">体验强大的WYSIWYG编辑功能</p>
    </div>

    <div class="demo-container">
      <div class="demo-section">
        <h2 class="section-title">🎯 编辑器演示</h2>
        <RichTextEditor />
      </div>

      <div class="demo-section">
        <h2 class="section-title">🚀 功能特性</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">📝</div>
            <h3>文本格式化</h3>
            <p>支持粗体、斜体、下划线、删除线等文本样式</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>表格编辑</h3>
            <p>创建和编辑表格，支持单元格合并和样式设置</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🖼️</div>
            <h3>媒体支持</h3>
            <p>插入图片、链接等多媒体内容</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💻</div>
            <h3>代码高亮</h3>
            <p>支持代码块和语法高亮，提升代码可读性</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📋</div>
            <h3>列表管理</h3>
            <p>有序列表、无序列表、任务列表等多种列表类型</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔍</div>
            <h3>全屏编辑</h3>
            <p>全屏编辑模式，提供沉浸式编辑体验</p>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <h2 class="section-title">💡 使用技巧</h2>
        <div class="tips-container">
          <div class="tip-item">
            <h4>快捷键支持</h4>
            <p>使用 Ctrl+B (粗体)、Ctrl+I (斜体) 等快捷键快速格式化文本</p>
          </div>
          <div class="tip-item">
            <h4>拖拽上传</h4>
            <p>直接将图片文件拖拽到编辑器中即可插入图片</p>
          </div>
          <div class="tip-item">
            <h4>实时预览</h4>
            <p>在WYSIWYG模式下，所有编辑都会实时显示效果</p>
          </div>
          <div class="tip-item">
            <h4>模式切换</h4>
            <p>可以在WYSIWYG和Markdown模式之间自由切换</p>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <h2 class="section-title">🔧 技术实现</h2>
        <div class="tech-info">
          <div class="tech-item">
            <h4>核心框架</h4>
            <p>基于 ToastUI Editor 3.x 版本，提供稳定可靠的编辑体验</p>
          </div>
          <div class="tech-item">
            <h4>Vue 3 集成</h4>
            <p>使用 Vue 3 组合式 API，组件化设计，易于维护和扩展</p>
          </div>
          <div class="tech-item">
            <h4>插件系统</h4>
            <p>集成代码高亮和颜色语法插件，功能更加丰富</p>
          </div>
          <div class="tech-item">
            <h4>响应式设计</h4>
            <p>使用 Tailwind CSS，支持各种屏幕尺寸和设备类型</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import RichTextEditor from '@/components/RichTextEditor.vue'
</script>

<style scoped>
.demo-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.hero-section {
  text-align: center;
  padding: 80px 20px 60px;
  color: white;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 20px;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 1.5rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

.demo-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 60px;
}

.demo-section {
  background: white;
  border-radius: 16px;
  padding: 40px;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 30px;
  text-align: center;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.feature-card {
  text-align: center;
  padding: 30px 20px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 12px;
}

.feature-card p {
  color: #4a5568;
  line-height: 1.6;
}

.tips-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.tip-item {
  padding: 20px;
  background: #f7fafc;
  border-radius: 8px;
  border-left: 4px solid #4299e1;
}

.tip-item h4 {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 8px;
}

.tip-item p {
  color: #4a5568;
  font-size: 0.95rem;
  line-height: 1.5;
}

.tech-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.tech-item {
  padding: 20px;
  background: #f0fff4;
  border-radius: 8px;
  border-left: 4px solid #48bb78;
}

.tech-item h4 {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 8px;
}

.tech-item p {
  color: #4a5568;
  font-size: 0.95rem;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.25rem;
  }

  .demo-section {
    padding: 30px 20px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .tips-container,
  .tech-info {
    grid-template-columns: 1fr;
  }
}
</style>
