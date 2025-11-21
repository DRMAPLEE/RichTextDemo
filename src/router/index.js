import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/demo',
      name: 'demo',
      component: () => import('../views/DemoView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/markdown',
      name: 'markdown',
      // Markdown文档查看页面，支持文档名称和高亮文本参数
      // 示例: /markdown?doc=example&highlight=文本内容
      component: () => import('../views/MarkdownView.vue'),
    },
  ],
})

export default router
