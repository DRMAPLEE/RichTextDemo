import { generateChartImage, parseEchartsConfig, generateImageMarkdown } from './chart-generator.js'

async function convertToMarkdown(text) {
  // 正则表达式匹配各种标签
  const patterns = {
    思考: /<思考>(.*?)<\/思考>/s,
    类型: /<类型>(.*?)<\/类型>/s,
    echart: /<echart>(.*?)<\/echart>/s,
    回答: /<回答>(.*?)<\/回答>/s,
    战略: /<战略>(.*?)<\/战略>/s,
  }

  let markdown = '# 数据分析报告\n\n'

  // 提取思考部分
  const thinkingMatch = text.match(patterns.思考)
  if (thinkingMatch) {
    markdown += '## 分析思考\n\n'
    markdown += thinkingMatch[1].trim() + '\n\n'
  }

  // 提取类型部分
  const typeMatch = text.match(patterns.类型)
  if (typeMatch) {
    markdown += '## 图表类型\n\n'
    markdown += `**${typeMatch[1].trim()}**\n\n`
  }

  // 提取ECharts配置并生成图片
  const echartMatch = text.match(patterns.echart)
  if (echartMatch) {
    markdown += '## 数据图表\n\n'

    try {
      // 解析 ECharts 配置
      const option = parseEchartsConfig(echartMatch[1].trim())

      if (option) {
        // 生成图表图片
        const base64Image = await generateChartImage(option)

        // 添加图片到 markdown
        markdown += generateImageMarkdown(base64Image, '数据分析图表')
      } else {
        // 如果解析失败，回退到代码块
        markdown += '```javascript\n'
        markdown += echartMatch[1].trim() + '\n'
        markdown += '```\n\n'
      }
    } catch (error) {
      console.error('生成图表失败:', error)
      // 如果生成图片失败，回退到代码块
      markdown += '```javascript\n'
      markdown += echartMatch[1].trim() + '\n'
      markdown += '```\n\n'
    }
  }

  // 提取回答部分
  const answerMatch = text.match(patterns.回答)
  if (answerMatch) {
    markdown += '## 数据分析结果\n\n'
    markdown += answerMatch[1].trim() + '\n\n'
  }

  // 提取战略部分
  const strategyMatch = text.match(patterns.战略)
  if (strategyMatch) {
    markdown += '## 战略建议\n\n'
    const strategies = strategyMatch[1].trim().split(/[；;]/)
    strategies.forEach((strategy, index) => {
      if (strategy.trim()) {
        markdown += `${index + 1}. ${strategy.trim()}\n`
      }
    })
    markdown += '\n'
  }

  return markdown
}

export { convertToMarkdown }
