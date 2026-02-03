import React, { useState } from 'react'
import { useImageContext } from '../contexts/ImageContext'

interface HistorySidebarProps {}

const HistorySidebar: React.FC<HistorySidebarProps> = () => {
  const { state, removeFromHistory, clearHistory, getHistoryStats } = useImageContext()
  const { history } = state
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showStats, setShowStats] = useState(false)
  
  const stats = getHistoryStats()

  const handleDownload = (item: any) => {
    const link = document.createElement('a')
    link.href = item.imageUrl
    link.download = `generated-${item.id}.jpg`
    link.click()
  }

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这张图片吗？')) {
      removeFromHistory(id)
    }
  }

  const handleClearAll = () => {
    if (window.confirm('确定要清空所有历史记录吗？此操作不可恢复。')) {
      clearHistory()
    }
  }

  return (
    <aside className={`
      ${isCollapsed ? 'w-16' : 'w-80'} 
      lg:w-80 lg:relative
      fixed right-0 top-0 h-full
      bg-white shadow-lg border-l lg:border-l
      transition-all duration-300 ease-in-out z-50
      ${isCollapsed ? 'lg:w-16' : ''}
    `}>
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                生成历史
              </h2>
              <div className="text-xs text-gray-500 mt-1">
                共 {stats.total} 张 | 今日 {stats.today} 张
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <svg 
              className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {history.length === 0 ? (
          <div className="text-center py-8">
            {!isCollapsed && (
              <>
                {/* 空状态插图 */}
                <div className="mb-4">
                  <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-500 font-medium">暂无生成历史</p>
                  <p className="text-sm text-gray-400">开始生成你的第一张图片吧！</p>
                </div>
                <div className="mt-6">
                  <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    提示：历史记录会自动保存
                  </div>
                </div>
              </>
            )}
            {isCollapsed && (
              <div className="flex flex-col items-center space-y-2">
                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {!isCollapsed && history.map((item) => (
              <div 
                key={item.id} 
                className="group border border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer bg-white"
              >
                <div className="relative">
                  <img
                    src={item.imageUrl}
                    alt={item.prompt}
                    className="w-full h-32 object-cover rounded mb-2 transition-transform duration-200 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => handleDownload(item)}
                        className="p-1 bg-white bg-opacity-90 rounded shadow-sm hover:bg-opacity-100 transition-colors"
                        title="下载图片"
                      >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-1 bg-white bg-opacity-90 rounded shadow-sm hover:bg-opacity-100 transition-colors"
                        title="删除图片"
                      >
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 line-clamp-2 font-medium">{item.prompt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-gray-100 rounded">{item.size}</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded">{item.style}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isCollapsed && (
              <div className="flex flex-col items-center space-y-2">
                {history.slice(0, 3).map((item) => (
                  <div key={item.id} className="relative group">
                    <img
                      src={item.imageUrl}
                      alt={item.prompt}
                      className="w-12 h-12 object-cover rounded-lg transition-transform duration-200 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                ))}
                {history.length > 3 && (
                  <div className="text-xs text-gray-400">+{history.length - 3}</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Footer */}
      {!isCollapsed && history.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
          <button 
            onClick={handleClearAll}
            className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            清空历史
          </button>
        </div>
      )}
    </aside>
  )
}

export default HistorySidebar
