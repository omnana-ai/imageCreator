import React, { useState } from 'react'
import Header from './components/Header'
import ImageGenerator from './components/ImageGenerator'
import HistorySidebar from './components/HistorySidebar'
import ErrorBoundary from './components/ErrorBoundary'
import { ImageProvider } from './contexts/ImageContext'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ErrorBoundary>
      <ImageProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
          <Header />
          
          {/* 移动端侧边栏遮罩 */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          
          <div className="flex relative">
            {/* 移动端侧边栏切换按钮 */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden fixed bottom-4 right-4 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
              <div className="max-w-6xl mx-auto">
                <ErrorBoundary>
                  <ImageGenerator />
                </ErrorBoundary>
              </div>
            </main>
            
            {/* 响应式侧边栏 */}
            <div className={`
              fixed lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out z-50
              ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
            `}>
              <ErrorBoundary>
                <HistorySidebar />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </ImageProvider>
    </ErrorBoundary>
  )
}

export default App
