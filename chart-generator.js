import * as echarts from 'echarts'

/**
 * 将 ECharts 配置转换为 base64 图片
 * @param {Object} option - ECharts 配置对象
 * @param {number} width - 图片宽度，默认800
 * @param {number} height - 图片高度，默认600
 * @returns {Promise<string>} base64 格式的图片数据
 */
export function generateChartImage(option, width = 800, height = 600) {
  return new Promise((resolve, reject) => {
    try {
      // 创建一个隐藏的 canvas 元素
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.style.position = 'absolute'
      canvas.style.top = '-9999px'
      canvas.style.left = '-9999px'
      document.body.appendChild(canvas)

      // 初始化 ECharts 实例
      const chart = echarts.init(canvas)

      // 禁用动画以确保立即获得最终状态
      const exportOption = {
        ...option,
        animation: false, // 禁用动画
        // 如果有系列数据，也禁用其动画
        series: option.series
          ? option.series.map((series) => ({
              ...series,
              animation: false,
              animationDuration: 0,
            }))
          : undefined,
      }

      // 设置配置并渲染
      chart.setOption(exportOption)

      let isResolved = false // 防止重复调用

      const exportImage = () => {
        if (isResolved) return
        isResolved = true

        try {
          const base64 = chart.getDataURL({
            type: 'png',
            pixelRatio: 2, // 高分辨率
            backgroundColor: '#fff',
          })

          // 清理资源
          chart.dispose()
          document.body.removeChild(canvas)

          resolve(base64)
        } catch (error) {
          reject(error)
        }
      }

      // 监听渲染完成事件
      chart.on('finished', exportImage)

      // 添加备用的定时器，防止finished事件没有触发
      setTimeout(exportImage, 1000) // 备用延迟，确保图表完全渲染
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 将 ECharts 配置字符串解析为对象
 * @param {string} configStr - ECharts 配置字符串
 * @returns {Object} 解析后的配置对象
 */
export function parseEchartsConfig(configStr) {
  try {
    // 移除可能的前后空白和换行
    const cleanStr = configStr.trim()

    // 尝试直接解析 JSON
    if (cleanStr.startsWith('{') && cleanStr.endsWith('}')) {
      // 使用 Function 构造函数来安全地解析包含函数的配置
      return new Function('return ' + cleanStr)()
    }

    // 如果不是标准 JSON 格式，尝试其他解析方式
    throw new Error('Invalid ECharts configuration format')
  } catch (error) {
    console.error('解析 ECharts 配置失败:', error)
    return null
  }
}

/**
 * 生成图表的 markdown 图片标签
 * @param {string} base64 - base64 格式的图片数据
 * @param {string} alt - 图片替代文本
 * @returns {string} markdown 图片标签
 */
export function generateImageMarkdown(base64, alt = '图表') {
  return `![${alt}](${base64})\n\n`
}
