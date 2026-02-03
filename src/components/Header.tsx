import React from 'react'

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 shadow-lg relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-2 left-4 w-20 h-20 bg-white opacity-5 rounded-full animate-pulse"></div>
        <div className="absolute bottom-2 right-8 w-16 h-16 bg-white opacity-5 rounded-full animate-pulse delay-75"></div>
        <div className="absolute top-8 right-20 w-12 h-12 bg-white opacity-5 rounded-full animate-pulse delay-150"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-16">
          <div className="flex items-center space-x-3">
            {/* Logo/Icon */}
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <svg 
                className="w-6 h-6 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              AI图片生成器
            </h1>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
