import React from 'react'

interface SkeletonLoaderProps {
  className?: string
  height?: string
  width?: string
  variant?: 'text' | 'rectangular' | 'circular'
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  className = '', 
  height = 'h-4', 
  width = 'w-full',
  variant = 'text'
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded'
  const variantClasses = {
    text: 'rounded',
    rectangular: 'rounded-md',
    circular: 'rounded-full'
  }

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${height} ${width} ${className}`}
    />
  )
}

export const ImageCardSkeleton: React.FC = () => {
  return (
    <div className="border border-gray-200 rounded-lg p-3 space-y-3">
      <SkeletonLoader height="h-32" variant="rectangular" />
      <SkeletonLoader height="h-4" width="w-3/4" />
      <div className="flex justify-between">
        <SkeletonLoader height="h-3" width="w-20" />
        <SkeletonLoader height="h-3" width="w-16" />
      </div>
    </div>
  )
}

export default SkeletonLoader
