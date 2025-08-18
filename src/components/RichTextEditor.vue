<template>
  <div class="rich-text-editor">
    <div id="editor"></div>
  </div>
</template>

<script>
import { Editor } from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css'
import { convertToMarkdown } from '../../convert-to-markdown'

const inputText = `<思考>分析数据后发现，各地区客户数量和总销售额存在显著差异。北京和广东的客户数量最多，均为3个，且总销售额也是最高的；而上海、四川、天津、浙江和重庆的客户数量较少，多为1个。这表明北京和广东是主要的销售市场，具有较高的客户集中度和销售额。</思考>

<类型>柱状图</类型>

<echart>{
  title: {
    text: '各地区客户数量和总销售额',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    data: ['客户数量', '总销售额'],
    orient: 'vertical',
    left: 'left'
  },
  xAxis: {
    type: 'category',
    data: ['上海', '北京', '四川', '天津', '广东', '江苏', '浙江', '重庆']
  },
  yAxis: [
    {
      type: 'value',
      name: '客户数量',
      axisLabel: {
        formatter: '{value}'
      }
    },
    {
      type: 'value',
      name: '总销售额',
      axisLabel: {
        formatter: '{value}'
      }
    }
  ],
  series: [
    {
      name: '客户数量',
      type: 'bar',
      data: [1, 3, 1, 1, 3, 2, 1, 1]
    },
    {
      name: '总销售额',
      type: 'bar',
      yAxisIndex: 1,
      data: [3584, 75354, 36612, 11074, 58534, 10118, 5040, 27800]
    }
  ]
}</echart>

<回答>数据分析结果显示，北京和广东的客户数量和总销售额均位居前列，北京客户数量为3个，总销售额为75354.00；广东客户数量为3个，总销售额为58534.00。四川、天津和重庆虽然客户数量较少，但总销售额相对较高。上海、江苏和浙江的客户数量和总销售额相对较低。</回答>

<战略>1. 重点开发北京和广东市场，增加营销投入，进一步提升销售额；2. 对于四川、天津和重庆等地区，虽然客户数量较少，但平均销售额较高，应关注高价值客户，提供个性化服务；3. 对于上海、江苏和浙江等销售额较低的地区，可考虑调整产品策略或价格策略，吸引更多客户；4. 定期分析各地区销售数据，动态调整销售策略，优化资源配置。</战略>分析数据后发现，各地区客户数量和总销售额存在显著差异。北京和广东的客户数量最多，均为3个，且总销售额也是最高的；而上海、四川、天津、浙江和重庆的客户数量较少，多为1个。这表明北京和广东是主要的销售市场，具有较高的客户集中度和销售额。柱状图option = {
  title: {
    text: '各地区客户数量和总销售额',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    data: ['客户数量', '总销售额'],
    orient: 'vertical',
    left: 'left'
  },
  xAxis: {
    type: 'category',
    data: ['上海', '北京', '四川', '天津', '广东', '江苏', '浙江', '重庆']
  },
  yAxis: [
    {
      type: 'value',
      name: '客户数量',
      axisLabel: {
        formatter: '{value}'
      }
    },
    {
      type: 'value',
      name: '总销售额',
      axisLabel: {
        formatter: '{value}'
      }
    }
  ],
  series: [
    {
      name: '客户数量',
      type: 'bar',
      data: [1, 3, 1, 1, 3, 2, 1, 1]
    },
    {
      name: '总销售额',
      type: 'bar',
      yAxisIndex: 1,
      data: [3584, 75354, 36612, 11074, 58534, 10118, 5040, 27800]
    }
  ]
};数据分析结果显示，北京和广东的客户数量和总销售额均位居前列，北京客户数量为3个，总销售额为75354.00；广东客户数量为3个，总销售额为58534.00。四川、天津和重庆虽然客户数量较少，但总销售额相对较高。上海、江苏和浙江的客户数量和总销售额相对较低。1. 重点开发北京和广东市场，增加营销投入，进一步提升销售额；2. 对于四川、天津和重庆等地区，虽然客户数量较少，但平均销售额较高，应关注高价值客户，提供个性化服务；3. 对于上海、江苏和浙江等销售额较低的地区，可考虑调整产品策略或价格策略，吸引更多客户；4. 定期分析各地区销售数据，动态调整销售策略，优化资源配置。
能不能把这种文案转成markdown`

export default {
  name: 'RichTextEditor',
  data() {
    return {
      markdownResult: '# 正在生成图表...\n\n请稍候，图表正在渲染中...',
    }
  },
  async mounted() {
    Editor.setLanguage('zh-CN', {
      Markdown: 'Markdown',
      WYSIWYG: '普通模式',
      Write: '编写',
      Preview: '预览',
      Headings: '标题',
      Paragraph: '段落',
      Bold: '粗体',
      Italic: '斜体',
      Strike: '删除线',
      Code: '代码',
      Line: '分割线',
      Blockquote: '引用',
      'Unordered list': '无序列表',
      'Ordered list': '有序列表',
      Task: '任务',
      Indent: '缩进',
      Outdent: '减少缩进',
      'Insert link': '插入链接',
      'Insert image': '插入图片',
      'Insert table': '插入表格',
      'Insert CodeBlock': '插入代码块',
      'Insert horizontal rule': '插入水平线',
      'Full screen': '全屏',
      'Code block': '代码块',
      Table: '表格',
      Image: '图片',
      Link: '链接',
      Text: '文本',
      URL: '网址',
      Title: '标题',
      'Alt text': '替代文本',
      Width: '宽度',
      Height: '高度',
      Rows: '行数',
      Columns: '列数',
      More: '更多',
      Header: '表头',
      Body: '表体',
      Footer: '表尾',
      'Add row above': '在上方添加行',
      'Add row below': '在下方添加行',
      'Add column left': '在左侧添加列',
      'Add column right': '在右侧添加列',
      'Remove row': '删除行',
      'Remove column': '删除列',
      'Remove table': '删除表格',
      Save: '保存',
      Cancel: '取消',
      Close: '关闭',
      Edit: '编辑',
      Delete: '删除',
      Copy: '复制',
      Cut: '剪切',
      Paste: '粘贴',
      Undo: '撤销',
      Redo: '重做',
      'Select all': '全选',
      Find: '查找',
      Replace: '替换',
      'Go to line': '跳转到行',
      'Go to column': '跳转到列',
      'Go to page': '跳转到页',
      'Go to top': '跳转到顶部',
      'Go to bottom': '跳转到底部',
      Previous: '上一个',
      Next: '下一个',
      First: '第一个',
      Last: '最后一个',
      Yes: '是',
      No: '否',
      OK: '确定',
      Error: '错误',
      Warning: '警告',
      Info: '信息',
      Success: '成功',
      Loading: '加载中',
      'Please wait': '请稍候',
      'No results found': '未找到结果',
      'No data available': '暂无数据',
      'No more data': '没有更多数据',
      All: '全部',
      None: '无',
      Custom: '自定义',
      Default: '默认',
      Auto: '自动',
      Manual: '手动',
      Enabled: '启用',
      Disabled: '禁用',
      Active: '活动',
      Inactive: '非活动',
      Visible: '可见',
      Hidden: '隐藏',
      Show: '显示',
      Hide: '隐藏',
      Expand: '展开',
      Collapse: '折叠',
      Open: '打开',
      Close: '关闭',
      Start: '开始',
      Stop: '停止',
      Play: '播放',
      Pause: '暂停',
      Resume: '恢复',
      Reset: '重置',
      Refresh: '刷新',
      Update: '更新',
      Download: '下载',
      Upload: '上传',
      Import: '导入',
      Export: '导出',
      Print: '打印',
      Share: '分享',
      Send: '发送',
      Receive: '接收',
      Connect: '连接',
      Disconnect: '断开连接',
      Login: '登录',
      Logout: '登出',
      Register: '注册',
      'Sign in': '登录',
      'Sign out': '登出',
      'Sign up': '注册',
      Profile: '个人资料',
      Settings: '设置',
      Preferences: '偏好设置',
      Account: '账户',
      Password: '密码',
      Username: '用户名',
      Email: '邮箱',
      Phone: '电话',
      Address: '地址',
      City: '城市',
      Country: '国家',
      Language: '语言',
      Theme: '主题',
      Font: '字体',
      Size: '大小',
      Color: '颜色',
      Background: '背景',
      Border: '边框',
      Margin: '外边距',
      Padding: '内边距',
      Width: '宽度',
      Height: '高度',
      Position: '位置',
      Display: '显示',
      Visibility: '可见性',
      Opacity: '透明度',
      'Z-index': '层级',
      Float: '浮动',
      Clear: '清除',
      Overflow: '溢出',
      Cursor: '光标',
      Outline: '轮廓',
      'Box-shadow': '阴影',
      'Text-shadow': '文字阴影',
      Transition: '过渡',
      Animation: '动画',
      Transform: '变换',
      Filter: '滤镜',
      'Backdrop-filter': '背景滤镜',
      Mask: '遮罩',
      'Clip-path': '裁剪路径',
      Perspective: '透视',
      'Transform-origin': '变换原点',
      'Transform-style': '变换样式',
      'Backface-visibility': '背面可见性',
      'Box-sizing': '盒模型',
      Content: '内容',
      Quotes: '引号',
      'Counter-reset': '计数器重置',
      'Counter-increment': '计数器递增',
      Resize: '调整大小',
    })

    // 异步生成 markdown 内容
    try {
      this.markdownResult = await convertToMarkdown(inputText)
      console.log('Markdown 转换完成:', this.markdownResult)
    } catch (error) {
      console.error('转换失败:', error)
      this.markdownResult = '# 转换失败\n\n图表生成时发生错误，请检查配置格式。'
    }

    // 创建编辑器实例
    const editor = new Editor({
      el: document.querySelector('#editor'),
      height: '500px',
      initialEditType: 'wysiwyg',
      previewStyle: 'vertical',
      language: 'zh-CN',
      initialValue: this.markdownResult,
    })

    // 设置编辑器语言为中文

    // 将编辑器实例保存到组件实例中，以便后续使用
    this.editor = editor
  },
  beforeUnmount() {
    // 组件销毁前销毁编辑器实例
    if (this.editor) {
      this.editor.destroy()
    }
  },
}
</script>

<style scoped>
.rich-text-editor {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

#editor {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}
</style>
