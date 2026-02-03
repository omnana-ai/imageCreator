import React, { useState, useRef, useEffect } from 'react'
import { zhipuApiService } from '../services/zhipuApi'
import { useImageContext } from '../contexts/ImageContext'

interface ImageGeneratorProps {}

const ImageGenerator: React.FC<ImageGeneratorProps> = () => {
  const { addToHistory } = useImageContext()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [prompt, setPrompt] = useState('')
  const [size, setSize] = useState('1024x1024')
  const [style, setStyle] = useState('realistic')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apiStatus, setApiStatus] = useState<{ configured: boolean; message: string } | null>(null)

  useEffect(() => {
    setCharCount(prompt.length)
    // Check API status on component mount
    const status = zhipuApiService.getApiKeyStatus()
    setApiStatus(status)
  }, [prompt])

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('请输入图片描述')
      textareaRef.current?.focus()
      setTimeout(() => setError(null), 3000)
      return
    }
    
    if (!apiStatus?.configured) {
      setError(apiStatus?.message || 'API配置错误')
      return
    }
    
    setIsGenerating(true)
    setError(null)
    
    try {
      const response = await zhipuApiService.generateImage({
        prompt: prompt.trim(),
        size,
        style
      })
      
      setGeneratedImage(response.imageUrl)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      
      // 保存到历史记录
      const historyItem = {
        id: response.id,
        prompt: prompt.trim(),
        imageUrl: response.imageUrl,
        timestamp: new Date(),
        size,
        style,
        taskId: response.taskId
      }
      addToHistory(historyItem)
      
      console.log('Image generated successfully:', response)
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '图片生成失败'
      setError(errorMessage)
      console.error('Error generating image:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleOptimizePrompt = async () => {
    if (!prompt.trim()) {
      setError('请输入要优化的提示词')
      textareaRef.current?.focus()
      setTimeout(() => setError(null), 3000)
      return
    }
    
    if (!apiStatus?.configured) {
      setError(apiStatus?.message || 'API配置错误')
      return
    }
    
    setIsOptimizing(true)
    setError(null)
    
    try {
      const optimizedPrompt = await zhipuApiService.optimizePrompt(prompt.trim())
      setPrompt(optimizedPrompt)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '提示词优化失败'
      setError(errorMessage)
      console.error('Error optimizing prompt:', error)
    } finally {
      setIsOptimizing(false)
    }
  }

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a')
      link.href = generatedImage
      link.download = 'generated-image.jpg'
      link.click()
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* API Status Warning */}
      {apiStatus && !apiStatus.configured && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-yellow-800">{apiStatus.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right">
          <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Success Alert */}
      {showSuccess && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>操作成功！</span>
          </div>
        </div>
      )}

      {/* Input Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
        <div className="flex justify-between items-center mb-3">
          <label className="text-lg font-semibold text-gray-800 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            图片描述
          </label>
          <span className={`text-sm ${charCount > 500 ? 'text-red-500' : 'text-gray-500'}`}>
            {charCount}/500
          </span>
        </div>
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="请详细描述您想要生成的图片，越详细越好..."
            className="w-full h-36 p-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 text-gray-700 placeholder-gray-400"
            maxLength={500}
          />
          {prompt && (
            <button
              onClick={() => setPrompt('')}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {['美丽的风景', '未来科技城市', '可爱的猫咪', '抽象艺术'].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setPrompt(suggestion)}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Parameters Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          参数设置
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              图片尺寸
            </label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
            >
              <option value="512x512">512x512 - 标准</option>
              <option value="1024x1024">1024x1024 - 高清</option>
              <option value="1024x768">1024x768 - 横版</option>
              <option value="768x1024">768x1024 - 竖版</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <svg className="w-4 h-4 mr-1 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              图片风格
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
            >
              <option value="realistic">写实风格</option>
              <option value="cartoon">卡通风格</option>
              <option value="anime">动漫风格</option>
              <option value="oil-painting">油画风格</option>
              <option value="watercolor">水彩风格</option>
            </select>
          </div>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleOptimizePrompt}
          disabled={!prompt.trim() || isOptimizing}
          className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
        >
          {isOptimizing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>优化中...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>优化提示词</span>
            </>
          )}
        </button>
        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>生成中...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>生成图片</span>
            </>
          )}
        </button>
      </div>

      {/* Loading Animation */}
      {isGenerating && (
        <div className="bg-white rounded-xl shadow-lg p-8 transform transition-all duration-300">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg font-medium text-gray-800">正在生成图片，请稍候...</p>
              <p className="text-sm text-gray-500">通常需要 10-30 秒，请耐心等待</p>
              <div className="flex space-x-1 justify-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-150"></div>
              </div>
              <p className="text-xs text-gray-400 mt-2">正在调用智谱AI生成图片...</p>
            </div>
          </div>
        </div>
      )}

      {/* Result Section */}
      {generatedImage && !isGenerating && (
        <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
          <div className="space-y-4">
            <div className="relative group">
              <img
                src={generatedImage}
                alt="Generated image"
                className="w-full rounded-lg shadow-md transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg"></div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDownload}
                className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>下载图片</span>
              </button>
              <button
                onClick={() => {
                  setGeneratedImage(null)
                  setPrompt('')
                }}
                className="flex-1 sm:flex-none px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>重新生成</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageGenerator
