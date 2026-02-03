import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react'
import { storageService, HistoryItem } from '../services/storageService'

interface ImageState {
  history: HistoryItem[]
  currentImage: string | null
  isGenerating: boolean
}

type ImageAction =
  | { type: 'ADD_TO_HISTORY'; payload: HistoryItem }
  | { type: 'SET_CURRENT_IMAGE'; payload: string | null }
  | { type: 'SET_GENERATING'; payload: boolean }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'REMOVE_FROM_HISTORY'; payload: string }
  | { type: 'LOAD_HISTORY'; payload: HistoryItem[] }

const initialState: ImageState = {
  history: [],
  currentImage: null,
  isGenerating: false,
}

const imageReducer = (state: ImageState, action: ImageAction): ImageState => {
  switch (action.type) {
    case 'ADD_TO_HISTORY':
      return {
        ...state,
        history: [action.payload, ...state.history],
      }
    case 'SET_CURRENT_IMAGE':
      return {
        ...state,
        currentImage: action.payload,
      }
    case 'SET_GENERATING':
      return {
        ...state,
        isGenerating: action.payload,
      }
    case 'CLEAR_HISTORY':
      return {
        ...state,
        history: [],
      }
    case 'REMOVE_FROM_HISTORY':
      return {
        ...state,
        history: state.history.filter(item => item.id !== action.payload),
      }
    case 'LOAD_HISTORY':
      return {
        ...state,
        history: action.payload,
      }
    default:
      return state
  }
}

interface ImageContextType {
  state: ImageState
  addToHistory: (item: HistoryItem) => void
  setCurrentImage: (imageUrl: string | null) => void
  setGenerating: (isGenerating: boolean) => void
  clearHistory: () => void
  removeFromHistory: (id: string) => void
  loadHistory: () => void
  getHistoryStats: () => { total: number; today: number; thisWeek: number }
}

const ImageContext = createContext<ImageContextType | undefined>(undefined)

interface ImageProviderProps {
  children: ReactNode
}

export const ImageProvider: React.FC<ImageProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(imageReducer, initialState)

  // 初始化时加载历史记录
  useEffect(() => {
    const history = storageService.loadHistory()
    dispatch({ type: 'LOAD_HISTORY', payload: history })
  }, [])

  const addToHistory = (item: HistoryItem) => {
    dispatch({ type: 'ADD_TO_HISTORY', payload: item })
    storageService.addHistoryItem(item)
  }

  const setCurrentImage = (imageUrl: string | null) => {
    dispatch({ type: 'SET_CURRENT_IMAGE', payload: imageUrl })
  }

  const setGenerating = (isGenerating: boolean) => {
    dispatch({ type: 'SET_GENERATING', payload: isGenerating })
  }

  const clearHistory = () => {
    dispatch({ type: 'CLEAR_HISTORY' })
    storageService.clearHistory()
  }

  const removeFromHistory = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_HISTORY', payload: id })
    storageService.removeHistoryItem(id)
  }

  const loadHistory = () => {
    const history = storageService.loadHistory()
    dispatch({ type: 'LOAD_HISTORY', payload: history })
  }

  const getHistoryStats = () => {
    return storageService.getHistoryStats()
  }

  return (
    <ImageContext.Provider
      value={{
        state,
        addToHistory,
        setCurrentImage,
        setGenerating,
        clearHistory,
        removeFromHistory,
        loadHistory,
        getHistoryStats,
      }}
    >
      {children}
    </ImageContext.Provider>
  )
}

export const useImageContext = () => {
  const context = useContext(ImageContext)
  if (context === undefined) {
    throw new Error('useImageContext must be used within an ImageProvider')
  }
  return context
}
