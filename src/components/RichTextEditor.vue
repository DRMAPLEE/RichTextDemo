<template>
  <div class="w-full max-w-6xl mx-auto p-5">
    <!-- 导出工具栏 -->
    <div class="export-toolbar">
      <button @click="showExportDialog" class="export-button" :disabled="isExporting">
        <span v-if="!isExporting" class="flex items-center gap-1.5">
          <span class="export-icon">📤</span>
          导出文档
        </span>
        <span v-else class="flex items-center gap-1.5">
          <span class="loading-spinner"></span>
          导出中...
        </span>
      </button>
    </div>

    <!-- 导出弹窗 -->
    <div v-if="exportDialogVisible" class="export-dialog-backdrop" @click="closeExportDialog">
      <div class="export-dialog-content" @click.stop>
        <div class="dialog-header">
          <h3 class="dialog-title">导出文档</h3>
          <button @click="closeExportDialog" class="dialog-close-button">×</button>
        </div>

        <div class="dialog-body">
          <div class="form-group">
            <label for="filename" class="form-label">文件名：</label>
            <input
              id="filename"
              v-model="exportSettings.filename"
              type="text"
              class="form-input"
              placeholder="请输入文件名"
              @keyup.enter="handleExport"
            />
          </div>

          <div class="form-group">
            <label class="form-label">导出格式：</label>
            <div class="format-options">
              <label class="format-option">
                <input
                  type="radio"
                  v-model="exportSettings.format"
                  value="pdf"
                  name="format"
                  class="format-radio"
                />
                <span class="format-content">
                  <span class="format-icon">📄</span>
                  PDF格式
                </span>
              </label>
              <label class="format-option">
                <input
                  type="radio"
                  v-model="exportSettings.format"
                  value="word"
                  name="format"
                  class="format-radio"
                />
                <span class="format-content">
                  <span class="format-icon">📝</span>
                  Word格式
                </span>
              </label>
            </div>
          </div>
        </div>

        <div class="dialog-footer">
          <button @click="closeExportDialog" class="dialog-button dialog-button-cancel">
            取消
          </button>
          <button
            @click="handleExport"
            class="dialog-button dialog-button-primary"
            :disabled="!exportSettings.filename.trim()"
          >
            确认导出
          </button>
        </div>
      </div>
    </div>

    <div id="editor" class="rounded-lg overflow-hidden"></div>
  </div>
</template>

<script>
import { Editor } from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css'
import { convertToMarkdown } from '../../convert-to-markdown'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun } from 'docx'
import MarkdownIt from 'markdown-it'

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
      isExporting: false,
      exportDialogVisible: false,
      exportSettings: {
        filename: '富文本内容',
        format: 'pdf',
      },
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
  methods: {
    // 显示导出弹窗
    showExportDialog() {
      this.exportDialogVisible = true
      // 默认设置文件名为当前时间
      const now = new Date()
      const timestamp = now
        .toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
        .replace(/[\/\s:]/g, '-')
      this.exportSettings.filename = `富文本内容-${timestamp}`
    },

    // 关闭导出弹窗
    closeExportDialog() {
      this.exportDialogVisible = false
    },

    // 处理导出操作
    async handleExport() {
      if (!this.exportSettings.filename.trim()) {
        alert('请输入文件名')
        return
      }

      this.closeExportDialog()

      if (this.exportSettings.format === 'pdf') {
        await this.exportToPDF(this.exportSettings.filename)
      } else if (this.exportSettings.format === 'word') {
        await this.exportToWord(this.exportSettings.filename)
      }
    },

    // 导出为PDF
    async exportToPDF(customFilename = '富文本内容') {
      if (!this.editor) return

      try {
        this.isExporting = true

        // 获取编辑器的HTML内容
        const editorContent = this.editor.getHTML()

        // 创建一个临时div用于渲染内容
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = editorContent

        // A4纸张比例：210mm x 297mm，减去边距后的有效宽度约为170mm
        // 按96dpi计算，170mm约等于640px
        const renderWidth = 640
        const padding = 40

        tempDiv.style.cssText = `
          position: absolute;
          left: -9999px;
          top: 0;
          width: ${renderWidth}px;
          padding: ${padding}px;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
          background: white;
          color: black;
          line-height: 1.6;
          font-size: 14px;
          box-sizing: border-box;
        `

        // 处理图片大小
        const images = tempDiv.querySelectorAll('img')
        images.forEach((img) => {
          img.style.maxWidth = '100%'
          img.style.height = 'auto'
          img.style.display = 'block'
          img.style.margin = '10px 0'
        })

        document.body.appendChild(tempDiv)

        // 等待图片加载完成
        const imagePromises = Array.from(images).map((img) => {
          return new Promise((resolve) => {
            if (img.complete) {
              resolve()
            } else {
              img.onload = resolve
              img.onerror = resolve
            }
          })
        })
        await Promise.all(imagePromises)

        // 使用html2canvas转换为图片
        const canvas = await html2canvas(tempDiv, {
          scale: 1.5, // 适中的缩放比例，平衡质量和文件大小
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: renderWidth + padding * 2,
          height: tempDiv.scrollHeight,
          logging: false,
          imageTimeout: 15000,
        })

        // 创建PDF
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        })

        // A4尺寸: 210 x 297 mm，留出边距
        const pdfWidth = 210
        const pdfHeight = 297
        const margin = 20
        const contentWidth = pdfWidth - margin * 2
        const contentHeight = pdfHeight - margin * 2

        // 计算图片在PDF中的实际尺寸
        const imgWidth = contentWidth
        const imgHeight = (canvas.height * contentWidth) / canvas.width

        let yPosition = 0
        let remainingHeight = imgHeight

        // 分页处理
        while (remainingHeight > 0) {
          // 如果不是第一页，添加新页面
          if (yPosition > 0) {
            pdf.addPage()
          }

          // 计算当前页面可以容纳的高度
          const currentPageHeight = Math.min(remainingHeight, contentHeight)

          // 计算源图片的裁剪位置
          const sourceY = (imgHeight - remainingHeight) * (canvas.width / contentWidth)
          const sourceHeight = currentPageHeight * (canvas.width / contentWidth)

          // 创建裁剪后的canvas
          const pageCanvas = document.createElement('canvas')
          const pageCtx = pageCanvas.getContext('2d')
          pageCanvas.width = canvas.width
          pageCanvas.height = sourceHeight

          pageCtx.drawImage(
            canvas,
            0,
            sourceY,
            canvas.width,
            sourceHeight,
            0,
            0,
            canvas.width,
            sourceHeight,
          )

          // 添加到PDF
          pdf.addImage(
            pageCanvas.toDataURL('image/jpeg', 0.85),
            'JPEG',
            margin,
            margin,
            imgWidth,
            currentPageHeight,
          )

          remainingHeight -= currentPageHeight
          yPosition += currentPageHeight
        }

        // 保存PDF
        pdf.save(`${customFilename}.pdf`)

        // 清理临时元素
        document.body.removeChild(tempDiv)
      } catch (error) {
        console.error('PDF导出失败:', error)
        alert('PDF导出失败，请重试')
      } finally {
        this.isExporting = false
      }
    },

    // 导出为Word
    async exportToWord(customFilename = '富文本内容') {
      if (!this.editor) return

      try {
        this.isExporting = true
        console.log('开始Word导出...')

        // 获取编辑器的Markdown内容
        const markdownContent = this.editor.getMarkdown()
        console.log('获取到的Markdown内容:', markdownContent)

        if (!markdownContent) {
          alert('警告：获取到的Markdown内容为空')
          console.log('编辑器状态:', this.editor)
        }

        // 检查markdown中是否包含图片
        const hasImages = markdownContent.includes('![') && markdownContent.includes('data:image/')
        console.log('Markdown中是否包含图片:', hasImages)
        if (hasImages) {
          const imageMatches = markdownContent.match(/!\[([^\]]*)\]\(([^)]+)\)/g)
          console.log('找到的图片标签:', imageMatches)
        }

        // 简单的Markdown到Word转换
        console.log('开始转换Markdown到Word元素...')
        const paragraphs = this.convertMarkdownToWordElements(markdownContent)
        console.log('转换完成，段落数量:', paragraphs.length)

        // 创建Word文档
        const doc = new Document({
          sections: [
            {
              properties: {},
              children: paragraphs,
            },
          ],
        })

        // 生成并下载Word文档
        console.log('开始生成Word文档...')
        const blob = await Packer.toBlob(doc)
        console.log('Word文档生成完成，大小:', blob.size, 'bytes')

        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${customFilename}.docx`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        console.log('Word文档下载完成')
      } catch (error) {
        console.error('Word导出失败:', error)
        alert('Word导出失败，请重试')
      } finally {
        this.isExporting = false
      }
    },

    // 将Markdown内容转换为Word元素
    convertMarkdownToWordElements(markdown) {
      console.log('convertMarkdownToWordElements被调用，markdown长度:', markdown.length)
      const md = new MarkdownIt()
      const tokens = md.parse(markdown, {})
      console.log('markdown-it解析完成，token数量:', tokens.length)
      console.log('前5个tokens:', tokens.slice(0, 5))
      const paragraphs = []

      // 先检查所有token中是否有图片相关的
      const imageTokens = tokens.filter(
        (token) =>
          token.type === 'image' ||
          (token.type === 'inline' &&
            token.children &&
            token.children.some((child) => child.type === 'image')),
      )
      console.log('找到的图片相关tokens:', imageTokens)

      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i]
        console.log(`处理token ${i}:`, token.type, token)

        switch (token.type) {
          case 'heading_open':
            // 获取下一个token（标题内容）
            const headingContent = tokens[i + 1]
            if (headingContent && headingContent.type === 'inline') {
              const level = parseInt(token.tag.substring(1)) // 从h1, h2, h3等提取数字
              const headingLevel = this.getHeadingLevel(level)
              const elements = this.parseInlineContent(headingContent.children || [])

              paragraphs.push(
                new Paragraph({
                  heading: headingLevel,
                  children:
                    elements.length > 0 ? elements : [new TextRun(headingContent.content || '')],
                }),
              )
            }
            i += 2 // 跳过内容和closing tag
            break

          case 'paragraph_open':
            // 获取段落内容
            const paragraphContent = tokens[i + 1]
            if (paragraphContent && paragraphContent.type === 'inline') {
              // 检查这个inline内容是否包含图片
              if (paragraphContent.children) {
                const hasImage = paragraphContent.children.some((child) => child.type === 'image')
                console.log('段落包含图片:', hasImage)
                if (hasImage) {
                  console.log('段落children:', paragraphContent.children)
                }
              }

              const elements = this.parseInlineContent(paragraphContent.children || [])
              paragraphs.push(
                new Paragraph({
                  children:
                    elements.length > 0 ? elements : [new TextRun(paragraphContent.content || '')],
                }),
              )
            }
            i += 2 // 跳过内容和closing tag
            break

          case 'bullet_list_open':
          case 'ordered_list_open':
            // 处理列表
            const listItems = this.parseListItems(tokens, i)
            paragraphs.push(...listItems.paragraphs)
            i = listItems.nextIndex - 1 // 调整索引，因为外层循环会+1
            break

          case 'blockquote_open':
            // 处理引用块
            const blockquoteItems = this.parseBlockquote(tokens, i)
            paragraphs.push(...blockquoteItems.paragraphs)
            i = blockquoteItems.nextIndex - 1
            break

          case 'code_block':
          case 'fence':
            // 处理代码块
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: token.content,
                    font: { name: 'Consolas' },
                    size: 20,
                  }),
                ],
              }),
            )
            break

          case 'hr':
            // 处理分割线
            paragraphs.push(
              new Paragraph({
                children: [new TextRun('─'.repeat(50))],
              }),
            )
            break

          case 'image':
            // 处理图片
            console.log('处理图片token:', token)
            let src, alt

            // 尝试不同方式获取图片属性
            if (token.attrGet) {
              src = token.attrGet('src')
              alt = token.attrGet('alt')
            } else if (token.attrs) {
              // 从attrs数组中查找src和alt
              const srcAttr = token.attrs.find((attr) => attr[0] === 'src')
              const altAttr = token.attrs.find((attr) => attr[0] === 'alt')
              src = srcAttr ? srcAttr[1] : null
              alt = altAttr ? altAttr[1] : null
            }

            // 如果还是没找到，尝试从children中获取
            if (!src && token.children) {
              for (const child of token.children) {
                if (child.type === 'image' && child.attrGet) {
                  src = child.attrGet('src')
                  alt = child.attrGet('alt')
                  break
                }
              }
            }

            alt = alt || '图片'
            console.log('图片信息:', { src: src?.substring(0, 50) + '...', alt })

            // 处理 base64 图片
            if (src && src.startsWith('data:image/')) {
              try {
                console.log('开始处理base64图片...')
                const imageData = this.base64ToArrayBuffer(src)
                console.log('图片数据长度:', imageData.length)

                const imageRun = new ImageRun({
                  data: imageData,
                  transformation: {
                    width: 600,
                    height: 400,
                  },
                })

                paragraphs.push(
                  new Paragraph({
                    children: [imageRun],
                  }),
                )
                console.log('图片添加成功')
              } catch (error) {
                console.error('处理图片失败:', error)
                // 如果图片处理失败，添加文本说明
                paragraphs.push(
                  new Paragraph({
                    children: [new TextRun(`[图片: ${alt}]`)],
                  }),
                )
              }
            } else {
              console.log('未找到有效的图片src或不是base64格式')
              paragraphs.push(
                new Paragraph({
                  children: [new TextRun(`[图片: ${alt}]`)],
                }),
              )
            }
            break
        }
      }

      // 如果没有解析到任何内容，返回原始文本
      if (paragraphs.length === 0) {
        return [new Paragraph({ children: [new TextRun(markdown)] })]
      }

      return paragraphs
    },

    // 获取标题级别
    getHeadingLevel(level) {
      switch (level) {
        case 1:
          return HeadingLevel.HEADING_1
        case 2:
          return HeadingLevel.HEADING_2
        case 3:
          return HeadingLevel.HEADING_3
        case 4:
          return HeadingLevel.HEADING_4
        case 5:
          return HeadingLevel.HEADING_5
        case 6:
          return HeadingLevel.HEADING_6
        default:
          return HeadingLevel.HEADING_1
      }
    },

    // 解析内联内容（粗体、斜体、图片等）
    parseInlineContent(children) {
      const elements = []

      for (const child of children) {
        console.log('parseInlineContent处理child:', child.type, child)

        switch (child.type) {
          case 'text':
            elements.push(new TextRun(child.content))
            break

          case 'image':
            // 处理图片
            console.log('在inline内容中发现图片:', child)
            let src, alt

            // 尝试不同方式获取图片属性
            if (child.attrGet) {
              src = child.attrGet('src')
              alt = child.attrGet('alt')
            } else if (child.attrs) {
              const srcAttr = child.attrs.find((attr) => attr[0] === 'src')
              const altAttr = child.attrs.find((attr) => attr[0] === 'alt')
              src = srcAttr ? srcAttr[1] : null
              alt = altAttr ? altAttr[1] : null
            }

            alt = alt || '图片'
            console.log('inline图片信息:', { src: src?.substring(0, 50) + '...', alt })

            // 处理 base64 图片
            if (src && src.startsWith('data:image/')) {
              try {
                console.log('开始处理inline中的base64图片...')
                const imageData = this.base64ToArrayBuffer(src)
                console.log('inline图片数据长度:', imageData.length)

                const imageRun = new ImageRun({
                  data: imageData,
                  transformation: {
                    width: 600,
                    height: 400,
                  },
                })

                elements.push(imageRun)
                console.log('inline图片添加成功')
              } catch (error) {
                console.error('处理inline图片失败:', error)
                elements.push(new TextRun(`[图片: ${alt}]`))
              }
            } else {
              console.log('inline中未找到有效的图片src或不是base64格式')
              elements.push(new TextRun(`[图片: ${alt}]`))
            }
            break

          case 'strong_open':
          case 'em_open':
            // 查找对应的关闭标签和中间内容
            const closeTag = child.type === 'strong_open' ? 'strong_close' : 'em_close'
            const content = this.findContentBetweenTags(children, child, closeTag)
            if (content) {
              elements.push(
                new TextRun({
                  text: content,
                  bold: child.type === 'strong_open',
                  italics: child.type === 'em_open',
                }),
              )
            }
            break

          case 'code_inline':
            elements.push(
              new TextRun({
                text: child.content,
                font: { name: 'Consolas' },
                size: 20,
              }),
            )
            break

          default:
            if (child.content) {
              elements.push(new TextRun(child.content))
            }
        }
      }

      return elements
    },

    // 查找标签之间的内容
    findContentBetweenTags(children, openTag, closeTagType) {
      const openIndex = children.indexOf(openTag)
      const closeIndex = children.findIndex(
        (child, index) => index > openIndex && child.type === closeTagType,
      )

      if (closeIndex > openIndex) {
        return children
          .slice(openIndex + 1, closeIndex)
          .map((child) => child.content || '')
          .join('')
      }

      return null
    },

    // 解析列表项
    parseListItems(tokens, startIndex) {
      const paragraphs = []
      let i = startIndex + 1 // 跳过list_open

      while (
        i < tokens.length &&
        tokens[i].type !== 'bullet_list_close' &&
        tokens[i].type !== 'ordered_list_close'
      ) {
        if (tokens[i].type === 'list_item_open') {
          const itemContent = tokens[i + 1]
          if (itemContent && itemContent.type === 'paragraph_open') {
            const itemText = tokens[i + 2]
            if (itemText && itemText.type === 'inline') {
              const elements = this.parseInlineContent(itemText.children || [])
              paragraphs.push(
                new Paragraph({
                  children: [
                    new TextRun('• '), // 添加项目符号
                    ...(elements.length > 0 ? elements : [new TextRun(itemText.content || '')]),
                  ],
                }),
              )
            }
            i += 4 // 跳过paragraph_open, inline, paragraph_close, list_item_close
          } else {
            i++
          }
        } else {
          i++
        }
      }

      return { paragraphs, nextIndex: i + 1 }
    },

    // 解析引用块
    parseBlockquote(tokens, startIndex) {
      const paragraphs = []
      let i = startIndex + 1 // 跳过blockquote_open

      while (i < tokens.length && tokens[i].type !== 'blockquote_close') {
        if (tokens[i].type === 'paragraph_open') {
          const quoteContent = tokens[i + 1]
          if (quoteContent && quoteContent.type === 'inline') {
            const elements = this.parseInlineContent(quoteContent.children || [])
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: '> ',
                    italics: true,
                  }),
                  ...(elements.length > 0
                    ? elements
                    : [
                        new TextRun({
                          text: quoteContent.content || '',
                          italics: true,
                        }),
                      ]),
                ],
              }),
            )
          }
          i += 3 // 跳过paragraph_open, inline, paragraph_close
        } else {
          i++
        }
      }

      return { paragraphs, nextIndex: i + 1 }
    },

    // 将 base64 转换为 Uint8Array
    base64ToArrayBuffer(base64) {
      try {
        // 提取 base64 数据部分（去掉 data:image/...;base64, 前缀）
        const base64Data = base64.split(',')[1]
        if (!base64Data) {
          throw new Error('无效的base64格式')
        }

        const binaryString = window.atob(base64Data)
        const len = binaryString.length
        const bytes = new Uint8Array(len)

        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }

        console.log('Base64转换成功，数据长度:', bytes.length)
        return bytes // 返回 Uint8Array 而不是 bytes.buffer
      } catch (error) {
        console.error('Base64转换失败:', error)
        throw error
      }
    },
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
/* 导出工具栏样式 */
.export-toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.export-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
  position: relative;
  overflow: hidden;
}

.export-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.export-button:active:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.4);
}

.export-button:disabled {
  background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.export-icon {
  font-size: 16px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

/* 加载动画 */
.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 导出弹窗样式 */
.export-dialog-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(2px);
  animation: fadeIn 0.3s ease-out;
}

.export-dialog-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  margin: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: slideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 弹窗关闭按钮 */
.dialog-close-button {
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: #6b7280;
  line-height: 1;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.dialog-close-button:hover {
  background-color: #f3f4f6;
  color: #374151;
}

/* 弹窗布局区域 */
.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.dialog-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.dialog-body {
  padding: 24px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

/* 弹窗按钮样式 */
.dialog-button {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.dialog-button-cancel {
  background: transparent;
  color: #6b7280;
  border-color: #6b7280;
}

.dialog-button-cancel:hover {
  background: #6b7280;
  color: white;
}

.dialog-button-primary {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

.dialog-button-primary:hover:not(:disabled) {
  background: #059669;
  border-color: #059669;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.dialog-button-primary:disabled {
  background: #9ca3af;
  border-color: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 表单样式 */
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

/* 格式选择样式 */
.format-options {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.format-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 12px 16px;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  transition: all 0.2s ease;
  min-width: 140px;
  flex: 1;
}

.format-option:hover {
  border-color: #10b981;
  background-color: #f0fdf4;
}

.format-option:has(.format-radio:checked) {
  border-color: #10b981;
  background-color: #f0fdf4;
}

.format-radio {
  margin-right: 12px;
  cursor: pointer;
}

.format-content {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.format-icon {
  margin-right: 8px;
  font-size: 16px;
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 动画类已整合到组件样式中 */

/* 移动端响应式样式 */
@media (max-width: 768px) {
  /* 移动端导出工具栏样式 */
  .export-toolbar {
    padding: 12px;
    margin-bottom: 12px;
  }

  .export-button {
    width: 100%;
    justify-content: center;
    padding: 14px 20px;
    font-size: 16px;
  }

  /* 移动端弹窗样式 */
  .export-dialog-content {
    width: 95%;
    max-width: none;
    margin: 10px;
    max-height: 95vh;
  }

  /* 移动端弹窗布局调整 */
  .dialog-header {
    padding: 16px 20px;
  }

  .dialog-title {
    font-size: 16px;
  }

  .dialog-body {
    padding: 20px;
  }

  .dialog-footer {
    padding: 16px 20px;
    flex-direction: column-reverse;
    gap: 12px;
  }

  .dialog-button {
    width: 100%;
    justify-content: center;
  }

  /* 移动端表单样式 */
  .format-options {
    flex-direction: column;
    gap: 12px;
  }

  .format-option {
    min-width: auto;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .export-dialog-content {
    width: 98%;
    margin: 5px;
    border-radius: 12px;
  }

  .dialog-header,
  .dialog-body,
  .dialog-footer {
    padding: 12px 16px;
  }
}

/* 移动端优化 */
.dialog-button,
.format-option {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* 防止iOS输入框缩放 */
.form-input {
  font-size: 16px;
}
/* 使用 :deep() 选择器来穿透组件作用域 */
:deep(.ProseMirror-selectednode) {
  outline: 2px solid #10b981 !important;
}

:deep(.toastui-editor-contents td.toastui-editor-cell-selected) {
  background-color: #d1fae5 !important;
  outline: 2px solid #10b981 !important;
}

:deep(.toastui-editor-contents th.toastui-editor-cell-selected) {
  background-color: #a7f3d0 !important;
  outline: 2px solid #10b981 !important;
}

/* 工具栏图标选中状态 - 改变图标颜色为绿色 */
:deep(.toastui-editor-toolbar-icons:not(:disabled).active) {
  background-position-y: -23px;
  filter: brightness(0) saturate(100%) invert(44%) sepia(79%) saturate(2476%) hue-rotate(142deg)
    brightness(97%) contrast(94%);
}

/* 工具栏图标悬停效果 - 背景透明 */
:deep(.toastui-editor-toolbar-icons:not(:disabled):hover) {
  background-color: rgba(16, 185, 129, 0.1) !important;
  border-radius: 4px;
}

/* 富文本编辑器内选中文本的颜色 */
:deep(.ProseMirror ::selection) {
  background-color: rgba(16, 185, 129, 0.3) !important;
  color: #065f46 !important;
}

:deep(.ProseMirror ::-moz-selection) {
  background-color: rgba(16, 185, 129, 0.3) !important;
  color: #065f46 !important;
}

/* Markdown编辑模式下的选中文本 */
:deep(.toastui-editor-md-container ::selection) {
  background-color: rgba(16, 185, 129, 0.3) !important;
  color: #065f46 !important;
}

:deep(.toastui-editor-md-container ::-moz-selection) {
  background-color: rgba(16, 185, 129, 0.3) !important;
  color: #065f46 !important;
}

/* 插入表格选择器的绿色主题 */
:deep(.toastui-editor-popup-add-table .toastui-editor-table-cell:hover) {
  background-color: #10b981 !important;
  color: white !important;
}

:deep(.toastui-editor-popup-add-table .toastui-editor-table-cell.header:hover) {
  background-color: #059669 !important;
  color: white !important;
}

/* 表格选择区域的绿色边框和背景 */
:deep(.toastui-editor-popup-add-table .toastui-editor-table-selection-layer) {
  background-color: rgba(16, 185, 129, 0.3) !important;
  border: 2px solid #10b981 !important;
}
</style>
