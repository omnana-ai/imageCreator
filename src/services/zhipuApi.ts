export interface ImageGenerationRequest {
  prompt: string
  size?: string
  style?: string
}

export interface ImageGenerationResponse {
  imageUrl: string
  id: string
  taskId?: string
}

export interface ZhipuImageResponse {
  created: number
  data: Array<{
    url: string
  }>
  id: string
  request_id: string
}

class ZhipuApiService {
  private apiKey: string | null = null
  private baseUrl = 'https://open.bigmodel.cn/api/paas/v4/images/generations'

  constructor() {
    this.apiKey = import.meta.env.VITE_ZHIPU_API_KEY || null
  }

  async generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    if (!this.apiKey) {
      throw new Error('API key is not configured. Please set VITE_ZHIPU_API_KEY in your environment variables.')
    }

    try {
      console.log('Calling Zhipu AI API with:', request)
      
      // Map size to API format
      const sizeMap: { [key: string]: string } = {
        '512x512': '512x512',
        '1024x1024': '1024x1024',
        '1024x768': '1024x768',
        '768x1024': '768x1024'
      }

      // Map style to API format
      const styleMap: { [key: string]: string } = {
        'realistic': 'realistic',
        'cartoon': 'cartoon',
        'anime': 'anime',
        'oil-painting': 'oil_painting',
        'watercolor': 'watercolor'
      }

      const requestBody = {
        model: 'cogview-3-plus', // 尝试使用 cogview-3-plus
        prompt: request.prompt,
        size: sizeMap[request.size || '1024x1024'] || '1024x1024',
        style: styleMap[request.style || 'realistic'] || 'realistic',
        quality: 'standard',
        n: 1
      }

      console.log('Request URL:', this.baseUrl)
      console.log('Request body:', JSON.stringify(requestBody, null, 2))

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      console.log('API Response status:', response.status)
      console.log('API Response headers:', response.headers)

      const responseText = await response.text()
      console.log('API Response text:', responseText)

      if (!response.ok) {
        let errorData = {}
        try {
          errorData = JSON.parse(responseText)
        } catch (e) {
          console.error('Failed to parse error response as JSON')
        }
        console.error('API Error Response:', errorData)
        throw new Error(`API request failed: ${response.status} - ${JSON.stringify(errorData)}`)
      }

      const data: ZhipuImageResponse = JSON.parse(responseText)
      console.log('API Response data:', data)
      
      // 智谱AI成功响应没有code字段，直接检查data数组
      if (!data.data || data.data.length === 0) {
        throw new Error('No image generated')
      }

      return {
        imageUrl: data.data[0].url,
        id: data.id,
        taskId: data.id
      }

    } catch (error) {
      console.error('Error calling Zhipu AI API:', error)
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          throw new Error('API密钥未配置，请检查环境变量设置')
        } else if (error.message.includes('401')) {
          throw new Error('API密钥无效，请检查密钥是否正确')
        } else if (error.message.includes('429')) {
          throw new Error('请求过于频繁，请稍后再试')
        } else if (error.message.includes('quota')) {
          throw new Error('API配额已用完，请检查账户余额')
        } else if (error.message.includes('content')) {
          throw new Error('提示词内容不符合规范，请修改后重试')
        }
      }
      
      throw new Error('图片生成失败，请稍后重试')
    }
  }

  async optimizePrompt(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('API key is not configured')
    }

    try {
      console.log('Optimizing prompt:', prompt)
      
      // For now, return a simple optimization
      // In the future, you could use a language model API for better optimization
      const optimizedPrompt = `${prompt}，高质量，细节丰富，专业摄影，8K分辨率，最佳画质`
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return optimizedPrompt
    } catch (error) {
      console.error('Error optimizing prompt:', error)
      throw new Error('提示词优化失败')
    }
  }

  // Check if API key is configured
  isApiKeyConfigured(): boolean {
    return !!this.apiKey
  }

  // Get API key status
  getApiKeyStatus(): { configured: boolean; message: string } {
    if (!this.apiKey) {
      return {
        configured: false,
        message: 'API密钥未配置，请在环境变量中设置 VITE_ZHIPU_API_KEY'
      }
    }
    
    if (this.apiKey.length < 20) {
      return {
        configured: false,
        message: 'API密钥格式不正确'
      }
    }
    
    return {
      configured: true,
      message: 'API密钥已配置'
    }
  }
}

export const zhipuApiService = new ZhipuApiService()
