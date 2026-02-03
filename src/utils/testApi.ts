import { zhipuApiService } from '../services/zhipuApi'

// 测试API功能的工具函数
export const testApiConfiguration = () => {
  console.log('=== 测试API配置 ===')
  
  const status = zhipuApiService.getApiKeyStatus()
  console.log('API状态:', status)
  
  if (!status.configured) {
    console.warn('⚠️ API密钥未配置，图片生成功能将无法使用')
    console.log('请按照以下步骤配置：')
    console.log('1. 复制 .env.example 为 .env')
    console.log('2. 在 .env 文件中设置 VITE_ZHIPU_API_KEY')
    console.log('3. 重启开发服务器')
    return false
  }
  
  console.log('✅ API配置正确')
  return true
}

// 测试图片生成API
export const testImageGeneration = async (prompt: string = '一只可爱的猫咪') => {
  console.log('=== 测试图片生成 ===')
  
  try {
    console.log('发送请求:', { prompt, size: '512x512', style: 'realistic' })
    
    const response = await zhipuApiService.generateImage({
      prompt,
      size: '512x512',
      style: 'realistic'
    })
    
    console.log('✅ 图片生成成功:', response)
    return response
  } catch (error) {
    console.error('❌ 图片生成失败:', error)
    throw error
  }
}

// 测试提示词优化
export const testPromptOptimization = async (prompt: string = '猫') => {
  console.log('=== 测试提示词优化 ===')
  
  try {
    console.log('原始提示词:', prompt)
    
    const optimized = await zhipuApiService.optimizePrompt(prompt)
    
    console.log('✅ 提示词优化成功:', optimized)
    return optimized
  } catch (error) {
    console.error('❌ 提示词优化失败:', error)
    throw error
  }
}

// 在浏览器控制台中运行测试
export const runTests = async () => {
  console.log('🧪 开始API测试...')
  
  // 测试配置
  const isConfigured = testApiConfiguration()
  
  if (!isConfigured) {
    console.log('❌ 测试终止：API配置错误')
    return
  }
  
  // 测试提示词优化
  try {
    await testPromptOptimization()
  } catch (error) {
    console.log('提示词优化测试失败，但继续其他测试')
  }
  
  // 测试图片生成（注释掉以避免实际API调用）
  /*
  try {
    await testImageGeneration()
  } catch (error) {
    console.log('图片生成测试失败')
  }
  */
  
  console.log('🏁 API测试完成')
}

// 将测试函数暴露到全局（仅在开发环境）
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  (window as any).testApi = {
    testConfiguration: testApiConfiguration,
    testImageGeneration,
    testPromptOptimization,
    runTests
  }
  
  console.log('🔧 开发工具：在控制台中使用 testApi.runTests() 来测试API功能')
}
